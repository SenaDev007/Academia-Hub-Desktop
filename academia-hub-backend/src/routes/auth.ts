import express from 'express';
import { AuthService } from '../services/auth';
import { authenticateToken } from '../middleware/auth';
import { checkRole } from '../middleware/role';
import logger from '../utils/logger';

const router = express.Router();
const authService = new AuthService();

// Inscription
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role, schoolId } = req.body;
    const user = await authService.register(
      email,
      password,
      firstName,
      lastName,
      role,
      schoolId
    );
    res.status(201).json(user);
  } catch (error) {
    logger.error('Registration error:', { error });
    next(error);
  }
});

// Connexion
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    logger.error('Login error:', { error });
    next(error);
  }
});

// Rafraîchissement du token
router.post('/refresh-token', authenticateToken, async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.validateToken(refreshToken, true);
    res.json(result);
  } catch (error) {
    logger.error('Token refresh error:', { error });
    next(error);
  }
});

// Profil utilisateur
router.get('/profile', authenticateToken, async (req, res, next) => {
  try {
    const user = await authService.validateToken(req.headers.authorization?.split(' ')[1] || '');
    res.json(user);
  } catch (error) {
    logger.error('Profile error:', { error });
    next(error);
  }
});

// Déconnexion
router.post('/logout', authenticateToken, async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    res.json({ message: 'Successfully logged out' });
  } catch (error) {
    logger.error('Logout error:', { error });
    next(error);
  }
});

export { router as authRoutes };
