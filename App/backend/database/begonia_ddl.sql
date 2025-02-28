
-- -----------------------------------------------------
-- Create table `Species`
    -- MUST have species name
    -- can be updated to fix any other elements
-- -----------------------------------------------------

DROP TABLE IF EXISTS `Species`;
CREATE TABLE `Species` (
  `speciesID` INT NOT NULL AUTO_INCREMENT,
  `speciesName` VARCHAR(90) NOT NULL,
  `subSection` VARCHAR(45) NULL,
  `chromosomeCount` INT NULL,
  `originCountry` VARCHAR(45) NULL,
  PRIMARY KEY (`speciesID`));

-- -----------------------------------------------------
-- `Species` data
-- -----------------------------------------------------

INSERT INTO `Species` (
	`speciesName`,
	`subsection`,
	`chromosomeCount`,
	`originCountry`
)
VALUES 
('Begonia hitchcockii', 'Gobenia', 22, 'Ecuador'),
('Begonia pearcei', 'Petermannia', 24, 'Ecuador'),
('Begonia tenuissima', 'Petermannia', 20, 'Borneo'),
('Begonia decora', 'Platycentrum', 26, 'Malaysia'),
('Begonia dodsonii', 'Gobenia', 20, 'Ecuador'),
('Begonia lichenora', 'Platycentrum', 14, 'Borneo'),
('Begonia luzhaiensis', 'Coleocentrum', 20, 'China');

-- -----------------------------------------------------
-- Create table `HybridizationEvents`
    -- MUST have the date of attempted cross and IDs of 1+ parents
    -- Can update later if the cross is a success (1) or failure (0)
    -- Deleting a hybridization event will delete child (Hybrid) rows 
    -- Deleting a pollen/ovary FK will set them to NULL
-- -----------------------------------------------------

DROP TABLE IF EXISTS `HybridizationEvents`;
CREATE TABLE `HybridizationEvents` (
  `hybridizationID` INT NOT NULL AUTO_INCREMENT,
  `hybridizationDate` DATE NOT NULL,
  `ovaryID` INT  NULL,
  `pollenID` INT  NULL,
  `success` TINYINT(1) NULL,
  PRIMARY KEY (`hybridizationID`),
  INDEX `fk_HybridizationEvents_Species1_idx` (`ovaryID` ASC) VISIBLE,
  INDEX `fk_HybridizationEvents_Species2_idx` (`pollenID` ASC) VISIBLE,
  CONSTRAINT `fk_HybridizationEvents_Species1`
    FOREIGN KEY (`ovaryID`)
    REFERENCES `Species` (`speciesID`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_HybridizationEvents_Species2`
    FOREIGN KEY (`pollenID`)
    REFERENCES `Species` (`speciesID`)
    ON DELETE SET NULL
    ON UPDATE CASCADE);
    
-- -----------------------------------------------------
-- `HybridizationEvents` data
-- -----------------------------------------------------

INSERT INTO `HybridizationEvents` (
	`ovaryID`,
	`pollenID`,
	`hybridizationDate`,
	`success`
)
VALUES 
(1, 2, STR_TO_DATE('1/10/2024', "%m/%d/%Y"), 1),
(2, 3, STR_TO_DATE('2/15/2024', "%m/%d/%Y"), 0),
(3, 4, STR_TO_DATE('3/20/2024', "%m/%d/%Y"), 1),
(5, 2, STR_TO_DATE('3/25/2024', "%m/%d/%Y"), 0),
(3, 7, STR_TO_DATE('4/20/2024', "%m/%d/%Y"), 0),
(6, 5, STR_TO_DATE('4/25/2024', "%m/%d/%Y"), 1);

-- -----------------------------------------------------
-- Create table `Hybrids`
    -- MUST be linked to a hybridization event and sowing date
    -- Can update germination and flowering information later
    -- Deleting a hybrid will delete child table (traits) data 
-- -----------------------------------------------------

DROP TABLE IF EXISTS `Hybrids`;
CREATE TABLE `Hybrids` (
  `hybridID` INT NOT NULL AUTO_INCREMENT,
  `hybridizationID` INT NOT NULL,
  `sowDate` DATE NOT NULL,
  `germinationDate` DATE NULL,
  `flowerDate` DATE NULL,
  PRIMARY KEY (`hybridID`),
  INDEX `fk_Hybrids_HybridizationEvents1_idx` (`hybridizationID` ASC) VISIBLE,
  CONSTRAINT `fk_Hybrids_HybridizationEvents1`
    FOREIGN KEY (`hybridizationID`)
    REFERENCES `HybridizationEvents` (`hybridizationID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- `Hybrids` data
-- -----------------------------------------------------

INSERT INTO `Hybrids` (
	`hybridizationID`,
	`sowDate`,
	`germinationDate`,
	`flowerDate`
)
VALUES 
(1, STR_TO_DATE('1/20/2024', "%m/%d/%Y"), STR_TO_DATE('2/5/2024', "%m/%d/%Y"), NULL),
(1, STR_TO_DATE('1/20/2024', "%m/%d/%Y"), STR_TO_DATE('2/11/2024', "%m/%d/%Y"), STR_TO_DATE('6/10/2024', "%m/%d/%Y")),
(3, STR_TO_DATE('4/1/2024', "%m/%d/%Y"), STR_TO_DATE('4/20/2024', "%m/%d/%Y"), NULL),
(3, STR_TO_DATE('4/1/2024', "%m/%d/%Y"), STR_TO_DATE('4/25/2024', "%m/%d/%Y"), STR_TO_DATE('7/15/2024', "%m/%d/%Y")),
(6, STR_TO_DATE('5/28/2024', "%m/%d/%Y"), STR_TO_DATE('6/15/2024', "%m/%d/%Y"), NULL),
(6, STR_TO_DATE('5/28/2024', "%m/%d/%Y"), STR_TO_DATE('6/12/2024', "%m/%d/%Y"), NULL);

-- -----------------------------------------------------
-- Create table `Traits`
    -- Trait name and type (value) are required
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Traits`;
CREATE TABLE `Traits` (
  `traitID` INT NOT NULL AUTO_INCREMENT,
  `traitName` VARCHAR(45) NOT NULL,
  `traitValue` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`traitID`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- `Traits` data
-- -----------------------------------------------------
INSERT INTO `Traits` (
	`traitName`,
	`traitValue`
)
VALUES 
('Leaf Color', 'yellow'),
('Leaf Color', 'red'),
('Leaf Size', 'large'),
('Leaf Size', 'medium'),
('Leaf Size', 'small'),
('Growth Habit', 'vining'),
('Growth Habit', 'tuberous'),
('Disease Resistance', 'high'),
('Disease Resistance', 'medium'),
('Disease Resistance', 'low');


-- -----------------------------------------------------
-- Create table `SpeciesTraits`
    -- Intersection table for SPECIES and TRAITS
    -- if associated species or trait disappear, rows are deleted
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SpeciesTraits`;
CREATE TABLE `SpeciesTraits` (
  `speciesID` INT NOT NULL,
  `traitID` INT NOT NULL,
  PRIMARY KEY (`speciesID`, `traitID`),
  INDEX `fk_Species_has_Traits_Traits1_idx` (`traitID` ASC) VISIBLE,
  INDEX `fk_Species_has_Traits_Species1_idx` (`speciesID` ASC) VISIBLE,
  CONSTRAINT `fk_Species_has_Traits_Species1`
    FOREIGN KEY (`speciesID`)
    REFERENCES `Species` (`speciesID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Species_has_Traits_Traits1`
    FOREIGN KEY (`traitID`)
    REFERENCES `Traits` (`traitID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- `SpeciesTraits` data
-- -----------------------------------------------------

INSERT INTO `SpeciesTraits` (
	`speciesID`,
	`traitID`
)
VALUES 
  (1, 1),
  (1, 3),
  (2, 3),
  (3, 4),
  (4, 2),
  (5, 3),
  (6, 7),
  (6, 5),
  (7, 9),
  (7, 6),
  (7, 4);

-- -----------------------------------------------------
-- Create table `HybridsTraits`
      -- Intersection table for HYBRIDS and TRAITS
      -- if associated hybrid or trait disappear, rows are deleted
-- -----------------------------------------------------
DROP TABLE IF EXISTS `HybridsTraits`;
CREATE TABLE `HybridsTraits` (
  `hybridID` INT NOT NULL,
  `traitID` INT NOT NULL,
  PRIMARY KEY (`hybridID`, `traitID`),
  INDEX `fk_Traits_has_Hybrids_Hybrids1_idx` (`hybridID` ASC) VISIBLE,
  INDEX `fk_Traits_has_Hybrids_Traits1_idx` (`traitID` ASC) VISIBLE,
  CONSTRAINT `fk_Traits_has_Hybrids_Traits1`
    FOREIGN KEY (`traitID`)
    REFERENCES `Traits` (`traitID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Traits_has_Hybrids_Hybrids1`
    FOREIGN KEY (`hybridID`)
    REFERENCES `Hybrids` (`hybridID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `HybridsTraits` data
-- -----------------------------------------------------
INSERT INTO `HybridsTraits` (
	`hybridID`,
	`traitID`
)
VALUES 
  (1, 3),
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 4),
  (5, 2),
  (6, 2),
  (6, 6),
  (6, 4),
  (6, 8),
  (2, 5);
