$(function(){
  $.ajax({
    url: 'build/elements.jsonld',
    dataType: 'json',
    success: function (response) {
      $('#thetable').DataTable({
        "data": response,
        "columns": [
          {"data":"name", "title":"Name"},
          {"data":"description","title":"Description"},
          {"data":"type","title":"Type"}
        ]
      });
    }
  });
});