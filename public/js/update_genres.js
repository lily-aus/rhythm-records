
// Get the objects we need to modify
let updateGenreForm = document.getElementById('update-genre-form-ajax');

// Modify the objects we need
updateGenreForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputGenreId = document.getElementById("mySelect");
    let inputGenreName = document.getElementById("input-genre_name-update");

    // Get the values from the form fields
    let genreIDValue = inputGenreId.value;
    let genreNameValue = inputGenreName.value;
    
    // currently the database table for genres does not allow updating values to NULL
    // so we must abort if being passed NULL

    // if (isNaN(genreIDValue)) 
    // {
    //     return;
    // }

    // if (isNaN(genreNameValue)) 
    // {
    //     return;
    // }

    // Put our data we want to send in a javascript object
    let data = {
        genreid: genreIDValue,
        genrename: genreNameValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-genre-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, genreNameValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, new_name){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("genre-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == new_name) {

            // Get the location of the row where we found the matching Genre ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of genre name value
            let td = updateRowIndex.getElementsByTagName("td")[1];
            
            // Reassign genre name to our value we updated to
            td.innerHTML = parsedData[0].new_name; 
       }
    }
}
