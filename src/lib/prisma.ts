import { PrismaClient } from "@prisma/client";

const prismaSingleton = () => {
  return new PrismaClient();
};

type PrismaSingletonClient = ReturnType<typeof prismaSingleton>;

const globalPrisma = globalThis as unknown as {
  prisma: PrismaSingletonClient | undefined;
};

const prisma = globalPrisma.prisma ?? prismaSingleton();

if (process.env.NODE_ENV === "development") {
  globalPrisma.prisma = prisma;
}

export default prisma;
