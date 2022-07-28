/*
    SETUP
*/

// Express
var express = require('express');
var app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

PORT = 34853;
app.use(express.static('public'))

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
        res.render('customers');
    });

app.get('/orders', function(req, res)
    {
        res.render('orders');
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
        res.render('genres');
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

app.get('/update_customers', function(req, res)
    {
        res.render('update_customers');
    });

app.get('/insert_orders', function(req, res)
    {   
        var context = {};

        query1 = "SELECT customer_id FROM Customers";

        db.pool.query(query1, function(err, rows, fields){
            context.res = rows;
            var customer_ids = [];

            for (var i = 0; i < rows.length; i++){
                customer_ids.push(rows[i]["customer_id"]);
            }
            res.render('insert_orders', {customer_ids:customer_ids});
        });
    });

app.get('/update_orders', function(req, res)
    {
        res.render('update_orders');
    });

app.get('/insert_genres', function(req, res)
    {
        res.render('insert_genres');
    });

app.get('/update_genres', function(req, res)
    {
        res.render('update_genres');
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

app.get('/update_artists', function(req, res)
    {
        res.render('update_artists');
    });

app.get('/insert_albums', function(req, res)
    {
        res.render('insert_albums');
    });

app.get('/update_albums', function(req, res)
    {
        res.render('update_albums');
    });
/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});