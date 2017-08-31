function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
                if (match.startsWith('\"http')){
                  match = '<a target="_blank" href='+match+'>'+match+'</a>'
                }
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

// var searchMapOption = function(column, val){}

var returnDataForTranslations = function( row, type, set, meta ){
  if (type === "type"){
    return "string"; // force type detection to string, since that's what we use for filter
  }
  else if (type === 'display') {
    if (!row.map_display) {
      row.map_display = "";
      row.maps.forEach(function(obj) {
        if (row.map_display !== "")
          row.map_display += "\n";
        row.map_display += obj.source+"->"+obj.target;
      });
    }
    return row.map_display;
  }
  else if (type === 'filter') {
    if (!row.map_filter) {
      var allFormat = new Set();
      row.maps.forEach(function(elt) {
        allFormat.add(elt.source);
        allFormat.add(elt.target);
      });
      row.map_filter = "";
      allFormat.forEach(function(type) {
        row.map_filter += type + " ";
      });
    }
    return row.map_filter;              }
  else if (type === 'sort') {
    return row.maps[0].source.charCodeAt(0);
  }
  else if (type === undefined) //for api call
    return row.maps;
  else
    return row.map;
};

//            "fnCreatedCell": createMapCell,
//
//            "fnSearch": searchMapOption
//          }


var createMapOption = function(column, select){
  var allFormat = new Set();
  column.data().unique().sort().each( function ( d, j ) {
    d.forEach(function(elt) {
      allFormat.add(elt.source);
      allFormat.add(elt.target);
    });
  });
  allFormat.forEach(function(d){
      select.append( '<option value="'+d+'">'+d+'</option>' );
  });
};
/*
var createMapCell = function (nTd, sData, oData, iRow, iCol) {
  var elt="";
  $.each(oData.maps,function(i, obj){
	elt += "<div class='mapping'>"+obj.source+"->"+obj.target+"</div>";
	});
  $(nTd).html(elt);
}
*/

var createLinkCell = function (nTd, sData, oData, iRow, iCol) {
  var elt = $("<a>"+oData.name+"</a>");
  $(nTd).html(elt);
  elt.click(function(){
    $.ajax({
        type: "GET",
        url: oData.hostedURL,
        success: function(msg)
        {
          $("#getCodeModal .modal-title").text("Detail View: ")
            .append('<a title="click to download" target="_blank" href="'+oData.hostedURL+'">'+oData.name+'</a>')
            .append('<a class="link-small" target="_blank" href="'+oData.githubURL+'">[view on github]</a>');
          $("#getCodeModal").modal("toggle");
          if (typeof msg !== "string")
            msg = JSON.stringify(msg, undefined, 2);
          $("#getCode").html(syntaxHighlight(msg));
        }
    });
  });

};


// Dropdowns will be created for all columns except those that have the "disableSelect" flag set in
//   the datatable column configuration. "fnSelect" is an alternate parsing function used for special
//   cases, like the object array used for translations
var createDropdown = function (settings) {
  this.api().columns().every( function () {
      var column = this;
      if (settings.aoColumns[column.index()].disableSelect){
        $('<div>&nbsp</div>').appendTo($(column.header()) ); //filler
        return
      }
      var select = $('<select class="newline "><option value="">show all</option></select>')
          .appendTo( $(column.header()) )
          .on( 'change', function () {
              var val = $.fn.dataTable.util.escapeRegex(
                  $(this).val()
              );
              // if (settings.aoColumns[column.index()].fnSearch)
              //   settings.aoColumns[column.index()].fnSearch(column, val);
              // else
                column
                  .search( val ? val : '', true, false )
                  .draw();
          } )
          .on( 'click', function(e){e.stopPropagation()});
      if (settings.aoColumns[column.index()].fnSelect)
        settings.aoColumns[column.index()].fnSelect(column, select);
      else
        column.data().unique().sort().each( function ( d, j ) {
          select.append('<option value="'+d+'">'+d+'</option>');
        } );
  } );
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
          {"data":"description","title":"Description",  "disableSelect": true},
          {"data":"type","title":"Type"}
        ],
        "initComplete": createDropdown
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
          //{ "title":"Translations Available", "fnSelect": createMapOption, "data": returnDataForTranslations },
          { "title":"Source Model", "data": "maps.0.source"},
          { "title":"Target Model", "data": "maps.0.target"},
          { "title":"Name", "data":"name",  "fnCreatedCell":createLinkCell },
          { "title":"Translator Language", "data":"mappingLanguage" },
          { "title":"Description", "data":"description", "disableSelect": true }
        ],
        "initComplete": createDropdown
      });
    }
  });
  $(".nav-tabs a").click(function (e) {
    $(this).tab('show');
    e.preventDefault();
  });
  $('#tableTabs a:first').tab('show')


});
