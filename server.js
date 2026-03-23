const app = require('./src/app');
const { initDatabase } = require('./src/config/database');

const PORT = process.env.PORT || 3000;

// Initialiser la base de données
async function startServer() {
    try {
        await initDatabase();
        console.log('✅ Base de données initialisée avec succès');
        
        app.listen(PORT, () => {
            console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
            console.log(`📚 Documentation Swagger: http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error('❌ Erreur lors du démarrage du serveur:', error);
        process.exit(1);
    }
}

startServer();