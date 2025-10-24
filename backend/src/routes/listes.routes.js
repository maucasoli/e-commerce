import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import {
  createListe,
  getListeByCode,
  acheterDepuisListe,
} from "../controllers/listes.controller.js";
import { createListeValidator } from "../validators/validators.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Middleware générique pour gérer les erreurs de validation
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Créer une liste et ajouter des items
router.post("/", verifyToken, createListeValidator, handleValidation, createListe);

// Consulter une liste par code
router.get("/:code", verifyToken, getListeByCode);

// Acheter directement depuis une liste
router.post("/:code", 
  verifyToken, 
  body("items")
    .isArray({ min: 1 }).withMessage("La liste d'items ne peut pas être vide"),
  body("items.*.ouvrage_id")
    .isInt({ gt: 0 }).withMessage("ID d'ouvrage invalide"),
  body("items.*.quantite_souhaitee")
    .isInt({ gt: 0 }).withMessage("Quantité invalide"),
  handleValidation,
  acheterDepuisListe
);

export default router;
