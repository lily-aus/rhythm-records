// Get the objects we need to modify
let addGenreForm = document.getElementById('addGenre');

// Modify the objects we need
addGenreForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("gname");


    // Get the values from the form fields
    let NameValue = inputName.value;


    // Put our data we want to send in a javascript object
    let data = {
        genre_name: NameValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-genre-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 2 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputName.value = '';
        }
        else if (xhttp.readyState == 2 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable =  document.getElementById("genres-table").innerHTML="/genres";

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


    // Fill the cells with correct data
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePerson(newRow.id);
    };
    
    idCell.innerText = newRow.genre_id;
    nameCell.innerText = newRow.genre_name;


    // Add the cells to the row 
    row.appendChild(deleteCell)
    row.appendChild(idCell);
    row.appendChild(nameCell);

     // Add a row attribute so the deleteRow function can find a newly added row
     row.setAttribute('data-value', newRow.id);


    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("genre_name");
    let option = document.createElement("option");
    option.text = newRow.genre_name;
    option.value = newRow.genre_id;
    selectMenu.add(option);
    
}