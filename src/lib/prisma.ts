import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  // On Vercel (production), the filesystem is read-only.
  // SQLite needs write access, so we copy dev.db to /tmp (the only writable dir).
  if (process.env.VERCEL) {
    const tmpDb = '/tmp/dev.db';

    if (!fs.existsSync(tmpDb)) {
      // The bundled dev.db is at <project>/prisma/dev.db
      const srcDb = path.join(process.cwd(), 'prisma', 'dev.db');
      try {
        fs.copyFileSync(srcDb, tmpDb);
        console.log('[prisma] Copied dev.db to /tmp/dev.db');
      } catch (e) {
        console.error('[prisma] Failed to copy dev.db to /tmp:', e);
      }
    }

    return new PrismaClient({
      datasourceUrl: 'file:/tmp/dev.db',
    });
  }

  // Locally, just use the DATABASE_URL from .env
  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
