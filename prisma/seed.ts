import { Customer } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { prisma } from "./db.server";

const cageImages = [
  "https://variety.com/wp-content/uploads/2023/07/GettyImages-1477632082.jpg?w=1000&h=667&crop=1",
  "https://images.bauerhosting.com/legacy/media/6262/e2bf/209b/55c1/b411/232b/7-con-air.jpg?ar=16%3A9&fit=crop&crop=top&auto=format&w=1440&q=80",
  "https://media.gq.com/photos/60ecbe1018480638c840cfe8/16:9/w_2560%2Cc_limit/NCage2.png",
  "https://hips.hearstapps.com/hmg-prod/images/nicolas-cage-1580830257.jpg?crop=0.491xw:0.983xh;0,0&resize=640:*",
  "https://static01.nyt.com/images/2019/08/11/magazine/11mag-talk-07/11mag-talk-07-superJumbo.jpg",
  "https://static1.moviewebimages.com/wordpress/wp-content/uploads/2024/07/nicolas-cage-in-pig.jpg",
];

const createRandomCustomer = (): Omit<Customer, "id"> => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  photoURL: faker.helpers.arrayElement(cageImages),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
});

import { Dog } from "@prisma/client";

const createRandomDog = (customerId: number): Omit<Dog, "id"> => ({
  name: faker.animal.dog(),
  breed: faker.helpers.arrayElement([
    "Labrador",
    "German Shepherd",
    "Golden Retriever",
    "Bulldog",
    "Poodle",
    "Mixed Breed",
  ]),
  birthDate: faker.date.past({ years: 15 }),
  photoURL: faker.image.urlLoremFlickr({ category: "dog" }),
  customerId,
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
});

const seedDatabase = async () => {
  // Clear existing data
  await prisma.dog.deleteMany();
  await prisma.customer.deleteMany();
  // Create 100 customers
  const customers = await Promise.all(
    Array.from({ length: 100 }).map(async () => {
      const customer = await prisma.customer.create({
        data: createRandomCustomer(),
      });

      // Create 1-5 random dogs for each customer
      const numDogs = Math.floor(Math.random() * 5) + 1;
      await Promise.all(
        Array.from({ length: numDogs }).map(() =>
          prisma.dog.create({
            data: createRandomDog(customer.id),
          })
        )
      );

      return customer;
    })
  );

  console.log(`Created ${customers.length} customers`);
};

seedDatabase()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
