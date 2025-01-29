import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.roles.createMany({
      data: [
        {
          name: 'admin',
        },
        {
          name: 'user',
        },
        {
          name: 'guest',
        },
      ],
    });
  } catch (error) {
    // Log any errors that occur during the process
    console.error('Error:', error);
  } finally {
    // Ensure that the Prisma client is properly disconnected
    await prisma.$disconnect();
  }
}

main();
