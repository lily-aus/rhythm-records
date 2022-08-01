// Get the objects we need to modify
let addAlbumForm = document.getElementById('addAlbum');

// Modify the objects we need
addAlbumForm.addEventListener("submit", function (e) {
    
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



    // Put our data we want to send in a javascript object
    let data = {
        album_name: NameValue,
        release_date: DateValue,
        stock_qty: QtyValue,
        price: PriceValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-album-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 5 && xhttp.status == 200) {

            // Add the new data to the table
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