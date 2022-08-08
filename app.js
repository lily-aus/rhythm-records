//
// # Citation for the project
// # Date: 08/08/2022
// # Adapted Based on the starter-app provided in CS340
// # Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
//


/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
var path = require("path");
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

PORT = 34861;

// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
const { type } = require('os');
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/
app.get('/', function(req, res)
    {
        res.render('index');
    });

app.get('/customers', function(req, res)
    {   
        // Declare Query 1
        let query1;

        // If there is no query string, we just perform a basic SELECT
        if (req.query.lname === undefined)
        {
            query1 = "SELECT customer_id AS 'Customer ID', first_name AS 'First Name', last_name AS 'Last Name', email AS Email, phone AS Phone, address AS Address FROM Customers;";
        }

        // If there is a query string, we assume this is a search, and return desired results
        else
        {
            query1 = `SELECT customer_id AS 'Customer ID', first_name AS 'First Name', last_name AS 'Last Name', email AS Email, phone AS Phone, address AS Address FROM Customers WHERE last_name LIKE "${req.query.lname}%"`
        }

        // Run the 1st query
        db.pool.query(query1, function(error, rows, fields){
            
            return res.render('customers', {data: rows});
        });
    });

app.get('/orders', function(req, res)
    {

        // Declare Query 1
        let query1 = "SELECT order_id AS 'Order ID',  DATE_FORMAT(order_date, '%Y/%m/%d') AS 'Order Date', order_total AS 'Order Total', customer_id AS 'Customer ID' FROM Orders;";

        // Query 2 for dropdown menu customer IDs
        let query2 = "SELECT DISTINCT customer_id FROM Orders;";

        if (req.query.custo_id)
        {
            query1 = `SELECT order_id AS 'Order ID',  DATE_FORMAT(order_date, '%Y/%m/%d') AS 'Order Date', order_total AS 'Order Total', customer_id AS 'Customer ID' FROM Orders WHERE customer_id = "${req.query.custo_id}%"`
        }

        // Run the 1st query
        db.pool.query(query1, function(error, rows, fields){
            
            // Save the people
            let orders = rows;
            
            // Run the second query
            db.pool.query(query2, (error, rows, fields) => {
                
                // Save the customer IDs
                let customer_ids = rows;
                return res.render('orders', {data: orders, customer_ids: customer_ids});
            });
        
        });
    });

app.get('/artists', function(req, res)
    {

        let query1 = `SELECT artist_id AS 'Artist ID', artist_name AS 'Artist Name', country AS 'Country' FROM Artists`;
        let query2 = `SELECT artist_id from Artists`;

        if(req.query.input_artist)
        {
            query1= `SELECT artist_id AS 'Artist ID', artist_name AS 'Artist Name', country AS 'Country' FROM Artists WHERE artist_id = "${req.query.input_artist}%"`;
        }

        db.pool.query(query1, function(error, rows, fields){
            db.pool.query(query2, function(error, rows2, fields){

            res.render('artists',{data: rows, artist_ids: rows2});                                      
        });
        
    });
    
    });  

app.get('/albums', function(req, res)

    {

        let query1 = `SELECT album_id AS 'Album ID', album_name AS 'Album Name',  DATE_FORMAT(release_date, '%Y/%m/%d') AS 'Release Date', stock_qty As 'Stock Quantity', price AS 'Price' FROM Albums`;
        let query2 = `SELECT album_id from Albums`;

        if(req.query.input_album)
        {
            query1= `SELECT album_id AS 'Album ID', album_name AS 'Album Name',  DATE_FORMAT(release_date, '%Y/%m/%d') AS 'Release Date', stock_qty As 'Stock Quantity', price AS 'Price' FROM Albums WHERE album_id = "${req.query.input_album}%"`;
        }

        db.pool.query(query1, function(error, rows, fields){
            db.pool.query(query2, function(error, rows2, fields){

            res.render('albums',{data: rows, album_ids: rows2});                                      
        });
        
    });
    
    });  

app.get('/genres', function(req, res)
    // {
    //     let query1 = "SELECT genre_id AS 'Genre ID', genre_name AS 'Genre Name' FROM Genres";

    //     db.pool.query(query1, function(error, rows, fields){
    //         res.render('genres', {data: rows});
    //     });
    // });


    {

        let query1 = `SELECT genre_id AS 'Genre ID', genre_name AS 'Genre Name' FROM Genres`;
        let query2 = `SELECT genre_id from Genres`;

        if(req.query.input_genre)
        {
            query1= `SELECT genre_id AS 'Genre ID', genre_name AS 'Genre Name' FROM Genres WHERE genre_id = "${req.query.input_genre}%"`;
        }

        db.pool.query(query1, function(error, rows, fields){
            db.pool.query(query2, function(error, rows2, fields){

            res.render('genres',{data: rows, genre_ids: rows2});                                      
        });
        
    });
    
    });  

app.get('/genres_has_albums', function(req, res)
    {
        let query1 = "SELECT Genres_Albums_id AS 'Genres_Albums_ID', genre_id AS 'Genre ID', album_id AS 'Album ID' FROM Genres_has_Albums";

        db.pool.query(query1, function(error, rows, fields){
            res.render('genres_has_albums', {data: rows});
        });
    });

app.get('/artists_has_albums', function(req, res)
    {
        let query1 = "SELECT Artists_Albums_id AS 'Artists_Albums_ID', artist_id AS 'Artist ID', album_id AS 'Album ID' FROM Artists_has_Albums";

        db.pool.query(query1, function(error, rows, fields){
            res.render('artists_has_albums', {data: rows});
        });
    });

app.get('/orders_has_albums', function(req, res)
    {
        let query1 = "SELECT Orders_Albums_id AS 'Orders_Albums_ID', order_id AS 'Order ID', album_id AS 'Album ID', quantity AS 'Quantity', line_total AS 'Line Total' FROM Orders_has_Albums";

        db.pool.query(query1, function(error, rows, fields){
            res.render('orders_has_albums', {data: rows});
        });
    });

app.get('/insert_customers', function(req, res)
    {
        res.render('insert_customers');
    });

app.get("/update_customers/:customer_id", async(req, res) =>
    {

        var customerId = req.params.customer_id;
        let getCustomerById = `SELECT customer_id AS 'Customer ID', first_name AS 'First Name', last_name AS 'Last Name', email AS 'Email', phone AS 'Phone', address AS 'Address' FROM Customers WHERE customer_id = ${customerId}`;
        
        // Run the 1st query
        db.pool.query(getCustomerById, function(error, rows, fields){
            // Run the query
            return res.render("update_customers", {data: rows, active: { Customers: true} });
        });
    });


app.get('/insert_orders', function(req, res)
    {
        let query1 = "SELECT customer_id FROM Customers";
        let query2 = "SELECT album_id, album_name FROM Albums";

        db.pool.query(query1, function(error, rows, fields){
            db.pool.query(query2, function(error, rows2, fields){
                res.render('insert_orders', {data: rows, album: rows2});
            });
        });
    });

app.post('/add-order-ajax', function(req, res)
    {   

        // Capture the incoming data and parse it back to a JS object
        let data = req.body;

        // Capture NULL values
        let customerID = parseInt(data.customer_id);
        let albumIds = data.album_ids;
        let albumQuantities = data.quantities;

        // Query to get desired album price
        let albumPrice = `SELECT price FROM Albums WHERE album_id = ?`;

        // Query to get existing stock quantity of desired album
        let oldQuantity = `SELECT stock_qty FROM Albums WHERE album_id = ?`;

        // Running order total and insertion query command
        // var orderTotal = 0;
        let insertOrder;

        for (let i = 0; i < albumIds.length; i++) {
            db.pool.query(albumPrice, [albumIds[i]], function(error, rows, fields)
            {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    let price_Album = rows[0].price;

                    // Calculated Order Total = Album Price * stock quantity input
                    let calculatedTotal = price_Album * albumQuantities[i];
                    orderTotal = orderTotal + calculatedTotal;

                    db.pool.query(oldQuantity, [albumIds[i]], function(error, rows, fields){

                        let quantity_Old = rows[0].stock_qty;

                        // Adjusted stock quantity of album being ordered = Old Stock Quantity - Quantity Purchased
                        let newQuantity = quantity_Old - albumQuantities[i];

                        // Query to update stock quantity of desired album 
                        let updQuant = `UPDATE Albums SET stock_qty = '${newQuantity}' WHERE album_id = ${albumIds[i]}`;

                        db.pool.query(updQuant, function(error, rows, fields){
                            if (error) {
                                console.log(error);
                                res.sendStatus(400);
                            }
                            else
                            {
                                // Check to see if Order is being created or if it's total is to be updated in final query
                                if (i == 0){
                                    insertOrder = `INSERT INTO Orders (order_date, order_total, customer_id) VALUES (CURDATE(), '${orderTotal}', ${customerID})`;
                                }
                                else
                                {
                                    insertOrder = `UPDATE Orders SET order_total = '${orderTotal}' WHERE order_id = (SELECT max(order_id) FROM Orders)`;
                                }
                                console.log(insertOrder);
                                console.log(i);

                                db.pool.query(insertOrder, function(error, rows, fields){
                                    if (error) {
                                        console.log(error);
                                        res.sendStatus(400);
                                    };
                                });
                            };
                        });
                    });
                };
            });
        };
    });

app.get('/update_orders/:order_id', function(req, res)
    {
        var incomingId = req.params.order_id;
        let albums = `SELECT album_id AS 'Album ID' FROM Orders_has_Albums WHERE order_id = ${incomingId}`;

        if (incomingId >= 500)
        {
            let getOrderById = `SELECT order_id AS 'Order ID' , DATE_FORMAT(order_date, '%Y/%m/%d') AS 'Order Date', customer_id AS 'Customer ID' FROM Orders WHERE order_id = ${incomingId}`;
            
            db.pool.query(getOrderById, function(error, rows, fields){
                let data = rows;

                if (error) {
                    console.log(error);
                    res.send(400);
                } 
                else 
                {
                    db.pool.query(albums, function(error, rows, fields){

                        let order_albums = rows;

                        if (error) {
                            console.log(error);
                            res.send(400);
                        } 
                        else
                        {
                            res.render("update_orders", { data, order_albums, active: { Orders: true }});
                        };
                    });
                };
            });
        } 
        else
        {
            let getOrderId = `SELECT order_id FROM Orders_has_Albums WHERE Orders_Albums_id = ${incomingId}`;

            db.pool.query(getOrderId, function(error, rows, fields){

                if (error) {
                    console.log(error);
                    res.send(400);
                } 
                else 
                {
                    let orderID = rows[0].order_id;

                    let getOrderById = `SELECT DATE_FORMAT(order_date, '%Y/%m/%d') AS 'Order Date', customer_id AS 'Customer ID' FROM Orders WHERE order_id = ${orderID}`;

                    db.pool.query(getOrderById, function(error, rows, fields){

                        let data = rows;

                        if(error) {
                            console.log(error);
                            res.send(400);
                        }
                        else 
                        {
                            let albums = `SELECT album_id AS 'Album ID' FROM Orders_has_Albums WHERE order_id = ${orderID}`;
                            db.pool.query(albums, function(error, rows, fields){

                                let order_albums = rows;
        
                                if (error) {
                                    console.log(error);
                                    res.send(400);
                                } 
                                else
                                {
                                    res.render("update_orders", { data, order_albums, active: { Orders: true }});
                                };
                            });
                        };
                    });
                };
            });
        };
    });

app.post("/update_orders/:order_id", function(req,res)
    {   
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
        console.log();

        // Capture NULL values
        let order_id = parseInt(data.order_id);
        let order_date = parseInt(data.order_date);
        let order_total = parseFloat(data.order_total);
        let customer_id = parseInt(data.customer_id);

        if (isNaN(order_id))
        {
            order_id = 'NULL'
        }

        if (isNaN(order_date))
        {
            order_date = 'NULL'
        }

        if (isNaN(order_total))
        {
            order_total = 'NULL'
        }

        if (isNaN(customer_id))
        {
            customer_id = 'NULL'
        }

        updateOrder = `UPDATE Orders SET order_date = '${data.order_date}', order_total = '${data.order_total}'
        WHERE order_id = ${order_id}`;

        db.pool.query(updateOrder, function(error, result)
        {
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                console.log(result.affectedRows + ' record(s) updated');
            }
        });
    });

app.get('/insert_genres', function(req, res)
    {
        res.render('insert_genres');
    });


app.post('/add-genre-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
        console.log();
        
        // Capture NULL values
        let genre_name = parseInt(data.genre_name);
        if (isNaN(genre_name))
        {
            genre_name = 'NULL'
        }

    
        // Create the query and run it on the database
        query1 = `INSERT INTO Genres(genre_name) VALUES ('${data.genre_name}')`;
        db.pool.query(query1, function(error, rows, fields){
            // Check to see if there was an error
            if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
 
        })
    });

app.get("/update_genres/:genre_id", async(req, res) =>
    {
        var genreId = req.params.genre_id;
        let getGenreById = `SELECT genre_id, genre_name FROM Genres WHERE genre_id = ${genreId}`;
        db.pool.query(getGenreById, function(error, rows, fields){
            res.render("update_genres", { data: rows, active: { Genres: true } });

        });
    });


app.post("/update_genres/:genre_id", function(req,res)
    {   
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
        console.log();
        // Capture NULL values
        let genre_id = parseInt(data.genre_id);
        let genre_name = parseInt(data.genre_name);

        if (isNaN(genre_name))
        {
            genre_name = 'NULL'
        }
    
    
        updateGenre = `UPDATE Genres SET genre_name = '${data.genre_name}'
        WHERE genre_id = ${genre_id}`;

        db.pool.query(updateGenre, function(error, result)
        {
          if (error) {
            console.log(error);
            res.sendStatus(400);
          } else {
            console.log(result.affectedRows + ' record(s) updated');
          }
        });
    });


app.get('/insert_artists', function(req, res)
    {
        res.render('insert_artists');
    });


app.post('/add-artist-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
        console.log();
        // Capture NULL values
        let artist_name = parseInt(data.artist_name);
        if (isNaN(artist_name))
        {
            artist_name = 'NULL'
        }
    
        let country = parseInt(data.country);
        if (isNaN(country))
        {
            country = 'NULL'
        }
    
        // Create the query and run it on the database
        query1 = `INSERT INTO Artists(artist_name, country) VALUES ('${data.artist_name}', '${data.country}')`;
        db.pool.query(query1, function(error, rows, fields){

            console.log(JSON.stringify(rows));
            // Check to see if there was an error
            if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
 
        })
    });

app.post('/add-customer-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
        console.log();

        // Capture NULL values
        let first_name = parseInt(data.first_name);
        if (isNaN(first_name))
        {
            first_name = 'NULL'
        }

        let last_name = parseInt(data.last_name);
        if (isNaN(last_name))
        {
            last_name = 'NULL'
        }

        let email = parseInt(data.email);
        if (isNaN(email))
        {
            email = 'NULL'
        }

        let phone = parseInt(data.phone);
        if (isNaN(phone))
        {
            phone = 'NULL'
        }

        let address = parseInt(data.address);
        if (isNaN(address))
        {
            address = 'NULL'
        }

        // Create the query and run it on the database
        query1 = `INSERT INTO Customers(first_name, last_name, email, phone, address) VALUES ('${data.first_name}', '${data.last_name}', '${data.email}', '${data.phone}', '${data.address}')`;

        db.pool.query(query1, function(error, rows, fields){
            // Check to see if there was an error
            if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }

        })
    });

app.get("/update_artists/:artist_id", async(req, res) =>
    {
        var artistId = req.params.artist_id;
        let getArtistById = `SELECT artist_id, artist_name, country FROM Artists WHERE artist_id = ${artistId}`;
        
        db.pool.query(getArtistById, function(error, rows, fields){
            res.render("update_artists", { data: rows, active: { Artists: true } });

        });
    });


app.post("/update_artists/:artist_id", function(req,res)
    {   
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
        console.log();

        // Capture NULL values
        let artist_id = parseInt(data.artist_id);
        let artist_name = parseInt(data.artist_name);

        if (isNaN(artist_name))
        {
            artist_name = 'NULL'
        }
    
        let country = parseInt(data.country);
        if (isNaN(country))
        {
            country = 'NULL'
        }
    
        updateArtist = `UPDATE Artists SET artist_name = '${data.artist_name}', country = '${data.country}'
        WHERE artist_id = ${artist_id}`;

        db.pool.query(updateArtist, function(error, result)
        {
          if (error) {
            console.log(error);
            res.sendStatus(400);
          } else {
            console.log(result.affectedRows + ' record(s) updated');
          }
        });
    });

app.post("/update_customers/:customer_id", function(req,res)
    {   
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
        console.log();
        
        // Capture NULL values
        let customer_id = parseInt(data.customer_id);
        let fname = parseInt(data.fname);
        let lname = parseInt(data.lname);
        let email = parseInt(data.email);
        let phone = parseInt(data.phone);
        let address = parseInt(data.address);

        if (isNaN(customer_id))
        {
            customer_id = 'NULL'
        }
    
        if (isNaN(fname))
        {
            fname = 'NULL'
        }

        if (isNaN(lname))
        {
            lname = 'NULL'
        }

        if (isNaN(email))
        {
            email = 'NULL'
        }

        if (isNaN(phone))
        {
            phone = 'NULL'
        }

        if (isNaN(address))
        {
            address = 'NULL'
        }

        updateCustomer = `UPDATE Customers SET first_name = '${data.fname}', last_name = '${data.lname}', email = '${data.email}', phone = '${data.phone}', address = '${data.address}'
        WHERE customer_id = ${customer_id}`;

        db.pool.query(updateCustomer, function(error, result)
        {
          if (error) {
            console.log(error);
            res.sendStatus(400);
          } else {
            console.log(result.affectedRows + ' record(s) updated');
          }
        });
    });

app.get('/insert_albums', function(req, res)
    {
        let getArtist = `SELECT artist_id, artist_name FROM Artists`;
        let getGenre =  `SELECT genre_id, genre_name FROM Genres`;
        
        db.pool.query(getArtist, function(error, rows, fields){

            db.pool.query(getGenre, function(error, rows2, fields){

            res.render('insert_albums', { data: rows, genre: rows2});
            });
        });        
    });


app.post('/add-album-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;

        // Insert into albums table
        query1 = `
        INSERT INTO Albums(
            album_name, release_date, stock_qty, 
            price
          ) 
          VALUES 
            (
              '${data.album_name}', '${data.release_date}', 
              '${data.stock_qty}', '${data.price}'
            )          
        `;       
        db.pool.query(query1, function(error, rows, fields){
            // Check to see if there was an error
            if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            } else {
                // add a new relationship to Artists_has_albums
                query2 = `
                    INSERT INTO Artists_has_Albums(artist_id, album_id) 
                    VALUES 
                    ` + Array.from(
                        data.artist_id,
                        x => `(${x}, ${rows.insertId})`
                    ).join(", ");
                
                db.pool.query(query2, function(error, rows2, fields){
                    if (error) {

                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error)
                        res.sendStatus(400);
                    } else {
                        // add a new relationship to Genres_has_albums
                        query3 = `
                            INSERT INTO Genres_has_Albums(genre_id, album_id) 
                            VALUES 
                            ` + Array.from(
                                data.genre_id,
                                x => `(${x}, ${rows.insertId})`
                            ).join(", ");
                            
                        db.pool.query(query3, function(error, rows3, fields){
                            if (error) {
        
                                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                                console.log(error)
                                res.sendStatus(400);
                            }
                        })
                    }              
                })
            }   
        
 
        })
    });

app.get("/update_albums/:album_id", async(req, res) =>
    {
        var albumId = req.params.album_id;
        
        
        let getAlbumById = `SELECT album_id, album_name, DATE_FORMAT(release_date, '%Y/%m/%d') AS 'Release Date', stock_qty, price FROM Albums WHERE album_id = ${albumId}`;
        let getArtistByAlbumID = `SELECT Artists.artist_id, Artists.artist_name, Artists_has_Albums.Artists_Albums_id 
                FROM Artists 
                JOIN Artists_has_Albums ON Artists.artist_id = Artists_has_Albums.artist_id 
                WHERE Artists_has_Albums.album_id = ${albumId}`;
        let getGenresByAlbumID = `SELECT Genres.genre_id, Genres.genre_name, Genres_has_Albums.Genres_Albums_id 
                FROM Genres 
                JOIN Genres_has_Albums ON Genres.genre_id = Genres_has_Albums.genre_id 
                WHERE Genres_has_Albums.album_id = ${albumId}`;
        
        db.pool.query(getAlbumById, function(error, rows, fields){
            db.pool.query(getArtistByAlbumID, function(error, rows2, fields){
                db.pool.query(getGenresByAlbumID, function(error, rows3, fields){
            res.render("update_albums", { data: rows, currentArtist: rows2, currentGenre: rows3});

        });
    });
    });
    });


app.post("/update_albums/:album_id", function(req,res)
    {   
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
        console.log();

        // Capture NULL values
        let album_id = parseInt(data.album_id);
        let album_name = parseInt(data.album_name);
        let release_date = parseInt(data.release_date);
        let stock_qty = parseInt(data.stock_qty);
        let price = parseInt(data.price);


        updateAlbum = `UPDATE Albums SET album_name = '${data.album_name}', release_date = '${data.release_date}',  stock_qty = '${data.stock_qty}',  price = '${data.price}'
        WHERE album_id = ${album_id}`;


        db.pool.query(updateAlbum, function(error, result)
        {
          if (error) {
            console.log(error);
            res.sendStatus(400);
          } else {
            console.log(result.affectedRows + ' record(s) updated');
          }
        });
    });


app.get('/insert_artists_has_albums', function(req, res)
    {
        let getArtist = `SELECT artist_id, artist_name FROM Artists`;
        let getAlbum =  `SELECT album_id, album_name FROM Albums`;
        
        db.pool.query(getArtist, function(error, rows, fields){

            db.pool.query(getAlbum, function(error, rows2, fields){

            res.render('insert_artists_has_albums', { data: rows, album: rows2});
        });
    });
        
    });


app.post('/add-artists-has-albums-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
        let album_id = parseInt(data.album_id);

        // Insert into albums table
        query1 = `
        INSERT INTO Artists_has_Albums(artist_id, album_id) 
        VALUES 
        ` + Array.from(
            data.artist_id,
            x => `(${x}, ${album_id})`
        ).join(", ");     
        db.pool.query(query1, function(error, rows, fields){
            // Check to see if there was an error
            if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            } else {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
        });
    });



app.get('/insert_genres_has_albums', function(req, res)
    {
        let getGenre = `SELECT genre_id, genre_name FROM Genres`;
        let getAlbum =  `SELECT album_id, album_name FROM Albums`;
        
        db.pool.query(getGenre, function(error, rows, fields){

            db.pool.query(getAlbum, function(error, rows2, fields){

            res.render('insert_genres_has_albums', { data: rows, album: rows2});
        });
    });
        
    });

app.post('/add-genres-has-albums-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
        let album_id = parseInt(data.album_id);

        // Insert into albums table
        query1 = `
        INSERT INTO Genres_has_Albums(genre_id, album_id) 
        VALUES 
        ` + Array.from(
            data.genre_id,
            x => `(${x}, ${album_id})`
        ).join(", ");
        db.pool.query(query1, function(error, rows, fields){
            // Check to see if there was an error
            if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            } else {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
        });
    });



app.get('/insert_orders_has_albums', function(req, res)
    {
        let getOrder = `SELECT order_id, customer_id FROM Orders ORDER BY order_id`;
        let getAlbum =  `SELECT album_id, album_name FROM Albums`;
        
        db.pool.query(getOrder, function(error, rows, fields){

            db.pool.query(getAlbum, function(error, rows2, fields){

            res.render('insert_orders_has_albums', { data: rows, album: rows2});
        });
    });
        
    });

app.post('/add-orders-has-albums-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
        let order_id = parseInt(data.order_id);

        let albums = data.albums;

        // convert albums to a object that id is the key and qty is value
        let albums_ = Object.assign(
            {},
            ...albums.map(
                (x) => ({[x.albumID]: parseInt(x.qty)})
            )
        );

        // Query to get existing stock quantity of desired album
        queryQty = `SELECT album_id, stock_qty FROM Albums WHERE album_id IN
        `+ `(` + Array.from(
            albums,
            x=> x.albumID
        ).join(", ") + `)`;

        // Query to check if the quantity exceeds the stock, if yes, return, else continue
        db.pool.query(queryQty, function(error, rows, fields){
            for (row of rows) {
                if (row.stock_qty < albums_[row.album_id]) {
                    console.log(row.album_id, row.stock_qty)
                    res.sendStatus(400);
                    return;
                }}});

        // update the quantity
        let remain_qty = row.stock_qty - albums_[row.album_id]
        queryQtyUpdate = `UPDATE Albums SET stock_qty = ${remain_qty} WHERE album_id = ${row.album_id}`;
        db.pool.query(queryQtyUpdate, function(error, rows, fields){
        
        // Insert into Orders_has_Albums table
        query1 = `
        INSERT INTO Orders_has_Albums(order_id, album_id, quantity) 
        VALUES 
        ` + Array.from(
            albums,
            x=> `(${order_id}, ${x.albumID}, ${x.qty})`
        ).join(", ");
        
        db.pool.query(query1, function(error, rows, fields){
            // Check to see if there was an error
            if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            } else {
                // update line_total
                query2 = `UPDATE Orders_has_Albums 
                INNER JOIN Albums ON Albums.album_id = Orders_has_Albums.album_id 
                SET Orders_has_Albums.line_total = Orders_has_Albums.quantity * Albums.price`;

                db.pool.query(query2, function(error, rows, fields){
                    // Check to see if there was an error
                    if (error) {

                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error)
                        res.sendStatus(400);
                    } else {
                        // update order total
                        query3 = `UPDATE Orders SET Orders.order_total = (SELECT SUM(Orders_has_Albums.line_total) 
                        FROM Orders_has_Albums
                        WHERE Orders_has_Albums.order_id = Orders.order_id)`;
                            
                        db.pool.query(query3, function(error, rows3, fields){
                            if (error) {
        
                                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                                console.log(error)
                                res.sendStatus(400);
                                }
                            });
                        }              
                    });
                }   
    
            });
        });
    });




app.delete('/delete-artist-ajax/', function(req,res,next)
    {
        let data = req.body;
        let artistID = parseInt(data.artist_id);
        let deleteArtists_has_Albums = `DELETE FROM Artists_has_Albums WHERE artist_id = ?`;
        let deleteArtists = `DELETE FROM Artists WHERE artist_id = ?`;

        // Run the 1st query
        db.pool.query(deleteArtists_has_Albums, [artistID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            else
            {
                // Run the second query
                db.pool.query(deleteArtists, [artistID], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                    }
                })
            }
    })});
 
app.delete('/delete-customer-ajax/', function(req,res,next)
    {
        let data = req.body;
        let customerID = parseInt(data.customer_id);
        let deleteCustomers = `DELETE FROM Customers WHERE customer_id = ?`;

        // Run the 1st query
        db.pool.query(deleteCustomers, [customerID], function(error, rows, fields){
            if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            }
            else
            {
                res.sendStatus(204);
            }
    })});

app.delete('/delete-order-ajax/', function(req,res,next)
    {
        let data = req.body;
        let orderID = parseInt(data.order_id);
        let deleteOrders_has_Albums = `DELETE FROM Orders_has_Albums WHERE order_id = ?`;
        let deleteOrders = `DELETE FROM Orders WHERE order_id = ?`;

        // Run the 1st query
        db.pool.query(deleteOrders_has_Albums, [orderID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            else
            {
                // Run the second query
                db.pool.query(deleteOrders, [orderID], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                    }
                })
            }
    })});


app.delete('/delete-genre-ajax/', function(req,res,next)
    {
        let data = req.body;
        let genreID = parseInt(data.genre_id);
        let deleteGenres_has_Albums = `DELETE FROM Genres_has_Albums WHERE genre_id = ?`;
        let deleteGenres = `DELETE FROM Genres WHERE genre_id = ?`;

        // Run the 1st query
        db.pool.query(deleteGenres_has_Albums, [genreID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            else
            {
                // Run the second query
                db.pool.query(deleteGenres, [genreID], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                    }
                })
            }
    })});


app.delete('/delete-album-ajax/', function(req,res,next)
    {
        let data = req.body;
        let albumID = parseInt(data.album_id);
        let deleteGenres_has_Albums = `DELETE FROM Genres_has_Albums WHERE album_id = ?`;
        let deleteArtists_has_Albums = `DELETE FROM Artists_has_Albums WHERE album_id = ?`;
        let deleteAlbums = `DELETE FROM Albums WHERE album_id = ?`;

        // Run the 1st query
        db.pool.query(deleteGenres_has_Albums, [albumID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            else
            {
                // Run the second query
                db.pool.query(deleteArtists_has_Albums, [albumID], function(error, rows, fields){
                    if (error) {
        
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                    }
        
                    else
                    {       
                        // run the third query    
                        db.pool.query(deleteAlbums, [albumID], function(error, rows, fields) {

                            if (error) {
                                console.log(error);
                                res.sendStatus(400);
                            } else {
                                res.sendStatus(204);
                            }
                        })
                    }    
                })
            }
    })});


app.delete('/delete-artists-has-albums-ajax/', function(req,res,next)
    {
        let data = req.body;
        let artists_has_albumsID = parseInt(data.Artists_Albums_id);
        let deleteArtists_has_Albums = `DELETE FROM Artists_has_Albums WHERE Artists_Albums_id = ?`;


        // Run the 1st query
        db.pool.query(deleteArtists_has_Albums, [artists_has_albumsID], function(error, rows, fields){
            if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            }
            else
            {
                res.sendStatus(204);
            }
    })});



app.delete('/delete-genres-has-albums-ajax/', function(req,res,next)
    {
        let data = req.body;
        let genres_has_albumsID = parseInt(data.Genres_Albums_id);
        let deleteGenres_has_Albums = `DELETE FROM Genres_has_Albums WHERE Genres_Albums_id = ?`;


        // Run the 1st query
        db.pool.query(deleteGenres_has_Albums, [genres_has_albumsID], function(error, rows, fields){
            if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            }
            else
            {
                res.sendStatus(204);
            }
    })});


app.delete('/delete-orders-has-albums-ajax/', function(req,res,next)
    {
        let data = req.body;
        let orders_has_albumsID = parseInt(data.Orders_Albums_id);
        let deleteOrders_has_Albums = `DELETE FROM Orders_has_Albums WHERE Orders_Albums_id = ?`;


        // Run the 1st query
        db.pool.query(deleteOrders_has_Albums, [orders_has_albumsID], function(error, rows, fields){
            if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            }
            else
            {
                res.sendStatus(204);
            }
        });
    });




/*
    LISTENER
*/
app.listen(PORT, function()
    {
        console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
    });
