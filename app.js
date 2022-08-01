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

PORT = 34860;

// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
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
        let query1 = "SELECT order_id AS 'Order ID',  DATE_FORMAT(order_date, '%M %d %Y') AS 'Order Date', order_total AS 'Order Total', customer_id AS 'Customer ID' FROM Orders;";

        // Query 2 for dropdown menu customer IDs
        let query2 = "SELECT customer_id FROM Customers;";

        if (req.query.custo_id)
        {
            query1 = `SELECT order_id AS 'Order ID',  DATE_FORMAT(order_date, '%M %d %Y') AS 'Order Date', order_total AS 'Order Total', customer_id AS 'Customer ID' FROM Orders WHERE customer_id = "${req.query.custo_id}%"`
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
        let query1 = "SELECT * FROM Artists;";

        db.pool.query(query1, function(error, rows, fields){
            res.render('artists',{data: rows});                                      
        })
    
    });  

app.get('/albums', function(req, res)
    {
        res.render('albums');
    });

app.get('/genres', function(req, res)
    {
        let query1 = "SELECT * FROM Genres";

        db.pool.query(query1, function(error, rows, fields){
            res.render('genres', {data: rows});
        });
    });

app.get('/genres_has_albums', function(req, res)
    {
        res.render('genres_has_albums');
    });

app.get('/artists_has_albums', function(req, res)
    {
        res.render('artists_has_albums');
    });

app.get('/orders_has_albums', function(req, res)
    {
        let query1 = "SELECT * FROM Orders_has_Albums";

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
        var context_1 = {};
        let query1 = "SELECT customer_id FROM Customers";

        db.pool.query(query1, function(error, rows, fields){
            context_1.res = rows;
            var customer_ids = [];

            for (var i = 0; i < rows.length; i++){
                customer_ids.push(rows[i]["customer_id"]);
            };

            res.render('insert_orders', {customer_ids: customer_ids});
        });

    });

app.post('/add-order-ajax', function(req, res)
    {   

        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
        console.log(JSON.stringify(data));

        // Capture NULL values
        let customerID = parseInt(data.customer_id);
        let albumName = parseInt(data.album_name);
        let buyQuantity = parseInt(data.quantity);

        console.log(albumName);

        if (isNaN(customerID))
        {
            customerID = 'NULL'
        }

        if (isNaN(albumName))
        {
            albumName = 'NULL'
        }

        if (isNaN(buyQuantity))
        {
            buyQuantity = 'NULL'
        }

        // Get date for the order (today's date)
        let today = new Date().toDateString();

        // Calculated Order Total = Album Price * stock quantity input
        var calculatedTotal;

        // Adjusted stock quantity of album being ordered = Old Stock Quantity - Quantity Purchased
        var newQuantity;

        // Query to get desired album price
        let albumPrice = `SELECT price FROM Albums WHERE album_name = ${albumName}`;

        // Query to get existing stock quantity of desired album
        let oldQuantity = `SELECT stock_qty FROM Albums WHERE album_name = ${albumName}`;

        // Query to update stock quantity of desired album 
        let updQuant = `INSERT INTO Albums (stock_qty) VALUES (${newQuantity})`;

        // Query to finally add new order
        let insertOrder = `INSERT INTO Orders (order_date, order_total, customer_id) VALUES ('${today}', '${calculatedTotal}', ${customerID})`;
        
        db.pool.query(albumPrice, function(error, rows, fields){

            // calculatedTotal = [Result of albumPrice query] * buyQuantity;
            calculatedTotal = rows[0] * buyQuantity;

            db.pool.query(oldQuantity, function(error, rows, fields){

                // newQuantity = [Result of oldQuantity query] - buyQuantity;
                newQuantity = rows[0] - buyQuantity;

                db.pool.query(updQuant, function(error, rows, fields){
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    }
                    else{
                        db.pool.query(insertOrder, function(error, rows, fields){
                            if (error) {
                                console.log(error);
                                res.sendStatus(400);
                            }
    
                            else
                            {
                                db.pool.query(insertOrder, function(error, rows, fields){
                                    
                                    if (error){
                                        console.log(error);
                                        res.sendStatus(400);
                                    }
                                });
                            };
                        });
                    };
                });
            });
        });
    });

app.get('/update_orders/:order_id', function(req, res)
    {
        
        var orderId = req.params.order_id;
        let getOrderById = `SELECT order_id, DATE_FORMAT(order_date, '%M %d %Y') AS order_date, order_total, customer_id FROM Orders WHERE order_id = ${orderId}`;

        db.pool.query(getOrderById, function(error, rows, fields){
            res.render("update_orders", { data: rows, active: { Orders: true } });
        });
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

app.get('/update_genres', function(req, res)
    {
        var context_1 = {};
        var context_2 = {};

        query1 = "SELECT genre_id FROM Genres";
        query2 = "SELECT genre_name FROM Genres";

        db.pool.query(query1, function(err, rows, fields){
            context_1.res = rows;
            var genre_ids = [];

            for (var i = 0; i < rows.length; i++){
                genre_ids.push(rows[i]["genre_id"]);
            }

            db.pool.query(query2, function(err, rows, fields){
                context_2.res = rows;
                var genre_names = [];
    
                for (var i = 0; i < rows.length; i++){
                    genre_names.push(rows[i]["genre_name"]);
                }
                res.render('update_genres', {genre_names:genre_names, genre_ids:genre_ids});
            });
        });
    });

app.put('/put-genre-ajax', function(req,res,next)
    {
        let data = req.body;
        
        let genre_id = parseInt(data.genreid);
        let genre_name = parseInt(data.genrename);
        
        let queryUpdateGenres = `UPDATE Genres SET genre_name = ? WHERE genre_id = ?`;
        let selectGenres = `SELECT * FROM Genres WHERE genre_id = ?`
        
        // Run the 1st query
        db.pool.query(queryUpdateGenres, [genre_name, genre_id], function(error, rows, fields){
            if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update the gnere
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(selectGenres, [genre_name], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                });
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
        res.render('insert_albums');
    });

app.get('/update_albums', function(req, res)
    {
        res.render('update_albums');
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

/*
    LISTENER
*/
app.listen(PORT, function()
    {
        console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
    });
