import express from 'express';
import { db } from '../db.js';
import { verifyToken } from '../middlewares/auth.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';

const router = express.Router();

// 👤 GET /me — profil connecté
router.get('/me', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nom, email, role, actif, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✍️ PUT /:id — modifier utilisateur (admin ou propriétaire)
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { nom, email, actif } = req.body;

  // Seul admin ou propriétaire du compte peut modifier
  if (req.user.role !== 'administrateur' && req.user.id != id) {
    return res.status(403).json({ message: 'Accès refusé' });
  }

  try {
    await db.query(
      'UPDATE users SET nom = ?, email = ?, actif = ? WHERE id = ?',
      [nom, email, actif, id]
    );
    res.json({ message: 'Utilisateur mis à jour' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 👑 GET / — liste des utilisateurs (admin uniquement)
router.get('/', verifyToken, authorizeRole(['administrateur']), async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nom, email, role, actif, created_at FROM users'
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
