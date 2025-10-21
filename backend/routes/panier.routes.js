import express from 'express';
import db from '../db.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

/**
 * 🛒 GET /api/panier — récupérer le panier actuel du client connecté
 */
router.get('/', verifyToken, async (req, res) => {
  const clientId = req.user.id;

  try {
    // 1️⃣ Récupérer le panier actif
    const [panierRows] = await db.query(
      `SELECT id FROM panier WHERE client_id = ? AND actif = 1`,
      [clientId]
    );

    if (panierRows.length === 0) {
      return res.json([]); // aucun panier actif → retourner liste vide
    }

    const panierId = panierRows[0].id;

    // 2️⃣ Récupérer les items du panier
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
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


/**
 * ➕ POST /api/panier/items — ajouter un item au panier
 * { ouvrage_id, quantite }
 */
router.post('/items', verifyToken, async (req, res) => {
  const { ouvrage_id, quantite } = req.body;
  const clientId = req.user.id;

  try {
    // 1️⃣ Récupérer le panier actif
    let [panierRows] = await db.query(
      `SELECT id FROM panier WHERE client_id = ? AND actif = 1`,
      [clientId]
    );

    let panierId;
    if (panierRows.length > 0) {
      panierId = panierRows[0].id;
    } else {
      // Créer un panier actif si pas existant
      const [result] = await db.query(
        `INSERT INTO panier (client_id) VALUES (?)`,
        [clientId]
      );
      panierId = result.insertId;
    }

    // 2️⃣ Vérifier si l'article est déjà dans le panier
    const [exist] = await db.query(
      `SELECT id, quantite FROM panier_items WHERE panier_id = ? AND ouvrage_id = ?`,
      [panierId, ouvrage_id]
    );

    if (exist.length > 0) {
      // Mettre à jour la quantité
      await db.query(
        `UPDATE panier_items SET quantite = quantite + ? WHERE id = ?`,
        [quantite, exist[0].id]
      );
    } else {
      // Ajouter un nouvel item
      // Récupérer le prix actuel de l'ouvrage
      const [ouvrageRows] = await db.query(`SELECT prix FROM ouvrages WHERE id = ?`, [ouvrage_id]);
      if (ouvrageRows.length === 0) return res.status(404).json({ message: "Ouvrage non trouvé" });
      const prix = ouvrageRows[0].prix;

      await db.query(
        `INSERT INTO panier_items (panier_id, ouvrage_id, quantite, prix_unitaire)
         VALUES (?, ?, ?, ?)`,
        [panierId, ouvrage_id, quantite, prix]
      );
    }

    res.status(201).json({ message: 'Article ajouté au panier' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/**
 * ✏️ PUT /api/panier/items/:id — modifier la quantité d'un item
 */
router.put('/items/:id', verifyToken, async (req, res) => {
  const { id } = req.params; // id do item do carrinho
  const { quantite } = req.body;
  const clientId = req.user.id;

  try {
    // Recuperar o panier ativo do cliente
    const [panierRows] = await db.query(
      `SELECT id FROM panier WHERE client_id = ? AND actif = 1`,
      [clientId]
    );

    if (panierRows.length === 0) {
      return res.status(404).json({ message: 'Panier non trouvé' });
    }

    const panierId = panierRows[0].id;

    // Atualizar a quantidade
    const [result] = await db.query(
      `UPDATE panier_items SET quantite = ? WHERE id = ? AND panier_id = ?`,
      [quantite, id, panierId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Article non trouvé dans le panier" });
    }

    res.json({ message: 'Quantité mise à jour' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


/**
 * ❌ DELETE /api/panier/items/:id — retirer un item du panier
 */
router.delete('/items/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const clientId = req.user.id;

  try {
    // Recuperar o panier ativo
    const [panierRows] = await db.query(
      `SELECT id FROM panier WHERE client_id = ? AND actif = 1`,
      [clientId]
    );

    if (panierRows.length === 0) {
      return res.status(404).json({ message: 'Panier non trouvé' });
    }

    const panierId = panierRows[0].id;

    // Remover o item
    const [result] = await db.query(
      `DELETE FROM panier_items WHERE id = ? AND panier_id = ?`,
      [id, panierId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Article non trouvé dans le panier" });
    }

    res.json({ message: 'Article retiré du panier' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


export default router;
