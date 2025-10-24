import db from "../db.js";
import { nanoid } from "nanoid";

export const createListe = async (req, res) => {
  const { nom, items } = req.body;

  if (!nom || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "nom et items requis" });
  }

  try {
    const code_partage = nanoid(8);
    const [listeResult] = await db.query(
      `INSERT INTO listes_cadeaux (nom, proprietaire_id, code_partage, date_creation)
       VALUES (?, ?, ?, NOW())`,
      [nom, req.user.id, code_partage]
    );
    const listeId = listeResult.insertId;

    for (const item of items) {
      const { ouvrage_id, quantite_souhaitee } = item;
      if (!ouvrage_id || !quantite_souhaitee) continue;

      await db.query(
        `INSERT INTO liste_items (liste_id, ouvrage_id, quantite_souhaitee, created_at)
         VALUES (?, ?, ?, NOW())`,
        [listeId, ouvrage_id, quantite_souhaitee]
      );
    }

    const [liste] = await db.query(
      `SELECT * FROM listes_cadeaux WHERE id = ?`,
      [listeId]
    );
    const [listeItems] = await db.query(
      `SELECT li.id, li.ouvrage_id, li.quantite_souhaitee, o.titre, o.prix
       FROM liste_items li
       JOIN ouvrages o ON li.ouvrage_id = o.id
       WHERE li.liste_id = ?`,
      [listeId]
    );

    res.status(201).json({
      message: "Liste créée avec succès",
      liste: liste[0],
      items: listeItems,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getListeByCode = async (req, res) => {
  const { code } = req.params;

  try {
    const [liste] = await db.query(
      `SELECT id, nom, proprietaire_id, code_partage, date_creation 
       FROM listes_cadeaux WHERE code_partage = ?`,
      [code]
    );

    if (liste.length === 0)
      return res.status(404).json({ message: "Liste introuvable" });

    const [items] = await db.query(
      `SELECT li.id, li.ouvrage_id, li.quantite_souhaitee, o.titre, o.prix
       FROM liste_items li
       JOIN ouvrages o ON li.ouvrage_id = o.id
       WHERE li.liste_id = ?`,
      [liste[0].id]
    );

    res.json({ liste: liste[0], items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const acheterDepuisListe = async (req, res) => {
  const { code } = req.params;

  try {
    const [liste] = await db.query(
      `SELECT id FROM listes_cadeaux WHERE code_partage = ?`,
      [code]
    );

    if (liste.length === 0)
      return res.status(404).json({ message: "Liste introuvable" });

    const listeId = liste[0].id;

    const [items] = await db.query(
      `SELECT ouvrage_id, quantite_souhaitee FROM liste_items WHERE liste_id = ?`,
      [listeId]
    );

    if (items.length === 0)
      return res.status(400).json({ message: "Liste vide" });

    const [commandeResult] = await db.query(
      `INSERT INTO commandes (client_id, statut, date, created_at)
       VALUES (?, 'en_cours', NOW(), NOW())`,
      [req.user.id]
    );
    const commandeId = commandeResult.insertId;

    for (const item of items) {
      await db.query(
        `INSERT INTO commande_items (commande_id, ouvrage_id, quantite, prix_unitaire, created_at)
         SELECT ?, id, ?, prix, NOW() FROM ouvrages WHERE id = ?`,
        [commandeId, item.quantite_souhaitee, item.ouvrage_id]
      );
    }

    const paymentUrl = `https://paiement.simulation.com/commande/${commandeId}`;
    res.status(201).json({
      message: "Commande créée depuis la liste",
      commandeId,
      paymentUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
