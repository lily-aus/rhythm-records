-- Group 18 
-- Rhythm Records
-- Artem Kuryachy, Lili Du



-- -----------------------------------------------------
-- Page `Customers`
-- -----------------------------------------------------

-- get all the customers details for the Customers table
SELECT `customer_id`, `first_name`, `last_name`, `email`, `phone`, `address` FROM `Customers`;

-- DELETE a customer 
DELETE FROM Customers WHERE customer_id = :id_of_customer_from_input;

-- SEARCH function - get details of customers based on last name (Dynamic Search/Filter requirement) 
SELECT `customer_id`, `first_name`, `email`, `phone`, `address` FROM `Customers` WHERE `last_name` = :lname;


-- -----------------------------------------------------
-- Page `Add Customer` - direct the user to this page after clicking the Add button
-- -----------------------------------------------------

-- insert new customer in Customers Table 
INSERT INTO `Customers` (`first_name`, `last_name`, `email`, `phone`, `address`) VALUES
(:fname, :lname, :email, :phonenum, :address);


-- -----------------------------------------------------
-- Page `Update Customer` - direct the user to this page afer clicking the Edit button
-- -----------------------------------------------------

-- UPDATE a customer's data based on submission of the Update Customer form 
UPDATE `Customers` 
SET 
`first_name` = :fname, `last_name` = :lname, `email` = :email, `phone` = :phonenum, `address` = :address 
WHERE `customer_id` = :id_of_customer_from_input;



-- -----------------------------------------------------
-- Page `Albums`
-- -----------------------------------------------------

-- get the album details for the Albums table
SELECT `album_id`, `album_name`, `release_date`, `stock_qty`, `price` FROM `Albums`;

-- DELETE an album 
DELETE FROM Albums WHERE album_id = :id_of_album_from_input;

-- SEARCH function - show the album information based on album name
SELECT `album_id`, `album_name`, `release_date`, `stock_qty`, `price` FROM `Albums` WHERE `album_name` = :alname;

-- -----------------------------------------------------
-- Page `Add Album`
-- -----------------------------------------------------

-- INSERT new album into Albums Table 
-- (deigned to obtain the info of corresponding intersections tables at the same time - Artists_has_Albums and Genre_has_Albums)
INSERT INTO `Albums` (`album_name`, `release_date`, `stock_qty`, `price`) VALUES
(:alname, :rdate, :stock, :price);

-- INSERT Artists_has_Albums
INSERT INTO `Artists_has_Albums` ( `artist_id`, `album_id`) VALUES
(
(SELECT `artist_id` FROM `Artists` WHERE `artist_name` = :arname), 
(SELECT `album_id` FROM `Albums` WHERE `album_name` = :alname)
);

-- INSERT Genre_has_Albums
INSERT INTO `Genres_has_Albums` (`genre_id`, `album_id`)
VALUES
(
  (SELECT `genre_id` FROM `Genres` WHERE `genre_name` = :gname),
  (SELECT `album_id` FROM `Albums` WHERE `album_name` = :alname)
);


-- -----------------------------------------------------
-- Page `Update Album`
-- -----------------------------------------------------

-- UPDATE an album's data based on submission of the Update Album form 
-- (deigned to update the info of corresponding intersections tables at the same time - Artists_has_Albums and Genre_has_Albums)
UPDATE `Albums` 
SET 
`album_name` = :alname, `release_date` = :date, `stock_qty` = :quan, `price` = :price 
WHERE `album_id` = :id_of_album_from_input;

-- UPDATE Artists_has_Albums
UPDATE `Artists_has_Albums`  
SET 
  (SELECT `artist_id` FROM `Artists` WHERE `artist_name` = :arname),
  (SELECT `album_id` FROM `Albums` WHERE `album_name` = :alname)
  WHERE `Artists_Albums_id` = :id_of_artist_album_from_input;

-- UPDATE Genre_has_Albums
UPDATE `Genres_has_Albums`  
SET 
`genre_id` = (SELECT `genre_id` FROM `Genres` WHERE `genre_name` = :gname), 
`album_id` = (SELECT `album_id` FROM `Albums` WHERE `album_name` = :alname)
WHERE Genres_Albums_id = :id_of_genre_album_from_input;

-- DELETE M:M Relationship Deletion: dis-associate an album from an artist
DELETE FROM `Artists_has_Albums` WHERE `artist_id` = :id_of_artist_from_input AND `album_id` = :id_of_album_from_input;

-- DELETE M:M Relationship: dis-associate an album from a genre
DELETE FROM `Genres_has_Albums` WHERE `genre_id` = :id_of_genre_from_input AND `album_id` = :id_of_album_from_input;



-- -----------------------------------------------------
-- Page `Orders`
-- -----------------------------------------------------

-- get all the orders details for the Orders table 
SELECT `order_id`, `order_date`, `order_total`, `customer_id` FROM `Orders`;

-- DELETE an order 
DELETE FROM Orders WHERE order_id = :id_of_order_from_input;

-- SEARCH function - show order information based on customer_id
SELECT `order_id`, `order_date`, `order_total`, `customer_id` FROM `Orders` WHERE customer_id = :id_of_user_from_input;


-- -----------------------------------------------------
-- Page `Add Order`
-- -----------------------------------------------------

-- Insert Order details  
-- enter customer names to look for FK as more user-friendly, if change to select user_id, a drop-down menu will be impelemented 
-- order_total is calulated automatically after the data in intersection table is entered, no user input required
INSERT INTO `Orders` (`order_date`, `customer_id`)
VALUES
(:order_date, (SELECT `customer_id` FROM `Customers` WHERE `first_name` = :fname AND `last_name` = :lname));


-- INSERT Orders Has ALbums Table (i.e. M:M Relationship - associate album with order)
-- This is inserted at the same time when the user creates a new order
INSERT INTO `Orders_has_Albums` (`order_id`,`album_id`, `quantity`, `unit_price`)
VALUES
(
  (SELECT `order_id` FROM `Orders` WHERE `customer_id` = :id_of_customer_from_input AND `order_date` = :order_date),
  (SELECT `album_id` FROM `Albums` WHERE `album_name` = :alname),
  :quan, 
  :uprice
);

-- Update line_price
UPDATE `Orders_has_Albums`
INNER JOIN `Albums` ON Albums.album_id = Orders_has_Albums.album_id
SET Orders_has_Albums.line_total = Orders_has_Albums.quantity * Albums.price;

-- Update total price in Orders
UPDATE `Orders`
SET Orders.order_total = (SELECT SUM(Orders_has_Albums.line_total) 
FROM `Orders_has_Albums` 
WHERE Orders_has_Albums.order_id = Orders.order_id);


-- -----------------------------------------------------
-- Page `Update Order`
-- -----------------------------------------------------

-- UPDATE an order's data based on submission of the Update Order form (order total is not entered by the user, it's calculated automatically)

UPDATE `Orders` 
SET 
`order_date` = :date, `customer_id` = :id_of_customer_from_input 
WHERE `order_id` = :id_of_order_from_input;

-- UPDATE the relationship between orders and albums based on submission of the Update Order form 
UPDATE `Orders_has_Albums` 
SET 
  (SELECT `order_id` FROM `Orders` WHERE `customer_id` = :id_of_customer_from_input AND `order_date` = :date),
  (SELECT `album_id` FROM `Albums` WHERE `album_name` = :alname),
  :quan,
  :uprice
WHERE `Orders_Albums_id`= :id_of_order_album_from_input;

-- Update line_price
UPDATE `Orders_has_Albums`
INNER JOIN `Albums` ON Albums.album_id = Orders_has_Albums.album_id
SET Orders_has_Albums.line_total = Orders_has_Albums.quantity * Albums.price;

-- Update total price in Orders
UPDATE `Orders`
SET Orders.order_total = (SELECT SUM(Orders_has_Albums.line_total) 
FROM `Orders_has_Albums` 
WHERE Orders_has_Albums.order_id = Orders.order_id);

-- M:M Relationship Deletion: dis-associate an album from an order
DELETE FROM `Orders_has_Albums` WHERE `order_id` = :id_of_order_from_input AND `album_id` = :id_of_album_from_input;




-- -----------------------------------------------------
-- Page `Artists`
-- -----------------------------------------------------

-- get all the artist details for the Artists table
SELECT `artist_id`, `artist_name`, `country`FROM `Artists`;

-- INSERT new artist into Artists Table
INSERT INTO `Artists` (`artist_name`, `country`) VALUES
(:arname, :country);

-- UPDATE an artist's data based on submission of the Update Artist form 
UPDATE `Artists` 
SET 
`artist_name` = :arname, `country` = :country 
WHERE `artist_id` = :id_of_artist_from_input;

-- DELETE an artist 
DELETE FROM Artists WHERE artist_id = :id_of_artist_from_input;

-- SEARCH function - display the artist info based on artist name
SELECT `artist_id`, `artist_name`, `country`FROM `Artists` WHERE `artist_name` = :arname;




-- -----------------------------------------------------
-- Page `Genres`
-- -----------------------------------------------------

-- get all the genres details for the Genres table
SELECT `genre_id`, `genre_name` FROM `Genres`;

-- INSERT new genre into Genres Table
INSERT INTO `Genres` (`genre_name`) VALUES
(:gname);

-- UPDATE a genre's data based on submission of the Update Genre form 
UPDATE `Genres` 
SET 
`genre_name` = :gname 
WHERE `genre_id` = :id_of_genre_from_input;

-- DELETE a genre
DELETE FROM Genres WHERE genres_id = :id_of_genre_from_input;


-- SEARCH function - display the genre id based on genre name
SELECT `genre_id`, `genre_name` FROM `Genres` WHERE `genre_name` = :gname;


-- -----------------------------------------------------
-- The following queries are for INTERSECTION TABLES, some of the queries for INSERT and UPDATE have also been shown above
-- -----------------------------------------------------




-- -----------------------------------------------------
-- Page `Orders Has Albums`
-- -----------------------------------------------------

-- get all information for the table
SELECT `Orders_Albums_id`, `order_id`, `album_id`, `quantity`, `unit_price`, `linie_total` FROM `Orders_has_Albums`;

-- INSERT Orders Has ALbums Table (i.e. M:M Relationship - associate album with order)
INSERT INTO `Orders_has_Albums` (`order_id`,`album_id`, `quantity`, `unit_price`)
VALUES
(
  (SELECT `order_id` FROM `Orders` WHERE `customer_id` = :id_of_customer_from_input AND `order_date` = :order_date),
  (SELECT `album_id` FROM `Albums` WHERE `album_name` = :alname),
  :quan, 
  :uprice
);

-- Update line_price
UPDATE `Orders_has_Albums`
INNER JOIN `Albums` ON Albums.album_id = Orders_has_Albums.album_id
SET Orders_has_Albums.line_total = Orders_has_Albums.quantity * Albums.price;

-- Update total price in Orders
UPDATE `Orders`
SET Orders.order_total = (SELECT SUM(Orders_has_Albums.line_total) 
FROM `Orders_has_Albums` 
WHERE Orders_has_Albums.order_id = Orders.order_id);


-- UPDATE the relationship between orders and albums based on submission of the Update Order form 
UPDATE `Orders_has_Albums` 
SET 
  (SELECT `order_id` FROM `Orders` WHERE `customer_id` = :id_of_customer_from_input AND `order_date` = :date),
  (SELECT `album_id` FROM `Albums` WHERE `album_name` = :alname),
  :quan,
  :uprice
WHERE `Orders_Albums_id`= :id_of_order_album_from_input;

-- Update line_price
UPDATE `Orders_has_Albums`
INNER JOIN `Albums` ON Albums.album_id = Orders_has_Albums.album_id
SET Orders_has_Albums.line_total = Orders_has_Albums.quantity * Albums.price;

-- Update total price in Orders
UPDATE `Orders`
SET Orders.order_total = (SELECT SUM(Orders_has_Albums.line_total) 
FROM `Orders_has_Albums` 
WHERE Orders_has_Albums.order_id = Orders.order_id);

-- M:M Relationship Deletion: dis-associate an album from an order
DELETE FROM `Orders_has_Albums` WHERE `order_id` = :id_of_order_from_input AND `album_id` = :id_of_album_from_input;

-- SEARCH function: get album details in an order (Orders Has Albums) -- optional
SELECT `order_id`, `album_id`, `quantity`, `unit_price`, `linie_total` FROM `Orders_has_Albums` 
WHERE `order_id` = :id_of_order_from_input;




-- -----------------------------------------------------
-- Page `Artists Has Albums`
-- -----------------------------------------------------


-- get all info of the table
SELECT `Artists_Albums_id`, `artist_id`, `album_id` FROM `Artists_has_Albums`;


-- INSERT new data into Artists Has Albums Table and M:M Relationship Addition: associate album with artist
-- Information obtained at the same time when adding a new album
INSERT INTO `Artists_has_Albums` ( `artist_id`, `album_id`) VALUES
(
(SELECT `artist_id` FROM `Artists` WHERE `artist_name` = :arname), 
(SELECT `album_id` FROM `Albums` WHERE `album_name` = :alname)
);


-- UPDATE the relationship between artists and albums based on submission of the Update Album form 
-- Information obtained at the same time when updaing an album
UPDATE `Artists_has_Albums`  
SET 
  (SELECT `artist_id` FROM `Artists` WHERE `artist_name` = :arname),
  (SELECT `album_id` FROM `Albums` WHERE `album_name` = :alname)
  WHERE `Artists_Albums_id` = :id_of_artist_album_from_input;


-- DELETE M:M Relationship Deletion: dis-associate an album from an artist
DELETE FROM `Artists_has_Albums` WHERE `artist_id` = :id_of_artist_from_input AND `album_id` = :id_of_album_from_input;


-- SEARCH function - get all album names belong to an artist (Artists Has Albums)
SELECT  `Artists`.`artist_name`,`Albums`.`album_name`
FROM `Albums`
JOIN `Artists_has_Albums` ON `Albums`.album_id = `Artists_has_Albums`.album_id
JOIN `Artists` ON `Artists`.`artist_id` = `Artists_has_Albums`.`artist_id`
WHERE `Artists`.`artist_name`= 'Nas'
ORDER BY `Artists`.`artist_name`;




-- -----------------------------------------------------
-- Page `Genres Has Albums`
-- -----------------------------------------------------

-- get all information for the table
SELECT `Genres_Albums_id`, `genre_id`, `album_id` FROM `Genres_has_Albums`;


-- INSERT new data into Genres Has Albums Table and M:M Relationship Addition: associate album with genre

INSERT INTO `Genres_has_Albums` (`genre_id`, `album_id`)
VALUES
(
  (SELECT `genre_id` FROM `Genres` WHERE `genre_name` = :gname),
  (SELECT `album_id` FROM `Albums` WHERE `album_name` = :alname)
);


-- UPDATE the relationship between genres and albums based on submission of the Update Album form 
UPDATE `Genres_has_Albums`  
SET 
`genre_id` = (SELECT `genre_id` FROM `Genres` WHERE `genre_name` = :gname), 
`album_id` = (SELECT `album_id` FROM `Albums` WHERE `album_name` = :alname)
WHERE Genres_Albums_id = :id_of_genre_album_from_input;


-- DELETE M:M Relationship: dis-associate an album from a genre
DELETE FROM `Genres_has_Albums` WHERE `genre_id` = :id_of_genre_from_input AND `album_id` = :id_of_album_from_input;


-- SEARCH function - get all album names belonging to a genre (Genres Has Albums)
SELECT  `Genres`.`genre_name`,`Albums`.`album_name`
FROM `Albums`
JOIN `Genres_has_Albums` ON `Albums`.album_id = `Genres_has_Albums`.album_id
JOIN `Genres` ON `Genres`.genre_id = `Genres_has_Albums`.genre_id
WHERE `Genres`.`genre_name`= 'Black Metal'
ORDER BY `Albums`.`album_name`;


