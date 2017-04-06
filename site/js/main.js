function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}


var createMapCell = function (nTd, sData, oData, iRow, iCol) {
  var elt="";
  $.each(oData.maps,function(i, obj){
	elt += "<div class='mapping'>"+obj.source+"->"+obj.target+"</div>";
	});
  $(nTd).html(elt);
}

var createLinkCell = function (nTd, sData, oData, iRow, iCol) {
  var elt = $("<a data-href='"+oData.githubURL+"'>"+oData.name+"</a>");
  $(nTd).html(elt);
  elt.click(function(){
    $.ajax({
        type: "GET",
        url: elt.data("href"),
        success: function(msg)
        {
          $("#getCodeModal .modal-title").text("Detail View: "+oData.name);
          $("#getCodeModal").modal("toggle");
          if (typeof msg !== "string")
            msg = JSON.stringify(msg, undefined, 2);
          $("#getCode").html(syntaxHighlight(msg));
        }
    });
  });

};

$(function(){
  $.ajax({
    url: 'build/elements.jsonld',
    dataType: 'json',
    success: function (response) {
      window.elements = response;
      $('#elements-table').DataTable({
        "data": response,
        "columns": [
          {"data":"name", "title":"Name", "fnCreatedCell":createLinkCell},
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
          {"data":"name", "title":"Name", "fnCreatedCell":createLinkCell},
          {"data":"mappingLanguage", "title":"Language"},
          {"data":"description","title":"Description"},
          {"data":"maps","title":"Translations Available", "fnCreatedCell":createMapCell}
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
