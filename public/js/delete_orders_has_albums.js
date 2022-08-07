function deleteOrdersHasAlbums(orders_has_albumsID) {
    let link = '/delete-orders-has-albums-ajax/';
    let data = {
        Orders_Albums_id: orders_has_albumsID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(orders_has_albumsID);
        location.reload();
      }
    });

  }
  
  function deleteRow(orders_has_albumsID){
      let table = document.getElementById("orders-albums-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == orders_has_albumsID) {
              table.deleteRow(i);
              break;
         }
      }
  }