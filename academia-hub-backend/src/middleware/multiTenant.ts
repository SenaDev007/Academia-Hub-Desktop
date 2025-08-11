import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { School } from '../types/prisma.d';

const prisma = new PrismaClient();

interface MultiTenantRequest extends Request {
  schoolId?: string;
  schoolSettings?: any;
}

export const multiTenantMiddleware = async (req: MultiTenantRequest, res: Response, next: NextFunction) => {
  try {
    // Extraire le sous-domaine du header Host
    const hostHeader = req.headers.host as string;
    if (!hostHeader) {
      return res.status(400).json({ message: 'Invalid host header' });
    }

    const subdomain = hostHeader.split('.')[0];
    
    // Vérifier si l'école existe
    const school = await prisma.school.findUnique({
      where: { subdomain },
      select: {
        id: true,
        status: true,
        settings: true
      }
    });

    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    // Vérifier le statut de l'école
    if (school.status !== 'active') {
      return res.status(403).json({ 
        message: school.status === 'inactive' 
          ? 'School subscription is not active' 
          : 'School subscription has expired' 
      });
    }

    // Injecter les informations de l'école dans la requête
    req.schoolId = school.id;
    req.schoolSettings = school.settings;

    next();
  } catch (error) {
    console.error('Multi-tenant error:', error);
    return res.status(500).json({ 
      message: 'Multi-tenant verification failed',
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};
