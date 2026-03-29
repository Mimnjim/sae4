-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : dim. 29 mars 2026 à 22:18
-- Version du serveur : 11.4.10-MariaDB
-- Version de PHP : 8.4.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `noke9342_musee_api`
--

-- --------------------------------------------------------

--
-- Structure de la table `promo_codes`
--

CREATE TABLE `promo_codes` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `discount_percent` smallint(6) NOT NULL DEFAULT 0,
  `description` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `expires_at` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
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
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `contact_firstname` varchar(100) NOT NULL,
  `contact_lastname` varchar(100) NOT NULL,
  `contact_email` varchar(255) NOT NULL,
  `language` char(2) DEFAULT 'fr',
  `reservation_date` date NOT NULL,
  `time_slot_id` int(11) DEFAULT NULL,
  `nb_people` int(11) NOT NULL DEFAULT 1,
  `reservation_type` enum('standard','group','promo','game') NOT NULL DEFAULT 'standard',
  `promo_code_id` int(11) DEFAULT NULL,
  `subtotal` decimal(8,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(8,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(8,2) NOT NULL DEFAULT 0.00,
  `status` enum('pending','confirmed','cancelled') NOT NULL DEFAULT 'confirmed',
  `reference` varchar(80) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
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
(7, 5, 'zgjkerogp', 'gerjkplger', 'delavigne.tom@outlook.fr', 'fr', '2026-03-26', 4, 5, 'standard', 1, 36.00, 1.80, 34.20, 'confirmed', 'RES-20260322-9d2bca', '2026-03-22 17:14:56', NULL),
(8, 5, 'tom', 'del', 'del@del.fr', 'fr', '2026-03-23', 3, 6, 'standard', NULL, 45.00, 0.00, 45.00, 'confirmed', 'RES-20260323-cbf8ff', '2026-03-23 07:54:27', NULL),
(9, 5, 'tom', 'tom', 'del@del.fr', 'fr', '2026-03-23', 4, 6, 'standard', NULL, 45.00, 0.00, 45.00, 'confirmed', 'RES-20260323-004d68', '2026-03-23 13:49:52', NULL),
(10, 5, 'tom', 'delavigne', 'del@fr', 'fr', '2026-03-26', 3, 5, 'standard', NULL, 36.00, 0.00, 36.00, 'confirmed', 'RES-20260324-0debca', '2026-03-24 14:07:45', NULL),
(11, 5, 'fzegerzg', 'fzefgez', 'fezfez@outlook.fr', 'fr', '2026-03-24', 4, 1, 'standard', NULL, 9.00, 0.00, 9.00, 'confirmed', 'RES-20260324-92adff', '2026-03-24 14:25:53', NULL),
(12, 5, 'bjeor', 'gjerÃ´', 'gerjop@gjr.fr', 'fr', '2026-03-25', 5, 5, 'standard', 1, 36.00, 1.80, 34.20, 'confirmed', 'RES-20260325-14e440', '2026-03-25 14:53:00', NULL),
(15, 8, 'Jimmy', 'TE', 'tejimmy77@gmail.com', 'fr', '2026-03-27', 3, 1, 'standard', NULL, 0.00, 0.00, 0.00, 'confirmed', 'RES-20260327-ad1578', '2026-03-27 17:37:19', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `reservation_tickets`
--

CREATE TABLE `reservation_tickets` (
  `id` int(11) NOT NULL,
  `reservation_id` int(11) NOT NULL,
  `ticket_type` enum('plein','reduit','gratuit') NOT NULL,
  `unit_price` decimal(6,2) NOT NULL DEFAULT 0.00,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `line_total` decimal(8,2) NOT NULL DEFAULT 0.00
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
(17, 7, 'reduit', 6.00, 3, 18.00),
(18, 8, 'plein', 9.00, 3, 27.00),
(19, 8, 'reduit', 6.00, 3, 18.00),
(20, 9, 'plein', 9.00, 3, 27.00),
(21, 9, 'reduit', 6.00, 3, 18.00),
(22, 10, 'plein', 9.00, 2, 18.00),
(23, 10, 'reduit', 6.00, 3, 18.00),
(24, 11, 'plein', 9.00, 1, 9.00),
(25, 12, 'plein', 9.00, 2, 18.00),
(26, 12, 'reduit', 6.00, 3, 18.00),
(29, 15, 'gratuit', 0.00, 1, 0.00);

-- --------------------------------------------------------

--
-- Structure de la table `time_slots`
--

CREATE TABLE `time_slots` (
  `id` int(11) NOT NULL,
  `label` varchar(30) NOT NULL,
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
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `role` enum('visitor','admin') DEFAULT 'visitor',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `firstname`, `lastname`, `phone`, `role`, `created_at`, `updated_at`) VALUES
(5, 'delavigne.tom@outlook.fr', '$2y$10$nxGI4H0HBk9keZLGHqaTLOkgHoCtoic7BMaoT8Ol/zuEj/0lJvvSi', 'tom', 'delavigne', NULL, 'admin', '2026-03-18 13:14:28', NULL),
(6, 'del@del.fr', '$2y$10$YKzDbOOZcX85Xk8n8r8Gl.rRbTB0f8ldu/O1udysQ8SSnZUpv3DYK', 'tom', 'del', NULL, 'visitor', '2026-03-23 06:44:57', NULL),
(7, 't@t.fr', '$2y$10$/hBMEJJelQZl4ZSRiLrjKOMuW.x7Kslhbmxe5hYaCxgivUUByxNSm', 't', 't', NULL, 'visitor', '2026-03-26 08:03:07', NULL),
(8, 'tejimmy77@gmail.com', '$2y$10$8eKPImoYxQcvGsi7o877EOrCRPCpGShU85ZIhXUpfMcj3l5fedX8u', 'Jimmy', 'TE', NULL, 'admin', '2026-03-27 08:39:13', NULL);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `reservation_tickets`
--
ALTER TABLE `reservation_tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT pour la table `time_slots`
--
ALTER TABLE `time_slots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
