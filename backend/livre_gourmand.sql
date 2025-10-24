-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 18 oct. 2025 à 04:53
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- Création et sélection de la base de données
-- --------------------------------------------------------

CREATE DATABASE IF NOT EXISTS livre_gourmand CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE livre_gourmand;

-- --------------------------------------------------------
-- Tables
-- --------------------------------------------------------

--
-- Structure de la table `avis`
--

CREATE TABLE `avis` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `ouvrage_id` int(11) NOT NULL,
  `note` int(11) NOT NULL CHECK (`note` between 1 and 5),
  `commentaire` text DEFAULT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `commandes`
--

CREATE TABLE `commandes` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `total` decimal(12,2) NOT NULL CHECK (`total` >= 0),
  `statut` enum('en_cours','payee','annulee','expediee') NOT NULL DEFAULT 'en_cours',
  `adresse_livraison` text DEFAULT NULL,
  `mode_livraison` varchar(255) DEFAULT NULL,
  `mode_paiement` varchar(255) DEFAULT NULL,
  `payment_provider_id` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `commande_items`
--

CREATE TABLE `commande_items` (
  `id` int(11) NOT NULL,
  `commande_id` int(11) NOT NULL,
  `ouvrage_id` int(11) NOT NULL,
  `quantite` int(11) NOT NULL DEFAULT 1 CHECK (`quantite` > 0),
  `prix_unitaire` decimal(10,2) NOT NULL CHECK (`prix_unitaire` >= 0),
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `commentaires`
--

CREATE TABLE `commentaires` (
  `id` int(11) NOT NULL,
  `client_id` int(11) DEFAULT NULL,
  `ouvrage_id` int(11) NOT NULL,
  `contenu` text NOT NULL,
  `valide` tinyint(1) NOT NULL DEFAULT 0,
  `date_soumission` datetime NOT NULL DEFAULT current_timestamp(),
  `date_validation` datetime DEFAULT NULL,
  `valide_par` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `listes_cadeaux`
--

CREATE TABLE `listes_cadeaux` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `proprietaire_id` int(11) NOT NULL,
  `code_partage` varchar(255) DEFAULT NULL,
  `date_creation` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `liste_items`
--

CREATE TABLE `liste_items` (
  `id` int(11) NOT NULL,
  `liste_id` int(11) NOT NULL,
  `ouvrage_id` int(11) NOT NULL,
  `quantite_souhaitee` int(11) NOT NULL DEFAULT 1 CHECK (`quantite_souhaitee` > 0),
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ouvrages`
--

CREATE TABLE `ouvrages` (
  `id` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `auteur` varchar(255) DEFAULT NULL,
  `isbn` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `prix` decimal(10,2) NOT NULL DEFAULT 0.00 CHECK (`prix` >= 0),
  `stock` int(11) NOT NULL DEFAULT 0 CHECK (`stock` >= 0),
  `categorie_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `panier`
--

CREATE TABLE `panier` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `actif` tinyint(1) NOT NULL DEFAULT 1,
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `panier_items`
--

CREATE TABLE `panier_items` (
  `id` int(11) NOT NULL,
  `panier_id` int(11) NOT NULL,
  `ouvrage_id` int(11) NOT NULL,
  `quantite` int(11) NOT NULL DEFAULT 1 CHECK (`quantite` > 0),
  `prix_unitaire` decimal(10,2) NOT NULL CHECK (`prix_unitaire` >= 0),
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `commande_id` int(11) NOT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `provider_payment_id` varchar(255) DEFAULT NULL,
  `statut` varchar(100) DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL CHECK (`amount` >= 0),
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('client','editeur','gestionnaire','administrateur') NOT NULL DEFAULT 'client',
  `actif` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `avis`
--
ALTER TABLE `avis`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ux_avis_client_ouvrage` (`client_id`,`ouvrage_id`),
  ADD KEY `fk_avis_ouvrage` (`ouvrage_id`);

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nom` (`nom`);

--
-- Index pour la table `commandes`
--
ALTER TABLE `commandes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_commandes_client` (`client_id`);

--
-- Index pour la table `commande_items`
--
ALTER TABLE `commande_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_commande_items_commande` (`commande_id`),
  ADD KEY `fk_commande_items_ouvrage` (`ouvrage_id`);

--
-- Index pour la table `commentaires`
--
ALTER TABLE `commentaires`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_commentaires_client` (`client_id`),
  ADD KEY `fk_commentaires_ouvrage` (`ouvrage_id`),
  ADD KEY `fk_commentaires_valide_par` (`valide_par`);

--
-- Index pour la table `listes_cadeaux`
--
ALTER TABLE `listes_cadeaux`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code_partage` (`code_partage`),
  ADD KEY `fk_listes_proprietaire` (`proprietaire_id`);

--
-- Index pour la table `liste_items`
--
ALTER TABLE `liste_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ux_liste_ouvrage` (`liste_id`,`ouvrage_id`),
  ADD KEY `fk_liste_items_ouvrage` (`ouvrage_id`);

--
-- Index pour la table `ouvrages`
--
ALTER TABLE `ouvrages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `isbn` (`isbn`),
  ADD KEY `fk_ouvrages_categorie` (`categorie_id`),
  ADD KEY `idx_ouvrages_titre` (`titre`);

--
-- Index pour la table `panier`
--
ALTER TABLE `panier`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_panier_client` (`client_id`);

--
-- Index pour la table `panier_items`
--
ALTER TABLE `panier_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ux_panier_ouvrage` (`panier_id`,`ouvrage_id`),
  ADD KEY `fk_panier_items_ouvrage` (`ouvrage_id`);

--
-- Index pour la table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_payments_commande` (`commande_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `avis`
--
ALTER TABLE `avis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `commandes`
--
ALTER TABLE `commandes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `commande_items`
--
ALTER TABLE `commande_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `commentaires`
--
ALTER TABLE `commentaires`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `listes_cadeaux`
--
ALTER TABLE `listes_cadeaux`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `liste_items`
--
ALTER TABLE `liste_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `ouvrages`
--
ALTER TABLE `ouvrages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `panier`
--
ALTER TABLE `panier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `panier_items`
--
ALTER TABLE `panier_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `avis`
--
ALTER TABLE `avis`
  ADD CONSTRAINT `fk_avis_client` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_avis_ouvrage` FOREIGN KEY (`ouvrage_id`) REFERENCES `ouvrages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `commandes`
--
ALTER TABLE `commandes`
  ADD CONSTRAINT `fk_commandes_client` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `commande_items`
--
ALTER TABLE `commande_items`
  ADD CONSTRAINT `fk_commande_items_commande` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_commande_items_ouvrage` FOREIGN KEY (`ouvrage_id`) REFERENCES `ouvrages` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `commentaires`
--
ALTER TABLE `commentaires`
  ADD CONSTRAINT `fk_commentaires_client` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_commentaires_ouvrage` FOREIGN KEY (`ouvrage_id`) REFERENCES `ouvrages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_commentaires_valide_par` FOREIGN KEY (`valide_par`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `listes_cadeaux`
--
ALTER TABLE `listes_cadeaux`
  ADD CONSTRAINT `fk_listes_proprietaire` FOREIGN KEY (`proprietaire_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `liste_items`
--
ALTER TABLE `liste_items`
  ADD CONSTRAINT `fk_liste_items_liste` FOREIGN KEY (`liste_id`) REFERENCES `listes_cadeaux` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_liste_items_ouvrage` FOREIGN KEY (`ouvrage_id`) REFERENCES `ouvrages` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `ouvrages`
--
ALTER TABLE `ouvrages`
  ADD CONSTRAINT `fk_ouvrages_categorie` FOREIGN KEY (`categorie_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `panier`
--
ALTER TABLE `panier`
  ADD CONSTRAINT `fk_panier_client` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `panier_items`
--
ALTER TABLE `panier_items`
  ADD CONSTRAINT `fk_panier_items_ouvrage` FOREIGN KEY (`ouvrage_id`) REFERENCES `ouvrages` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_panier_items_panier` FOREIGN KEY (`panier_id`) REFERENCES `panier` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `fk_payments_commande` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- --------------------------------------------------------
-- SEED: données initiales
-- --------------------------------------------------------

INSERT INTO categories (nom, description) VALUES
('Littérature classique', 'Livres classiques de la littérature mondiale'),
('Science-fiction', 'Romans de science-fiction et dystopie'),
('Jeunesse', 'Livres pour enfants et adolescents');

INSERT INTO ouvrages (titre, auteur, isbn, description, prix, stock, categorie_id) VALUES
('Le Petit Prince', 'Antoine de Saint-Exupéry', '9782070612758', 'Un conte poétique et philosophique pour tous les âges.', 12.99, 50, 1),
('1984', 'George Orwell', '9780451524935', 'Un roman dystopique sur la surveillance et le totalitarisme.', 15.50, 30, 2),
('Harry Potter à l''école des sorciers', 'J.K. Rowling', '9780747532743', 'Le premier tome des aventures de Harry Potter.', 20.00, 100, 3),
('Le Comte de Monte-Cristo', 'Alexandre Dumas', '9782070409349', 'Une histoire de vengeance et de justice.', 18.75, 25, 2),
('La Peste', 'Albert Camus', '9782070360427', 'Roman philosophique sur la condition humaine.', 14.20, 40, 2);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
