import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
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

    const pass = await bcrypt.hash('admin', 12);

    await prisma.users.create({
      data: {
        username: 'admin',
        uuid: uuidv4(),
        password: pass,
        role_id: 1,
        status: true,
      },
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
