// prisma/seed.ts
import prisma from "./prismaClient";

async function main() {
  
  /* prisma.user.create({
    data: {
      firstName: 'test',
      lastName: 'test',
      username:'test',
      password:'test',
      email:'test@gmail.com'
    }
  }) */

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
