// Get the objects we need to modify
let updateCustomerForm = document.getElementById('updateCustomer');

// Modify the objects we need
updateCustomerForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputId = document.getElementById("customer_id");
    let inputFName = document.getElementById("fname");
    let inputLName = document.getElementById("lname");
    let inputEmail = document.getElementById("email");
    let inputPhone = document.getElementById("phone");
    let inputAddress = document.getElementById("address");

    // Get the values from the form fields
    let CustomerID = inputId.text;
    let FNameValue = inputFName.value;
    let LNameValue = inputLName.value;
    let EmailValue = inputEmail.value;
    let PhoneValue = inputPhone.value;
    let AddressValue = inputAddress.value;

    // Put our data we want to send in a javascript object
    let data = {
        customer_id: CustomerID,
        fname: FNameValue,
        lname: LNameValue,
        email: EmailValue,
        phone: PhoneValue,
        address: AddressValue
    }
    console.log(data)

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/update_customers/" + CustomerID, true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})
