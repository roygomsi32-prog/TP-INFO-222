const ArticleModel = require('../models/articleModel');

class ArticleController {
    // Créer un article
    static async createArticle(req, res) {
        try {
            const { title, content, author, category, tags = [] } = req.body;
            
            const article = await ArticleModel.create({
                title,
                content,
                author,
                category,
                tags
            });
            
            res.status(201).json({
                status: 'success',
                message: 'Article créé avec succès',
                data: article
            });
        } catch (error) {
            console.error('Erreur lors de la création:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erreur interne du serveur'
            });
        }
    }

    // Récupérer tous les articles (avec filtres)
    static async getAllArticles(req, res) {
        try {
            const { category, author, date } = req.query;
            const filters = {};
            
            if (category) filters.category = category;
            if (author) filters.author = author;
            if (date) filters.date = date;
            
            const articles = await ArticleModel.findAll(filters);
            
            res.status(200).json({
                status: 'success',
                count: articles.length,
                data: articles
            });
        } catch (error) {
            console.error('Erreur lors de la récupération:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erreur interne du serveur'
            });
        }
    }

    // Rechercher des articles
    static async searchArticles(req, res) {
        try {
            const { query } = req.query;
            const articles = await ArticleModel.search(query);
            
            res.status(200).json({
                status: 'success',
                count: articles.length,
                query: query,
                data: articles
            });
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erreur interne du serveur'
            });
        }
    }

    // Récupérer un article par ID
    static async getArticleById(req, res) {
        try {
            const { id } = req.params;
            const article = await ArticleModel.findById(parseInt(id));
            
            if (!article) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Article non trouvé'
                });
            }
            
            res.status(200).json({
                status: 'success',
                data: article
            });
        } catch (error) {
            console.error('Erreur lors de la récupération:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erreur interne du serveur'
            });
        }
    }

    // Mettre à jour un article
    static async updateArticle(req, res) {
        try {
            const { id } = req.params;
            
            // Vérifier si l'article existe
            const existingArticle = await ArticleModel.findById(parseInt(id));
            if (!existingArticle) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Article non trouvé'
                });
            }
            
            const updatedArticle = await ArticleModel.update(parseInt(id), req.body);
            
            res.status(200).json({
                status: 'success',
                message: 'Article mis à jour avec succès',
                data: updatedArticle
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erreur interne du serveur'
            });
        }
    }

    // Supprimer un article
    static async deleteArticle(req, res) {
        try {
            const { id } = req.params;
            const deletedArticle = await ArticleModel.delete(parseInt(id));
            
            if (!deletedArticle) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Article non trouvé'
                });
            }
            
            res.status(200).json({
                status: 'success',
                message: 'Article supprimé avec succès',
                data: deletedArticle
            });
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erreur interne du serveur'
            });
        }
    }
}

module.exports = ArticleController;