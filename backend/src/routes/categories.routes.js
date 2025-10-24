import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categories.controller.js';
import { createCategoryValidator } from "../validators/validators.js";
import { validationResult } from 'express-validator';

const router = express.Router();

// Middleware générique pour gérer les erreurs de validation
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// GET /api/categories
router.get('/', getAllCategories);

// POST /api/categories
router.post(
  '/',
  verifyToken,
  authorizeRole(['editeur', 'gestionnaire', 'administrateur']),
  createCategoryValidator,
  handleValidation,
  createCategory
);

// PUT /api/categories/:id
router.put(
  '/:id',
  verifyToken,
  authorizeRole(['editeur', 'gestionnaire', 'administrateur']),
  createCategoryValidator,
  handleValidation,
  updateCategory
);

// DELETE /api/categories/:id
router.delete(
  '/:id',
  verifyToken,
  authorizeRole(['editeur', 'gestionnaire', 'administrateur']),
  deleteCategory
);

export default router;
