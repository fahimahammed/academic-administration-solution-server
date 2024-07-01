import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  errorFormat: 'minimal'
})
//.$extends(withOptimize());

export default prisma;
