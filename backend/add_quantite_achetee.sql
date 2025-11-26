-- Script pour ajouter la colonne quantite_achetee à la table liste_items
-- Exécutez ce script dans votre base de données MySQL

ALTER TABLE `liste_items`
ADD COLUMN `quantite_achetee` int(11) NOT NULL DEFAULT 0 CHECK (`quantite_achetee` >= 0);

