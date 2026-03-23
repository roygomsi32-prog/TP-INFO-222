const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let db;

async function initDatabase() {
    db = await open({
        filename: path.join(__dirname, '../../database/blog.db'),
        driver: sqlite3.Database
    });

    // Créer la table articles si elle n'existe pas
    await db.exec(`
        CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            author TEXT NOT NULL,
            category TEXT NOT NULL,
            tags TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    return db;
}

function getDb() {
    if (!db) {
        throw new Error('Base de données non initialisée');
    }
    return db;
}

module.exports = { initDatabase, getDb };