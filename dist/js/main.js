$(function(){
  $.ajax({
    url: 'build/elements.jsonld',
    dataType: 'json',
    success: function (response) {
      window.elements = response;
      $('#elements-table').DataTable({
        "data": response,
        "columns": [
          {"data":"name", "title":"Name"},
          {"data":"description","title":"Description"},
          {"data":"type","title":"Type"}
        ]
      });
    }
  });

   $.ajax({
    url: 'build/mappings.jsonld',
    dataType: 'json',
    success: function (response) {
      window.mappings = response;
      $('#mappings-table').DataTable({
        "data": response,
        "columns": [
          {"data":"name", "title":"Name"},
          {"data":"mappingLanguage", "title":"Mapping Language"},
          {"data":"description","title":"Description"},
          {"data":"sourceFormat","title":"Source Format"},
          {"data":"targetFormat","title":"Target Format"}
        ]
      });
    }
  });
  $(".nav-tabs a").click(function (e) {
    $(this).tab('show');
    e.preventDefault();
  });
  $('#tableTabs a:first').tab('show')


});