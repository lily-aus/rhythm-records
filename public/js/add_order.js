// THE BELOW CODE IS CURRENTLY NON-FUNCTIONAL, AND BUG UNKNOWN

// Get the objects we need to modify
let addOrderForm = document.getElementById('addOrder');

// Modify the objects we need
addOrderForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCustomerID = document.getElementById("customer_id");
    let inputAlbumName = document.getElementById("album_name");
    let inputQuantity = document.getElementById("quantity");

    // Get the values from the form fields
    let CustomerIDValue = inputCustomerID.value;
    let AlbumNameValue = inputAlbumName.value;
    let QuantityValue = inputQuantity.value;

    // Put our data we want to send in a javascript object
    let data = {
        customer_id: CustomerIDValue,
        album_name: AlbumNameValue,
        quantity: QuantityValue,
    }
    console.log(JSON.stringify(data));

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        console.log(xhttp.status);

        if (xhttp.readyState == 3 && xhttp.status == 200) {
            
            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputAlbumName.value = '';
            inputQuantity.value = '';
            inputCustomerID.value = '';
            
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
    console.log("hello")
    // Get a reference to the current table on the page and clear it out.
    let currentTable =  document.getElementById("orders-table").innerHTML="/orders";

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let deleteCell = document.createElement("TD"); 
    let idCell = document.createElement("TD");
    let orderDateCell = document.createElement("TD");
    let orderTotalCell = document.createElement("TD");
    let customerIdCell = document.createElement("TD");

    // Fill the cells with correct data
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePerson(newRow.id);
    };
    
    // var order_total = data.line_price * data.quantity;
    // console.log(data[0].value);
    // console.log(parsedData[0].value);
    
    console.log(parsedData.success);

    idCell.innerText = newRow.order_id;
    orderDateCell.innerText = newRow.order_date;
    orderTotalCell.innerText = newRow.order_total;
    customerIdCell.innerText = newRow.customer_id;

    // Add the cells to the row 
    row.appendChild(deleteCell)
    row.appendChild(idCell);
    row.appendChild(orderDateCell);
    row.appendChild(orderTotalCell);
    row.appendChild(customerIdCell);

     // Add a row attribute so the deleteRow function can find a newly added row
     row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("order_id");
    let option = document.createElement("option");
    option.text = newRow.order_id;
    option.value = newRow.order_id;
    selectMenu.add(option);

}