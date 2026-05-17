import { PrismaClient } from '@prisma/client';
import Database from 'better-sqlite3';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

import path from 'path';
import fs from 'fs';
import os from 'os';

function createPrismaClient() {
  let dbPath = path.join(process.cwd(), 'dev.db');
  
  if (process.env.NODE_ENV === 'production') {
    const tmpDbPath = path.join(os.tmpdir(), 'dev.db');
    if (!fs.existsSync(tmpDbPath)) {
      try {
        fs.copyFileSync(dbPath, tmpDbPath);
      } catch (e) {
        console.error('Failed to copy db to /tmp', e);
      }
    }
    dbPath = tmpDbPath;
  }

  const sqlite = new Database(dbPath);
  const adapter = new PrismaBetterSqlite3(sqlite);
  return new PrismaClient({ adapter });
}

export const prisma =
  globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
