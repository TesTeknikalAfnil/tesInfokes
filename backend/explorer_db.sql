/*
 Navicat Premium Dump SQL

 Source Server         : tes
 Source Server Type    : MariaDB
 Source Server Version : 100413 (10.4.13-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : explorer_db

 Target Server Type    : MariaDB
 Target Server Version : 100413 (10.4.13-MariaDB)
 File Encoding         : 65001

 Date: 27/01/2025 22:38:05
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for files
-- ----------------------------
DROP TABLE IF EXISTS `files`;
CREATE TABLE `files`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `folder_id` int(11) NULL DEFAULT NULL,
  `file_path` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `files_ibfk_1`(`folder_id`) USING BTREE,
  CONSTRAINT `files_ibfk_1` FOREIGN KEY (`folder_id`) REFERENCES `folders` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of files
-- ----------------------------
INSERT INTO `files` VALUES (1, 'Resume.pdf', 2, 'path/to/Resume.pdf', '2025-01-26 18:21:48', '2025-01-26 18:21:48', NULL);
INSERT INTO `files` VALUES (2, 'Photo1.jpg', 3, 'path/to/Photo1.jpg', '2025-01-26 18:21:48', '2025-01-26 18:21:48', NULL);
INSERT INTO `files` VALUES (3, 'Song.mp3', 4, 'path/to/Song.mp3', '2025-01-26 18:21:48', '2025-01-26 18:21:48', NULL);
INSERT INTO `files` VALUES (4, 'Report.docx', 5, 'path/to/Report.docx', '2025-01-26 18:21:48', '2025-01-26 18:21:48', NULL);
INSERT INTO `files` VALUES (5, 'Beach.jpg', 6, 'path/to/Beach.jpg', '2025-01-26 18:21:48', '2025-01-26 18:21:48', NULL);

-- ----------------------------
-- Table structure for folders
-- ----------------------------
DROP TABLE IF EXISTS `folders`;
CREATE TABLE `folders`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `parent_id` int(11) NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `folders_ibfk_1`(`parent_id`) USING BTREE,
  CONSTRAINT `folders_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `folders` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of folders
-- ----------------------------
INSERT INTO `folders` VALUES (2, 'Documents', NULL, '2025-01-26 18:21:06', '2025-01-26 19:01:59', NULL);
INSERT INTO `folders` VALUES (3, 'Pictures', NULL, '2025-01-26 18:21:06', '2025-01-26 19:02:00', NULL);
INSERT INTO `folders` VALUES (4, 'Music', NULL, '2025-01-26 18:21:06', '2025-01-26 19:02:05', NULL);
INSERT INTO `folders` VALUES (5, 'Work', 2, '2025-01-26 18:21:06', '2025-01-26 18:21:06', NULL);
INSERT INTO `folders` VALUES (6, 'Vacation', 3, '2025-01-26 18:21:06', '2025-01-26 18:21:06', NULL);
INSERT INTO `folders` VALUES (8, 'Subfolder', 2, '2025-01-26 19:21:00', '2025-01-26 19:21:00', NULL);
INSERT INTO `folders` VALUES (9, 'New Folder', NULL, '2025-01-26 19:22:54', '2025-01-26 19:22:54', NULL);
INSERT INTO `folders` VALUES (18, 'Subfolder', 2, '2025-01-27 11:58:43', '2025-01-27 11:58:43', NULL);
INSERT INTO `folders` VALUES (19, 'string', NULL, '2025-01-27 12:30:54', '2025-01-27 12:30:54', NULL);

SET FOREIGN_KEY_CHECKS = 1;
