function deleteArtist(artistID) {
    let link = '/delete-artist-ajax/';
    let data = {
      artist_id: artistID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(artistID);
      }
    });
    location.reload();
  }
  
  function deleteRow(artistID){
      let table = document.getElementById("artist-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == artistID) {
              table.deleteRow(i);
              break;
         }
      }
  }