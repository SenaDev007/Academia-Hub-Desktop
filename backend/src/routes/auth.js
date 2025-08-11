const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscription d'une nouvelle école
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - schoolName
 *               - subdomain
 *               - adminEmail
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               schoolName:
 *                 type: string
 *                 description: Nom de l'école
 *               subdomain:
 *                 type: string
 *                 description: Sous-domaine unique de l'école
 *               adminEmail:
 *                 type: string
 *                 format: email
 *                 description: Email de l'administrateur
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: Mot de passe
 *               firstName:
 *                 type: string
 *                 description: Prénom de l'administrateur
 *               lastName:
 *                 type: string
 *                 description: Nom de l'administrateur
 *     responses:
 *       201:
 *         description: École créée avec succès
 *       400:
 *         description: Données invalides
 *       409:
 *         description: École ou utilisateur déjà existant
 */
router.post('/register', [
  body('schoolName').notEmpty().withMessage('Le nom de l\'école est requis'),
  body('subdomain')
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Le sous-domaine doit contenir 3-20 caractères (lettres minuscules, chiffres, tirets)'),
  body('adminEmail').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères'),
  body('firstName').notEmpty().withMessage('Le prénom est requis'),
  body('lastName').notEmpty().withMessage('Le nom est requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { schoolName, subdomain, adminEmail, password, firstName, lastName } = req.body;

    // Vérifier si l'école ou l'utilisateur existe déjà
    const existingSchool = await prisma.school.findUnique({
      where: { subdomain }
    });

    if (existingSchool) {
      return res.status(409).json({
        success: false,
        message: 'Ce sous-domaine est déjà utilisé',
        error: 'SUBDOMAIN_EXISTS'
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà',
        error: 'EMAIL_EXISTS'
      });
    }

    // Récupérer le plan gratuit
    let freePlan = await prisma.plan.findUnique({
      where: { name: 'Gratuit' }
    });

    if (!freePlan) {
      // Créer le plan gratuit s'il n'existe pas
      freePlan = await prisma.plan.create({
        data: {
          name: 'Gratuit',
          description: 'Plan d\'essai gratuit de 15 jours',
          price: 0,
          duration: 15,
          features: {
            students: 50,
            teachers: 10,
            classes: 10,
            modules: ['basic']
          }
        }
      });
    }

    // Créer l'école et l'administrateur dans une transaction
    const result = await prisma.$transaction(async (tx) => {
      // Créer l'école
      const school = await tx.school.create({
        data: {
          name: schoolName,
          subdomain,
          planId: freePlan.id,
          academicYear: '2024-2025',
          trimester: 1,
          trialEndsAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 jours
          settings: {
            timezone: 'Africa/Abidjan',
            currency: 'XOF',
            language: 'fr'
          }
        }
      });

      // Hasher le mot de passe
      const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 12);

      // Créer l'utilisateur administrateur
      const user = await tx.user.create({
        data: {
          schoolId: school.id,
          email: adminEmail,
          passwordHash,
          role: 'SCHOOL_ADMIN',
          status: 'active',
          firstName,
          lastName
        }
      });

      return { school, user };
    });

    // Créer le token JWT
    const token = jwt.sign(
      { userId: result.user.id, schoolId: result.school.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    const refreshToken = jwt.sign(
      { userId: result.user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    logger.info(`New school registered: ${result.school.name} (${result.school.subdomain})`);

    res.status(201).json({
      success: true,
      message: 'École créée avec succès',
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          role: result.user.role
        },
        school: {
          id: result.school.id,
          name: result.school.name,
          subdomain: result.school.subdomain,
          trialEndsAt: result.school.trialEndsAt
        },
        tokens: {
          access: token,
          refresh: refreshToken
        }
      }
    });

  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'école',
      error: 'REGISTRATION_ERROR'
    });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Identifiants invalides
 */
router.post('/login', [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Le mot de passe est requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Récupérer l'utilisateur avec les informations de l'école
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        school: {
          include: {
            plan: true
          }
        },
        student: true,
        teacher: true,
        parent: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides',
        error: 'INVALID_CREDENTIALS'
      });
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides',
        error: 'INVALID_CREDENTIALS'
      });
    }

    // Vérifier le statut de l'utilisateur
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Compte désactivé',
        error: 'ACCOUNT_DISABLED'
      });
    }

    // Vérifier le statut de l'école
    if (user.school.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'École suspendue',
        error: 'SCHOOL_SUSPENDED'
      });
    }

    // Créer les tokens
    const token = jwt.sign(
      { userId: user.id, schoolId: user.schoolId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    // Mettre à jour la dernière connexion
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    logger.info(`User logged in: ${user.email} (${user.school.name})`);

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatar: user.avatar
        },
        school: {
          id: user.school.id,
          name: user.school.name,
          subdomain: user.school.subdomain,
          plan: user.school.plan,
          trialEndsAt: user.school.trialEndsAt
        },
        tokens: {
          access: token,
          refresh: refreshToken
        }
      }
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: 'LOGIN_ERROR'
    });
  }
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Renouvellement du token d'accès
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token renouvelé avec succès
 *       401:
 *         description: Token de rafraîchissement invalide
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Token de rafraîchissement requis',
        error: 'NO_REFRESH_TOKEN'
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { school: true }
    });

    if (!user || user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur invalide',
        error: 'INVALID_USER'
      });
    }

    const newToken = jwt.sign(
      { userId: user.id, schoolId: user.schoolId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      success: true,
      message: 'Token renouvelé avec succès',
      data: {
        access: newToken
      }
    });

  } catch (error) {
    logger.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      message: 'Token de rafraîchissement invalide',
      error: 'INVALID_REFRESH_TOKEN'
    });
  }
});

module.exports = router;