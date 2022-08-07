// Get the objects we need to modify
let addArtistsToAlbum = document.getElementById('addArtistsToAlbum');
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



// Modify the objects we need
submitForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let albumSelect = document.getElementById("albumSelect");
    let album = albumSelect.options[albumSelect.selectedIndex];
    let albumName = album.innerText;
    let albumId = album.getAttribute("album_id");
    
    var ArtisttableInfo = Array.prototype.map.call(document.querySelectorAll('#addArtist-table tbody tr'), function(tr){
        return tr.querySelector("td").innerText;
        });

    let ArtistValue = ArtisttableInfo;



    // Put our data we want to send in a javascript object
    let data = {
        album_id: albumId,
        artist_id: ArtistValue

    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "add-artists-has-albums-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})
