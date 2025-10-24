import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { getMe, updateUser, getUsers } from "../controllers/users.controller.js";
import { updateUserValidator } from "../validators/validators.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Middleware générique pour gérer les erreurs de validation
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Profil connecté
router.get("/me", verifyToken, getMe);

// Modifier un utilisateur
router.put("/:id", verifyToken, updateUserValidator, handleValidation, updateUser);

// Liste des utilisateurs (admin)
router.get("/", verifyToken, authorizeRole(["administrateur"]), getUsers);

export default router;
