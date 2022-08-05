// Get the objects we need to modify
let addAlbumForm = document.getElementById('addAlbum');
let addArtist = document.getElementById('addArtist');
let addGenre = document.getElementById('addGenre');
let submitForm = document.getElementById('submitForm');

function addMoreArtist() {

    // Get a reference to the current table on the page and clear it out.
    let currentTable =  document.getElementById("addArtist-table");

    // Get the value of the variable
    let artistSelect = document.getElementById("artistSelect")
    let artist = artistSelect.options[artistSelect.selectedIndex];
    let artistName = artist.innerText;
    let artistId = artist.getAttribute("artist_id");

    // Create a row and 2 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = artistId;
    nameCell.innerText = artistName;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(nameCell);

    // Add the row to the table
    currentTable.querySelector("tbody").appendChild(row);

    //delete the selected one from dropdown list
    let selectElement = document.getElementById("artistSelect");
    for (child of selectElement.children) {
        if (child.innerText==artistName) {
            child.parentNode.removeChild(child);
            break;
        }
    }
}


function addMoreGenre() {

    // Get a reference to the current table on the page and clear it out.
    let currentTable =  document.getElementById("addGenre-table");

    // Get the value of the variable
    let genreSelect = document.getElementById("genreSelect")
    let genre = genreSelect.options[genreSelect.selectedIndex];
    let genreName = genre.innerText;
    let genreId = genre.getAttribute("genre_id");

    // Create a row and 2 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = genreId;
    nameCell.innerText = genreName;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(nameCell);

    // Add the row to the table
    currentTable.querySelector("tbody").appendChild(row);

    //delete the selected one from dropdown list
    let selectElement = document.getElementById("genreSelect");
    for (child of selectElement.children) {
        if (child.innerText==genreName) {
            child.parentNode.removeChild(child);
            break;
        }
    }
}


// Modify the objects we need
submitForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("alname");
    let inputDate = document.getElementById("date");
    let inputQty = document.getElementById("qty");
    let inputPrice = document.getElementById("price");


    // Get the values from the form fields
    let NameValue = inputName.value;
    let DateValue = inputDate.value;
    let QtyValue = inputQty.value;
    let PriceValue = inputPrice.value;
    
    var ArtisttableInfo = Array.prototype.map.call(document.querySelectorAll('#addArtist-table tbody tr'), function(tr){
        return tr.querySelector("td").innerText;
        });

    let ArtistValue = ArtisttableInfo;

    var GenretableInfo = Array.prototype.map.call(document.querySelectorAll('#addGenre-table tbody tr'), function(tr){
        return tr.querySelector("td").innerText;
        });

    let GenreValue = GenretableInfo;




    // Put our data we want to send in a javascript object
    let data = {
        album_name: NameValue,
        release_date: DateValue,
        stock_qty: QtyValue,
        price: PriceValue,
        artist_id: ArtistValue,
        genre_id: GenreValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-album-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 5 && xhttp.status == 200) {

            // Add the new data to the table Albums
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputName.value = '';
            inputDate.value = '';
            inputQty.value = '';
            inputpr.value = '';

        }
        else if (xhttp.readyState == 5 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable =  document.getElementById("albums-table").innerHTML="/albums";

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let deleteCell = document.createElement("TD"); 
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let dateCell = document.createElement("TD");
    let qtyCell = document.createElement("TD");
    let priceCell = document.createElement("TD");

    // Fill the cells with correct data
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePerson(newRow.id);
    };
    
    idCell.innerText = newRow.album_id;
    nameCell.innerText = newRow.album_name;
    dateCell.innerText = newRow.release_date;
    qtyCell.innerText = newRow.stock_qty;
    priceCell.innerText = newRow.price;

    // Add the cells to the row 
    row.appendChild(deleteCell)
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(dateCell);
    row.appendChild(qtyCell);
    row.appendChild(priceCell);

     // Add a row attribute so the deleteRow function can find a newly added row
     row.setAttribute('data-value', newRow.id);


    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("album_name");
    let option = document.createElement("option");
    option.text = newRow.album_name;
    option.value = newRow.album_id;
    selectMenu.add(option);
    
}