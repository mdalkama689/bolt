import { PrismaClient } from "@prisma/client";


const prisma = globalThis.prisma ?? new PrismaClient();

declare global {
  var prisma: PrismaClient | undefined;
}
if (process.env.NODE_ENV === "development") {
  globalThis.prisma = prisma;
}

export default prisma;
