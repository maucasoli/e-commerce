import express from 'express';
import db from '../db.js';
import { verifyToken } from '../middlewares/auth.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';

const router = express.Router();

/**
 * 📌 GET /api/categories — liste
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM categories ORDER BY nom`);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/**
 * 📌 POST /api/categories — création (editeur/gestionnaire)
 */
router.post('/', verifyToken, authorizeRole(['editeur', 'gestionnaire', 'administrateur']), async (req, res) => {
  try {
    const { nom, description } = req.body;
    const [result] = await db.query(
      `INSERT INTO categories (nom, description) VALUES (?, ?)`,
      [nom, description]
    );
    res.status(201).json({ message: 'Catégorie créée', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/**
 * 📌 PUT /api/categories/:id — mise à jour
 */
router.put('/:id', verifyToken, authorizeRole(['editeur', 'gestionnaire', 'administrateur']), async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description } = req.body;
    await db.query(
      `UPDATE categories SET nom = ?, description = ?, updated_at = NOW() WHERE id = ?`,
      [nom, description, id]
    );
    res.json({ message: 'Catégorie mise à jour' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/**
 * 📌 DELETE /api/categories/:id — suppression
 */
router.delete('/:id', verifyToken, authorizeRole(['editeur', 'gestionnaire', 'administrateur']), async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM categories WHERE id = ?`, [id]);
    res.json({ message: 'Catégorie supprimée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
