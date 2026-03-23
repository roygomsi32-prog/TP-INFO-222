const { getDb } = require('../config/database');

class ArticleModel {
    // Créer un article
    static async create(articleData) {
        const db = getDb();
        const { title, content, author, category, tags } = articleData;
        
        const result = await db.run(
            `INSERT INTO articles (title, content, author, category, tags) 
             VALUES (?, ?, ?, ?, ?)`,
            [title, content, author, category, JSON.stringify(tags)]
        );
        
        return this.findById(result.lastID);
    }

    // Récupérer tous les articles avec filtres
    static async findAll(filters = {}) {
        const db = getDb();
        let query = 'SELECT * FROM articles WHERE 1=1';
        const params = [];

        if (filters.category) {
            query += ' AND category = ?';
            params.push(filters.category);
        }

        if (filters.author) {
            query += ' AND author = ?';
            params.push(filters.author);
        }

        if (filters.date) {
            query += ' AND DATE(created_at) = ?';
            params.push(filters.date);
        }

        query += ' ORDER BY created_at DESC';
        
        const articles = await db.all(query, params);
        
        // Parser les tags JSON pour chaque article
        return articles.map(article => ({
            ...article,
            tags: JSON.parse(article.tags)
        }));
    }

    // Rechercher des articles par titre ou contenu
    static async search(queryText) {
        const db = getDb();
        const articles = await db.all(
            `SELECT * FROM articles 
             WHERE title LIKE ? OR content LIKE ?
             ORDER BY created_at DESC`,
            [`%${queryText}%`, `%${queryText}%`]
        );
        
        return articles.map(article => ({
            ...article,
            tags: JSON.parse(article.tags)
        }));
    }

    // Récupérer un article par son ID
    static async findById(id) {
        const db = getDb();
        const article = await db.get(
            'SELECT * FROM articles WHERE id = ?',
            [id]
        );
        
        if (article) {
            article.tags = JSON.parse(article.tags);
        }
        
        return article;
    }

    // Mettre à jour un article
    static async update(id, updateData) {
        const db = getDb();
        const { title, content, category, tags } = updateData;
        
        const updates = [];
        const params = [];

        if (title !== undefined) {
            updates.push('title = ?');
            params.push(title);
        }
        if (content !== undefined) {
            updates.push('content = ?');
            params.push(content);
        }
        if (category !== undefined) {
            updates.push('category = ?');
            params.push(category);
        }
        if (tags !== undefined) {
            updates.push('tags = ?');
            params.push(JSON.stringify(tags));
        }

        if (updates.length === 0) {
            return null;
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        params.push(id);

        await db.run(
            `UPDATE articles SET ${updates.join(', ')} WHERE id = ?`,
            params
        );

        return this.findById(id);
    }

    // Supprimer un article
    static async delete(id) {
        const db = getDb();
        const article = await this.findById(id);
        
        if (!article) {
            return null;
        }
        
        await db.run('DELETE FROM articles WHERE id = ?', [id]);
        return article;
    }
}

module.exports = ArticleModel;