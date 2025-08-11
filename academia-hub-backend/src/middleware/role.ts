import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkRole = (requiredRole: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Vérifier si l'utilisateur est authentifié
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      // Vérifier si l'utilisateur a le rôle requis
      if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: 'Role verification failed' });
    }
  };
};
