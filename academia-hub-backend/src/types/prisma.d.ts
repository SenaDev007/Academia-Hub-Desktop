import { PrismaClient } from '@prisma/client';
import { Request } from 'express';

// Déclaration des types Prisma
export type User = PrismaClient['user'];
export type School = PrismaClient['school'];

// Extension de l'interface Request d'Express
declare global {
  namespace Express {
    interface Request extends Request {
      schoolId?: string;
      schoolSettings?: Record<string, unknown>;
      user?: User;
    }
  }
}
