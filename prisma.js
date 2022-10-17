import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
console.log('[MODULE] Prisma Initialized.');
export default prisma;
