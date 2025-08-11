import express from 'express';
import { StudentService } from '../services/student.service';
import { validateRequest } from '../middleware/validation.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = express.Router();
const studentService = new StudentService();

// Validation schemas
const createStudentSchema = {
  firstName: { type: 'string', required: true },
  lastName: { type: 'string', required: true },
  birthDate: { type: 'string', required: true, format: 'date' },
  gender: { type: 'string', required: true, enum: ['MALE', 'FEMALE', 'OTHER'] },
  emergencyContactName: { type: 'string', required: true },
  emergencyContactPhone: { type: 'string', required: true },
  emergencyContactRelationship: { type: 'string', required: true },
  schoolId: { type: 'string', required: true },
  userId: { type: 'string', required: true },
  email: { type: 'string', format: 'email' },
  phone: { type: 'string' },
  address: { type: 'string' },
  city: { type: 'string' },
  postalCode: { type: 'string' },
  country: { type: 'string' },
  classId: { type: 'string' },
  enrollmentDate: { type: 'string', format: 'date' },
  status: { type: 'string', enum: ['active', 'inactive', 'graduated', 'transferred', 'expelled'] },
  studentId: { type: 'string' },
  medicalInfo: { type: 'string' },
  allergies: { type: 'string' },
  emergencyContactAddress: { type: 'string' },
  parentId: { type: 'string' }
};

const updateStudentSchema = {
  firstName: { type: 'string' },
  lastName: { type: 'string' },
  birthDate: { type: 'string', format: 'date' },
  gender: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHER'] },
  emergencyContactName: { type: 'string' },
  emergencyContactPhone: { type: 'string' },
  emergencyContactRelationship: { type: 'string' },
  schoolId: { type: 'string' },
  userId: { type: 'string' },
  email: { type: 'string', format: 'email' },
  phone: { type: 'string' },
  address: { type: 'string' },
  city: { type: 'string' },
  postalCode: { type: 'string' },
  country: { type: 'string' },
  classId: { type: 'string' },
  enrollmentDate: { type: 'string', format: 'date' },
  status: { type: 'string', enum: ['active', 'inactive', 'graduated', 'transferred', 'expelled'] },
  studentId: { type: 'string' },
  medicalInfo: { type: 'string' },
  allergies: { type: 'string' },
  emergencyContactAddress: { type: 'string' },
  parentId: { type: 'string' }
};

// Routes
router.post(
  '/',
  validateRequest(createStudentSchema),
  authMiddleware,
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER']),
  async (req, res, next) => {
    try {
      const student = await studentService.createStudent(req.body);
      res.status(201).json(student);
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
      const { page = 1, limit = 10, classId } = req.query;
      const { students, total } = await studentService.listStudents(
        parseInt(page as string),
        parseInt(limit as string),
        req.schoolId,
        classId as string
      );
      res.json({ students, total });
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
      const student = await studentService.getStudentById(req.params.id);
      res.json(student);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  validateRequest(updateStudentSchema),
  authMiddleware,
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER']),
  async (req, res, next) => {
    try {
      const student = await studentService.updateStudent(
        req.params.id,
        req.body
      );
      res.json(student);
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
      await studentService.deleteStudent(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id/status',
  authMiddleware,
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER']),
  async (req, res, next) => {
    try {
      await studentService.updateStatus(
        req.params.id,
        req.body.status
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

// Routes pour les documents
router.get(
  '/:id/documents',
  authMiddleware,
  async (req, res, next) => {
    try {
      const documents = await studentService.getStudentDocuments(req.params.id);
      res.json(documents);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/:id/documents',
  authMiddleware,
  roleMiddleware(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER']),
  async (req, res, next) => {
    try {
      const document = await studentService.addStudentDocument(
        req.params.id,
        req.body
      );
      res.status(201).json(document);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
