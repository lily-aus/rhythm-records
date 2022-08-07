// Get the objects we need to modify
let updateAlbumForm = document.getElementById('updateAlbum');
let submitForm = document.getElementById('submitForm');

// Modify the objects we need
submitForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputId = document.getElementById("album_id");
    let inputName = document.getElementById("alname");
    let inputDate = document.getElementById("release_date");
    let inputQuantity = document.getElementById("stock_qty");
    let inputPrice = document.getElementById("price");
    
    // Get the values from the form fields
    let AlbumID = inputId.text;
    let NameValue = inputName.value;
    let DateValue = inputDate.value;
    let QuantityValue = inputQuantity.value;
    let priceValue = inputPrice.value;

    // Put our data we want to send in a javascript object
    let data = {
        album_id: AlbumID,
        album_name: NameValue,
        release_date: DateValue,
        stock_qty: QuantityValue,
        price: priceValue
    }
    console.log(data)
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/update_albums/" + AlbumID, true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})
