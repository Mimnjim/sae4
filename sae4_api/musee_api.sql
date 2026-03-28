-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : dim. 22 mars 2026 à 17:22
-- Version du serveur : 8.0.40
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `musee_api`
--

-- --------------------------------------------------------

--
-- Structure de la table `promo_codes`
--

CREATE TABLE `promo_codes` (
  `id` int NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_percent` smallint NOT NULL DEFAULT '0',
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `expires_at` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `promo_codes`
--

INSERT INTO `promo_codes` (`id`, `code`, `discount_percent`, `description`, `active`, `expires_at`, `created_at`) VALUES
(1, 'HUMAIN5', 5, 'Réduction liée au mini-jeu', 1, NULL, '2026-03-18 14:05:45');

-- --------------------------------------------------------

--
-- Structure de la table `reservations`
--

CREATE TABLE `reservations` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `contact_firstname` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_lastname` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `language` char(2) COLLATE utf8mb4_unicode_ci DEFAULT 'fr',
  `reservation_date` date NOT NULL,
  `time_slot_id` int DEFAULT NULL,
  `nb_people` int NOT NULL DEFAULT '1',
  `reservation_type` enum('standard','group','promo','game') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'standard',
  `promo_code_id` int DEFAULT NULL,
  `subtotal` decimal(8,2) NOT NULL DEFAULT '0.00',
  `discount_amount` decimal(8,2) NOT NULL DEFAULT '0.00',
  `total_amount` decimal(8,2) NOT NULL DEFAULT '0.00',
  `status` enum('pending','confirmed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'confirmed',
  `reference` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `reservations`
--

INSERT INTO `reservations` (`id`, `user_id`, `contact_firstname`, `contact_lastname`, `contact_email`, `language`, `reservation_date`, `time_slot_id`, `nb_people`, `reservation_type`, `promo_code_id`, `subtotal`, `discount_amount`, `total_amount`, `status`, `reference`, `created_at`, `updated_at`) VALUES
(2, NULL, 'TOM', 'TOM', 'fgjropge@gjrekogpe.fr', 'fr', '2026-03-24', 5, 7, 'standard', NULL, 36.00, 0.00, 36.00, 'confirmed', 'RES-20260318-8ff65b', '2026-03-18 14:12:06', NULL),
(3, NULL, 'klgre', 'ferkl', 'fjkzeopl@fejkop.fr', 'fr', '2026-04-14', 6, 6, 'standard', 1, 45.00, 2.25, 42.75, 'confirmed', 'RES-20260318-2afc84', '2026-03-18 14:12:50', NULL),
(5, 5, 'gjerpog', 'gejrpkogler', 'gjerpkzlm@gjerpkm.fr', 'fr', '2026-10-06', 4, 8, 'standard', NULL, 45.00, 0.00, 45.00, 'confirmed', 'RES-20260318-0f67b3', '2026-03-18 17:39:27', NULL),
(6, 5, 'dfezf', 'ife)f', 'fekzfop@fekzpf.com', 'fr', '2028-03-15', 5, 6, 'standard', NULL, 30.00, 0.00, 30.00, 'confirmed', 'RES-20260319-5dbb0c', '2026-03-19 12:51:15', NULL),
(7, 5, 'zgjkerogp', 'gerjkplger', 'delavigne.tom@outlook.fr', 'fr', '2026-03-26', 4, 5, 'standard', 1, 36.00, 1.80, 34.20, 'confirmed', 'RES-20260322-9d2bca', '2026-03-22 17:14:56', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `reservation_tickets`
--

CREATE TABLE `reservation_tickets` (
  `id` int NOT NULL,
  `reservation_id` int NOT NULL,
  `ticket_type` enum('plein','reduit','gratuit') COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit_price` decimal(6,2) NOT NULL DEFAULT '0.00',
  `quantity` int NOT NULL DEFAULT '1',
  `line_total` decimal(8,2) NOT NULL DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `reservation_tickets`
--

INSERT INTO `reservation_tickets` (`id`, `reservation_id`, `ticket_type`, `unit_price`, `quantity`, `line_total`) VALUES
(2, 2, 'plein', 9.00, 2, 18.00),
(3, 2, 'reduit', 6.00, 3, 18.00),
(4, 2, 'gratuit', 0.00, 2, 0.00),
(5, 3, 'plein', 9.00, 3, 27.00),
(6, 3, 'reduit', 6.00, 3, 18.00),
(10, 5, 'plein', 9.00, 3, 27.00),
(11, 5, 'reduit', 6.00, 3, 18.00),
(12, 5, 'gratuit', 0.00, 2, 0.00),
(13, 6, 'plein', 9.00, 2, 18.00),
(14, 6, 'reduit', 6.00, 2, 12.00),
(15, 6, 'gratuit', 0.00, 2, 0.00),
(16, 7, 'plein', 9.00, 2, 18.00),
(17, 7, 'reduit', 6.00, 3, 18.00);

-- --------------------------------------------------------

--
-- Structure de la table `time_slots`
--

CREATE TABLE `time_slots` (
  `id` int NOT NULL,
  `label` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `time_slots`
--

INSERT INTO `time_slots` (`id`, `label`, `start_time`, `end_time`) VALUES
(1, '10:00 - 11:00', '10:00:00', '11:00:00'),
(2, '11:00 - 12:00', '11:00:00', '12:00:00'),
(3, '12:00 - 13:00', '12:00:00', '13:00:00'),
(4, '13:00 - 14:00', '13:00:00', '14:00:00'),
(5, '14:00 - 15:00', '14:00:00', '15:00:00'),
(6, '15:00 - 16:00', '15:00:00', '16:00:00'),
(7, '16:00 - 17:00', '16:00:00', '17:00:00'),
(8, '17:00 - 18:00', '17:00:00', '18:00:00');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `firstname` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastname` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('visitor','admin') COLLATE utf8mb4_unicode_ci DEFAULT 'visitor',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `firstname`, `lastname`, `phone`, `role`, `created_at`, `updated_at`) VALUES
(5, 'delavigne.tom@outlook.fr', '$2y$10$nxGI4H0HBk9keZLGHqaTLOkgHoCtoic7BMaoT8Ol/zuEj/0lJvvSi', 'tom', 'delavigne', NULL, 'admin', '2026-03-18 13:14:28', NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `promo_codes`
--
ALTER TABLE `promo_codes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Index pour la table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `time_slot_id` (`time_slot_id`),
  ADD KEY `promo_code_id` (`promo_code_id`),
  ADD KEY `idx_res_user` (`user_id`),
  ADD KEY `idx_res_date` (`reservation_date`),
  ADD KEY `idx_res_status` (`status`);

--
-- Index pour la table `reservation_tickets`
--
ALTER TABLE `reservation_tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ticket_res` (`reservation_id`);

--
-- Index pour la table `time_slots`
--
ALTER TABLE `time_slots`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `label` (`label`);

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
-- AUTO_INCREMENT pour la table `promo_codes`
--
ALTER TABLE `promo_codes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `reservation_tickets`
--
ALTER TABLE `reservation_tickets`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT pour la table `time_slots`
--
ALTER TABLE `time_slots`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`time_slot_id`) REFERENCES `time_slots` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `reservations_ibfk_3` FOREIGN KEY (`promo_code_id`) REFERENCES `promo_codes` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `reservation_tickets`
--
ALTER TABLE `reservation_tickets`
  ADD CONSTRAINT `reservation_tickets_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
