const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const articleRoutes = require('./routes/articleRoutes');

const app = express();

// Middlewares de sécurité
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limite chaque IP à 100 requêtes par fenêtre
    message: 'Trop de requêtes, veuillez réessayer plus tard.'
});
app.use('/api', limiter);

// Middlewares de base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Blog API ROY ',
            version: '1.0.0',
            description: 'API de gestion d\'articles de blog',
            contact: {
                name: 'Support',
                email: 'support@blogapi.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Serveur de développement'
            }
        ]
    },
    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api', articleRoutes);

// Route de test
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'API Blog en ligne',
        timestamp: new Date().toISOString()
    });
});

// Middleware pour les routes non trouvées
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route non trouvée'
    });
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Erreur interne du serveur'
    });
});

module.exports = app;