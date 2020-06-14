$('#tool-search').on('input', function() {
  var search = $(this).serialize();
  if(search === "search=") {
    search = "all"
  }
  $.get('/tools?' + search, function(data) {
    $('#tool-grid').html('');
    data.forEach(function(tool) {
      $('#tool-grid').append(`
        <div class="col-md-3 col-sm-6">
          <div class="thumbnail">
            <img src="${ tool.image }">
            <div class="caption">
              <h4>${ tool.name }</h4>
            </div>
            <p>
              <a href="/tools/${ tool._id }" class="btn btn-primary">More Info</a>
            </p>
          </div>
        </div>
      `);
    });
  });
});

$('#tool-search').submit(function(event) {
  event.preventDefault();
});