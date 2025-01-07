import { createFileRoute, Link, useLoaderData } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { prisma } from "prisma/db.server";
import { z } from "zod";
import { validateWithZod } from "~/utils/validate-with-zod";

const $getCustomer = createServerFn()
  .validator(
    validateWithZod(
      z.object({
        id: z.coerce.number(),
      })
    )
  )
  .handler(async ({ data }) => {
    return await prisma.customer.findFirst({
      where: {
        id: data.id,
      },
      include: {
        dogs: true,
      },
    });
  });
export const Route = createFileRoute("/customers/$customerId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    return {
      customer: await $getCustomer({
        data: {
          id: params.customerId,
        },
      }),
    };
  },
});

function RouteComponent() {
  const customer = useLoaderData({
    from: "/customers/$customerId",
    select: (data) => {
      return data.customer;
    },
  });

  if (!customer) {
    return <div className="p-4 text-red-500">Customer not found</div>;
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col gap-6">
          <Link
            to="/customers"
            className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
          >
            ← Back to Customers
          </Link>

          {/* Customer Details */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              {customer.photoURL ? (
                <img
                  src={customer.photoURL}
                  alt={customer.name}
                  className="rounded-full w-32 h-32 object-cover"
                />
              ) : (
                <div className="flex justify-center items-center bg-gray-200 rounded-full w-32 h-32">
                  <span className="text-gray-500">No Photo</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-2xl">{customer.name}</h1>
              <div className="text-gray-600">
                <p>Email: {customer.email}</p>
                <p>Phone: {customer.phone || "Not provided"}</p>
                <p>
                  Created: {new Date(customer.createdAt).toLocaleDateString()}
                </p>
                <p>
                  Updated: {new Date(customer.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Dogs Section */}
          <div className="mt-6">
            <h2 className="mb-4 font-semibold text-xl">Dogs</h2>
            {customer.dogs.length === 0 ? (
              <p className="text-gray-500">No dogs registered</p>
            ) : (
              <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {customer.dogs.map((dog) => (
                  <div
                    key={dog.id}
                    className="flex flex-col gap-2 p-4 border rounded-lg"
                  >
                    {dog.photoURL ? (
                      <img
                        src={dog.photoURL}
                        alt={dog.name}
                        className="rounded-lg w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="flex justify-center items-center bg-gray-200 rounded-lg w-full h-48">
                        <span className="text-gray-500">No Photo</span>
                      </div>
                    )}
                    <h3 className="font-semibold text-lg">{dog.name}</h3>
                    <p className="text-gray-600">
                      Breed: {dog.breed || "Unknown"}
                    </p>
                    <p className="text-gray-600">Age: {dog.age || "Unknown"}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
