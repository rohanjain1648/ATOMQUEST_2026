import { PrismaClient } from '@prisma/client';
try {
  // Try initializing without adapter
  const prisma = new PrismaClient({
    datasourceUrl: 'file:./dev.db'
  });
  console.log("SUCCESS");
} catch(e) {
  console.error("ERROR:", e);
}
