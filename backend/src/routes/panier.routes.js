import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import {
  getPanier,
  addItem,
  updateItem,
  removeItem,
} from "../controllers/panier.controller.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Middleware générique pour gérer les erreurs de validation
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Récupérer le panier actuel
router.get("/", verifyToken, getPanier);

// Ajouter un item
router.post(
  "/items",
  verifyToken,
  handleValidation,
  addItem
);

// Modifier un item
router.put(
  "/items/:id",
  verifyToken,
  handleValidation,
  updateItem
);

// Retirer un item
router.delete("/items/:id", verifyToken, removeItem);

export default router;
