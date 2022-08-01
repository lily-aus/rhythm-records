function deleteAlbum(albumID) {
    let link = '/delete-album-ajax/';
    let data = {
      album_id: albumID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(albumID);
        location.reload();
      }
    });
    
  }
  
  function deleteRow(albumID){
      let table = document.getElementById("albums-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == albumID) {
              table.deleteRow(i);
              break;
         }
      }
  }