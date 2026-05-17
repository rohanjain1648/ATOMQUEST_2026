const { PrismaClient } = require('@prisma/client');
try {
  new PrismaClient();
  console.log("success");
} catch (e) {
  console.error("ERROR MESSAGE:", e.message);
}
