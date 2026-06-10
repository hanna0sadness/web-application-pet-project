-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Час створення: Квт 23 2026 р., 17:09
-- Версія сервера: 8.0.41
-- Версія PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База даних: `analytics_db`
--

-- --------------------------------------------------------

--
-- Структура таблиці `analysis_results`
--

CREATE TABLE `analysis_results` (
  `id` int NOT NULL,
  `dataset_id` int NOT NULL,
  `analysis_type` varchar(50) NOT NULL,
  `result_data` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп даних таблиці `analysis_results`
--

INSERT INTO `analysis_results` (`id`, `dataset_id`, `analysis_type`, `result_data`, `created_at`) VALUES
(1, 1, 'basic', '{\"Age\": {\"q1\": 20, \"q3\": 38, \"iqr\": 18, \"max\": 80, \"min\": 0.42, \"std\": 14.52, \"mean\": 29.7, \"count\": 714, \"median\": 28, \"outliers\": [66, 70, 70, 70.5, 71, 71, 74, 80], \"variance\": 210.72}, \"Fare\": {\"q1\": 7.8958, \"q3\": 31, \"iqr\": 23.1, \"max\": 512.3292, \"min\": 0, \"std\": 49.67, \"mean\": 32.2, \"count\": 891, \"median\": 14.45, \"outliers\": [66.6, 66.6, 69.3, 69.3, 69.55, 69.55, 69.55, 69.55, 69.55, 69.55, 69.55, 71, 71, 71.2833, 73.5, 73.5, 73.5, 73.5, 73.5, 75.25, 76.2917, 76.7292, 76.7292, 76.7292, 77.2875, 77.2875, 77.9583, 77.9583, 77.9583, 78.2667, 78.2667, 78.85, 78.85, 79.2, 79.2, 79.2, 79.2, 79.65, 79.65, 79.65, 80, 80, 81.8583, 82.1708, 82.1708, 83.1583, 83.1583, 83.1583, 83.475, 83.475, 86.5, 86.5, 86.5, 89.1042, 89.1042, 90, 90, 90, 90, 91.0792, 91.0792, 93.5, 93.5, 106.425, 106.425, 108.9, 108.9, 110.8833, 110.8833, 110.8833, 110.8833, 113.275, 113.275, 113.275, 120, 120, 120, 120, 133.65, 133.65, 134.5, 134.5, 135.6333, 135.6333, 135.6333, 146.5208, 146.5208, 151.55, 151.55, 151.55, 151.55, 153.4625, 153.4625, 153.4625, 164.8667, 164.8667, 211.3375, 211.3375, 211.3375, 211.5, 221.7792, 227.525, 227.525, 227.525, 227.525, 247.5208, 247.5208, 262.375, 262.375, 263, 263, 263, 263, 512.3292, 512.3292, 512.3292], \"variance\": 2466.67}, \"Parch\": {\"q1\": 0, \"q3\": 0, \"iqr\": 0, \"max\": 6, \"min\": 0, \"std\": 0.81, \"mean\": 0.38, \"count\": 891, \"median\": 0, \"outliers\": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6], \"variance\": 0.65}, \"SibSp\": {\"q1\": 0, \"q3\": 1, \"iqr\": 1, \"max\": 8, \"min\": 0, \"std\": 1.1, \"mean\": 0.52, \"count\": 891, \"median\": 0, \"outliers\": [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 8, 8, 8, 8, 8, 8, 8], \"variance\": 1.21}, \"Pclass\": {\"q1\": 2, \"q3\": 3, \"iqr\": 1, \"max\": 3, \"min\": 1, \"std\": 0.84, \"mean\": 2.31, \"count\": 891, \"median\": 3, \"outliers\": [], \"variance\": 0.7}, \"Ticket\": {\"q1\": 19996, \"q3\": 347743, \"iqr\": 327747, \"max\": 3101298, \"min\": 693, \"std\": 471252.39, \"mean\": 260318.55, \"count\": 661, \"median\": 236171, \"outliers\": [3101264, 3101265, 3101267, 3101276, 3101277, 3101278, 3101278, 3101281, 3101295, 3101295, 3101295, 3101295, 3101295, 3101295, 3101296, 3101298], \"variance\": 222078819253.29}, \"Survived\": {\"q1\": 0, \"q3\": 1, \"iqr\": 1, \"max\": 1, \"min\": 0, \"std\": 0.49, \"mean\": 0.38, \"count\": 891, \"median\": 0, \"outliers\": [], \"variance\": 0.24}, \"PassengerId\": {\"q1\": 223, \"q3\": 669, \"iqr\": 446, \"max\": 891, \"min\": 1, \"std\": 257.21, \"mean\": 446, \"count\": 891, \"median\": 446, \"outliers\": [], \"variance\": 66156.67}}', '2026-04-23 18:05:57'),
(2, 1, 'correlation', '{\"Fare\": {\"Fare\": 1, \"Parch\": 0.22, \"SibSp\": 0.16, \"Pclass\": -0.55, \"Survived\": 0.26, \"PassengerId\": 0.01}, \"Parch\": {\"Fare\": 0.22, \"Parch\": 1, \"SibSp\": 0.41, \"Pclass\": 0.02, \"Survived\": 0.08, \"PassengerId\": 0}, \"SibSp\": {\"Fare\": 0.16, \"Parch\": 0.41, \"SibSp\": 1, \"Pclass\": 0.08, \"Survived\": -0.04, \"PassengerId\": -0.06}, \"Pclass\": {\"Fare\": -0.55, \"Parch\": 0.02, \"SibSp\": 0.08, \"Pclass\": 1, \"Survived\": -0.34, \"PassengerId\": -0.04}, \"Survived\": {\"Fare\": 0.26, \"Parch\": 0.08, \"SibSp\": -0.04, \"Pclass\": -0.34, \"Survived\": 1, \"PassengerId\": -0.01}, \"PassengerId\": {\"Fare\": 0.01, \"Parch\": 0, \"SibSp\": -0.06, \"Pclass\": -0.04, \"Survived\": -0.01, \"PassengerId\": 1}}', '2026-04-23 18:05:57'),
(3, 2, 'basic', '{\"EAN\": {\"q1\": 2091465262179, \"q3\": 7695934105636, \"iqr\": 5604468843457, \"max\": 9921752342730, \"min\": 524638185, \"std\": 2903456757490.56, \"mean\": 4876267242467.14, \"count\": 100, \"median\": 4875720414995.5, \"outliers\": [], \"variance\": 8.430061142617581e24}, \"Size\": {\"q1\": null, \"q3\": null, \"iqr\": null, \"max\": null, \"min\": null, \"std\": null, \"mean\": null, \"count\": 39, \"median\": null, \"outliers\": [], \"variance\": null}, \"Index\": {\"q1\": 26, \"q3\": 76, \"iqr\": 50, \"max\": 100, \"min\": 1, \"std\": 28.87, \"mean\": 50.5, \"count\": 100, \"median\": 50.5, \"outliers\": [], \"variance\": 833.25}, \"Price\": {\"q1\": 232, \"q3\": 685, \"iqr\": 453, \"max\": 999, \"min\": 1, \"std\": 280.2, \"mean\": 451.19, \"count\": 100, \"median\": 407.5, \"outliers\": [], \"variance\": 78510.65}, \"Stock\": {\"q1\": 349, \"q3\": 756, \"iqr\": 407, \"max\": 998, \"min\": 10, \"std\": 265.38, \"mean\": 545.71, \"count\": 100, \"median\": 575.5, \"outliers\": [], \"variance\": 70426.51}, \"Internal ID\": {\"q1\": 25, \"q3\": 76, \"iqr\": 51, \"max\": 99, \"min\": 3, \"std\": 27.94, \"mean\": 49.34, \"count\": 100, \"median\": 48, \"outliers\": [], \"variance\": 780.5}}', '2026-04-23 18:06:06'),
(4, 2, 'correlation', '{\"EAN\": {\"EAN\": 1, \"Index\": -0.09, \"Price\": 0.11, \"Stock\": 0.02, \"Internal ID\": -0.16}, \"Index\": {\"EAN\": -0.09, \"Index\": 1, \"Price\": -0.08, \"Stock\": -0.11, \"Internal ID\": -0.22}, \"Price\": {\"EAN\": 0.11, \"Index\": -0.08, \"Price\": 1, \"Stock\": -0.02, \"Internal ID\": 0.19}, \"Stock\": {\"EAN\": 0.02, \"Index\": -0.11, \"Price\": -0.02, \"Stock\": 1, \"Internal ID\": -0.02}, \"Internal ID\": {\"EAN\": -0.16, \"Index\": -0.22, \"Price\": 0.19, \"Stock\": -0.02, \"Internal ID\": 1}}', '2026-04-23 18:06:06'),
(5, 3, 'basic', '{\"Index\": {\"q1\": 26, \"q3\": 76, \"iqr\": 50, \"max\": 100, \"min\": 1, \"std\": 28.87, \"mean\": 50.5, \"count\": 100, \"median\": 50.5, \"outliers\": [], \"variance\": 833.25}, \"Phone 1\": {\"q1\": null, \"q3\": null, \"iqr\": null, \"max\": null, \"min\": null, \"std\": null, \"mean\": null, \"count\": 76, \"median\": null, \"outliers\": [], \"variance\": null}, \"Phone 2\": {\"q1\": null, \"q3\": null, \"iqr\": null, \"max\": null, \"min\": null, \"std\": null, \"mean\": null, \"count\": 79, \"median\": null, \"outliers\": [], \"variance\": null}, \"Customer Id\": {\"q1\": null, \"q3\": null, \"iqr\": null, \"max\": null, \"min\": null, \"std\": null, \"mean\": null, \"count\": 42, \"median\": null, \"outliers\": [], \"variance\": null}, \"Subscription Date\": {\"q1\": null, \"q3\": null, \"iqr\": null, \"max\": null, \"min\": null, \"std\": null, \"mean\": null, \"count\": 100, \"median\": null, \"outliers\": [], \"variance\": null}}', '2026-04-23 18:06:17'),
(6, 3, 'correlation', '{\"Index\": {\"Index\": 1, \"Subscription Date\": null}, \"Subscription Date\": {\"Index\": null, \"Subscription Date\": null}}', '2026-04-23 18:06:17');

-- --------------------------------------------------------

--
-- Структура таблиці `datasets`
--

CREATE TABLE `datasets` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `filename` varchar(255) NOT NULL,
  `row_count` int DEFAULT '0',
  `column_count` int DEFAULT '0',
  `upload_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` enum('uploaded','processing','ready','error') DEFAULT 'uploaded'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп даних таблиці `datasets`
--

INSERT INTO `datasets` (`id`, `user_id`, `filename`, `row_count`, `column_count`, `upload_date`, `status`) VALUES
(1, 2, 'titanic.csv', 891, 12, '2026-04-23 18:05:57', 'ready'),
(2, 2, 'products-100.csv', 100, 13, '2026-04-23 18:06:06', 'ready'),
(3, 2, 'customers-100.csv', 100, 12, '2026-04-23 18:06:17', 'ready');

-- --------------------------------------------------------

--
-- Структура таблиці `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп даних таблиці `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'Віталій', 'vetal14@gmail.com', '$2b$10$tYqErHXcVnjKkwtagQoG.e4aD/9zxmV8QJ90CjjVX9.qDRL5nslPG', 'user', '2026-04-13 11:23:44'),
(2, 'Петро', 'petro@gmail.com', '$2b$10$TYfZxrm8zGLc4hJAu8UIS.o3lq7GwyStazziDs1ghA2fMaRlEujqa', 'user', '2026-04-15 20:54:39'),
(3, 'Олександр', 'vitko@gmail.com', '$2b$10$Mf8hf8k3STDEBNWw0g7aqOzJDu6I9ScxKhUv8aeskpIlS.JcMLDIa', 'user', '2026-04-23 17:58:02');

-- --------------------------------------------------------

--
-- Структура таблиці `visualizations`
--

CREATE TABLE `visualizations` (
  `id` int NOT NULL,
  `dataset_id` int NOT NULL,
  `viz_type` varchar(50) NOT NULL,
  `column_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `config` json DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп даних таблиці `visualizations`
--

INSERT INTO `visualizations` (`id`, `dataset_id`, `viz_type`, `column_name`, `config`, `image_path`) VALUES
(1, 3, 'bar', 'index', '{\"column\": \"index\"}', '5f27b932bd2ba56d49a710de507ba600');

--
-- Індекси збережених таблиць
--

--
-- Індекси таблиці `analysis_results`
--
ALTER TABLE `analysis_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dataset_id` (`dataset_id`);

--
-- Індекси таблиці `datasets`
--
ALTER TABLE `datasets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Індекси таблиці `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Індекси таблиці `visualizations`
--
ALTER TABLE `visualizations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dataset_id` (`dataset_id`);

--
-- AUTO_INCREMENT для збережених таблиць
--

--
-- AUTO_INCREMENT для таблиці `analysis_results`
--
ALTER TABLE `analysis_results`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT для таблиці `datasets`
--
ALTER TABLE `datasets`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблиці `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблиці `visualizations`
--
ALTER TABLE `visualizations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Обмеження зовнішнього ключа збережених таблиць
--

--
-- Обмеження зовнішнього ключа таблиці `analysis_results`
--
ALTER TABLE `analysis_results`
  ADD CONSTRAINT `analysis_results_ibfk_1` FOREIGN KEY (`dataset_id`) REFERENCES `datasets` (`id`) ON DELETE CASCADE;

--
-- Обмеження зовнішнього ключа таблиці `datasets`
--
ALTER TABLE `datasets`
  ADD CONSTRAINT `datasets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Обмеження зовнішнього ключа таблиці `visualizations`
--
ALTER TABLE `visualizations`
  ADD CONSTRAINT `visualizations_ibfk_1` FOREIGN KEY (`dataset_id`) REFERENCES `datasets` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
