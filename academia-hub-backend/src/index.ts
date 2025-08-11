import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { authLimiter } from './middleware/rateLimiter';
import { multiTenantMiddleware } from './middleware/multiTenant';
import { authenticateToken, checkRole } from './middleware/auth';
import { PrismaClient } from '@prisma/client';
import { AuthService } from './services/auth';
import { csrfProtection, injectCsrfToken } from './middleware/csrf';
import { setupSwagger } from './docs/swagger';
import logger from './utils/logger';
import { authRoutes } from './routes/auth';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Configuration de base
app.set('trust proxy', true);

// Middleware de base
app.use(cors());
app.use(helmet());
app.use(morgan('dev', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Documentation Swagger
setupSwagger(app);

// Middleware CSRF
app.use(csrfProtection);
app.use(injectCsrfToken);

// Middleware multi-tenant
app.use(multiTenantMiddleware);

// Rate limiting
app.use('/api/auth', authLimiter);

// Routes
app.use('/api/auth', authRoutes);

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const authService = new AuthService();
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// Routes protégées
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json(req.user);
});

// Routes avec contrôle d'accès par rôle
app.get('/api/admin/dashboard', 
  authenticateToken, 
  checkRole(['SUPER_ADMIN', 'SCHOOL_ADMIN']),
  (req, res) => {
    res.json({ message: 'Bienvenue dans le tableau de bord admin' });
  });

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Une erreur est survenue' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
