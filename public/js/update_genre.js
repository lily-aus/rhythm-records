// Get the objects we need to modify
let updateGenreForm = document.getElementById('updateGenre');

// Modify the objects we need
updateGenreForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputId = document.getElementById("genre_id");
    let inputName = document.getElementById("gname");

    // Get the values from the form fields
    let GenreID = inputId.text;
    let NameValue = inputName.value;

    // Put our data we want to send in a javascript object
    let data = {
        genre_id: GenreID,
        genre_name: NameValue
    }
    console.log(data)
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/update_genres/" + GenreID, true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})
