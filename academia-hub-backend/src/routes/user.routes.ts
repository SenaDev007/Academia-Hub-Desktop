import express from 'express';
import { UserService } from '../services/user.service';
import { validateRequest } from '../middleware/validation.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = express.Router();
const userService = new UserService();

// Validation schemas
const createUserSchema = {
  email: { type: 'string', required: true, format: 'email' },
  firstName: { type: 'string', required: true },
  lastName: { type: 'string', required: true },
  role: { type: 'string', required: true, enum: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'] },
  password: { type: 'string', required: true, min: 8 },
  schoolId: { type: 'string', required: true }
};

const updateUserSchema = {
  email: { type: 'string', format: 'email' },
  firstName: { type: 'string' },
  lastName: { type: 'string' },
  role: { type: 'string', enum: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'] },
  password: { type: 'string', min: 8 },
  status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] }
};

// Routes
router.post(
  '/',
  validateRequest(createUserSchema),
  authMiddleware,
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN']),
  async (req, res, next) => {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/',
  authMiddleware,
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN']),
  async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const { users, total } = await userService.listUsers(
        parseInt(page as string),
        parseInt(limit as string),
        req.schoolId
      );
      res.json({ users, total });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/:id',
  authMiddleware,
  async (req, res, next) => {
    try {
      const user = await userService.getUserById(req.params.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  validateRequest(updateUserSchema),
  authMiddleware,
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN']),
  async (req, res, next) => {
    try {
      const user = await userService.updateUser(
        req.params.id,
        req.body
      );
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['SUPER_ADMIN']),
  async (req, res, next) => {
    try {
      await userService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id/status',
  authMiddleware,
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN']),
  async (req, res, next) => {
    try {
      await userService.updateStatus(
        req.params.id,
        req.body.status
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
