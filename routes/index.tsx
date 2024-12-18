import { Handlers, PageProps } from "$fresh/server.ts";
import { Session } from "@5t111111/fresh-session";
import { integer } from "drizzle-orm/sqlite-core";
import {
  createSessionIfNotExists,
  db,
  getProblemById,
  getProblemCount,
  getSessionDBID,
  insertVote,
} from "../src/db/db.ts";

let _NUM_PROBLEMS = -1;

interface State {
  session: Session;
}

export const handler: Handlers<any, State> = {
  async POST(req, ctx) {
    const session = ctx.state.session;
    const formData = await req.formData();
    const votedLeft = formData.get("votedLeft");
    let votedforID = session.get<number>("problem1") ?? 0;
    let votedagainstID = session.get<number>("problem2") ?? 0;
    console.log(votedLeft);
    if (votedLeft === "false") {
      votedforID = session.get<number>("problem2") ?? 0;
      votedagainstID = session.get<number>("problem1") ?? 0;
    }

    if (votedforID === 0 || votedagainstID === 0) {
      return new Response(null, {
        status: 400,
        headers: {
          Location: "/",
        },
      });
    }

    const dbsessionid = await getSessionDBID(session.get("sessiontid") || "");

    await insertVote(
      votedforID,
      votedagainstID,
      dbsessionid,
      votedLeft === "true",
    );

    session.set("newProblems", true);

    return new Response(null, {
      status: 303,
      headers: {
        Location: "/",
      },
    });
  },

  async GET(_req, ctx) {
    const session = ctx.state.session;

    if (_NUM_PROBLEMS === -1) {
      _NUM_PROBLEMS = await getProblemCount();
    }

    if (!session.get<number>("sessiontid")) {
      session.set(
        "sessiontid",
        Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
      );
    }

    const sessiontid = session.get<string>("sessiontid") || "";
    const expiry = session.get<string>("expiry") || new Date().toISOString();
    createSessionIfNotExists(sessiontid, new Date(expiry));

    if (!session.get<number>("problem1") || session.get("newProblems")) {
      session.set("problem1", Math.floor(Math.random() * _NUM_PROBLEMS));
    }

    if (
      !session.get<number>("problem2") ||
      session.get("problem1") === session.get("problem2") ||
      session.get("newProblems")
    ) {
      let problem2 = Math.floor(Math.random() * _NUM_PROBLEMS);
      while (problem2 === session.get("problem1")) {
        problem2 = Math.floor(Math.random() * _NUM_PROBLEMS);
      }
      session.set("problem2", problem2);
    }

    session.set("newProblems", false);
    const problem1Id = session.get<number>("problem1") || 1;
    const problem1 = await getProblemById(problem1Id);
    const problem2Id = session.get<number>("problem2") || 1;
    const problem2 = await getProblemById(problem2Id);
    return ctx.render({ session, problem1, problem2 });
  },
};

export default function Indexpage({ data }: PageProps) {
  const { session, problem1, problem2 } = data;
  return (
    <div class="px-4 py-8 mx-auto">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <h1 class="text-4xl font-bold">Which problem did you like more?</h1>
        <p class="my-4">
          Please use your own judgement to decide which problem you liked more
          and tap/click on it.
        </p>
        <div class="flex flex-row gap-4 my-4">
          <form method="POST" action="/">
            <input type="hidden" name="votedLeft" value="true" />
            <button
              type="submit"
              id="problem1"
              class="basis-1/2 rounded overflow-hidden shadow-lg p-4 bg-slate-700"
            >
              <h3 id="problem1Title" class="font-bold text-xl mb-2">
                {problem1.title}
              </h3>
              <p id="problem1description">{problem1.description}</p>
            </button>
          </form>
          <form method="POST" action="/">
            <input type="hidden" name="votedLeft" value="false" />
            <button
              type="submit"
              id="problem2"
              class="basis-1/2 rounded overflow-hidden shadow-lg p-4 bg-slate-700"
            >
              <h3 id="problem2Title" class="font-bold text-xl mb-2">
                {problem2.title}
              </h3>
              <p id="problem2description">{problem2.description}</p>
            </button>
          </form>
        </div>
        <hr class="my-8 w-full border-gray-500" />
        <div>
          <h1 class="text-4xl font-bold">FAQ</h1>
          <h2 class="text-2xl font-bold my-4">What is this?</h2>
          <p>
            This is a simple website that allows you to compare two problems
            from the A Problem Squared podcast and decide which one you liked
            more.
          </p>
          <h2 class="text-2xl font-bold my-4">Why?</h2>
          <p>
            I wanted to create a fun and interactive way to engage with the
            content from the A Problem Squared podcast. Also, in the past Matt
            created a form for this, but it was not very user friendly, or
            friendly for him to process.
          </p>
          <h2 class="text-2xl font-bold my-4">What is A Problem Squared?</h2>
          <p>
            A Problem Squared is a podcast by Matt Parker and Bec Hill where
            they solve problems from the audience. You can find the podcast
            itself on your favorite podcast app or on twitter and instagram.
          </p>
          <h2 class="text-2xl font-bold my-4">Who made this?</h2>
          <p>
            This was made by{" "}
            <a
              href="https://dirkschut.nl/"
              class="underline hover:no-underline"
            >
              Dirk Schut
            </a>{" "}
            in 2024.
          </p>
          <h2 class="text-2xl font-bold my-4">
            Did Matt and Bec have anything to do with this?
          </h2>
          <p>
            No, this was made without their knowledge or consent. I hope they
            like it though.
          </p>
          <h2 class="text-2xl font-bold my-4">How did you make this?</h2>
          <p>
            I made this website by throwing together some terrible Typescript
            code. More specifically, I used Deno, Drizzle, Fresh, and
            TailwindCSS. (I did actually use some terrible Python code as well
            to get the data from the podcast.)
          </p>
          <h2 class="text-2xl font-bold my-4">Is this open source?</h2>
          <p>
            Yes, you can find the source code on{" "}
            <a
              href="https://github.com/dirkschut/apsleaderboard/"
              class="underline hover:no-underline"
            >
              Github
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
