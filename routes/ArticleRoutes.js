import express from 'express';
import {
  getArticles,
  getArticleById,
  createArticle,
  getUserImagesByRole,
  deleteArticle,
  updateArticle,
  getArticleCount
} from '../controllers/ArticleController.js';

const router = express.Router();

// Specific route must come first
router.get('/articles/user-images', getUserImagesByRole);

// Generic CRUD routes
router.get('/articles', getArticles);
router.post('/articles', createArticle);
router.get('/articles/:id', getArticleById);
router.put('/articles/:id', updateArticle);
router.delete('/articles/:id', deleteArticle);
router.get('/article/count', getArticleCount);
export default router;
