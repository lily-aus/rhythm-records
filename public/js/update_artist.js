// Get the objects we need to modify
let updateArtistForm = document.getElementById('updateArtist');

// Modify the objects we need
updateArtistForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputId = document.getElementById("artist_id");
    let inputName = document.getElementById("arname");
    let inputCountry = document.getElementById("country");

    // Get the values from the form fields
    let ArtistID = inputId.text;
    let NameValue = inputName.value;
    let CountryValue = inputCountry.value;

    // Put our data we want to send in a javascript object
    let data = {
        artist_id: ArtistID,
        artist_name: NameValue,
        country: CountryValue
    }
    console.log(data)
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/update_artists/" + ArtistID, true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})
