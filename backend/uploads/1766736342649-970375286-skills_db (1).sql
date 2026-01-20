-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Dec 26, 2025 at 07:26 AM
-- Server version: 8.0.43
-- PHP Version: 8.2.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `skills_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `id` bigint UNSIGNED NOT NULL,
  `period_id` bigint UNSIGNED NOT NULL,
  `evaluator_id` bigint UNSIGNED NOT NULL,
  `evaluatee_id` bigint UNSIGNED NOT NULL,
  `dept_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `assignments`
--

INSERT INTO `assignments` (`id`, `period_id`, `evaluator_id`, `evaluatee_id`, `dept_id`, `created_at`) VALUES
(6, 1, 2, 5, 2, '2025-12-25 16:47:13'),
(8, 1, 3, 4, 1, '2025-12-25 17:14:15');

-- --------------------------------------------------------

--
-- Table structure for table `attachments`
--

CREATE TABLE `attachments` (
  `id` bigint UNSIGNED NOT NULL,
  `period_id` bigint UNSIGNED NOT NULL,
  `evaluatee_id` bigint UNSIGNED NOT NULL,
  `indicator_id` bigint UNSIGNED NOT NULL,
  `evidence_type_id` int NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mime_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size_bytes` int UNSIGNED NOT NULL,
  `storage_path` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attachments`
--

INSERT INTO `attachments` (`id`, `period_id`, `evaluatee_id`, `indicator_id`, `evidence_type_id`, `file_name`, `mime_type`, `size_bytes`, `storage_path`, `created_at`) VALUES
(26, 1, 33, 1, 1, 'Screenshot 2025-12-25 204219.png', 'image/png', 396732, 'D:\\devops\\backend\\uploads\\1766725189436-567953472-Screenshot 2025-12-25 204219.png', '2025-12-26 04:59:49');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int NOT NULL,
  `code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_th` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` int NOT NULL,
  `org_group_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `code`, `name_th`, `category_id`, `org_group_id`) VALUES
(1, 'IT', 'แผนกวิชาเทคโนโลยีสารสนเทศ', 8, 1),
(2, 'ME', 'แผนกวิชาเครื่องกล', 1, 1),
(3, 'EL', 'แผนกวิชาอิเล็กทรอนิกส์', 1, 1),
(4, 'ACC', 'แผนกวิชาการบัญชี', 2, 1),
(5, 'MKT', 'แผนกวิชาการตลาด', 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `dept_fields`
--

CREATE TABLE `dept_fields` (
  `dept_id` int NOT NULL,
  `field_code` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `dept_fields`
--

INSERT INTO `dept_fields` (`dept_id`, `field_code`) VALUES
(2, '20101'),
(3, '20105'),
(4, '20201'),
(5, '20202'),
(1, '21901'),
(1, '21903');

-- --------------------------------------------------------

--
-- Table structure for table `evaluation_periods`
--

CREATE TABLE `evaluation_periods` (
  `id` bigint UNSIGNED NOT NULL,
  `code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_th` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `buddhist_year` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `evaluation_periods`
--

INSERT INTO `evaluation_periods` (`id`, `code`, `name_th`, `buddhist_year`, `start_date`, `end_date`, `is_active`, `created_at`) VALUES
(1, 'Y2568', 'การประเมินครูประจำปี 2568', 2568, '2025-10-01', '2026-09-30', 1, '2025-12-25 15:02:53');

-- --------------------------------------------------------

--
-- Table structure for table `evaluation_results`
--

CREATE TABLE `evaluation_results` (
  `id` bigint UNSIGNED NOT NULL,
  `period_id` bigint UNSIGNED NOT NULL,
  `evaluatee_id` bigint UNSIGNED NOT NULL,
  `evaluator_id` bigint UNSIGNED NOT NULL,
  `topic_id` bigint UNSIGNED NOT NULL,
  `indicator_id` bigint UNSIGNED NOT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `value_yes_no` tinyint(1) DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` enum('draft','submitted') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `evaluation_results`
--

INSERT INTO `evaluation_results` (`id`, `period_id`, `evaluatee_id`, `evaluator_id`, `topic_id`, `indicator_id`, `score`, `value_yes_no`, `notes`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 4, 3, 1, 2, 3.00, NULL, 'สื่อการสอนครบถ้วน เหมาะกับผู้เรียน', 'draft', '2025-10-16 09:45:39', '2025-10-16 09:45:39');

-- --------------------------------------------------------

--
-- Table structure for table `evaluation_topics`
--

CREATE TABLE `evaluation_topics` (
  `id` bigint UNSIGNED NOT NULL,
  `code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title_th` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `weight` decimal(5,2) NOT NULL DEFAULT '0.00',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `evaluation_topics`
--

INSERT INTO `evaluation_topics` (`id`, `code`, `title_th`, `description`, `weight`, `active`, `created_at`) VALUES
(1, 'TOP1', 'การจัดการเรียนการสอน', 'คุณภาพการวางแผนการสอน สื่อการสอน การวัดผล และผลสัมฤทธิ์ของผู้เรียน', 0.30, 1, '2025-10-16 10:13:44'),
(2, 'TOP2', 'การบริหารจัดการชั้นเรียน', 'การจัดบรรยากาศ กฎระเบียบ การดูแล/ให้คำปรึกษา และกิจกรรมส่งเสริม', 0.20, 1, '2025-10-16 10:13:44'),
(3, 'TOP3', 'การพัฒนาตนเองและพัฒนาวิชาชีพ', 'การอบรม/สัมมนา งานวิจัย แผนพัฒนาตนเอง และการประเมินตนเอง', 0.30, 1, '2025-10-16 10:13:44'),
(4, 'TOP4', 'ด้านอื่นๆ (PA/ผลงาน/จรรยาบรรณ)', 'ผลงานตามหน้าที่ จรรยาบรรณ และแบบประเมิน PA', 0.20, 1, '2025-10-16 10:13:44');

-- --------------------------------------------------------

--
-- Table structure for table `evidence_types`
--

CREATE TABLE `evidence_types` (
  `id` int NOT NULL,
  `code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_th` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `evidence_types`
--

INSERT INTO `evidence_types` (`id`, `code`, `name_th`, `description`) VALUES
(1, 'E-PLAN', 'แผนการจัดการเรียนรู้', 'แผนการสอนตามมาตรฐาน/ตัวชี้วัด'),
(2, 'E-MEDIA', 'สื่อการเรียนรู้', 'ใบงาน/แบบฝึก/มัลติมีเดีย'),
(3, 'E-ASSESS', 'หลักฐานการวัดและประเมินผล', 'ข้อสอบ/รูบริก/บันทึกคะแนน'),
(4, 'E-REFLECT', 'บันทึกหลังการสอน', 'สรุปผล-ข้อเสนอแนะ-ปรับปรุง'),
(5, 'E-STUWORK', 'ผลงานนักเรียน', 'ชิ้นงาน/แฟ้มสะสมผลงาน'),
(6, 'E-CHART', 'แผนภูมิ/กฎ/ตารางเวร', 'เอกสารการจัดชั้นเรียน'),
(7, 'E-HOMEVISIT', 'บันทึกการเยี่ยมบ้าน', 'หลักฐานการเยี่ยมบ้าน/ประสานผู้ปกครอง'),
(8, 'E-COUNSEL', 'บันทึกการให้คำปรึกษา', 'แบบบันทึก/รายงานกรณี'),
(9, 'E-ACT', 'โครงการ/กิจกรรม', 'เอกสาร/ภาพกิจกรรม/รายงานผล'),
(10, 'E-CERT', 'เกียรติบัตร/วุฒิบัตร', 'เอกสารการอบรม/สัมมนา'),
(11, 'E-RESEARCH', 'งานวิจัย/บทความ', 'เอกสารวิชาการ/นำเสนอผลงาน'),
(12, 'E-IDP', 'แผนพัฒนาตนเอง', 'เอกสารเป้าหมาย/แผนพัฒนา'),
(13, 'E-SELFASSESS', 'ผลการประเมินตนเอง', 'แบบฟอร์มประเมินตนเอง'),
(14, 'E-PA', 'แบบประเมิน PA', 'เอกสารข้อตกลงฯ'),
(15, 'E-WORK', 'ผลงานตามหน้าที่', 'หลักฐานผลงาน/รายงาน'),
(16, 'E-ETHICS', 'จรรยาบรรณวิชาชีพ', 'หลักฐานการปฏิบัติตามจรรยาบรรณ');

-- --------------------------------------------------------

--
-- Table structure for table `indicators`
--

CREATE TABLE `indicators` (
  `id` bigint UNSIGNED NOT NULL,
  `topic_id` bigint UNSIGNED NOT NULL,
  `code` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_th` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `type` enum('score_1_4','yes_no','file_url') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'score_1_4',
  `weight` decimal(5,2) NOT NULL DEFAULT '1.00',
  `min_score` tinyint NOT NULL DEFAULT '1',
  `max_score` tinyint NOT NULL DEFAULT '4',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `indicators`
--

INSERT INTO `indicators` (`id`, `topic_id`, `code`, `name_th`, `description`, `type`, `weight`, `min_score`, `max_score`, `active`, `created_at`) VALUES
(1, 1, 'T1-PLAN', 'แผนการจัดการเรียนรู้', 'แผนการสอนสอดคล้องมาตรฐานและตัวชี้วัด', 'score_1_4', 1.00, 1, 4, 1, '2025-10-16 10:13:44'),
(2, 1, 'T1-MEDIA', 'สื่อการเรียนรู้', 'ใบงาน/แบบฝึก/มัลติมีเดียเหมาะสมกับผู้เรียน', 'score_1_4', 1.00, 1, 4, 1, '2025-10-16 10:13:44'),
(3, 1, 'T1-ASSESS', 'หลักฐานการวัดและประเมินผล', 'ข้อสอบ/รูบริก/ชิ้นงาน/บันทึกคะแนน', 'score_1_4', 1.00, 1, 4, 1, '2025-10-16 10:13:44'),
(4, 1, 'T1-REFLECT', 'บันทึกหลังการสอน', 'สะท้อนผลและการปรับปรุงแผนการสอน', 'yes_no', 1.00, 1, 4, 1, '2025-10-16 10:13:44'),
(5, 1, 'T1-STUWORK', 'ผลงานนักเรียน', 'ชิ้นงานแสดงความรู้/ทักษะ/คุณลักษณะ', 'score_1_4', 1.00, 1, 4, 1, '2025-10-16 10:13:44'),
(6, 2, 'T2-CHART', 'แผนภูมิ/ตาราง', 'แผนผังที่นั่ง กฎห้องเรียน ตารางเวร', 'yes_no', 1.00, 1, 4, 1, '2025-10-16 10:13:44'),
(7, 2, 'T2-HOMEVISIT', 'บันทึกการเยี่ยมบ้าน', 'ร่วมมือผู้ปกครอง/ประสานเครือข่าย', 'yes_no', 1.00, 1, 4, 1, '2025-10-16 10:13:44'),
(8, 2, 'T2-COUNSEL', 'บันทึกการให้คำปรึกษา', 'ช่วยเหลือนักเรียนเป็นรายบุคคล/กลุ่ม', 'yes_no', 1.00, 1, 4, 1, '2025-10-16 10:13:44'),
(9, 2, 'T2-ACT', 'โครงการ/กิจกรรม', 'กิจกรรมส่งเสริมการเรียนรู้และคุณลักษณะ', 'score_1_4', 1.00, 1, 4, 1, '2025-10-16 10:13:44'),
(10, 3, 'T3-CERT', 'เกียรติบัตร/วุฒิบัตร', 'การอบรม/สัมมนา/ศึกษาดูงาน', 'yes_no', 1.00, 1, 4, 1, '2025-10-16 10:13:44'),
(11, 3, 'T3-RESEARCH', 'เอกสาร/งานวิจัย', 'วิจัยในชั้นเรียน/ตีพิมพ์/นำเสนอวิชาการ', 'score_1_4', 1.00, 1, 4, 1, '2025-10-16 10:13:44'),
(12, 3, 'T3-IDP', 'แผนพัฒนาตนเอง', 'เป้าหมาย/แนวทางพัฒนาตามสายงาน', 'yes_no', 1.00, 1, 4, 1, '2025-10-16 10:13:44'),
(13, 3, 'T3-SELFASSESS', 'ผลการประเมินตนเอง', 'แบบประเมินตนเองตามแบบของสถานศึกษา', 'yes_no', 1.00, 1, 4, 1, '2025-10-16 10:13:44'),
(14, 3, 'T3-SCHOOLPART', 'มีส่วนร่วมกิจกรรมโรงเรียน', 'เข้าร่วมประชุม/กิจกรรมวันสำคัญ/โครงการ', 'score_1_4', 1.00, 1, 4, 1, '2025-10-16 10:13:44'),
(15, 4, 'T4-PA', 'แบบประเมิน PA', 'แบบข้อตกลงในการพัฒนางาน (PA)', 'yes_no', 1.00, 1, 4, 1, '2025-10-16 10:13:44'),
(16, 4, 'T4-WORK', 'ผลงานที่เกิดจากหน้าที่', 'ผลงานตามภาระงานที่ได้รับมอบหมาย', 'score_1_4', 1.00, 1, 4, 1, '2025-10-16 10:13:44'),
(17, 4, 'T4-ETHICS', 'จรรยาบรรณวิชาชีพ', 'หลักฐานการปฏิบัติตามจรรยาบรรณครู', 'yes_no', 1.00, 1, 4, 1, '2025-10-16 10:13:44');

-- --------------------------------------------------------

--
-- Table structure for table `indicator_evidence`
--

CREATE TABLE `indicator_evidence` (
  `indicator_id` bigint UNSIGNED NOT NULL,
  `evidence_type_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `indicator_evidence`
--

INSERT INTO `indicator_evidence` (`indicator_id`, `evidence_type_id`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(14, 9),
(10, 10),
(11, 11),
(12, 12),
(13, 13),
(15, 14),
(16, 15),
(17, 16);

-- --------------------------------------------------------

--
-- Table structure for table `org_groups`
--

CREATE TABLE `org_groups` (
  `id` int NOT NULL,
  `code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_th` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `org_groups`
--

INSERT INTO `org_groups` (`id`, `code`, `name_th`) VALUES
(1, 'ACD', 'ฝ่ายวิชาการ'),
(2, 'STD', 'ฝ่ายพัฒนากิจการนักเรียนนักศึกษา'),
(3, 'FIN', 'ฝ่ายบริหารทรัพยากร'),
(4, 'PLA', 'ฝ่ายแผนงานและความร่วมมือ');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_th` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','evaluator','evaluatee') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('active','disabled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `department_id` int DEFAULT NULL,
  `org_group_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `name_th`, `role`, `status`, `department_id`, `org_group_id`, `created_at`, `updated_at`) VALUES
(1, 'admin@ccollege.ac.th', '$2b$10$f6g9QMzpdIjzUyckEbFLIeuSRKEGJdNSu.TZ3tmegQ5ioSop02og6', 'ผู้ดูแลระบบ', 'admin', 'active', 1, 1, '2025-10-16 10:13:44', '2025-10-16 10:13:44'),
(2, 'eva.me@ccollege.ac.th', '$2b$10$ycxCewoT/qjuiZiDb7hfP.aGEnWZu8rMF3UzRO6QgxgIO7lKLsRSm', 'กรรมการประเมินเครื่องกล', 'evaluator', 'active', 2, 1, '2025-10-16 10:13:44', '2025-10-16 10:13:44'),
(3, 'eva.it@ccollege.ac.th', '$2b$10$rCg8BVUQSVs51Hb/fwctneQcBfIE0RL5dVRm1bcX5CPyGKyRAxFoe', 'กรรมการประเมินไอที', 'evaluator', 'active', 1, 1, '2025-10-16 10:13:44', '2025-10-16 10:13:44'),
(4, 't.it01@ccollege.ac.th', '$2b$10$V0GTPQ/2Ap5r0nzE49FjfOW7xmXuSPQ8m7P81jwKrFFltwCvBXTsy', 'ครูไอที 01', 'evaluatee', 'active', 1, 1, '2025-10-16 10:13:44', '2025-10-16 10:13:44'),
(5, 't.me01@ccollege.ac.th', '$2b$10$gkmAZQmS5GjA3cgHAzZgN.HZzaH4gKeuTkeJnNoAEFT2OyczRibuC', 'ครูเครื่องกล 01', 'evaluatee', 'active', 2, 1, '2025-10-16 10:13:44', '2025-10-16 10:13:44'),
(6, 't.acc01@ccollege.ac.th', '$2b$10$5FALWHRfgaBZC0Az5BAVdeelVK4LgRGyKOmSC0hNI3yU6.PRbCxnW', 'ครูบัญชี 01', 'evaluatee', 'active', 4, 1, '2025-10-16 10:13:44', '2025-10-16 10:13:44'),
(20, 'exppsspp111@gmail.com', '$2b$10$PCMQJr2S18oM/1jIgyv9U.lP9HaHoomK5W1SiEckoZc6Pnv9WtJsy', 'นายสุภนันท์', 'admin', 'disabled', 4, 2, '2025-10-27 08:58:23', '2025-11-25 03:20:42'),
(33, 'exppsspp@gmail.com', '$2b$10$wYywmMCID7mObkvA2PJTmeJ66P0dBuveHEVtMThrma4egInM53RFi', 'XD', 'evaluatee', 'active', 1, 2, '2025-12-02 04:57:15', '2025-12-02 04:57:15'),
(35, 'exppsspp122@gmail.com', '$2b$10$szhBwks.Uqd08XgOzq28MeID7z8VsIbl8P95.YJJvz6bIVqnYtHGq', 'XD', 'evaluatee', 'active', 5, 4, '2025-12-02 05:45:56', '2025-12-02 05:45:56'),
(40, 'exppsspp3@gmail.com', '$2b$10$/YgLLYMmzcglsNdk7T5P6Odde39D8eEmfrm/.7WR5hUrHvS5a3oGa', 'น่าน่า', 'evaluatee', 'active', 4, 3, '2025-12-25 14:25:09', '2025-12-25 14:25:09'),
(41, 'exppsspp44@gmail.com', '$2b$10$khmeoODRxrGbLkcq421QaO2xlaKPxP.mfqlddcZI6V9GJbKtivom.', '22222', 'evaluatee', 'active', 1, 1, '2025-12-25 18:00:27', '2025-12-25 18:00:27');

-- --------------------------------------------------------

--
-- Table structure for table `vocational_categories`
--

CREATE TABLE `vocational_categories` (
  `id` int NOT NULL,
  `code` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_th` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vocational_categories`
--

INSERT INTO `vocational_categories` (`id`, `code`, `name_th`, `created_at`) VALUES
(1, 'CAT01', 'อุตสาหกรรม', '2025-10-16 10:13:44'),
(2, 'CAT02', 'บริหารธุรกิจ', '2025-10-16 10:13:44'),
(3, 'CAT03', 'ศิลปกรรมและเศรษฐกิจสร้างสรรค์', '2025-10-16 10:13:44'),
(4, 'CAT04', 'คหกรรม', '2025-10-16 10:13:44'),
(5, 'CAT05', 'เกษตรกรรมและประมง', '2025-10-16 10:13:44'),
(6, 'CAT06', 'อุตสาหกรรมท่องเที่ยว', '2025-10-16 10:13:44'),
(7, 'CAT07', 'อุตสาหกรรมแฟชั่นและสิ่งทอ', '2025-10-16 10:13:44'),
(8, 'CAT08', 'อุตสาหกรรมดิจิทัลและเทคโนโลยีสารสนเทศ', '2025-10-16 10:13:44'),
(9, 'CAT09', 'โลจิสติกส์XD', '2025-10-16 10:13:44'),
(14, 'CAT10', 'XD', '2025-11-24 08:16:57'),
(18, 'CAT11', 'TEST11233', '2025-12-04 09:27:38');

-- --------------------------------------------------------

--
-- Table structure for table `vocational_fields`
--

CREATE TABLE `vocational_fields` (
  `code` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_th` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vocational_fields`
--

INSERT INTO `vocational_fields` (`code`, `name_th`, `category_id`) VALUES
('20101', 'ช่างยนต์', 1),
('20102', 'ช่างกลโรงงาน', 1),
('20103', 'ช่างเชื่อมโลหะ', 1),
('20104', 'ช่างไฟฟ้ากำลัง', 1),
('20105', 'อิเล็กทรอนิกส์', 1),
('20127', 'เมคคาทรอนิกส์และหุ่นยนต์', 1),
('20201', 'การบัญชี', 2),
('20202', 'การตลาด', 2),
('20216', 'การจัดการสำนักงานดิจิทัล', 2),
('20406', 'คหกรรมศาสตร์', 4),
('20701', 'การโรงแรม', 6),
('20702', 'การท่องเที่ยว', 6),
('21401', 'โลจิสติกส์', 9),
('21504', 'อาหารและโภชนาการ', 4),
('21602', 'การออกแบบ', 3),
('21606', 'การถ่ายภาพและมัลติมีเดีย', 3),
('21619', 'ออกแบบนิเทศศิลป์', 3),
('21701', 'เกษตรศาสตร์', 5),
('21709', 'นวัตกรรมเกษตร', 5),
('21715', 'ประมง', 5),
('21801', 'เทคโนโลยีสิ่งทอ', 7),
('21802', 'เคมีสิ่งทอ', 7),
('21803', 'เทคโนโลยีเครื่องนุ่งห่ม', 7),
('21804', 'แฟชั่นและสิ่งทอ', 4),
('21901', 'เทคโนโลยีสารสนเทศ', 8),
('21903', 'คอมพิวเตอร์โปรแกรมเมอร์', 8),
('21906', 'เทคโนโลยีปัญญาประดิษฐ์', 8),
('21907', 'เทคโนโลยีโลกเสมือนจริง', 8),
('21910', 'เทคโนโลยีธุรกิจดิจิทัล', 2);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_evidence_progress`
-- (See below for the actual view)
--
CREATE TABLE `v_evidence_progress` (
`evaluatee_name` varchar(255)
,`dept_name` varchar(255)
,`buddhist_year` int
,`topic_title` varchar(255)
,`indicator_code` varchar(40)
,`indicator_name` varchar(255)
,`files_uploaded` bigint
);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_asg` (`period_id`,`evaluator_id`,`evaluatee_id`),
  ADD KEY `fk_asg_dept` (`dept_id`),
  ADD KEY `idx_asg_evalr` (`evaluator_id`,`period_id`),
  ADD KEY `idx_asg_evale` (`evaluatee_id`,`period_id`);

--
-- Indexes for table `attachments`
--
ALTER TABLE `attachments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_att_period` (`period_id`),
  ADD KEY `fk_att_ind` (`indicator_id`),
  ADD KEY `fk_att_evtype` (`evidence_type_id`),
  ADD KEY `idx_attach_evale` (`evaluatee_id`,`period_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `fk_dept_cat` (`category_id`),
  ADD KEY `fk_dept_org` (`org_group_id`);

--
-- Indexes for table `dept_fields`
--
ALTER TABLE `dept_fields`
  ADD PRIMARY KEY (`dept_id`,`field_code`),
  ADD KEY `fk_df_field` (`field_code`);

--
-- Indexes for table `evaluation_periods`
--
ALTER TABLE `evaluation_periods`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `evaluation_results`
--
ALTER TABLE `evaluation_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_res_period` (`period_id`),
  ADD KEY `fk_res_evalr` (`evaluator_id`),
  ADD KEY `fk_res_topic` (`topic_id`),
  ADD KEY `idx_results_evale` (`evaluatee_id`,`period_id`),
  ADD KEY `idx_results_indicator` (`indicator_id`);

--
-- Indexes for table `evaluation_topics`
--
ALTER TABLE `evaluation_topics`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `evidence_types`
--
ALTER TABLE `evidence_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `indicators`
--
ALTER TABLE `indicators`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_ind_topic` (`topic_id`);

--
-- Indexes for table `indicator_evidence`
--
ALTER TABLE `indicator_evidence`
  ADD PRIMARY KEY (`indicator_id`,`evidence_type_id`),
  ADD KEY `fk_ie_ev` (`evidence_type_id`);

--
-- Indexes for table `org_groups`
--
ALTER TABLE `org_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_users_org` (`org_group_id`),
  ADD KEY `idx_users_dept` (`department_id`);

--
-- Indexes for table `vocational_categories`
--
ALTER TABLE `vocational_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `vocational_fields`
--
ALTER TABLE `vocational_fields`
  ADD PRIMARY KEY (`code`),
  ADD KEY `fk_vf_cat` (`category_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `attachments`
--
ALTER TABLE `attachments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `evaluation_periods`
--
ALTER TABLE `evaluation_periods`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `evaluation_results`
--
ALTER TABLE `evaluation_results`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `evaluation_topics`
--
ALTER TABLE `evaluation_topics`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `evidence_types`
--
ALTER TABLE `evidence_types`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `indicators`
--
ALTER TABLE `indicators`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `org_groups`
--
ALTER TABLE `org_groups`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `vocational_categories`
--
ALTER TABLE `vocational_categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

-- --------------------------------------------------------

--
-- Structure for view `v_evidence_progress`
--
DROP TABLE IF EXISTS `v_evidence_progress`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `v_evidence_progress`  AS SELECT `u`.`name_th` AS `evaluatee_name`, `d`.`name_th` AS `dept_name`, `p`.`buddhist_year` AS `buddhist_year`, `t`.`title_th` AS `topic_title`, `i`.`code` AS `indicator_code`, `i`.`name_th` AS `indicator_name`, count(`a`.`id`) AS `files_uploaded` FROM ((((((`users` `u` join `departments` `d` on((`d`.`id` = `u`.`department_id`))) join `assignments` `s` on((`s`.`evaluatee_id` = `u`.`id`))) join `evaluation_periods` `p` on(((`p`.`id` = `s`.`period_id`) and (`p`.`is_active` = 1)))) join `indicators` `i` on((1 = 1))) join `evaluation_topics` `t` on((`t`.`id` = `i`.`topic_id`))) left join `attachments` `a` on(((`a`.`indicator_id` = `i`.`id`) and (`a`.`evaluatee_id` = `u`.`id`) and (`a`.`period_id` = `p`.`id`)))) WHERE (`u`.`role` = 'evaluatee') GROUP BY `u`.`name_th`, `d`.`name_th`, `p`.`buddhist_year`, `t`.`title_th`, `i`.`code`, `i`.`name_th` ORDER BY `u`.`name_th` ASC, `t`.`title_th` ASC, `i`.`code` ASC ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `fk_asg_dept` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_asg_evale` FOREIGN KEY (`evaluatee_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_asg_evalr` FOREIGN KEY (`evaluator_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_asg_period` FOREIGN KEY (`period_id`) REFERENCES `evaluation_periods` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `attachments`
--
ALTER TABLE `attachments`
  ADD CONSTRAINT `fk_att_evale` FOREIGN KEY (`evaluatee_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_att_evtype` FOREIGN KEY (`evidence_type_id`) REFERENCES `evidence_types` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_att_ind` FOREIGN KEY (`indicator_id`) REFERENCES `indicators` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_att_period` FOREIGN KEY (`period_id`) REFERENCES `evaluation_periods` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `fk_dept_cat` FOREIGN KEY (`category_id`) REFERENCES `vocational_categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_dept_org` FOREIGN KEY (`org_group_id`) REFERENCES `org_groups` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `dept_fields`
--
ALTER TABLE `dept_fields`
  ADD CONSTRAINT `fk_df_dept` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_df_field` FOREIGN KEY (`field_code`) REFERENCES `vocational_fields` (`code`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `evaluation_results`
--
ALTER TABLE `evaluation_results`
  ADD CONSTRAINT `fk_res_evale` FOREIGN KEY (`evaluatee_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_res_evalr` FOREIGN KEY (`evaluator_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_res_ind` FOREIGN KEY (`indicator_id`) REFERENCES `indicators` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_res_period` FOREIGN KEY (`period_id`) REFERENCES `evaluation_periods` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_res_topic` FOREIGN KEY (`topic_id`) REFERENCES `evaluation_topics` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `indicators`
--
ALTER TABLE `indicators`
  ADD CONSTRAINT `fk_ind_topic` FOREIGN KEY (`topic_id`) REFERENCES `evaluation_topics` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `indicator_evidence`
--
ALTER TABLE `indicator_evidence`
  ADD CONSTRAINT `fk_ie_ev` FOREIGN KEY (`evidence_type_id`) REFERENCES `evidence_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ie_ind` FOREIGN KEY (`indicator_id`) REFERENCES `indicators` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_dept` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_users_org` FOREIGN KEY (`org_group_id`) REFERENCES `org_groups` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `vocational_fields`
--
ALTER TABLE `vocational_fields`
  ADD CONSTRAINT `fk_vf_cat` FOREIGN KEY (`category_id`) REFERENCES `vocational_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
