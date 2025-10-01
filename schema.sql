-- MySQL dump 10.13  Distrib 9.1.0, for Win64 (x86_64)
--
-- Host: shuttle.proxy.rlwy.net    Database: railway
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_users`
--

DROP TABLE IF EXISTS `auth_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `isActive` tinyint NOT NULL DEFAULT '1',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_13d8b49e55a8b06bee6bbc828f` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_users`
--

LOCK TABLES `auth_users` WRITE;
/*!40000 ALTER TABLE `auth_users` DISABLE KEYS */;
INSERT INTO `auth_users` VALUES (1,'admin1@gmail.com','$2a$12$2dlLN/N1pYbjq72MDRyt2O7op2kF0t2ZBg4Y2NT1u3sRT2vc727.u','admin',1,'2025-09-14 19:31:16.476534','2025-09-14 19:31:16.476534'),(2,'testcase@gmail.com','$2a$12$seNbpjeHnl1oS68n5Mhl.O4IKrINCflTbDwfK7AhGXLUy7gEDOIOO','customer',1,'2025-09-14 19:57:32.331773','2025-09-14 19:57:32.331773'),(3,'admin2@gmail.com','$2a$12$L7ck0QfNyW5JgP6aU/WGqO8WasBlugDx/doKX/mvgMWr1VBJ//AaK','customer',1,'2025-09-14 20:15:56.038778','2025-09-14 20:15:56.038778'),(4,'abc@gmail.com','$2a$12$j9kQ1Bw0Dcg5zRAuofn3B.kQeL05VdYNtprVtZ/pSuzI5XdzBs7DK','customer',1,'2025-09-17 18:28:29.755797','2025-09-17 18:28:29.755797'),(5,'aniketdalal126@gmail.com','$2a$12$wVdsUI8CnU3HWY70Zurx..Arm83vdj7viPyz3bpa2.SZELjtW7Xt.','customer',1,'2025-09-17 18:29:57.885696','2025-09-17 18:29:57.885696'),(6,'mahesh@gmail.com','$2a$12$.mJ.UPrEaf6Li4GfKza32eoJ2Ql/zOPIctUXgu5VjRltAuzGieJIO','employee',1,'2025-09-19 07:48:46.660065','2025-09-19 07:48:46.660065'),(7,'maheshcustomer@gmail.com','$2a$12$XkdTmndLN2DQxpLWZ3UVSOoENuP23nnqWaeJcnlAgq4gOw2uVG2Di','customer',1,'2025-09-19 12:13:18.933202','2025-09-19 12:13:18.933202'),(8,'abhaycustomer@gmail.com','$2a$12$MaNWG8MtkbgZVW1h61KP9OCtPXbqTj26s0JFWG/p0ZyTdFgedjNcW','customer',1,'2025-09-19 13:40:59.410544','2025-09-19 13:40:59.410544'),(9,'dhiraj@gmail.com','$2a$12$nuqjZ7uny9Rbd8664kkHcuylwXXdsXwjP2ZhyZxQIOGy1t16KLiN6','distributor',1,'2025-09-19 16:29:49.317145','2025-09-19 16:29:49.317145'),(10,'d1@gmail.com','$2a$12$sJSbBYSNRnS2d7ATVCZIb.Afyi5Psg3WUbXeFhs5qA.Nk18udTHti','distributor',1,'2025-09-19 16:30:53.601245','2025-09-19 16:30:53.601245'),(11,'ram@gmail.com','$2a$12$dwvltY8j1rUs2225rvZGI.mUFClFrtC9Mz1a9zl4c2W.oglsJt9va','employee',1,'2025-09-19 17:21:45.283188','2025-09-19 17:21:45.283188'),(12,'ramesh@gmail.com','$2a$12$htEmd5e7BPsc4ciI7CPaD.MlgJKVXBfVv5bw0RaCPH3K.22xzLwf.','employee',1,'2025-09-19 17:51:24.872030','2025-09-19 17:51:24.872030'),(13,'virat123@gmail.com','$2a$12$QF3DkR.1r2xb1Ai8ntZDM.XrXHZWccuxUY8VkLVHtGnzsNWXVlGU6','customer',1,'2025-09-19 18:09:19.547025','2025-09-19 18:09:19.547025'),(14,'jamesbond@gmai.com','$2a$12$yQsZVviS.SrjUwfOGeuyVudFkfjjxnRTdfhFm3sLQb4nCgzmdXd0u','customer',1,'2025-09-20 16:18:45.620039','2025-09-20 16:18:45.620039'),(15,'dilipdalal153@gmail.com','$2a$12$Z2UxzuSbRa67rzacW/Kdm.PUQeR7eo4ToYRLJOauc6.nkVc9VLrhG','customer',1,'2025-09-21 11:54:07.902464','2025-09-21 11:54:07.902464'),(16,'rihir71703@dotxan.com','$2a$12$lM9lsOB7BYHnRCUyU/xK8eVco2GONATsvxDSe0zp28HbitDgbmGDK','customer',1,'2025-09-21 13:19:20.095381','2025-09-21 13:19:20.095381'),(17,'tony@gmail.com','$2a$12$TcYxAfcj9oYS0G8TeiNYF.HDv6KLZWyIbFvHuM/STRISmcVRtrngi','customer',1,'2025-09-25 16:30:12.464960','2025-09-25 16:30:12.464960'),(18,'tony123@gmail.com','$2a$12$/y3LfUu8ILIwCZhLw/qNruzyPaagMfq4XZ28jL3FbT2g2.rsr9qCq','customer',1,'2025-09-26 08:34:22.986148','2025-09-26 08:34:22.986148'),(19,'ram1234@gmail.com','$2a$12$mpqTrltZtgPNKRW6HUO8texgvjzY/kYFK3jyeg3UpB5d7YZm5p8S2','customer',1,'2025-09-26 08:42:31.897721','2025-09-26 08:42:31.897721'),(20,'nitesh@gmail.com','$2a$12$UCm/8b4KoZisEJdzELg1l.67yhMEc43p2u8EF4yWGRXKPaNFTnyiG','customer',1,'2025-10-01 10:24:29.281099','2025-10-01 10:24:29.281099'),(21,'Shyamsundar@gmail.com','$2a$12$obC1mlClfW7HoUp2WBGtIuNiVBG2rLZ8Zk0Kjgy91yvS79wUUqL4G','customer',1,'2025-10-01 12:27:14.584896','2025-10-01 12:27:14.584896'),(22,'hoyalom540@rograc.com','$2a$12$vzv7DM/BdCOfuSZWe8n/I.9imU3auq1SVDopUXoQRiFOs5qii6DiC','customer',1,'2025-10-01 15:46:29.506043','2025-10-01 15:46:29.506043');
/*!40000 ALTER TABLE `auth_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `IDX_872bff57db2b6fe48c0913d8da` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (26,'Document','2025-09-14 21:09:55.593941'),(27,'2','2025-09-17 19:30:00.709766'),(28,'JOB','2025-09-19 08:05:28.470910'),(29,'Licence','2025-09-19 11:39:46.355215'),(30,'Hospital','2025-09-19 14:14:45.189011'),(31,'ParentLabel','2025-09-20 08:48:29.538788'),(32,'Identity Documents','2025-09-20 08:51:32.124197'),(34,'Identity_Documents','2025-09-20 08:51:51.823927'),(35,'Health Records','2025-09-20 08:53:29.864818'),(36,'School','2025-09-20 17:44:23.599835'),(37,'Document2','2025-10-01 09:53:09.348494');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificates`
--

DROP TABLE IF EXISTS `certificates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificates` (
  `certificate_id` int NOT NULL AUTO_INCREMENT,
  `certificate_name` varchar(255) NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `user_id` int NOT NULL,
  `document_id` int NOT NULL,
  `distributor_id` varchar(255) DEFAULT NULL,
  `certified_date` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `application_id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `receipt_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`certificate_id`),
  UNIQUE KEY `IDX_2cc147e8a7deb49696a2b8cf5b` (`application_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificates`
--

LOCK TABLES `certificates` WRITE;
/*!40000 ALTER TABLE `certificates` DISABLE KEYS */;
/*!40000 ALTER TABLE `certificates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact`
--

DROP TABLE IF EXISTS `contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact` (
  `id` int NOT NULL AUTO_INCREMENT,
  `data` json NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact`
--

LOCK TABLES `contact` WRITE;
/*!40000 ALTER TABLE `contact` DISABLE KEYS */;
INSERT INTO `contact` VALUES (6,'{\"Name\": \"ABhay\", \"Email\": \"abhay@gmail.com\", \"Address\": \"pune\", \"Contact\": \"8432551414\"}','2025-09-19 14:40:04','2025-09-19 14:40:04');
/*!40000 ALTER TABLE `contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_info`
--

DROP TABLE IF EXISTS `contact_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` varchar(500) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_info`
--

LOCK TABLES `contact_info` WRITE;
/*!40000 ALTER TABLE `contact_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents` (
  `document_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `category_id` int NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `subcategory_id` int NOT NULL,
  `subcategory_name` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` text,
  `documents` json NOT NULL,
  `status` enum('Pending','Approved','Rejected','Uploaded','Completed','Sent','Received') NOT NULL DEFAULT 'Pending',
  `distributor_id` varchar(255) DEFAULT NULL,
  `uploaded_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `status_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status_history` json DEFAULT NULL,
  `document_fields` json NOT NULL,
  `application_id` varchar(50) NOT NULL,
  `remark` text,
  `receipt_url` varchar(255) DEFAULT NULL,
  `rejection_reason` text,
  `selected_document_names` json DEFAULT NULL,
  PRIMARY KEY (`document_id`),
  UNIQUE KEY `IDX_723c3078829240efb0f35eb4c9` (`application_id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
INSERT INTO `documents` VALUES (16,1,36,'School',7,'11 class schollarship','Abhishek','Abhishek@gmail.com','+911234567890','','[{\"mimetype\": \"application/vnd.openxmlformats-officedocument.wordprocessingml.document\", \"file_path\": \"/uploads/16629663-88d7-40cd-a54f-abc8e51b1435.docx\", \"document_type\": \"B\"}]','Pending',NULL,'2025-09-20 17:58:33.980863','2025-09-20 17:58:33',NULL,'[]','11CLASSSCH01',NULL,NULL,NULL,NULL),(17,1,36,'School',7,'11 class schollarship','Abhishek','Abhishek@gmail.com','+911234567890','','[{\"mimetype\": \"application/vnd.openxmlformats-officedocument.wordprocessingml.document\", \"file_path\": \"/uploads/0309680f-851e-4b79-8c9b-7dd9dd877c76.docx\", \"document_type\": \"B\"}]','Rejected',NULL,'2025-09-20 18:00:30.007102','2025-09-20 18:00:30','[{\"status\": \"Rejected\", \"updated_at\": \"2025-09-20T18:34:41.986Z\"}, {\"status\": \"Rejected\", \"updated_at\": \"2025-09-20T18:50:07.829Z\"}]','[]','11CLASSSCH02',NULL,NULL,'fjqcb','[]'),(18,1,29,'Licence',8,'2 wheel licence','Abhishek','Abhishek@gmail.com','+911234567890','','[{\"mimetype\": \"image/png\", \"file_path\": \"/uploads/8df6b746-5bc0-4ef0-b0b0-2e4a9ccdbff7.png\", \"document_type\": \"p\"}]','Approved','10','2025-09-20 18:06:06.141275','2025-09-20 18:06:06','[{\"status\": \"Approved\", \"updated_at\": \"2025-09-20T18:30:09.124Z\"}, {\"status\": \"Approved\", \"updated_at\": \"2025-09-20T18:40:14.208Z\"}]','[]','2WHEELLICE01',NULL,NULL,NULL,NULL),(19,9,26,'Document',1,'Abc','Abhay Customer ','abhaycustomer@gmail.com','9657124518','','[{\"mimetype\": \"image/png\", \"file_path\": \"/uploads/81cc1b41-106a-48e0-a02d-3435a4963d3e.png\", \"document_type\": \"n\"}]','Received','10','2025-09-20 19:04:03.869525','2025-09-20 19:04:03','[{\"status\": \"Approved\", \"updated_at\": \"2025-09-20T19:14:49.824Z\"}, {\"status\": \"Sent\", \"updated_at\": \"2025-09-20T19:26:06.710Z\"}, {\"status\": \"Received\", \"updated_at\": \"2025-09-20T19:34:10.115Z\"}]','[{\"field_name\": \"123\", \"field_value\": \"12123\"}]','ABC01',NULL,'/uploads/1e3e7fa6-ca58-4e65-aaca-4ea8298dd590.png',NULL,NULL),(20,10,36,'School',7,'11 class schollarship','Dhiraj','dhiraj@gmail.com','9075830252','','[{\"mimetype\": \"image/png\", \"file_path\": \"/uploads/64c28a0d-4920-4cd7-8d24-7b75ac8a5346.png\", \"document_type\": \"B\"}]','Pending',NULL,'2025-09-29 10:58:13.709737','2025-09-29 10:58:13',NULL,'[]','11CLASSSCH03',NULL,NULL,NULL,NULL),(21,9,36,'School',7,'11 class schollarship','Abhay Customer ','abhaycustomer@gmail.com','9657124518','','[{\"mimetype\": \"image/png\", \"file_path\": \"/uploads/545f5bb5-e051-48f2-8934-b7397a02c374.png\", \"document_type\": \"B\"}]','Pending',NULL,'2025-09-29 18:15:07.412551','2025-09-29 18:15:07',NULL,'[{\"field_name\": \"Name\", \"field_value\": \"Aniket\"}]','11CLASSSCH04',NULL,NULL,NULL,NULL),(22,9,26,'Document',1,'Abc','Abhay Customer ','abhaycustomer@gmail.com','9657124518','','[{\"mimetype\": \"image/png\", \"file_path\": \"/uploads/a3b133f5-2a67-4e53-9bbd-61c162e94e6d.png\", \"document_type\": \"n\"}]','Received','10','2025-09-29 18:17:01.112952','2025-09-29 18:17:01','[{\"status\": \"Approved\", \"updated_at\": \"2025-09-29T18:23:54.281Z\"}, {\"status\": \"Sent\", \"updated_at\": \"2025-09-29T18:27:22.884Z\"}, {\"status\": \"Received\", \"updated_at\": \"2025-09-29T18:30:51.573Z\"}]','[{\"field_name\": \"123\", \"field_value\": \"Aniket\"}]','ABC02',NULL,'/uploads/1fec61e9-7977-4993-ad44-e1158d4641ad.png',NULL,NULL),(23,9,36,'School',7,'11 class schollarship','Abhay Customer ','abhaycustomer@gmail.com','9657124518','','[{\"mimetype\": \"image/png\", \"file_path\": \"/uploads/082a1bbe-bbc1-43e6-a8e6-4770f46ab473.png\", \"document_type\": \"B\"}]','Pending',NULL,'2025-09-30 16:52:17.891114','2025-09-30 16:52:17',NULL,'[{\"field_name\": \"Name\", \"field_value\": \"Aniket\"}]','11CLASSSCH05',NULL,NULL,NULL,NULL),(24,9,36,'School',7,'11 class schollarship','Abhay Customer ','abhaycustomer@gmail.com','9657124518','','[{\"mimetype\": \"image/png\", \"file_path\": \"/uploads/7aea02b9-7424-49f8-824d-c958ee0401f1.png\", \"document_type\": \"B\"}]','Pending',NULL,'2025-09-30 17:00:48.920171','2025-09-30 17:00:48',NULL,'[{\"field_name\": \"Name\", \"field_value\": \"Aniket Dalal\"}]','11CLASSSCH06',NULL,NULL,NULL,NULL),(25,9,36,'School',7,'11 class schollarship','Abhay Customer ','abhaycustomer@gmail.com','9657124518','','[{\"mimetype\": \"image/png\", \"file_path\": \"/uploads/25152f52-ad81-4fae-ba52-555b8129a03b.png\", \"document_type\": \"B\"}]','Pending',NULL,'2025-09-30 17:01:53.632388','2025-09-30 17:01:53',NULL,'[{\"field_name\": \"Name\", \"field_value\": \"Aniket\"}]','11CLASSSCH07',NULL,NULL,NULL,NULL),(26,9,36,'School',7,'11 class schollarship','Abhay Customer ','abhaycustomer@gmail.com','9657124518','','[{\"mimetype\": \"image/png\", \"file_path\": \"/uploads/fbaaef94-4656-4ab3-9680-3dbcdc31daf8.png\", \"document_type\": \"B\"}]','Pending',NULL,'2025-09-30 17:04:12.095145','2025-09-30 17:04:12',NULL,'[{\"field_name\": \"Name\", \"field_value\": \"Aniket Dalal\"}]','11CLASSSCH08',NULL,NULL,NULL,NULL),(27,9,36,'School',7,'11 class schollarship','Abhay Customer ','abhaycustomer@gmail.com','9657124518','','[{\"mimetype\": \"image/png\", \"file_path\": \"/uploads/e6cc171e-ad72-4e6b-a186-bd0f1c0cb739.png\", \"document_type\": \"B\"}]','Pending',NULL,'2025-09-30 17:17:04.674131','2025-09-30 17:17:04',NULL,'[{\"field_name\": \"Name\", \"field_value\": \"ANiket Dalal\"}]','11CLASSSCH09',NULL,NULL,NULL,NULL),(28,9,36,'School',7,'11 class schollarship','Abhay Customer ','abhaycustomer@gmail.com','9657124518','','[{\"mimetype\": \"image/png\", \"file_path\": \"/uploads/51326753-4faa-46f8-b26a-ac8d5f9b33a0.png\", \"document_type\": \"B\"}]','Pending',NULL,'2025-09-30 17:18:11.281325','2025-09-30 17:18:11',NULL,'[{\"field_name\": \"Name\", \"field_value\": \"Aniket Dalal\"}]','11CLASSSCH10',NULL,NULL,NULL,NULL),(29,9,36,'School',7,'11 class schollarship','Abhay Customer ','abhaycustomer@gmail.com','9657124518','','[{\"mimetype\": \"application/pdf\", \"file_path\": \"/uploads/637b6647-8923-4ff3-bf8c-47c87e91c6fc.pdf\", \"document_type\": \"B\"}]','Pending',NULL,'2025-09-30 17:24:42.041013','2025-09-30 17:24:42',NULL,'[{\"field_name\": \"Name\", \"field_value\": \"Aniket\"}]','11CLASSSCH11',NULL,NULL,NULL,NULL),(30,9,36,'School',7,'11 class schollarship','Abhay Customer ','abhaycustomer@gmail.com','9657124518','','[{\"mimetype\": \"image/png\", \"file_path\": \"/uploads/9025dde7-502e-45c9-8438-2982193d3fb8.png\", \"document_type\": \"B\"}]','Pending',NULL,'2025-09-30 17:41:13.487041','2025-09-30 17:41:13',NULL,'[{\"field_name\": \"Name\", \"field_value\": \"Aiket\"}]','11CLASSSCH12',NULL,NULL,NULL,NULL),(31,9,36,'School',7,'11 class schollarship','Abhay Customer ','abhaycustomer@gmail.com','9657124518','','[{\"mimetype\": \"image/png\", \"file_path\": \"/uploads/2d0f0873-59d0-49da-af68-46ced55675d6.png\", \"document_type\": \"B\"}]','Pending',NULL,'2025-09-30 17:42:54.442960','2025-09-30 17:42:54',NULL,'[{\"field_name\": \"Name\", \"field_value\": \"rgff\"}]','11CLASSSCH13',NULL,NULL,NULL,NULL),(32,9,36,'School',7,'11 class schollarship','Abhay Customer ','abhaycustomer@gmail.com','9657124518','','[{\"mimetype\": \"image/png\", \"file_path\": \"/uploads/b71ace93-27f9-4343-b574-340540a587e9.png\", \"document_type\": \"B\"}]','Pending',NULL,'2025-09-30 17:43:47.717141','2025-09-30 17:43:47',NULL,'[{\"field_name\": \"Name\", \"field_value\": \"dfdf\"}]','11CLASSSCH14',NULL,NULL,NULL,NULL),(33,9,36,'School',7,'11 class schollarship','Abhay Customer ','abhaycustomer@gmail.com','9657124518','','[{\"mimetype\": \"image/png\", \"file_path\": \"/uploads/152af93c-1d7f-44e4-bb27-9ca677cd2ca7.png\", \"document_type\": \"B\"}]','Pending',NULL,'2025-09-30 17:46:56.070245','2025-09-30 17:46:56',NULL,'[{\"field_name\": \"Name\", \"field_value\": \"ddf\"}]','11CLASSSCH15',NULL,NULL,NULL,NULL),(34,10,37,'Document2',10,'Cast Certificate ','Dhiraj','dhiraj@gmail.com','9075830252','','[{\"mimetype\": \"image/png\", \"file_path\": \"/uploads/6333271a-efde-4f4d-8bcb-e4919ae0cd11.png\", \"document_type\": \"B\"}]','Received','10','2025-10-01 09:59:49.046426','2025-10-01 09:59:49','[{\"status\": \"Approved\", \"updated_at\": \"2025-10-01T10:05:00.980Z\"}, {\"status\": \"Sent\", \"updated_at\": \"2025-10-01T10:06:49.690Z\"}, {\"status\": \"Received\", \"updated_at\": \"2025-10-01T10:07:32.973Z\"}]','[{\"field_name\": \"Name\", \"field_value\": \"Nitesh\"}]','CASTCERT01',NULL,'/uploads/020243d7-adae-413d-af1b-05ab5cfa92b0.png',NULL,NULL);
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documenttypes`
--

DROP TABLE IF EXISTS `documenttypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documenttypes` (
  `doc_type_id` int NOT NULL AUTO_INCREMENT,
  `doc_type_name` varchar(255) NOT NULL,
  PRIMARY KEY (`doc_type_id`),
  UNIQUE KEY `IDX_a84c5b76915e5cc15fb692c99b` (`doc_type_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documenttypes`
--

LOCK TABLES `documenttypes` WRITE;
/*!40000 ALTER TABLE `documenttypes` DISABLE KEYS */;
INSERT INTO `documenttypes` VALUES (1,'Licences'),(2,'Passport');
/*!40000 ALTER TABLE `documenttypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int DEFAULT NULL,
  `subcategory_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_e3889d87c0bfe311af8748cf08e` (`category_id`),
  KEY `FK_676fa6a3e903d4309a558d94694` (`subcategory_id`),
  CONSTRAINT `FK_676fa6a3e903d4309a558d94694` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`subcategory_id`),
  CONSTRAINT `FK_e3889d87c0bfe311af8748cf08e` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,30,6,7,'2025-09-20 09:01:33.000000','2025-09-20 09:01:33.000000'),(2,26,1,12,'2025-09-20 09:05:02.000000','2025-09-20 09:05:02.000000'),(3,36,7,7,'2025-09-20 17:50:35.000000','2025-09-20 17:50:35.000000'),(4,31,2,7,'2025-09-28 16:38:25.000000','2025-09-28 16:38:25.000000'),(5,30,6,7,'2025-09-29 03:29:44.455421','2025-09-29 03:29:44.455421');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `feedback_id` int NOT NULL AUTO_INCREMENT,
  `comment` varchar(255) NOT NULL,
  `rating` int NOT NULL DEFAULT '5',
  `user_id` int NOT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `userUserId` int DEFAULT NULL,
  PRIMARY KEY (`feedback_id`),
  KEY `FK_f5dc2db3587c3240c921a0df566` (`userUserId`),
  CONSTRAINT `FK_f5dc2db3587c3240c921a0df566` FOREIGN KEY (`userUserId`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,'Testing 123',3,9,1,'2025-09-19 14:23:45.493897',NULL),(2,'can you check my name is wrong in sequence',3,10,1,'2025-09-19 17:54:02.264186',NULL);
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feildname`
--

DROP TABLE IF EXISTS `feildname`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feildname` (
  `id` int NOT NULL AUTO_INCREMENT,
  `document_fields` text NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `categoryCategoryId` int DEFAULT NULL,
  `subcategorySubcategoryId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_7055795d21aed34ffc8ff84fcd9` (`categoryCategoryId`),
  KEY `FK_5530ee73b70742d37debdc55f71` (`subcategorySubcategoryId`),
  CONSTRAINT `FK_5530ee73b70742d37debdc55f71` FOREIGN KEY (`subcategorySubcategoryId`) REFERENCES `subcategories` (`subcategory_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_7055795d21aed34ffc8ff84fcd9` FOREIGN KEY (`categoryCategoryId`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feildname`
--

LOCK TABLES `feildname` WRITE;
/*!40000 ALTER TABLE `feildname` DISABLE KEYS */;
INSERT INTO `feildname` VALUES (4,'123','2025-09-20 18:57:33.890524',26,1),(5,'456','2025-09-20 18:57:50.179965',26,1),(6,'Name','2025-09-29 10:59:28.235390',36,7),(7,'Address','2025-09-29 11:44:29.459842',36,7),(8,'Name','2025-10-01 09:58:38.930080',37,10),(9,'Address','2025-10-01 09:58:52.214921',37,10),(10,'Contact','2025-10-01 09:59:02.344432',37,10);
/*!40000 ALTER TABLE `feildname` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `field`
--

DROP TABLE IF EXISTS `field`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `field` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_3df3435514867f0adea48430cf` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `field`
--

LOCK TABLES `field` WRITE;
/*!40000 ALTER TABLE `field` DISABLE KEYS */;
INSERT INTO `field` VALUES (2,'Name','2025-09-19 12:07:25','2025-09-19 12:07:25'),(3,'Address','2025-09-19 12:07:36','2025-09-19 12:07:36'),(4,'Contact','2025-09-19 12:07:52','2025-09-19 12:07:52'),(5,'Email','2025-09-19 14:38:40','2025-09-19 14:38:40');
/*!40000 ALTER TABLE `field` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `header`
--

DROP TABLE IF EXISTS `header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `header` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` text NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `header`
--

LOCK TABLES `header` WRITE;
/*!40000 ALTER TABLE `header` DISABLE KEYS */;
/*!40000 ALTER TABLE `header` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `image`
--

DROP TABLE IF EXISTS `image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `image` (
  `id` int NOT NULL AUTO_INCREMENT,
  `imageUrl` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `youtubeLink` varchar(255) DEFAULT NULL,
  `youtubeDescription` varchar(255) DEFAULT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `image`
--

LOCK TABLES `image` WRITE;
/*!40000 ALTER TABLE `image` DISABLE KEYS */;
/*!40000 ALTER TABLE `image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` text NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES (1,'Abc','2025-09-17 19:30:33.032881'),(2,'XYZ','2025-09-19 07:59:16.663982'),(3,'PQR','2025-09-19 12:30:15.068877'),(4,'Abhay','2025-09-19 17:42:22.066828');
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `distributor_notification` varchar(255) DEFAULT NULL,
  `customer_notification` varchar(255) DEFAULT NULL,
  `notification_status` varchar(255) NOT NULL DEFAULT 'Active',
  `notification_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`notification_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,'','','Active','2025-09-19 17:23:38.570000'),(2,'This is Distributer','This is Customer','Active','2025-09-19 17:25:50.010000');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `price`
--

DROP TABLE IF EXISTS `price`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `price` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `subcategory_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `price`
--

LOCK TABLES `price` WRITE;
/*!40000 ALTER TABLE `price` DISABLE KEYS */;
INSERT INTO `price` VALUES (1,36,7,1000.00,'2025-09-20 17:56:57.280978'),(2,36,7,1000.00,'2025-09-20 17:56:57.344785');
/*!40000 ALTER TABLE `price` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `privacy_policy`
--

DROP TABLE IF EXISTS `privacy_policy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `privacy_policy` (
  `id` int NOT NULL AUTO_INCREMENT,
  `policyFileUrl` varchar(255) DEFAULT NULL,
  `policyType` enum('Terms and Conditions','Privacy Policy','Return Policy') NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `privacy_policy`
--

LOCK TABLES `privacy_policy` WRITE;
/*!40000 ALTER TABLE `privacy_policy` DISABLE KEYS */;
/*!40000 ALTER TABLE `privacy_policy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_token`
--

DROP TABLE IF EXISTS `refresh_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_token` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expiresAt` timestamp NULL DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_8e913e288156c133999341156ad` (`userId`),
  CONSTRAINT `FK_8e913e288156c133999341156ad` FOREIGN KEY (`userId`) REFERENCES `auth_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_token`
--

LOCK TABLES `refresh_token` WRITE;
/*!40000 ALTER TABLE `refresh_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `refresh_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `request_errors`
--

DROP TABLE IF EXISTS `request_errors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `request_errors` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `request_description` varchar(500) NOT NULL,
  `error_document` varchar(255) DEFAULT NULL,
  `document_id` int NOT NULL,
  `category_id` int NOT NULL,
  `subcategory_id` int NOT NULL,
  `user_id` int NOT NULL,
  `distributor_id` varchar(255) DEFAULT NULL,
  `request_status` varchar(50) NOT NULL DEFAULT 'Pending',
  `application_id` varchar(50) NOT NULL,
  `request_name` varchar(100) NOT NULL,
  `request_email` varchar(100) NOT NULL,
  `error_type` varchar(20) DEFAULT NULL,
  `request_date` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`request_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `request_errors`
--

LOCK TABLES `request_errors` WRITE;
/*!40000 ALTER TABLE `request_errors` DISABLE KEYS */;
/*!40000 ALTER TABLE `request_errors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `requireddocuments`
--

DROP TABLE IF EXISTS `requireddocuments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `requireddocuments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `document_names` text NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `file_url` varchar(255) DEFAULT NULL,
  `categoryCategoryId` int DEFAULT NULL,
  `subcategorySubcategoryId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_e580e3883733c142cd70aa40a9c` (`categoryCategoryId`),
  KEY `FK_c870a2ae82e2663e4dfc7cfc4f1` (`subcategorySubcategoryId`),
  CONSTRAINT `FK_c870a2ae82e2663e4dfc7cfc4f1` FOREIGN KEY (`subcategorySubcategoryId`) REFERENCES `subcategories` (`subcategory_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_e580e3883733c142cd70aa40a9c` FOREIGN KEY (`categoryCategoryId`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requireddocuments`
--

LOCK TABLES `requireddocuments` WRITE;
/*!40000 ALTER TABLE `requireddocuments` DISABLE KEYS */;
INSERT INTO `requireddocuments` VALUES (1,'Bank account','2025-09-20 17:53:09.039695',NULL,36,7),(2,'Bank account','2025-09-20 17:53:31.867089',NULL,36,7),(3,'Bank account','2025-09-20 17:55:27.767200',NULL,36,7),(5,'name','2025-09-20 19:01:49.267006',NULL,26,1),(6,'name','2025-09-20 19:02:11.649858',NULL,26,1),(7,'Passport Photo','2025-09-29 10:22:18.313328',NULL,26,9),(8,'Passport Photo','2025-09-29 10:22:23.455879',NULL,26,9),(9,'Passport Photo','2025-09-29 10:22:32.912535',NULL,26,9),(10,'Passport Photo','2025-09-29 10:23:51.087148',NULL,26,9),(11,'Passport Photo','2025-09-29 10:23:53.427874',NULL,26,9),(12,'Birth Certificate ','2025-10-01 09:55:06.416063',NULL,37,10);
/*!40000 ALTER TABLE `requireddocuments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subcategories`
--

DROP TABLE IF EXISTS `subcategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subcategories` (
  `subcategory_id` int NOT NULL AUTO_INCREMENT,
  `subcategory_name` varchar(255) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `category_id` int NOT NULL,
  PRIMARY KEY (`subcategory_id`),
  KEY `FK_f7b015bc580ae5179ba5a4f42ec` (`category_id`),
  CONSTRAINT `FK_f7b015bc580ae5179ba5a4f42ec` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategories`
--

LOCK TABLES `subcategories` WRITE;
/*!40000 ALTER TABLE `subcategories` DISABLE KEYS */;
INSERT INTO `subcategories` VALUES (1,'Abc','2025-09-20 08:19:24.330596',26),(2,'ChildLabel','2025-09-20 08:48:43.693458',31),(3,'Aadhaar Card','2025-09-20 08:52:21.946056',34),(4,'Pan Card','2025-09-20 08:52:58.807100',34),(5,'Blood Records','2025-09-20 08:54:10.239448',35),(6,'Government ','2025-09-20 08:58:36.834196',30),(7,'11 class schollarship','2025-09-20 17:44:51.739271',36),(8,'2 wheel licence','2025-09-20 18:02:37.377175',29),(9,'Adhar2','2025-09-29 10:21:04.805916',26),(10,'Cast Certificate ','2025-10-01 09:53:44.458441',37);
/*!40000 ALTER TABLE `subcategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `shop_address` varchar(500) DEFAULT NULL,
  `role` enum('Admin','Distributor','Customer','Employee') NOT NULL DEFAULT 'Customer',
  `user_login_status` enum('Active','Inactive') NOT NULL DEFAULT 'Inactive',
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `district` varchar(255) DEFAULT NULL,
  `taluka` varchar(255) DEFAULT NULL,
  `user_documents` text,
  `edit_request_status` enum('Pending','Approved','Rejected') DEFAULT NULL,
  `resetToken` varchar(255) DEFAULT NULL,
  `resetTokenExpiration` timestamp NULL DEFAULT NULL,
  `profile_picture` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Abhishek','Abhishek@gmail.com','Abhishek@123','+911234567890',NULL,NULL,'Admin','Active','2025-09-15 01:11:11.000000',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,'Testcase ','testcase@gmail.com','ABhi@9834382044','8432551414','Karve Nagar',NULL,'Customer','Inactive','2025-09-14 19:57:31.731907','Pune','Haveli','[{\"document_type\":\"Aadhar Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/e00cb7c0-a1b9-448d-a05c-e1ae152a52d9.png\"},{\"document_type\":\"PAN Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/4f455ffb-2156-41ae-8199-98b931d6c465.png\"}]',NULL,NULL,NULL,'/uploads/09a939a7-f6a1-42bc-8647-38d50b7337db.png'),(3,'Test3','test3@gmail.com','test@123',NULL,NULL,NULL,'Distributor','Inactive','2025-09-14 21:09:00.324925',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,'Abc','abc@gmail.com','Dalal691*','1234567890','ss',NULL,'Employee','Inactive','2025-09-17 18:28:29.379655','Nashi','NAhk','[{\"document_type\":\"Aadhar Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/6b8d1786-8c92-47cb-9fd3-a1c1d4da0025.png\"},{\"document_type\":\"PAN Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/9916e1f3-db78-46ae-94a8-251cdf01f904.png\"}]',NULL,NULL,NULL,'/uploads/d7c39718-60e3-4e98-b817-1449d976c514.png'),(5,'Aniket Dalal','aniketdalal126@gmail.com','Dalal691*','7350531889','dhiren app shanti park',NULL,'Customer','Active','2025-09-17 18:29:57.544515','Nashik','Nashik','[{\"document_type\":\"Aadhar Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/cd658c20-c0c3-4d4a-8f9c-8e9ac5bdbbe4.png\"},{\"document_type\":\"PAN Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/9f50b84c-c961-4e1a-8cf9-460fecc7aa07.png\"}]',NULL,'mfodlc12nfsvfbzlf2h','2025-09-17 20:29:24','/uploads/88680ade-b8d0-417f-8687-1ea5dec6edb8.png'),(7,'Mahesh','mahesh@gmail.com','Mahesh@123','7263865545','Pune',NULL,'Employee','Active','2025-09-19 07:48:46.316347',NULL,NULL,NULL,'Approved',NULL,NULL,'/uploads/62fd4e34-8c0f-43f0-bcee-29c7a77dc7e6.png'),(8,'Mehesh Customer ','maheshcustomer@gmail.com','Mahesh@123','7263865545','Shri krishna mitra mandal',NULL,'Customer','Active','2025-09-19 12:13:18.586510','Pune','Karve','[{\"document_type\":\"Aadhar Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/90f732fc-060a-4193-9364-0a9e251f51b1.png\"},{\"document_type\":\"PAN Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/849d66b0-93c5-45ac-a717-8ee123fec358.png\"}]','Approved',NULL,NULL,'/uploads/11a5efb0-e7b8-40a1-ab30-79c7835014eb.png'),(9,'Abhay Customer ','abhaycustomer@gmail.com','Abhay@123','9657124518','Karve Nagar',NULL,'Customer','Active','2025-09-19 13:40:59.046407','Pune','Haveli','[{\"document_type\":\"Aadhar Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/ecce0c18-d35d-4791-9986-521e91d83fbd.png\"},{\"document_type\":\"PAN Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/fc5981e7-eae5-48fc-99af-ed01ce951b47.png\"}]','Approved',NULL,NULL,'/uploads/74468766-9f55-440a-805b-900c0600aa6b.png'),(10,'Dhiraj','dhiraj@gmail.com','Dhiraj@123','9075830252','KArve','abc','Distributor','Active','2025-09-19 16:29:48.955883',NULL,NULL,'[{\"document_type\":\"Aadhar Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/f4b08d58-9d8d-4176-9bdf-aa50c4d4e531.png\"},{\"document_type\":\"PAN Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/4cdd01ef-1c74-4c4e-8f73-d493d018e2e0.png\"}]','Approved',NULL,NULL,'/uploads/d9f3d44a-3355-4b03-8703-a4f68f793758.png'),(11,'ABhishek','d1@gmail.com','Distributor@123','1234567890','b5 ','','Distributor','Inactive','2025-09-19 16:30:53.240690',NULL,NULL,'[{\"document_type\":\"Aadhar Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/099349ba-5a74-47de-8879-b7d7d48933cf.png\"},{\"document_type\":\"PAN Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/252e4f05-ea96-4789-8c36-04c779eb265d.png\"}]',NULL,NULL,NULL,'/uploads/9f3045b0-ccf4-4c34-a95b-965d38bb9618.png'),(12,'Ram','ram@gmail.com','Ramnagar@123','9876543210','Ram Nagar',NULL,'Employee','Active','2025-09-19 17:21:44.936955',NULL,NULL,NULL,'Approved',NULL,NULL,NULL),(13,'Ramesh','ramesh@gmail.com','Ramesh@123','9876561245','Shyam nagar',NULL,'Employee','Active','2025-09-19 17:51:24.530720',NULL,NULL,NULL,'Approved',NULL,NULL,'/uploads/05309dac-00c9-421d-8ea9-7698dfd2e049.png'),(14,'Virat Kohli','virat123@gmail.com','Virat@123','9657124518','Kothrud',NULL,'Customer','Active','2025-09-19 18:09:19.172947','pune','shivaji Nagar','[{\"document_type\":\"Aadhar Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/5c81ef22-56bb-48d8-ad86-aa692ee2421e.png\"},{\"document_type\":\"PAN Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/7059a43e-851c-442c-a97f-3b2bbd739664.png\"}]','Approved',NULL,NULL,'/uploads/14aac167-e938-4d81-a2e1-1230640f6a6d.png'),(15,'James Bond','jamesbond@gmai.com','Dalal691*','1234567890','White house ',NULL,'Customer','Active','2025-09-20 16:18:45.265723','Parbhani','Germany','[{\"document_type\":\"Aadhar Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/bdb0839d-8422-4d6e-86d2-72100defcc39.png\"},{\"document_type\":\"PAN Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/73d2b630-7152-4b78-a6e7-cf28b9972166.png\"}]','Approved',NULL,NULL,'/uploads/a716f544-72fd-4863-90c7-05923c225be3.png'),(16,'Dilip Dalal','dilipdalal153@gmail.com','Dalal691*','1234567890','B 5 block no 4 dhiren apt shanti park upnagar ',NULL,'Customer','Inactive','2025-09-21 11:54:07.549811','Nashik','Nashik','[{\"document_type\":\"Aadhar Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/53c40552-fa33-43e0-b176-6b4178ad380f.png\"},{\"document_type\":\"PAN Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/0ed9f4ba-3c26-435a-9307-b1232198a564.png\"}]',NULL,NULL,NULL,NULL),(17,'Randheer Vasai  ','rihir71703@dotxan.com','Dalal691*','1234567890','B 5 block no4 dhiren apt Shanti Park',NULL,'Customer','Inactive','2025-09-21 13:19:19.747969','Nashik','Nashik','[{\"document_type\":\"Aadhar Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/8196be86-cb6c-43a1-96f4-af2e13d2bb35.png\"},{\"document_type\":\"PAN Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/e734382b-23d5-4e04-8b7f-ce7161b25e9e.png\"}]',NULL,NULL,NULL,NULL),(18,'Tony Stack','tony@gmail.com','Tony@123','9420936455','Baramati',NULL,'Customer','Inactive','2025-09-25 16:30:12.113402','pune','Baramati','[{\"document_type\":\"Aadhar Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/720735fc-e3c4-4286-b1b3-a6a8c0135f43.png\"},{\"document_type\":\"PAN Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/10579855-bece-44ef-9313-357b38b6cb84.png\"}]',NULL,NULL,NULL,'/uploads/7cd608ce-129d-4687-b613-feeedb9ff837.png'),(20,'Tony','tony123@gmail.com','Tony@123','9657124518','Pune',NULL,'Customer','Inactive','2025-09-26 08:34:22.638323','Ram nagar','kothrud','[{\"document_type\":\"Aadhar Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/9d843113-c51b-4de3-968d-d80e22f7af8d.png\"},{\"document_type\":\"PAN Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/1a8bfb99-4ae2-4365-b65a-daf9e465761a.png\"}]',NULL,NULL,NULL,'/uploads/d89a8c1b-cbbc-4799-b1ec-5fea7ed70575.png'),(22,'Ram','ram1234@gmail.com','Ram@1234','9657124518','At post Dongaon',NULL,'Customer','Inactive','2025-09-26 08:42:31.542330','buldhana','shivaji Nagar','[{\"document_type\":\"Aadhar Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/756b32c2-c52c-4e53-8309-53c678916b12.png\"},{\"document_type\":\"PAN Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/0e338b23-7365-4325-befd-2769388fc13a.png\"}]',NULL,NULL,NULL,'/uploads/e736e94d-a466-4018-97a7-3580c14dfd06.png'),(23,'Nitesh','nitesh@gmail.com','Nitesh@123','1234567890','Nagpur',NULL,'Customer','Inactive','2025-10-01 10:24:28.932421','Nagpur','Nagpur','[{\"document_type\":\"Aadhar Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/50eb5977-b9a7-4812-b416-891e8a138542.png\"},{\"document_type\":\"PAN Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/2879046c-c598-413e-add0-96903c345f6f.png\"}]',NULL,NULL,NULL,NULL),(24,'Shyam Sundar','Shyamsundar@gmail.com','Shyamsundar@123','9657124518','Baramati',NULL,'Customer','Inactive','2025-10-01 12:27:14.239986','Pune','Pune','[{\"document_type\":\"Aadhar Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/55b8400b-47d6-4355-a348-439249c1992c.png\"},{\"document_type\":\"PAN Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/4c7f6fee-f527-4f6b-a6ab-1d02be2d13c8.png\"}]','Approved',NULL,NULL,'/uploads/ecafcc53-f0e1-4ac5-890f-97f20818e920.png'),(25,'Aniket Test','hoyalom540@rograc.com','Hoyalom540@123','1234567890','fdx jhbjhb khbkj ',NULL,'Customer','Inactive','2025-10-01 15:46:29.164577','Nashik','Nashik','[{\"document_type\":\"Aadhar Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/79297d20-eac9-4d95-b3ec-7cd3041cdac1.png\"},{\"document_type\":\"PAN Card\",\"mimetype\":\"image/png\",\"file_path\":\"/uploads/6d70d15e-9821-490f-bd09-e6e4f4f62b7a.png\"}]',NULL,NULL,NULL,'/uploads/d6146fb0-d66d-4d62-b0f6-c2e91f585c0c.png');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallet`
--

DROP TABLE IF EXISTS `wallet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallet` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `balance` decimal(12,2) NOT NULL DEFAULT '0.00',
  `totalBalance` decimal(12,2) NOT NULL DEFAULT '0.00',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallet`
--

LOCK TABLES `wallet` WRITE;
/*!40000 ALTER TABLE `wallet` DISABLE KEYS */;
/*!40000 ALTER TABLE `wallet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallet_topup_request`
--

DROP TABLE IF EXISTS `wallet_topup_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallet_topup_request` (
  `id` int NOT NULL AUTO_INCREMENT,
  `merchant_order_id` varchar(255) NOT NULL,
  `user_id` int NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_cc8802b9e61c6d203fb84a8286` (`merchant_order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallet_topup_request`
--

LOCK TABLES `wallet_topup_request` WRITE;
/*!40000 ALTER TABLE `wallet_topup_request` DISABLE KEYS */;
/*!40000 ALTER TABLE `wallet_topup_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallet_transaction`
--

DROP TABLE IF EXISTS `wallet_transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallet_transaction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `merchant_order_id` varchar(255) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `type` enum('CREDIT','DEBIT') NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `status` varchar(32) NOT NULL,
  `payment_details` json DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `wallet_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_8d24740ecf28b42b41dea47086` (`transaction_id`),
  KEY `FK_3694dd13a5c66114b4474c86904` (`wallet_id`),
  CONSTRAINT `FK_3694dd13a5c66114b4474c86904` FOREIGN KEY (`wallet_id`) REFERENCES `wallet` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallet_transaction`
--

LOCK TABLES `wallet_transaction` WRITE;
/*!40000 ALTER TABLE `wallet_transaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `wallet_transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'railway'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-01 23:22:18
