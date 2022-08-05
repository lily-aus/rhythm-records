function deleteGenresHasAlbums(genres_has_albumsID) {
    let link = '/delete-genres-has-albums-ajax/';
    let data = {
        Genres_Albums_id: genres_has_albumsID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(genres_has_albumsID);
        location.reload();
      }
    });

  }
  
  function deleteRow(genres_has_albumsID){
      let table = document.getElementById("genres-albums-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == genres_has_albumsID) {
              table.deleteRow(i);
              break;
         }
      }
  }