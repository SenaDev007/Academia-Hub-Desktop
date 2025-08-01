import { PrismaClient } from '@prisma/client';

// Créer une instance unique de PrismaClient
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Configuration de la base de données
export const config = {
  database: {
    url: process.env.DATABASE_URL,
    schema: 'public'
  }
};
