import db from "../db.js";

/**
 * Liste des ouvrages avec filtres
 */
export const getOuvrages = async (req, res) => {
  try {
    const { search, categorie, order } = req.query;

    let query = `
      SELECT o.*, 
             IFNULL(AVG(a.note), 0) AS moyenne_note,
             COUNT(a.id) AS nb_avis
      FROM ouvrages o
      LEFT JOIN avis a ON a.ouvrage_id = o.id
    `;
    let conditions = ["o.stock > 0"]; // Verificação de stock > 0
    let params = [];

    if (search) {
      conditions.push(
        `(o.titre LIKE ? OR o.auteur LIKE ? OR o.description LIKE ?)`
      );
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (categorie) {
      conditions.push(`o.categorie_id = ?`);
      params.push(categorie);
    }

    // Adiciona condições ao WHERE
    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ");
    }

    query += ` GROUP BY o.id`;

    // Ordenação
    if (order === "popularite") {
      query += ` ORDER BY nb_avis DESC`;
    } else {
      query += ` ORDER BY o.created_at DESC`;
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


/**
 * Détail d'un ouvrage
 */
export const getOuvrageById = async (req, res) => {
  try {
    const { id } = req.params;

    const [ouvrage] = await db.query(
      `SELECT o.*, 
              IFNULL(AVG(a.note), 0) AS moyenne_note,
              COUNT(a.id) AS nb_avis
       FROM ouvrages o
       LEFT JOIN avis a ON a.ouvrage_id = o.id
       WHERE o.id = ?
       GROUP BY o.id`,
      [id]
    );

    if (ouvrage.length === 0)
      return res.status(404).json({ message: "Ouvrage non trouvé" });

    const [avis] = await db.query(
      `SELECT a.*, u.nom AS client_nom
       FROM avis a
       JOIN users u ON u.id = a.client_id
       WHERE a.ouvrage_id = ?`,
      [id]
    );

    res.json({ ...ouvrage[0], avis });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Créer un ouvrage
 */
export const createOuvrage = async (req, res) => {
  try {
    const { titre, auteur, isbn, description, prix, stock, categorie_id } = req.body;

    const [result] = await db.query(
      `INSERT INTO ouvrages (titre, auteur, isbn, description, prix, stock, categorie_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [titre, auteur, isbn, description, prix, stock, categorie_id]
    );

    res.status(201).json({ message: "Ouvrage créé", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Mettre à jour un ouvrage
 */
export const updateOuvrage = async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, auteur, isbn, description, prix, stock, categorie_id } = req.body;

    await db.query(
      `UPDATE ouvrages 
       SET titre = ?, auteur = ?, isbn = ?, description = ?, prix = ?, stock = ?, categorie_id = ?, updated_at = NOW()
       WHERE id = ?`,
      [titre, auteur, isbn, description, prix, stock, categorie_id, id]
    );

    res.json({ message: "Ouvrage mis à jour" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Supprimer un ouvrage
 */
export const deleteOuvrage = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM ouvrages WHERE id = ?`, [id]);
    res.json({ message: "Ouvrage supprimé" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Ajouter un avis
 */
export const addAvis = async (req, res) => {
  const ouvrageId = req.params.id;
  const clientId = req.user.id;
  const { note, commentaire } = req.body;

  if (!note || note < 1 || note > 5) {
    return res.status(400).json({ message: "La note doit être entre 1 et 5." });
  }

  try {
    const [rows] = await db.query(
      `SELECT COUNT(*) AS count
       FROM commande_items ci
       JOIN commandes c ON ci.commande_id = c.id
       WHERE c.client_id = ? AND ci.ouvrage_id = ?`,
      [clientId, ouvrageId]
    );

    if (rows[0].count === 0) {
      return res.status(403).json({ message: "Vous devez acheter ce livre pour laisser un avis." });
    }

    const [existing] = await db.query(
      `SELECT id FROM avis WHERE client_id = ? AND ouvrage_id = ?`,
      [clientId, ouvrageId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Vous avez déjà laissé un avis pour ce livre." });
    }

    const [result] = await db.query(
      `INSERT INTO avis (client_id, ouvrage_id, note, commentaire)
       VALUES (?, ?, ?, ?)`,
      [clientId, ouvrageId, note, commentaire || null]
    );

    res.status(201).json({ message: "Avis ajouté avec succès", avisId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
