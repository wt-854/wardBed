DROP TABLE IF EXISTS `tbl_bed`;
DROP TABLE IF EXISTS `tbl_ward`;

CREATE TABLE `tbl_ward` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `WARD_REFERENCE_ID` varchar(7) NOT NULL,
  `WARD_NAME` varchar(10) NOT NULL,
  `WARD_CLASS_TYPE` varchar(20) DEFAULT NULL,
  `WARD_LOCATION` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `WARD_REFERENCE_ID` (`WARD_REFERENCE_ID`),
  UNIQUE KEY `WARD_NAME` (`WARD_NAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `tbl_bed` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `BED_REFERENCE_ID` varchar(6) NOT NULL,
  `BED_NAME` varchar(17) DEFAULT NULL,
  `WARD_ALLOCATION_DATE` datetime DEFAULT NULL,
  `WARD_ID` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `BED_REFERENCE_ID` (`BED_REFERENCE_ID`),
  UNIQUE KEY `BED_NAME` (`BED_NAME`),
  KEY `FK_WARD` (`WARD_ID`),
  CONSTRAINT `FK_WARD` FOREIGN KEY (`WARD_ID`) REFERENCES `tbl_ward` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;