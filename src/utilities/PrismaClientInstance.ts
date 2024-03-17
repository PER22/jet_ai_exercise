// PrismaClientInstance.ts
import { PrismaClient } from '@prisma/client'; 
const prisma = new PrismaClient();
export default prisma;
//I am getting this warning: 'This is the 10th instance of Prisma Client being started. Make sure this is intentional.'
//I'll need to figure it out later, feeling time crunch