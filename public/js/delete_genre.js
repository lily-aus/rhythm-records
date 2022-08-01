function deleteGenre(genreID) {
    let link = '/delete-genre-ajax/';
    let data = {
      genre_id: genreID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(genreID);
        location.reload();
      }
    });
  }
  
  function deleteRow(genreID){
      let table = document.getElementById("genres-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == genreID) {
              table.deleteRow(i);
              break;
         }
      }
  }