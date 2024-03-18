// PrismaClientInstance.ts
import { PrismaClient } from '@prisma/client'; 
let prisma;
if(!prisma){
    const prisma = new PrismaClient();
}
export default prisma;