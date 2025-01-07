import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dogs")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <button
        onClick={() => alert("Woof!")}
        className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded font-bold text-white"
      >
        Click me!
      </button>
    </div>
  );
}
