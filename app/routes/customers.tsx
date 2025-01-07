import {
  createFileRoute,
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { prisma } from "prisma/db.server";
import { z } from "zod";
import { validateWithZod } from "~/utils/validate-with-zod";

const $getCustomers = createServerFn()
  .validator(
    validateWithZod(
      z.object({
        searchTerm: z.string().nullable(),
      })
    )
  )
  .handler(async ({ data: { searchTerm } }) => {
    if (searchTerm) {
      return await prisma.customer.findMany({
        take: 5,

        where: {
          OR: [
            {
              name: {
                contains: searchTerm,
              },
            },
          ],
        },
      });
    } else {
      return await prisma.customer.findMany({
        take: 5,
      });
    }
  });

export const Route = createFileRoute("/customers")({
  validateSearch: (input) =>
    validateWithZod(
      z.object({
        searchTerm: z.string().optional(),
      })
    )(input),
  component: RouteComponent,
  loaderDeps: ({ search }) => search,
  loader: ({ deps: { searchTerm } }) => {
    return $getCustomers({
      data: {
        searchTerm: searchTerm ?? null,
      },
    });
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
                <Link
                  to="/customers/$customerId"
                  params={{
                    customerId: `${customer.id}`,
                  }}
                  className="text-blue-400 underline cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer.name}
                  </td>
                </Link>
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
      <Outlet />
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
