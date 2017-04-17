-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.5.36 - MySQL Community Server (GPL)
-- Server OS:                    Win64
-- HeidiSQL Version:             9.4.0.5169
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for phone_booth_database
CREATE DATABASE IF NOT EXISTS `phone_booth_database` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `phone_booth_database`;

-- Dumping structure for table phone_booth_database.user_info
CREATE TABLE IF NOT EXISTS `user_info` (
  `user_id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table phone_booth_database.user_info: ~0 rows (approximately)
/*!40000 ALTER TABLE `user_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_info` ENABLE KEYS */;

-- Dumping structure for table phone_booth_database.user_password
CREATE TABLE IF NOT EXISTS `user_password` (
  `user_id` int(10) NOT NULL,
  `password_hash` varchar(200) NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `FK__user_info` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table phone_booth_database.user_password: ~0 rows (approximately)
/*!40000 ALTER TABLE `user_password` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_password` ENABLE KEYS */;

-- Dumping structure for table phone_booth_database.user_phone_booth
CREATE TABLE IF NOT EXISTS `user_phone_booth` (
  `phone_booth_id` int(10) NOT NULL,
  `name` varchar(50) NOT NULL,
  `img_url` varchar(200) DEFAULT NULL,
  `contact_num` int(20) NOT NULL,
  `contact_ext` int(3) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`phone_booth_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table phone_booth_database.user_phone_booth: ~0 rows (approximately)
/*!40000 ALTER TABLE `user_phone_booth` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_phone_booth` ENABLE KEYS */;

-- Dumping structure for table phone_booth_database.user_phone_booth_extra
CREATE TABLE IF NOT EXISTS `user_phone_booth_extra` (
  `phone_booth_extra_id` int(10) NOT NULL AUTO_INCREMENT,
  `phone_booth_id` int(10) NOT NULL,
  `name` varchar(50) NOT NULL,
  `details` varchar(250) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`phone_booth_extra_id`),
  KEY `FK_user_phone_booth_extra_user_phone_booth` (`phone_booth_id`),
  CONSTRAINT `FK_user_phone_booth_extra_user_phone_booth` FOREIGN KEY (`phone_booth_id`) REFERENCES `user_phone_booth` (`phone_booth_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table phone_booth_database.user_phone_booth_extra: ~0 rows (approximately)
/*!40000 ALTER TABLE `user_phone_booth_extra` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_phone_booth_extra` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
