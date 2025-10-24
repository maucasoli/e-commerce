import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { validationResult } from "express-validator";
import { registerValidator, loginValidator } from "../validators/validators.js";

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.post("/register", registerValidator, handleValidation, register);
router.post("/login", loginValidator, handleValidation, login);

export default router;
