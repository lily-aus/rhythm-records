// Get the objects we need to modify
let addArtistForm = document.getElementById('addArtist');

// Modify the objects we need
addArtistForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("arname");
    let inputCountry = document.getElementById("country");


    // Get the values from the form fields
    let NameValue = inputName.value;
    let CountryValue = inputCountry.value;

    // Put our data we want to send in a javascript object
    let data = {
        artist_name: NameValue,
        country: CountryValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-artist-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 3 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputName.value = '';
            inputCountry.value = '';
        }
        else if (xhttp.readyState == 3 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable =  document.getElementById("artists-table").innerHTML="/artists";

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 3 cells
    let row = document.createElement("TR");
    let deleteCell = document.createElement("TD"); 
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let countryCell = document.createElement("TD");

    // Fill the cells with correct data
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePerson(newRow.id);
    };
    
    idCell.innerText = newRow.artist_id;
    nameCell.innerText = newRow.artist_name;
    countryCell.innerText = newRow.country;

    // Add the cells to the row 
    row.appendChild(deleteCell)
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(countryCell);

     // Add a row attribute so the deleteRow function can find a newly added row
     row.setAttribute('data-value', newRow.id);


    // Add the row to the table
    currentTable.appendChild(row);
}