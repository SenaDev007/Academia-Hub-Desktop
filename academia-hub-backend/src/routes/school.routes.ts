import express from 'express';
import { SchoolService } from '../services/school.service';
import { validateRequest } from '../middleware/validation.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = express.Router();
const schoolService = new SchoolService();

// Validation schemas
const createSchoolSchema = {
  name: { type: 'string', required: true },
  address: { type: 'string', required: true },
  email: { type: 'string', required: true, format: 'email' },
  phone: { type: 'string', required: true },
  academicYear: { type: 'string', required: true },
  logo: { type: 'string' },
  website: { type: 'string' },
  description: { type: 'string' }
};

const updateSchoolSchema = {
  name: { type: 'string' },
  address: { type: 'string' },
  email: { type: 'string', format: 'email' },
  phone: { type: 'string' },
  academicYear: { type: 'string' },
  logo: { type: 'string' },
  website: { type: 'string' },
  description: { type: 'string' },
  status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] }
};

// Routes
router.post(
  '/',
  validateRequest(createSchoolSchema),
  authMiddleware,
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN']),
  async (req, res, next) => {
    try {
      const school = await schoolService.createSchool(req.body);
      res.status(201).json(school);
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
      const { schools, total } = await schoolService.listSchools(
        parseInt(page as string),
        parseInt(limit as string)
      );
      res.json({ schools, total });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/:id',
  authMiddleware,
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN']),
  async (req, res, next) => {
    try {
      const school = await schoolService.getSchoolById(req.params.id);
      res.json(school);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  validateRequest(updateSchoolSchema),
  authMiddleware,
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN']),
  async (req, res, next) => {
    try {
      const school = await schoolService.updateSchool(
        req.params.id,
        req.body
      );
      res.json(school);
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
      await schoolService.deleteSchool(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id/status',
  authMiddleware,
  roleMiddleware(['SUPER_ADMIN']),
  async (req, res, next) => {
    try {
      await schoolService.updateSchoolStatus(
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
