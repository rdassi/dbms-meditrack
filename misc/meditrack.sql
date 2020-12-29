-- MySQL dump 10.13  Distrib 5.7.32, for Linux (x86_64)
--
-- Host: localhost    Database: MediTrack
-- ------------------------------------------------------
-- Server version	5.7.32-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `appointment`
--

DROP TABLE IF EXISTS `appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `appointment` (
  `app_id` int(11) NOT NULL AUTO_INCREMENT,
  `app_slot` datetime NOT NULL,
  `app_confirm` tinyint(1) NOT NULL,
  `p_id` int(11) NOT NULL,
  `d_id` int(11) NOT NULL,
  `reason` varchar(200) NOT NULL,
  PRIMARY KEY (`app_id`),
  KEY `p_id` (`p_id`),
  KEY `d_id` (`d_id`),
  CONSTRAINT `appointment_ibfk_1` FOREIGN KEY (`p_id`) REFERENCES `patient` (`p_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `appointment_ibfk_2` FOREIGN KEY (`d_id`) REFERENCES `doctor` (`d_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment`
--

LOCK TABLES `appointment` WRITE;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `appointment`
--

--
-- Table structure for table `doctor`
--

DROP TABLE IF EXISTS `doctor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `doctor` (
  `d_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL UNIQUE,
  `name` varchar(100) NOT NULL,
  `ph_no` varchar(10) NOT NULL,
  `dob` date NOT NULL,
  `sex` varchar(10) NOT NULL,
  `qualification` varchar(100) NOT NULL,
  `specialization` varchar(100) NOT NULL,
  `address` varchar(300) NOT NULL,
  `timing` varchar(200) NOT NULL,
  `days` varchar(200) NOT NULL,
  `pwd` varchar(200) NOT NULL,
  PRIMARY KEY (`d_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor`
--

LOCK TABLES `doctor` WRITE;
/*!40000 ALTER TABLE `doctor` DISABLE KEYS */;
/*!40000 ALTER TABLE `doctor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patient`
--

DROP TABLE IF EXISTS `patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patient` (
  `p_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL UNIQUE,
  `name` varchar(100) NOT NULL,
  `ph_no` varchar(10) NOT NULL,
  `dob` date NOT NULL,
  `address` varchar(300) NOT NULL,
  `sex` varchar(10) NOT NULL,
  `age` int(11) NOT NULL,
  `height` int(11) NOT NULL,
  `weight` int(11) NOT NULL,
  `pwd` varchar(200) NOT NULL,
  PRIMARY KEY (`p_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient`
--

LOCK TABLES `patient` WRITE;
/*!40000 ALTER TABLE `patient` DISABLE KEYS */;
/*!40000 ALTER TABLE `patient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pharmacy`
--

DROP TABLE IF EXISTS `pharmacy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pharmacy` (
  `med_id` int(11) NOT NULL AUTO_INCREMENT,
  `medicine` varchar(100) NOT NULL,
  `dosage` varchar(100) NOT NULL,
  `directions` varchar(300) NOT NULL,
  PRIMARY KEY (`med_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pharmacy`
--

LOCK TABLES `pharmacy` WRITE;
/*!40000 ALTER TABLE `pharmacy` DISABLE KEYS */;
/*!40000 ALTER TABLE `pharmacy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pres_meds`
--

DROP TABLE IF EXISTS `pres_meds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pres_meds` (
  `pres_id` int(11) NOT NULL,
  `med_id` int(11) NOT NULL,
  KEY `pres_id` (`pres_id`),
  KEY `med_id` (`med_id`),
  CONSTRAINT `pres_meds_ibfk_1` FOREIGN KEY (`pres_id`) REFERENCES `prescription` (`pres_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pres_meds_ibfk_2` FOREIGN KEY (`med_id`) REFERENCES `pharmacy` (`med_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pres_meds`
--

LOCK TABLES `pres_meds` WRITE;
/*!40000 ALTER TABLE `pres_meds` DISABLE KEYS */;
/*!40000 ALTER TABLE `pres_meds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescription`
--

DROP TABLE IF EXISTS `prescription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prescription` (
  `pres_id` int(11) NOT NULL AUTO_INCREMENT,
  `p_id` int(11) NOT NULL,
  `d_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `symptoms` varchar(300) NOT NULL,
  `disease` varchar(300) NOT NULL,
  `comments` varchar(300) NOT NULL,
  PRIMARY KEY (`pres_id`),
  KEY `p_id` (`p_id`),
  KEY `d_id` (`d_id`),
  CONSTRAINT `prescription_ibfk_1` FOREIGN KEY (`p_id`) REFERENCES `patient` (`p_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `prescription_ibfk_2` FOREIGN KEY (`d_id`) REFERENCES `doctor` (`d_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescription`
--

LOCK TABLES `prescription` WRITE;
/*!40000 ALTER TABLE `prescription` DISABLE KEYS */;
/*!40000 ALTER TABLE `prescription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `record`
--

DROP TABLE IF EXISTS `record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `record` (
  `p_id` int(11) NOT NULL,
  `file` int(11) NOT NULL,
  KEY `p_id` (`p_id`),
  CONSTRAINT `record_ibfk_1` FOREIGN KEY (`p_id`) REFERENCES `patient` (`p_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `record`
--

LOCK TABLES `record` WRITE;
/*!40000 ALTER TABLE `record` DISABLE KEYS */;
/*!40000 ALTER TABLE `record` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `uploads`
--

DROP TABLE IF EXISTS `uploads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `uploads` (
  `p_id` int(11) NOT NULL,
  `tr_id` int(11) NOT NULL AUTO_INCREMENT,
  `test_name` varchar(100) NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`tr_id`),
  KEY `p_id` (`p_id`),
  CONSTRAINT `uploads_ibfk_1` FOREIGN KEY (`p_id`) REFERENCES `patient` (`p_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uploads`
--

LOCK TABLES `uploads` WRITE;
/*!40000 ALTER TABLE `uploads` DISABLE KEYS */;
/*!40000 ALTER TABLE `uploads` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-12-16  0:13:16
-- fake data for doctor
insert into `doctor`(`email`,`name`,`ph_no`,`dob`,`sex`,`qualification`,`specialization`,`address`,`timing`,`days`,`pwd`) values('amy@doc.com','amy santiago','1234567890','1985-12-10','female','Exists','Existing','ABC','timee','simon says','$2a$10$/comR4xTKpklPzmhSplXLO3cCOST1M96p2Jvwtxvrl6B5EHeONWtS');

insert into `doctor`(`email`,`name`,`ph_no`,`dob`,`sex`,`qualification`,`specialization`,`address`,`timing`,`days`,`pwd`) values('jake@doc.com','jake peralta','1234567890','1985-11-25','male','Exists','Existing','ABC','timee','simon says','$2a$10$/comR4xTKpklPzmhSplXLO3cCOST1M96p2Jvwtxvrl6B5EHeONWtS');

insert into `doctor`(`email`,`name`,`ph_no`,`dob`,`sex`,`qualification`,`specialization`,`address`,`timing`,`days`,`pwd`) values('rosa@doc.com','rosa diaz','1234567890','1975-10-12','female','Exists','Existing','ABC','timee','simon says','$2a$10$/comR4xTKpklPzmhSplXLO3cCOST1M96p2Jvwtxvrl6B5EHeONWtS');

insert into `doctor`(`email`,`name`,`ph_no`,`dob`,`sex`,`qualification`,`specialization`,`address`,`timing`,`days`,`pwd`) values('boyle@doc.com','charles boyle','1234567890','1975-9-12','male','Exists','Existing','ABC','timee','simon says','$2a$10$/comR4xTKpklPzmhSplXLO3cCOST1M96p2Jvwtxvrl6B5EHeONWtS');

insert into `doctor`(`email`,`name`,`ph_no`,`dob`,`sex`,`qualification`,`specialization`,`address`,`timing`,`days`,`pwd`) values('holt@doc.com','raymond holt','1234567890','1975-8-12','male','Exists','Existing','ABC','timee','simon says','$2a$10$/comR4xTKpklPzmhSplXLO3cCOST1M96p2Jvwtxvrl6B5EHeONWtS');


-- fake data for patient
insert into `patient`(`email`,`name`,`ph_no`,`dob`,`address`,`sex`,`age`,`height`,`weight`,`pwd`) values ('michael@pat.com','Michael Scott','1234567890','1985-12-23','home','male',45,123,56,'$2a$10$/comR4xTKpklPzmhSplXLO3cCOST1M96p2Jvwtxvrl6B5EHeONWtS');

insert into `patient`(`email`,`name`,`ph_no`,`dob`,`address`,`sex`,`age`,`height`,`weight`,`pwd`) values ('dwight@pat.com','Dwight Schrute','1234567890','1995-08-10','home','male',45,123,56,'$2a$10$/comR4xTKpklPzmhSplXLO3cCOST1M96p2Jvwtxvrl6B5EHeONWtS');

insert into `patient`(`email`,`name`,`ph_no`,`dob`,`address`,`sex`,`age`,`height`,`weight`,`pwd`) values ('jim@pat.com','Jim Halpert','1234567890','1980-12-10','home','male',45,123,56,'$2a$10$/comR4xTKpklPzmhSplXLO3cCOST1M96p2Jvwtxvrl6B5EHeONWtS');

insert into `patient`(`email`,`name`,`ph_no`,`dob`,`address`,`sex`,`age`,`height`,`weight`,`pwd`) values ('pam@pat.com','Pam Beesly','1234567890','1983-12-10','home','female',45,123,56,'$2a$10$/comR4xTKpklPzmhSplXLO3cCOST1M96p2Jvwtxvrl6B5EHeONWtS');

insert into `patient`(`email`,`name`,`ph_no`,`dob`,`address`,`sex`,`age`,`height`,`weight`,`pwd`) values ('jan@pat.com','Jan Levinson','1234567890','1998-11-14','home','female',45,123,56,'$2a$10$/comR4xTKpklPzmhSplXLO3cCOST1M96p2Jvwtxvrl6B5EHeONWtS');

-- fake appointment data
insert into `appointment`(`app_slot`,`app_confirm`, `p_id`, `d_id`, `reason`) values (NOW(),TRUE,1,1,'random pain');

insert into `appointment`(`app_slot`,`app_confirm`, `p_id`, `d_id`, `reason`) values (NOW(),TRUE,2,2,'random pain');

insert into `appointment`(`app_slot`,`app_confirm`, `p_id`, `d_id`, `reason`) values (NOW(),TRUE,3,2,'random pain');

insert into `appointment`(`app_slot`,`app_confirm`, `p_id`, `d_id`, `reason`) values (NOW(),TRUE,4,5,'random pain');

insert into `appointment`(`app_slot`,`app_confirm`, `p_id`, `d_id`, `reason`) values (NOW(),TRUE,5,1,
'random pain');

insert into `appointment`(`app_slot`,`app_confirm`, `p_id`, `d_id`, `reason`) values (NOW(),TRUE,4,3,'random pain');

insert into `appointment`(`app_slot`,`app_confirm`, `p_id`, `d_id`, `reason`) values (NOW(),TRUE,5,5,'random pain');

insert into `appointment`(`app_slot`,`app_confirm`, `p_id`, `d_id`, `reason`) values (NOW(),TRUE,1,4,'random pain');