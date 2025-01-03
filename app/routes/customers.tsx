import {
  createFileRoute,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { prisma } from "prisma/db.server";
import { z } from "vinxi";
import { ZodSchema } from "zod";

const $getCustomers = createServerFn().handler(async () => {
  return await prisma.customer.findMany({
    take: 5,
  });
});

export const validateWithZod =
  <Schema extends ZodSchema>(schema: Schema) =>
  (input: any) => {
    return schema.parse(input) as z.infer<Schema>;
  };

export const Route = createFileRoute("/customers")({
  validateSearch: (input) =>
    validateWithZod(
      z.object({
        searchTerm: z.string().optional(),
      })
    )(input),
  component: RouteComponent,
  loaderDeps: ({ search }) => search,
  loader: () => {
    return $getCustomers();
  },
});

const CustomerList = () => {
  const customerList = useLoaderData({ from: "/customers" });

  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="w-full">
        <input
          type="text"
          placeholder="Search customers by name..."
          onChange={(e) => {
            alert("hello");
            navigate({
              to: "/customers",
              search: {
                searchTerm: e.target.value,
              },
            });
          }}
          className="border-gray-300 p-2 border rounded w-full"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="border-gray-300 bg-white border min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500 text-left text-xs uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 font-medium text-gray-500 text-left text-xs uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 font-medium text-gray-500 text-left text-xs uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 font-medium text-gray-500 text-left text-xs uppercase tracking-wider">
                Photo
              </th>
              <th className="px-6 py-3 font-medium text-gray-500 text-left text-xs uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 font-medium text-gray-500 text-left text-xs uppercase tracking-wider">
                Updated
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customerList.map((customer) => (
              <tr key={customer.id}>
                <td className="px-6 py-4 whitespace-nowrap">{customer.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {customer.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {customer.phone || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {customer.photoURL ? (
                    <img
                      src={customer.photoURL}
                      alt={customer.name}
                      className="rounded-full w-10 h-10"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(customer.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
function RouteComponent() {
  return (
    <div>
      <CustomerList />
    </div>
  );
}
