import { Handlers, PageProps } from "$fresh/server.ts";
import Choose from "../islands/choose.tsx";
import { Session } from "@5t111111/fresh-session";
import { db, getProblemCount } from "../src/db/db.ts";

let _NUM_PROBLEMS = -1;

interface State {
  session: Session;
}

export const handler: Handlers<any, State> = {
  async GET(_req, ctx) {
    const session = ctx.state.session;

    if (_NUM_PROBLEMS === -1) {
      console.log("Getting problem count");
      _NUM_PROBLEMS = await getProblemCount();
      console.log(`Got ${_NUM_PROBLEMS} problems`);
    }

    if (!session.get<number>("sessiontid")) {
      session.set(
        "sessiontid",
        Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
      );
    }

    if (!session.get<number>("problem1")) {
      session.set("problem1", Math.floor(Math.random() * _NUM_PROBLEMS));
    }

    if (
      !session.get<number>("problem2") ||
      session.get("problem1") === session.get("problem2")
    ) {
      let problem2 = Math.floor(Math.random() * _NUM_PROBLEMS);
      while (problem2 === session.get("problem1")) {
        problem2 = Math.floor(Math.random() * _NUM_PROBLEMS);
      }
      session.set("problem2", problem2);
    }

    return ctx.render({ session });
  },
};

export default function ProfilePage({ data }: PageProps) {
  const { session } = data;
  console.log(session);
  return (
    <div class="px-4 py-8 mx-auto">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <h1 class="text-4xl font-bold">Which problem did you like more?</h1>
        <p class="my-4">
          Please use your own judgement to decide which problem you liked more
          and tap/click on it.
        </p>
        <Choose />
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
        </div>
      </div>
    </div>
  );
}
