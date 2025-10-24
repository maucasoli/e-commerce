import db from "../db.js";

/**
 * Récupérer le panier actuel du client
 */
export const getPanier = async (req, res) => {
  const clientId = req.user.id;

  try {
    const [panierRows] = await db.query(
      `SELECT id FROM panier WHERE client_id = ? AND actif = 1`,
      [clientId]
    );

    if (panierRows.length === 0) return res.json([]);

    const panierId = panierRows[0].id;

    const [items] = await db.query(
      `SELECT pi.id AS panier_item_id, o.id AS ouvrage_id, o.titre, pi.quantite, pi.prix_unitaire, (pi.quantite * pi.prix_unitaire) AS total
       FROM panier_items pi
       JOIN ouvrages o ON pi.ouvrage_id = o.id
       WHERE pi.panier_id = ?`,
      [panierId]
    );

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Ajouter un item au panier
 */
export const addItem = async (req, res) => {
  const { ouvrage_id, quantite } = req.body;
  const clientId = req.user.id;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Vérifier le stock disponible
    const [stockRows] = await connection.query(
      `SELECT stock, prix, titre FROM ouvrages WHERE id = ? FOR UPDATE`,
      [ouvrage_id]
    );

    if (stockRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Ouvrage non trouvé" });
    }

    const ouvrage = stockRows[0];

    if (ouvrage.stock <= 0) {
      await connection.rollback();
      return res
        .status(400)
        .json({ message: `Aucun stock disponible` });
    }

    if (ouvrage.stock < quantite) {
      await connection.rollback();
      return res.status(400).json({
        message: `Stock insuffisant pour "${ouvrage.titre}" (disponible: ${ouvrage.stock})`,
      });
    }

    // Créer ou récupérer le panier actif
    let [panierRows] = await connection.query(
      `SELECT id FROM panier WHERE client_id = ? AND actif = 1`,
      [clientId]
    );

    let panierId;
    if (panierRows.length > 0) {
      panierId = panierRows[0].id;
    } else {
      const [result] = await connection.query(
        `INSERT INTO panier (client_id) VALUES (?)`,
        [clientId]
      );
      panierId = result.insertId;
    }

    // Vérifier si l'article existe déjà dans le panier
    const [exist] = await connection.query(
      `SELECT id, quantite FROM panier_items WHERE panier_id = ? AND ouvrage_id = ?`,
      [panierId, ouvrage_id]
    );

    if (exist.length > 0) {
      const nouvelleQuantite = exist[0].quantite + quantite;

      // Vérifier que la nouvelle quantité ne dépasse pas le stock
      if (nouvelleQuantite > ouvrage.stock) {
        await connection.rollback();
        return res.status(400).json({
          message: `Impossible d’ajouter ${quantite} exemplaires — seulement ${ouvrage.stock} disponibles.`,
        });
      }

      await connection.query(
        `UPDATE panier_items SET quantite = ? WHERE id = ?`,
        [nouvelleQuantite, exist[0].id]
      );
    } else {
      await connection.query(
        `INSERT INTO panier_items (panier_id, ouvrage_id, quantite, prix_unitaire)
         VALUES (?, ?, ?, ?)`,
        [panierId, ouvrage_id, quantite, ouvrage.prix]
      );
    }

    // Décrémenter le stock
    await connection.query(
      `UPDATE ouvrages SET stock = stock - ? WHERE id = ?`,
      [quantite, ouvrage_id]
    );

    await connection.commit();
    res.status(201).json({ message: "Article ajouté au panier" });
  } catch (err) {
    console.error(err);
    await connection.rollback();
    res.status(500).json({ message: "Erreur serveur" });
  } finally {
    connection.release();
  }
};

/**
 * Modifier la quantité d'un item
 */
export const updateItem = async (req, res) => {
  const { id } = req.params;
  const { quantite } = req.body;
  const clientId = req.user.id;

  try {
    const [panierRows] = await db.query(
      `SELECT id FROM panier WHERE client_id = ? AND actif = 1`,
      [clientId]
    );

    if (panierRows.length === 0) {
      return res.status(404).json({ message: "Panier non trouvé" });
    }

    const panierId = panierRows[0].id;

    const [result] = await db.query(
      `UPDATE panier_items SET quantite = ? WHERE id = ? AND panier_id = ?`,
      [quantite, id, panierId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Article non trouvé dans le panier" });
    }

    res.json({ message: "Quantité mise à jour" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Retirer un item du panier
 */
export const removeItem = async (req, res) => {
  const { id } = req.params;
  const clientId = req.user.id;

  try {
    const [panierRows] = await db.query(
      `SELECT id FROM panier WHERE client_id = ? AND actif = 1`,
      [clientId]
    );

    if (panierRows.length === 0) {
      return res.status(404).json({ message: "Panier non trouvé" });
    }

    const panierId = panierRows[0].id;

    const [result] = await db.query(
      `DELETE FROM panier_items WHERE id = ? AND panier_id = ?`,
      [id, panierId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Article non trouvé dans le panier" });
    }

    res.json({ message: "Article retiré du panier" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
