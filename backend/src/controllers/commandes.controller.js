import db from "../db.js";

// Créer une commande depuis le panier
export const createCommande = async (req, res) => {
  const clientId = req.user.id;

  try {
    // 1. Récupérer le panier actif
    const [panierRows] = await db.query(
      `SELECT id FROM panier WHERE client_id = ? AND actif = 1`,
      [clientId]
    );

    if (panierRows.length === 0) {
      return res.status(400).json({ message: "Panier vide" });
    }

    const panierId = panierRows[0].id;

    // 2. Récupérer les items du panier
    const [items] = await db.query(
      `SELECT pi.ouvrage_id, pi.quantite 
       FROM panier_items pi
       WHERE pi.panier_id = ?`,
      [panierId]
    );

    if (items.length === 0) {
      return res.status(400).json({ message: "Panier vide" });
    }

    // 3. Créer la commande
    const [commandeResult] = await db.query(
      `INSERT INTO commandes (client_id, statut, created_at) VALUES (?, 'en_cours', NOW())`,
      [clientId]
    );
    const commandeId = commandeResult.insertId;

    // 4. Ajouter les lignes de commande
    for (const item of items) {
      const [ouvrageRows] = await db.query(
        `SELECT prix FROM ouvrages WHERE id = ?`,
        [item.ouvrage_id]
      );
      const prix = ouvrageRows[0]?.prix || 0;

      await db.query(
        `INSERT INTO commande_items (commande_id, ouvrage_id, quantite, prix_unitaire)
         VALUES (?, ?, ?, ?)`,
        [commandeId, item.ouvrage_id, item.quantite, prix]
      );
    }

    // 5. Vider le panier
    await db.query(`DELETE FROM panier_items WHERE panier_id = ?`, [panierId]);

    // 6. Simuler une URL de paiement
    const paymentUrl = `https://paiement.simulation.com/commande/${commandeId}`;
    res.status(201).json({ message: "Commande créée", commandeId, paymentUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Historique client
export const getCommandes = async (req, res) => {
  try {
    const [commandes] = await db.query(
      `SELECT * FROM commandes WHERE client_id = ? ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(commandes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Détail d'une commande
export const getCommandeById = async (req, res) => {
  const { id } = req.params;

  try {
    const [commande] = await db.query(`SELECT * FROM commandes WHERE id = ?`, [
      id,
    ]);
    if (commande.length === 0)
      return res.status(404).json({ message: "Commande introuvable" });

    // Vérifier les droits
    if (
      req.user.role !== "administrateur" &&
      commande[0].client_id !== req.user.id
    ) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const [items] = await db.query(
      `SELECT ci.id, ci.quantite, ci.prix_unitaire, o.titre
       FROM commande_items ci
       JOIN ouvrages o ON ci.ouvrage_id = o.id
       WHERE ci.commande_id = ?`,
      [id]
    );

    res.json({ commande: commande[0], items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Mise à jour du statut
export const updateCommandeStatus = async (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE commandes SET statut = ? WHERE id = ?`,
      [statut, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Commande introuvable" });
    }

    res.json({ message: "Statut mis à jour" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
