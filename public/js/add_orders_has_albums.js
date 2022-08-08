// Get the objects we need to modify
// let addAlbumsToOrder = document.getElementById('addAlbumsToOrder');
let submitForm = document.getElementById('submitForm');

function addMoreAlbum() {

    // Get a reference to the current table on the page and clear it out.
    let currentTable =  document.getElementById("addAlbum-table");

    // Get the value of the variable
    let albumSelect = document.getElementById("albumSelect")
    let album = albumSelect.options[albumSelect.selectedIndex];
    let albumName = album.innerText;
    let albumId = album.getAttribute("album_id");

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let qtyCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = albumId;
    nameCell.innerText = albumName;
    let input = document.createElement("input");
    input.type= "number";
    input.step =1;
    qtyCell.appendChild(input);


    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(qtyCell);


    // Add the row to the table
    currentTable.querySelector("tbody").appendChild(row);

    //delete the selected one from dropdown list
    let selectElement = document.getElementById("albumSelect");
    for (child of selectElement.children) {
        if (child.innerText==albumName) {
            child.parentNode.removeChild(child);
            break;
        }
    }
}



// Modify the objects we need
function addAlbumsToOrder() {
    
    // Prevent the form from submitting
    // e.preventDefault();

    // Get form fields we need to get data from
    let orderSelect = document.getElementById("orderSelect");
    let order = orderSelect.options[orderSelect.selectedIndex];
    let orderId = order.innerText;
    let customerId = order.getAttribute("customer_id");
    let addAlbumTable = document.getElementById("addAlbum-table");

    // create an empty list
    let allAlbums = [];

    for (row of addAlbumTable.querySelectorAll("tbody > tr")) {
        tds = row.querySelectorAll("td");
        let AlbumId = tds[0].innerText;
        let qty = tds[2].firstChild.value;
        allAlbums.push({"albumID": AlbumId, "qty": qty});
    };



    // Put our data we want to send in a javascript object
    let data = {
        order_id: orderId,
        albums: allAlbums
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "add-orders-has-albums-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.status == 400) {
            alert("The quantity exceeds the stock! Please choose again.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

    location.replace="/orders_has_albums";
    // document.location.href = '/orders_has_albums';
}
