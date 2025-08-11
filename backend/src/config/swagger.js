const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Academia Hub API',
      version: '1.0.0',
      description: 'API pour la gestion scolaire multi-tenant Academia Hub',
      contact: {
        name: 'Academia Hub Team',
        email: 'contact@academiahub.com'
      }
    },
    servers: [
      {
        url: process.env.APP_URL || 'http://localhost:3000',
        description: 'Serveur de développement'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Message d\'erreur'
            },
            error: {
              type: 'string',
              example: 'ERROR_CODE'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Opération réussie'
            },
            data: {
              type: 'object'
            }
          }
        },
        Pagination: {
          type: 'object',
          properties: {
            current: {
              type: 'integer',
              example: 1
            },
            pages: {
              type: 'integer',
              example: 10
            },
            total: {
              type: 'integer',
              example: 100
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentification et autorisation'
      },
      {
        name: 'Schools',
        description: 'Gestion des écoles'
      },
      {
        name: 'Users',
        description: 'Gestion des utilisateurs'
      },
      {
        name: 'Students',
        description: 'Gestion des élèves'
      },
      {
        name: 'Teachers',
        description: 'Gestion des enseignants'
      },
      {
        name: 'Classes',
        description: 'Gestion des classes'
      },
      {
        name: 'Subjects',
        description: 'Gestion des matières'
      },
      {
        name: 'Grades',
        description: 'Gestion des notes'
      },
      {
        name: 'Schedules',
        description: 'Gestion des emplois du temps'
      },
      {
        name: 'Planning',
        description: 'Gestion du planning'
      },
      {
        name: 'Exams',
        description: 'Gestion des examens'
      },
      {
        name: 'Documents',
        description: 'Gestion des documents'
      },
      {
        name: 'Notifications',
        description: 'Gestion des notifications'
      },
      {
        name: 'Dashboard',
        description: 'Tableau de bord'
      },
      {
        name: 'Reports',
        description: 'Rapports et statistiques'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJSDoc(options);

const swaggerSetup = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Academia Hub API Documentation'
  }));
};

module.exports = swaggerSetup;