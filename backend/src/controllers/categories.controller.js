import db from '../db.js';

// Liste toutes les catégories
export const getAllCategories = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM categories ORDER BY nom`);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Crée une nouvelle catégorie
export const createCategory = async (req, res) => {
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
};

// Met à jour une catégorie
export const updateCategory = async (req, res) => {
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
};

// Supprime une catégorie
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM categories WHERE id = ?`, [id]);
    res.json({ message: 'Catégorie supprimée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
