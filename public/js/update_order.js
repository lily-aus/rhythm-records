// Get the objects we need to modify
let updateOrderForm = document.getElementById('updateOrder');

// Modify the objects we need
updateOrderForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOrderId = document.getElementById("order_id");
    let inputOrderDate = document.getElementById("order_date");
    let inputOrderTotal = document.getElementById("order_total");
    let inputCustomerId = document.getElementById("customer_id");

    // Get the values from the form fields
    let OrderID = inputOrderId.text;
    let OrderDate = inputOrderDate.value;
    let OrderTotal = inputOrderTotal.value;
    let CustomerID = inputCustomerId.value;

    // Put our data we want to send in a javascript object
    let data = {
        order_id: OrderID,
        order_date: OrderDate,
        order_total: OrderTotal,
        customer_id: CustomerID
    }
    console.log(data)
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/update_orders/" + OrderID, true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})
