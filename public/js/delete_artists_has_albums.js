function deleteArtistsHasAlbums(artists_has_albumsID) {
    let link = '/delete-artists-has-albums-ajax/';
    let data = {
        Artists_Albums_id: artists_has_albumsID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(artists_has_albumsID);
        location.reload();
      }
    });

  }
  
  function deleteRow(artists_has_albumsID){
      let table = document.getElementById("artists-albums-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == artists_has_albumsID) {
              table.deleteRow(i);
              break;
         }
      }
  }