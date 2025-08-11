const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/auth');

// Routes
const authRoutes = require('./routes/auth');
const schoolRoutes = require('./routes/schools');
const userRoutes = require('./routes/users');
const studentRoutes = require('./routes/students');
const teacherRoutes = require('./routes/teachers');
const classRoutes = require('./routes/classes');
const subjectRoutes = require('./routes/subjects');
const gradeRoutes = require('./routes/grades');
const scheduleRoutes = require('./routes/schedules');
const planningRoutes = require('./routes/planning');
const examRoutes = require('./routes/exams');
const documentRoutes = require('./routes/documents');
const notificationRoutes = require('./routes/notifications');
const dashboardRoutes = require('./routes/dashboard');
const reportRoutes = require('./routes/reports');
const academicYearRoutes = require('./routes/academicYears');
const absenceRoutes = require('./routes/absences');
const cahierJournalRoutes = require('./routes/cahierJournal');
const competenceRoutes = require('./routes/competences');
const financeRoutes = require('./routes/finance');
const roomRoutes = require('./routes/rooms');
const parentRoutes = require('./routes/parents');
const bulletinRoutes = require('./routes/bulletins');
const payrollRoutes = require('./routes/payroll');
const supportRoutes = require('./routes/support');

// Swagger
const swaggerSetup = require('./config/swagger');

const app = express();
const prisma = new PrismaClient();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});

// Speed limiting
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,
  delayMs: 500
});

app.use(limiter);
app.use(speedLimiter);

// Middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV 
  });
});

// Swagger documentation
swaggerSetup(app);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/schools', authMiddleware, schoolRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/students', authMiddleware, studentRoutes);
app.use('/api/teachers', authMiddleware, teacherRoutes);
app.use('/api/classes', authMiddleware, classRoutes);
app.use('/api/subjects', authMiddleware, subjectRoutes);
app.use('/api/grades', authMiddleware, gradeRoutes);
app.use('/api/schedules', authMiddleware, scheduleRoutes);
app.use('/api/planning', authMiddleware, planningRoutes);
app.use('/api/exams', authMiddleware, examRoutes);
app.use('/api/documents', authMiddleware, documentRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/reports', authMiddleware, reportRoutes);
app.use('/api/planning', authMiddleware, planningRoutes);
app.use('/api/academic-years', authMiddleware, academicYearRoutes);
app.use('/api/absences', authMiddleware, absenceRoutes);
app.use('/api/cahier-journal', authMiddleware, cahierJournalRoutes);
app.use('/api/competences', authMiddleware, competenceRoutes);
app.use('/api/finance', authMiddleware, financeRoutes);
app.use('/api/rooms', authMiddleware, roomRoutes);
app.use('/api/parents', authMiddleware, parentRoutes);
app.use('/api/bulletins', authMiddleware, bulletinRoutes);
app.use('/api/payroll', authMiddleware, payrollRoutes);
app.use('/api/support', authMiddleware, supportRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`🚀 Academia Hub API running on port ${PORT}`);
  logger.info(`📝 API Documentation available at http://localhost:${PORT}/api-docs`);
  logger.info(`🏥 Health check available at http://localhost:${PORT}/health`);
});

module.exports = app;