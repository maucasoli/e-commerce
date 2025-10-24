import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import {
  createCommande,
  getCommandes,
  getCommandeById,
  updateCommandeStatus,
} from "../controllers/commandes.controller.js";
import { createCommandeValidator } from "../validators/validators.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Middleware générique pour gérer les erreurs de validation
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Créer une commande depuis le panier
router.post("/", verifyToken, createCommandeValidator, handleValidation, createCommande);

// Historique client
router.get("/", verifyToken, getCommandes);

// Détail d'une commande (client ou admin)
router.get("/:id", verifyToken, getCommandeById);

// Mise à jour du statut (admin/gestionnaire)
router.put(
  "/:id/status",
  verifyToken,
  authorizeRole(["administrateur", "gestionnaire"]),
  body("statut")
    .isIn(["en_cours","payee","annulee","expediee"])
    .withMessage("Statut invalide"),
  handleValidation,
  updateCommandeStatus
);

export default router;
