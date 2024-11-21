import { useSignal } from "@preact/signals";

export default function MyIsland() {
  return (
    <div class="flex flex-row gap-4">
      <div
        id="problem1"
        class="basis-1/2 rounded overflow-hidden shadow-lg p-4 bg-slate-700"
      >
        <h3 id="problem1Title" class="font-bold text-xl mb-2">Problem Title</h3>
        <p id="problem1description">Problem Description</p>
      </div>
      <div
        id="problem2"
        class="basis-1/2 rounded overflow-hidden shadow-lg p-4 bg-slate-700"
      >
        <h3 id="problem2Title" class="font-bold text-xl mb-2">Problem Title</h3>
        <p id="problem2description">Problem Description</p>
      </div>
    </div>
  );
}
