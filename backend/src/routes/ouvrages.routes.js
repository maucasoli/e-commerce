import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import {
  getOuvrages,
  getOuvrageById,
  createOuvrage,
  updateOuvrage,
  deleteOuvrage,
  addAvis,
} from "../controllers/ouvrages.controller.js";
import { createOuvrageValidator, addAvisValidator } from "../validators/validators.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Middleware générique pour gérer les erreurs de validation
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Routes publiques
router.get("/", getOuvrages);
router.get("/:id", getOuvrageById);

// Routes protégées
router.post(
  "/",
  verifyToken,
  authorizeRole(["editeur", "gestionnaire", "administrateur"]),
  createOuvrageValidator,
  handleValidation,
  createOuvrage
);

router.put(
  "/:id",
  verifyToken,
  authorizeRole(["editeur", "gestionnaire", "administrateur"]),
  createOuvrageValidator,
  handleValidation,
  updateOuvrage
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRole(["editeur", "gestionnaire", "administrateur"]),
  deleteOuvrage
);

// Ajouter un avis
router.post(
  "/:id/avis",
  verifyToken,
  addAvisValidator,
  handleValidation,
  addAvis
);

export default router;
