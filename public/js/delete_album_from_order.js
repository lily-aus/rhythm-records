function deleteAlbumFromOrder(order_albumID, orders_has_albumsID) {
    let link = '/delete-albums-from-orders-ajax/';
    let data = {
        Orders_Albums_id: order_albumID, // Album ID
        Orders_Has_Albums_id: orders_has_albumsID // Order ID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(order_albumID);
        location.reload();
      }
    });

  }
  
  function deleteRow(order_albumID){
      let table = document.getElementById("updateOrder-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == order_albumID) {
              table.deleteRow(i);
              break;
         }
      }
  }