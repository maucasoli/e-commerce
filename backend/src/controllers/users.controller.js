import db from "../db.js";

/**
 * Récupérer le profil connecté
 */
export const getMe = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, nom, email, role, actif, created_at FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Modifier un utilisateur (admin ou propriétaire)
 */
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nom, email, actif } = req.body;

  if (req.user.role !== "administrateur" && req.user.id != id) {
    return res.status(403).json({ message: "Accès refusé" });
  }

  try {
    await db.query(
      "UPDATE users SET nom = ?, email = ?, actif = ? WHERE id = ?",
      [nom, email, actif, id]
    );

    res.json({ message: "Utilisateur mis à jour" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Liste des utilisateurs (admin uniquement)
 */
export const getUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, nom, email, role, actif, created_at FROM users"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
