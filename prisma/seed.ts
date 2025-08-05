import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const usersData = Array.from({ length: 5000 }).map(() => ({
    email: faker.internet.email(),
    name: faker.person.fullName(),
    avatar: faker.image.avatar(),
    searchable: faker.lorem.words({ min: 3, max: 10 }),
    isActive: true,
  }));

  for (let i = 0; i < usersData.length; i += 500) {
    const batch = usersData.slice(i, i + 500);
    await prisma.user.createMany({ data: batch });
    console.log(`Inserted users: ${i + batch.length}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
