import express from 'express';
import db from '../db.js';
import { verifyToken } from '../middlewares/auth.js';
import { nanoid } from 'nanoid';

const router = express.Router();

/**
 * ➕ POST /api/listes — créer une liste cadeau
 * Génère un code de partage unique
 */
router.post('/', verifyToken, async (req, res) => {
  const { nom } = req.body;
  const proprietaire_id = req.user.id;

  if (!nom) return res.status(400).json({ message: 'Nom requis' });

  const code_partage = nanoid(10);

  try {
    const [result] = await db.query(
      `INSERT INTO listes_cadeaux (nom, proprietaire_id, code_partage, date_creation)
       VALUES (?, ?, ?, NOW())`,
      [nom, proprietaire_id, code_partage]
    );

    res.status(201).json({ message: 'Liste créée', id: result.insertId, code_partage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/**
 * ➕ POST /api/listes/:id/items — ajouter un livre à la liste
 * { ouvrage_id, quantite_souhaitee }
 */
router.post('/:id/items', verifyToken, async (req, res) => {
  const listeId = req.params.id;
  const { ouvrage_id, quantite_souhaitee } = req.body;

  if (!ouvrage_id || !quantite_souhaitee || quantite_souhaitee < 1) {
    return res.status(400).json({ message: 'Ouvrage et quantité valides requis' });
  }

  try {
    // Vérifier que la liste appartient à l'utilisateur
    const [liste] = await db.query(
      `SELECT * FROM listes_cadeaux WHERE id = ? AND proprietaire_id = ?`,
      [listeId, req.user.id]
    );
    if (liste.length === 0) {
      return res.status(403).json({ message: 'Liste introuvable ou non autorisée' });
    }

    // Vérifier si le livre est déjà dans la liste
    const [exist] = await db.query(
      `SELECT id FROM liste_items WHERE liste_id = ? AND ouvrage_id = ?`,
      [listeId, ouvrage_id]
    );
    if (exist.length > 0) {
      await db.query(
        `UPDATE liste_items SET quantite_souhaitee = quantite_souhaitee + ? WHERE id = ?`,
        [quantite_souhaitee, exist[0].id]
      );
      return res.json({ message: 'Quantité mise à jour pour ce livre' });
    }

    // Ajouter le livre
    await db.query(
      `INSERT INTO liste_items (liste_id, ouvrage_id, quantite_souhaitee, created_at)
       VALUES (?, ?, ?, NOW())`,
      [listeId, ouvrage_id, quantite_souhaitee]
    );

    res.status(201).json({ message: 'Livre ajouté à la liste' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/**
 * 📌 GET /api/listes/:code — consulter liste par code (ami)
 */
router.get('/:code', async (req, res) => {
  const { code } = req.params;

  try {
    const [listes] = await db.query(
      `SELECT l.id, l.nom, l.proprietaire_id, l.date_creation, u.nom AS proprietaire_nom
       FROM listes_cadeaux l
       JOIN users u ON u.id = l.proprietaire_id
       WHERE l.code_partage = ?`,
      [code]
    );

    if (listes.length === 0) return res.status(404).json({ message: 'Liste non trouvée' });

    const [items] = await db.query(
      `SELECT li.id, li.quantite_souhaitee, o.id AS ouvrage_id, o.titre, o.prix
       FROM liste_items li
       JOIN ouvrages o ON li.ouvrage_id = o.id
       WHERE li.liste_id = ?`,
      [listes[0].id]
    );

    res.json({ ...listes[0], items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/**
 * 🛒 POST /api/listes/:id/acheter — achat direct depuis la liste
 */
router.post('/:id/acheter', verifyToken, async (req, res) => {
  const listeId = req.params.id;
  const clientId = req.user.id;

  try {
    // récupérer les items de la liste
    const [items] = await db.query(
      `SELECT li.ouvrage_id, li.quantite_souhaitee AS quantite
       FROM liste_items li
       WHERE li.liste_id = ?`,
      [listeId]
    );

    if (items.length === 0) {
      return res.status(400).json({ message: 'Liste vide' });
    }

    // créer la commande
    const [commandeResult] = await db.query(
      `INSERT INTO commandes (client_id, statut, created_at) VALUES (?, 'en_cours', NOW())`,
      [clientId]
    );
    const commandeId = commandeResult.insertId;

    // ajouter les items à la commande
    for (const item of items) {
      await db.query(
        `INSERT INTO commande_items (commande_id, ouvrage_id, quantite, prix_unitaire)
         SELECT ?, o.id, ?, o.prix FROM ouvrages o WHERE o.id = ?`,
        [commandeId, item.quantite, item.ouvrage_id]
      );
    }

    res.status(201).json({ message: 'Commande créée depuis la liste', commandeId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
