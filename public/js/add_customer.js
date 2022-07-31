// Get the objects we need to modify
let addCustomerForm = document.getElementById('addCustomer');

// Modify the objects we need
addCustomerForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFirstName = document.getElementById("fname");
    let inputLastName = document.getElementById("lname");
    let inputEmail = document.getElementById("email");
    let inputPhone = document.getElementById("phone");
    let inputAddress = document.getElementById("address");

    // Get the values from the form fields
    let FirstNameValue = inputFirstName.value;
    let LastNameValue = inputLastName.value;
    let EmailValue = inputEmail.value;
    let PhoneValue = inputPhone.value;
    let AddressValue = inputAddress.value;

    // Put our data we want to send in a javascript object
    let data = {
        first_name: FirstNameValue,
        last_name: LastNameValue,
        email: EmailValue,
        phone: PhoneValue,
        address: AddressValue
    }
    console.log(JSON.stringify(data));
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-customer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 3 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputFirstName.value = '';
            inputLastName.value = '';
            inputEmail.value = '';
            inputPhone.value = '';
            inputAddress.value = '';
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
    let currentTable =  document.getElementById("customers-table").innerHTML="/customers";

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 6 cells
    let row = document.createElement("TR");
    let deleteCell = document.createElement("TD"); 
    let idCell = document.createElement("TD");
    let first_nameCell = document.createElement("TD");
    let last_nameCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let phoneCell = document.createElement("TD");
    let addressCell = document.createElement("TD");

    // Fill the cells with correct data
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePerson(newRow.id);
    };
    
    idCell.innerText = newRow.customer_id;
    first_nameCell.innerText = newRow.first_name;
    last_nameCell.innerText = newRow.last_name;
    emailCell.innerText = newRow.email;
    phoneCell.innerText = newRow.phone;
    addressCell.innerText = newRow.address;

    // Add the cells to the row 
    row.appendChild(deleteCell)
    row.appendChild(idCell);
    row.appendChild(first_nameCell);
    row.appendChild(last_nameCell);
    row.appendChild(emailCell);
    row.appendChild(phoneCell);
    row.appendChild(addressCell);

     // Add a row attribute so the deleteRow function can find a newly added row
     row.setAttribute('data-value', newRow.id);


    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("last_name");
    let option = document.createElement("option");
    option.text = newRow.last_name;
    option.value = newRow.customer_id;
    selectMenu.add(option);

}