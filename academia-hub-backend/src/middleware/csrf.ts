import { Request, Response, NextFunction } from 'express';
import csrf from 'csurf';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuration CSRF
const csrfConfig = {
  cookie: {
    key: 'csrfToken',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 86400 // 24 heures
  },
  value: (req: Request) => {
    // Pour les requêtes API, utiliser le token dans l'en-tête
    if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
      return req.headers['x-csrf-token'] as string;
    }
    // Pour les formulaires HTML, utiliser le token dans le body
    return req.body._csrf as string;
  }
};

// Middleware CSRF pour les requêtes POST
export const csrfProtection = csrf(csrfConfig);

// Middleware pour injecter le token CSRF dans les requêtes
export const injectCsrfToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Générer un nouveau token CSRF
    const csrfToken = req.csrfToken();
    
    if (!csrfToken) {
      throw new Error('Failed to generate CSRF token');
    }

    // Injecter le token dans la réponse
    res.locals.csrfToken = csrfToken;
    
    // Pour les requêtes API, ajouter le token dans les headers
    if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
      res.setHeader('X-CSRF-Token', csrfToken);
    }
    
    next();
  } catch (error) {
    console.error('CSRF middleware error:', error);
    res.status(500).json({ 
      message: 'CSRF token generation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
