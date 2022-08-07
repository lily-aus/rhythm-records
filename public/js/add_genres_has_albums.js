// Get the objects we need to modify
let addGenresToAlbum = document.getElementById('addGenresToAlbum');
let submitForm = document.getElementById('submitForm');

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
    let albumSelect = document.getElementById("albumSelect");
    let album = albumSelect.options[albumSelect.selectedIndex];
    let albumName = album.innerText;
    let albumId = album.getAttribute("album_id");
    
    var GenretableInfo = Array.prototype.map.call(document.querySelectorAll('#addGenre-table tbody tr'), function(tr){
        return tr.querySelector("td").innerText;
        });

    let GenreValue = GenretableInfo;

    // Put our data we want to send in a javascript object
    let data = {
        album_id: albumId,
        genre_id: GenreValue

    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "add-genres-has-albums-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})
