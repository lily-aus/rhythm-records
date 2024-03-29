-- MySQL Script generated by MySQL Workbench
-- Sun Jul 10 22:11:53 2022
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema Rhythm_Records
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Table `Customers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Customers` ;

CREATE TABLE IF NOT EXISTS `Customers` (
  `customer_id` INT UNIQUE NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `phone` VARCHAR(15) NOT NULL,
  `address` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`customer_id`))
ENGINE = InnoDB;

ALTER TABLE `Customers` AUTO_INCREMENT=1001;


-- -----------------------------------------------------
-- Table `Orders`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Orders` ;

CREATE TABLE IF NOT EXISTS `Orders` (
  `order_id` INT UNIQUE NOT NULL AUTO_INCREMENT,
  `order_date` DATE NOT NULL,
  `order_total` DECIMAL(10,2) DEFAULT NULL,
  `customer_id` INT NULL,
  PRIMARY KEY (`order_id`),
  CONSTRAINT `fk_Orders_Customer`
    FOREIGN KEY (`customer_id`) 
    REFERENCES `Customers` (`customer_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;

ALTER TABLE `Orders` AUTO_INCREMENT=501;

-- -----------------------------------------------------
-- Table `Albums`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Albums` ;

CREATE TABLE IF NOT EXISTS `Albums` (
  `album_id` INT UNIQUE NOT NULL AUTO_INCREMENT,
  `album_name` VARCHAR(255) NOT NULL,
  `release_date` DATE DEFAULT NULL,
  `stock_qty` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`album_id`))
ENGINE = InnoDB;

ALTER TABLE `Albums` AUTO_INCREMENT=5001;


-- -----------------------------------------------------
-- Table `Orders_has_Albums`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Orders_has_Albums` ;

CREATE TABLE IF NOT EXISTS `Orders_has_Albums` (
  `Orders_Albums_id` INT NOT NULL AUTO_INCREMENT,
  `order_id` INT NOT NULL,
  `album_id` INT NULL,
  `quantity` INT NOT NULL,
  `line_total` DECIMAL(10,2) DEFAULT NULL,
  PRIMARY KEY (`Orders_Albums_id`),
  CONSTRAINT `fk_Order_has_Albums_Orders` 
    FOREIGN KEY (`order_id`) 
    REFERENCES `Orders` (`order_id`),
  CONSTRAINT `fk_Order_has_Albums_Albums` 
    FOREIGN KEY (`album_id`) 
    REFERENCES `Albums` (`album_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Artists`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Artists` ;

CREATE TABLE IF NOT EXISTS `Artists` (
  `artist_id` INT UNIQUE NOT NULL AUTO_INCREMENT,
  `artist_name` VARCHAR(255) NOT NULL,
  `country` VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (`artist_id`))
ENGINE = InnoDB;

ALTER TABLE `Artists` AUTO_INCREMENT=990;


-- -----------------------------------------------------
-- Table `Genres`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Genres` ;

CREATE TABLE IF NOT EXISTS `Genres` (
  `genre_id` INT UNIQUE NOT NULL AUTO_INCREMENT,
  `genre_name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`genre_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Genres_has_Albums`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Genres_has_Albums` ;

CREATE TABLE IF NOT EXISTS `Genres_has_Albums` (
  `Genres_Albums_id` INT NOT NULL AUTO_INCREMENT,
  `genre_id` INT NOT NULL,
  `album_id` INT NOT NULL,
  PRIMARY KEY (`Genres_Albums_id`),
  CONSTRAINT `fk_Genres_has_Albums_Genres` 
    FOREIGN KEY (`genre_id`) 
    REFERENCES `Genres` (`genre_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Genres_has_Albums_Albums` 
    FOREIGN KEY (`album_id`) 
    REFERENCES `Albums` (`album_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Artists_has_Albums`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Artists_has_Albums` ;

CREATE TABLE IF NOT EXISTS `Artists_has_Albums` (
  `Artists_Albums_id` INT NOT NULL AUTO_INCREMENT,
  `artist_id` INT NOT NULL,
  `album_id` INT NOT NULL,
  PRIMARY KEY (`Artists_Albums_id`),
  CONSTRAINT `fk_Artists_has_Albums_Artists` 
    FOREIGN KEY (`artist_id`) 
    REFERENCES `Artists` (`artist_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Artists_has_Albums_Albums`
    FOREIGN KEY (`album_id`) 
    REFERENCES `Albums` (`album_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Insert data to Table `Customers`
-- -----------------------------------------------------

INSERT INTO `Customers` (`first_name`, `last_name`, `email`, `phone`, `address`)
VALUES
('Robert', 'Smith', 'rmisth@gmail.com', '9984648001', '123 Fake Street, Towner, CO 73892'),
('Amanda', 'Bergen', 'abergen@yahoo.com', '1546140854', '456 Unreal Drive, Cityberg, UT 98903'),
('Jon', 'Johnson', 'jjohnson@hotmail.com', '6135549641', '789 Wheresit Road, Whoville, NY 30432'),
('Jacob', 'Lichtenstein', 'jlicthenstein@aol.com', '8813411452', '987 Theresit Street, Realville, CA 45034'),
('Mark', 'Nunda', 'mnunda@comcast.net', '7763015124', '654 Someplace Avenue, Someplace, WA 53403');


-- -----------------------------------------------------
-- Insert data to Table `Artists`
-- -----------------------------------------------------

INSERT INTO `Artists` (`artist_name`, `country`)
VALUES
('Nas', 'United States of America'),
('Neutral Milk Hotel', 'United States of America'),
('Summoning', 'Austria'),
('Iggy & The Stooges', 'United States of America'),
('Ed Harris', 'Australia');


-- -----------------------------------------------------
-- Insert data to Table `Genres`
-- -----------------------------------------------------

INSERT INTO `Genres` (`genre_name`)
VALUES
('East Coast Hiphop'),
('Hardcore Hiphop'),
('Indie Rock'),
('Psychedelic Folk'),
('Black Metal'),
('Ambient/Atmospheric'),
('Proto-Punk'),
('Hard Rock'),
('Soundtrack'),
('Drum and Bass');


-- -----------------------------------------------------
-- Insert data to Table `Orders`
-- -----------------------------------------------------

INSERT INTO `Orders` (`order_date`, `customer_id`)
VALUES
('2022-04-21', (SELECT customer_id FROM Customers WHERE first_name = 'Jacob' AND last_name = 'Lichtenstein' AND phone = '8813411452')),
('2022-04-21', (SELECT customer_id FROM Customers WHERE first_name = 'Jon' AND last_name = 'Johnson' AND phone = '6135549641')),
('2022-05-01', (SELECT customer_id FROM Customers WHERE first_name = 'Robert' AND last_name = 'Smith' AND phone = '9984648001')),
('2022-05-01', (SELECT customer_id FROM Customers WHERE first_name = 'Jacob' AND last_name = 'Lichtenstein' AND phone = '8813411452')),
('2022-05-05', (SELECT customer_id FROM Customers WHERE first_name = 'Mark' AND last_name = 'Nunda' AND phone = '7763015124'));


-- -----------------------------------------------------
-- Insert data to Table `Albums`
-- -----------------------------------------------------
INSERT INTO `Albums` (`album_name`, `release_date`, `stock_qty`, `price`)
VALUES
('Illmatic', '1994-04-19', 15, '24.50'),
('In the Aeroplane Over the Sea', '1998-02-10', 15, '24.50'),
('Let Mortal Heroes Sing Your Flame', '2001-10-31', 5, '37.50'),
('Raw Power', '1970-02-07', 10, '24.50'),
('Neotokyo GSDF', '2009-03-05', 5, '37.50'),
('It Was Written', '1996-07-02', 5, '24.50');



-- -----------------------------------------------------
-- Insert data to Table `Orders_has_Albums`
-- -----------------------------------------------------

INSERT INTO `Orders_has_Albums` (`order_id`,`album_id`, `quantity`)
VALUES
(
  (SELECT order_id FROM Orders WHERE customer_id = '1004' AND order_date = '2022-04-21'),
  (SELECT album_id FROM Albums WHERE album_name = 'Let Mortal Heroes Sing Your Flame'),
  2
),
(
  (SELECT order_id FROM Orders WHERE customer_id = '1003' AND order_date = '2022-04-21'),
  (SELECT album_id FROM Albums WHERE album_name = 'Illmatic'),
  1
),
(
  (SELECT order_id FROM Orders WHERE customer_id = '1003' AND order_date = '2022-04-21'),
  (SELECT album_id FROM Albums WHERE album_name = 'In the Aeroplane Over the Sea'),
  2
),
(
  (SELECT order_id FROM Orders WHERE customer_id = '1001' AND order_date = '2022-05-01'),
  (SELECT album_id FROM Albums WHERE album_name = 'Raw Power'),
  1
),
(
  (SELECT order_id FROM Orders WHERE customer_id = '1004' AND order_date = '2022-05-01'),
  (SELECT album_id FROM Albums WHERE album_name = 'Neotokyo GSDF'),
  1
),
(
  (SELECT order_id FROM Orders WHERE customer_id = '1004' AND order_date = '2022-05-01'),
  (SELECT album_id FROM Albums WHERE album_name = 'It Was Written'),
  1
),
(
  (SELECT order_id FROM Orders WHERE customer_id = '1005' AND order_date = '2022-05-05'),
  (SELECT album_id FROM Albums WHERE album_name = 'Let Mortal Heroes Sing Your Flame'),
  1
);


-- -----------------------------------------------------
-- Update Line_Total to Table `Orders_has_Albums`
-- -----------------------------------------------------

UPDATE `Orders_has_Albums`
INNER JOIN `Albums` ON Albums.album_id = Orders_has_Albums.album_id
SET Orders_has_Albums.line_total = Orders_has_Albums.quantity * Albums.price;


-- -----------------------------------------------------
-- Update Order Total to Table `Orders`
-- -----------------------------------------------------

UPDATE `Orders`
SET Orders.order_total = (SELECT SUM(Orders_has_Albums.line_total) 
FROM `Orders_has_Albums` 
WHERE Orders_has_Albums.order_id = Orders.order_id);



-- -----------------------------------------------------
-- Insert data to Table `Genres_has_Albums`
-- -----------------------------------------------------

INSERT INTO `Genres_has_Albums` (`genre_id`, `album_id`)
VALUES
(
  (SELECT genre_id FROM Genres WHERE genre_name = 'East Coast Hiphop'),
  (SELECT album_id FROM Albums WHERE album_name = 'Illmatic')
),
(
  (SELECT genre_id FROM Genres WHERE genre_name = 'East Coast Hiphop'),
  (SELECT album_id FROM Albums WHERE album_name = 'In the Aeroplane Over the Sea')
),
(
  (SELECT genre_id FROM Genres WHERE genre_name = 'Hardcore Hiphop'),
  (SELECT album_id FROM Albums WHERE album_name = 'In the Aeroplane Over the Sea')
),
(
  (SELECT genre_id FROM Genres WHERE genre_name = 'Hardcore Hiphop'),
  (SELECT album_id FROM Albums WHERE album_name = 'Let Mortal Heroes Sing Your Flame')
),
(
  (SELECT genre_id FROM Genres WHERE genre_name = 'Hardcore Hiphop'),
  (SELECT album_id FROM Albums WHERE album_name = 'Neotokyo GSDF')
),
(
  (SELECT genre_id FROM Genres WHERE genre_name = 'Indie Rock'),
  (SELECT album_id FROM Albums WHERE album_name = 'Raw Power')
),
(
  (SELECT genre_id FROM Genres WHERE genre_name = 'Psychedelic Folk'),
  (SELECT album_id FROM Albums WHERE album_name = 'Illmatic')
),
(
  (SELECT genre_id FROM Genres WHERE genre_name = 'Black Metal'),
  (SELECT album_id FROM Albums WHERE album_name = 'In the Aeroplane Over the Sea')
),
(
  (SELECT genre_id FROM Genres WHERE genre_name = 'Black Metal'),
  (SELECT album_id FROM Albums WHERE album_name = 'Let Mortal Heroes Sing Your Flame')
),
(
  (SELECT genre_id FROM Genres WHERE genre_name = 'Ambient/Atmospheric'),
  (SELECT album_id FROM Albums WHERE album_name = 'Illmatic')
),
(
  (SELECT genre_id FROM Genres WHERE genre_name = 'Proto-Punk'),
  (SELECT album_id FROM Albums WHERE album_name = 'Raw Power')
),
(
  (SELECT genre_id FROM Genres WHERE genre_name = 'Proto-Punk'),
  (SELECT album_id FROM Albums WHERE album_name = 'In the Aeroplane Over the Sea')
),
(
  (SELECT genre_id FROM Genres WHERE genre_name = 'Proto-Punk'),
  (SELECT album_id FROM Albums WHERE album_name = 'Let Mortal Heroes Sing Your Flame')
),
(
  (SELECT genre_id FROM Genres WHERE genre_name = 'Hard Rock'),
  (SELECT album_id FROM Albums WHERE album_name = 'Raw Power')
),
(
  (SELECT genre_id FROM Genres WHERE genre_name = 'Soundtrack'),
  (SELECT album_id FROM Albums WHERE album_name = 'Neotokyo GSDF')
),
(
  (SELECT genre_id FROM Genres WHERE genre_name = 'Drum and Bass'),
  (SELECT album_id FROM Albums WHERE album_name = 'It Was Written')
);


-- -----------------------------------------------------
-- Insert data to Table `Artists_has_Albums`
-- -----------------------------------------------------

INSERT INTO `Artists_has_Albums` ( `artist_id`, `album_id`)
VALUES
(
  (SELECT artist_id FROM Artists WHERE artist_name = 'Nas' AND country = 'United States of America'),
  (SELECT album_id FROM Albums WHERE album_name = 'Illmatic')
),  
(
  (SELECT artist_id FROM Artists WHERE artist_name = 'Neutral Milk Hotel' AND country = 'United States of America'),
  (SELECT album_id FROM Albums WHERE album_name = 'In the Aeroplane Over the Sea')
),
(
  (SELECT artist_id FROM Artists WHERE artist_name = 'Summoning' AND country = 'Austria'),
  (SELECT album_id FROM Albums WHERE album_name = 'Let Mortal Heroes Sing Your Flame')
),
(
  (SELECT artist_id FROM Artists WHERE artist_name = 'Iggy & The Stooges' AND country = 'United States of America'),
  (SELECT album_id FROM Albums WHERE album_name = 'Raw Power')
),
(
  (SELECT artist_id FROM Artists WHERE artist_name = 'Ed Harris' AND country = 'Australia'),
  (SELECT album_id FROM Albums WHERE album_name = 'Neotokyo GSDF')
),
(
  (SELECT artist_id FROM Artists WHERE artist_name = 'Summoning' AND country = 'Austria'),
  (SELECT album_id FROM Albums WHERE album_name = 'Neotokyo GSDF')
),
(
  (SELECT artist_id FROM Artists WHERE artist_name = 'Iggy & The Stooges' AND country = 'United States of America'),
  (SELECT album_id FROM Albums WHERE album_name = 'It Was Written')
);


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
