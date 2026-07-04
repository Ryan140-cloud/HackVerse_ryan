// Prisma client singleton.
// Note: Run `npx prisma generate` after cloning to generate the client.
// For the foundation MVP, pages read from dummy data in lib/data/hackathons.js.

let prisma;

try {
  const { PrismaClient } = require('@prisma/client');
  const globalForPrisma = globalThis;
  prisma = globalForPrisma.prisma ?? new PrismaClient();
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
} catch (e) {
  // Prisma client not yet generated; export null to allow graceful fallback.
  prisma = null;
}

export default prisma;
