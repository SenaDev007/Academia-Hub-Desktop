import express from 'express';
import { TeacherService } from '../services/teacher.service';
import { validateRequest } from '../middleware/validation.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = express.Router();
const teacherService = new TeacherService();

// Validation schemas
const createTeacherSchema = {
  firstName: { type: 'string', required: true },
  lastName: { type: 'string', required: true },
  email: { type: 'string', format: 'email' },
  phone: { type: 'string' },
  address: { type: 'string' },
  city: { type: 'string' },
  postalCode: { type: 'string' },
  country: { type: 'string' },
  schoolId: { type: 'string', required: true },
  department: { type: 'string' },
  specialization: { type: 'string' },
  status: { type: 'string', enum: ['active', 'inactive', 'on_leave'] },
  userId: { type: 'string', required: true }
};

const updateTeacherSchema = {
  firstName: { type: 'string' },
  lastName: { type: 'string' },
  email: { type: 'string', format: 'email' },
  phone: { type: 'string' },
  address: { type: 'string' },
  city: { type: 'string' },
  postalCode: { type: 'string' },
  country: { type: 'string' },
  schoolId: { type: 'string' },
  department: { type: 'string' },
  specialization: { type: 'string' },
  status: { type: 'string', enum: ['active', 'inactive', 'on_leave'] },
  userId: { type: 'string' }
};

// Routes
router.post(
  '/',
  validateRequest(createTeacherSchema),
  authMiddleware,
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN']),
  async (req, res, next) => {
    try {
      const teacher = await teacherService.createTeacher(req.body);
      res.status(201).json(teacher);
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
      const { page = 1, limit = 10, department } = req.query;
      const { teachers, total } = await teacherService.listTeachers(
        parseInt(page as string),
        parseInt(limit as string),
        req.schoolId,
        department as string
      );
      res.json({ teachers, total });
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
      const teacher = await teacherService.getTeacherById(req.params.id);
      res.json(teacher);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  validateRequest(updateTeacherSchema),
  authMiddleware,
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN']),
  async (req, res, next) => {
    try {
      const teacher = await teacherService.updateTeacher(
        req.params.id,
        req.body
      );
      res.json(teacher);
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
      await teacherService.deleteTeacher(req.params.id);
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
      await teacherService.updateStatus(
        req.params.id,
        req.body.status
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

// Routes pour les classes
router.post(
  '/:id/classes/:classId',
  authMiddleware,
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN']),
  async (req, res, next) => {
    try {
      await teacherService.addClassToTeacher(
        req.params.id,
        req.params.classId
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id/classes/:classId',
  authMiddleware,
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN']),
  async (req, res, next) => {
    try {
      await teacherService.removeClassFromTeacher(
        req.params.id,
        req.params.classId
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
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN']),
  async (req, res, next) => {
    try {
      await teacherService.addSubjectToTeacher(
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
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN']),
  async (req, res, next) => {
    try {
      await teacherService.removeSubjectFromTeacher(
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
