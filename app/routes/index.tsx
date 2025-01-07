import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex justify-center gap-8 mx-auto p-8 container">
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-bold text-4xl">
          Welcome to the Pet Management App
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your customers and their furry friends all in one place
        </p>
      </div>
      <Link
        to="/customers"
        className="bg-blue-500 hover:bg-blue-600 px-16 py-8 rounded-lg font-bold text-2xl text-white transition"
      >
        Customers
      </Link>
    </div>
  );
}
