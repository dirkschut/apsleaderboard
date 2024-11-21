import { FreshContext } from "$fresh/server.ts";

const _MATT_PARKER = 0;
const _BEC_HILL = 1;

const problems = [
    {
        id: 1,
        title: "What's the Deal with Shoe Sizes?",
        description: "This is the first problem",
        episode: 1,
        solver: _MATT_PARKER,
    },
    {
        id: 2,
        title: "Buy my body!",
        description: "This is the second problem",
        episde: 1,
        solver: _BEC_HILL,
    },
];

export const handler = (_req: Request, _ctx: FreshContext): Response => {
    const randomIndex = Math.floor(Math.random() * problems.length);
    const body = problems[randomIndex];
    return new Response(JSON.stringify(body), {
        headers: { "Content-Type": "application/json" },
    });
};
