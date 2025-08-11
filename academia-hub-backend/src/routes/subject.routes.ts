import express from 'express';
import { SubjectService } from '../services/subject.service';
import { validateRequest } from '../middleware/validation.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = express.Router();
const subjectService = new SubjectService();

// Validation schemas
const createSubjectSchema = {
  name: { type: 'string', required: true },
  code: { type: 'string', required: true },
  description: { type: 'string' },
  credits: { type: 'number', required: true },
  schoolId: { type: 'string', required: true },
  status: { type: 'string', enum: ['active', 'inactive'] },
  teacherId: { type: 'string' }
};

const updateSubjectSchema = {
  name: { type: 'string' },
  code: { type: 'string' },
  description: { type: 'string' },
  credits: { type: 'number' },
  schoolId: { type: 'string' },
  status: { type: 'string', enum: ['active', 'inactive'] },
  teacherId: { type: 'string' }
};

// Routes
router.post(
  '/',
  validateRequest(createSubjectSchema),
  authMiddleware,
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN']),
  async (req, res, next) => {
    try {
      const subject = await subjectService.createSubject(req.body);
      res.status(201).json(subject);
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
      const { page = 1, limit = 10, name } = req.query;
      const { subjects, total } = await subjectService.listSubjects(
        parseInt(page as string),
        parseInt(limit as string),
        req.schoolId,
        name as string
      );
      res.json({ subjects, total });
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
      const subject = await subjectService.getSubjectById(req.params.id);
      res.json(subject);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  validateRequest(updateSubjectSchema),
  authMiddleware,
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN']),
  async (req, res, next) => {
    try {
      const subject = await subjectService.updateSubject(
        req.params.id,
        req.body
      );
      res.json(subject);
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
      await subjectService.deleteSubject(req.params.id);
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
      await subjectService.updateStatus(
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
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER']),
  async (req, res, next) => {
    try {
      await subjectService.addClassToSubject(
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
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER']),
  async (req, res, next) => {
    try {
      await subjectService.removeClassFromSubject(
        req.params.id,
        req.params.classId
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
