import express from 'express';
import { ClassService } from '../services/class.service';
import { validateRequest } from '../middleware/validation.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = express.Router();
const classService = new ClassService();

// Validation schemas
const createClassSchema = {
  name: { type: 'string', required: true },
  grade: { type: 'string', required: true },
  level: { type: 'string' },
  section: { type: 'string' },
  academicYear: { type: 'string', required: true },
  schoolId: { type: 'string', required: true },
  status: { type: 'string', enum: ['active', 'inactive'] },
  teacherId: { type: 'string' }
};

const updateClassSchema = {
  name: { type: 'string' },
  grade: { type: 'string' },
  level: { type: 'string' },
  section: { type: 'string' },
  academicYear: { type: 'string' },
  schoolId: { type: 'string' },
  status: { type: 'string', enum: ['active', 'inactive'] },
  teacherId: { type: 'string' }
};

// Routes
router.post(
  '/',
  validateRequest(createClassSchema),
  authMiddleware,
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN']),
  async (req, res, next) => {
    try {
      const classObj = await classService.createClass(req.body);
      res.status(201).json(classObj);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/',
  authMiddleware,
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER']),
  async (req, res, next) => {
    try {
      const { page = 1, limit = 10, grade, academicYear } = req.query;
      const { classes, total } = await classService.listClasses(
        parseInt(page as string),
        parseInt(limit as string),
        req.schoolId,
        grade as string,
        academicYear as string
      );
      res.json({ classes, total });
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
      const classObj = await classService.getClassById(req.params.id);
      res.json(classObj);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  validateRequest(updateClassSchema),
  authMiddleware,
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN']),
  async (req, res, next) => {
    try {
      const classObj = await classService.updateClass(
        req.params.id,
        req.body
      );
      res.json(classObj);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN']),
  async (req, res, next) => {
    try {
      await classService.deleteClass(req.params.id);
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
      await classService.updateStatus(
        req.params.id,
        req.body.status
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

// Routes pour les élèves
router.post(
  '/:id/students/:studentId',
  authMiddleware,
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER']),
  async (req, res, next) => {
    try {
      await classService.addStudentToClass(
        req.params.id,
        req.params.studentId
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id/students/:studentId',
  authMiddleware,
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER']),
  async (req, res, next) => {
    try {
      await classService.removeStudentFromClass(
        req.params.id,
        req.params.studentId
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

// Routes pour les matières
router.post(
  '/:id/subjects/:subjectId',
  authMiddleware,
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER']),
  async (req, res, next) => {
    try {
      await classService.addSubjectToClass(
        req.params.id,
        req.params.subjectId
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id/subjects/:subjectId',
  authMiddleware,
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER']),
  async (req, res, next) => {
    try {
      await classService.removeSubjectFromClass(
        req.params.id,
        req.params.subjectId
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
