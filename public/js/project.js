$(document).ready(function () {
  var query = String("<%= query %>");
  var table = $("#zzzz").DataTable({
    'ajax': {
      'url': `'/dataTable?query=${query}`
    },
    'columnDefs': [{
      'targets': 0,
      'searchable': false,
      'orderable': false,
      'className': 'dt-body-center',
      'render': function (data, type, full, meta) {
        return $('<div/>').text(data).html();
      }
    }],
    'order': [[4, 'desc']]
  });


  var t1 = "아이디어 도출", t3 = '개발 완료';
  var g1 = 1, g2 = 2, g3 = 3, g4 = 4;

  $.fn.dataTable.ext.search.push(
    function (settings, data, dataIndex) {
      var ptype = data[2].toString() || 0; // use data for the age column
      var grade = parseFloat(data[5]) || 0; // use data for the age column

      if (t1 == '' && t3 == '') {
        t1 = "아이디어 도출";
        t3 = '개발 완료';
      }
      if (g1 == 0 && g2 == 0 && g3 == 0 && g4 == 0) {
        g1 = 1, g2 = 2, g3 = 3, g4 = 4;
      }
      if ((t1 == ptype && (g1 == grade || g2 == grade || g3 == grade || g4 == grade))
        || (t3 == ptype && (g1 == grade || g2 == grade || g3 == grade || g4 == grade))) {
        return true;
      }
      return false;
    }
  );


  $("div#checkboxGroup > label").click(function () {
    t1 = t3 = ''
    g1 = g2 = g3 = g4 = 0;
    $("input[name=grade]:checked").each(function () {
      var grade = $(this).val();
      if (grade == 1) {
        g1 = 1;
      }
      if (grade == 2) {
        g2 = 2;
      }
      if (grade == 3) {
        g3 = 3;
      }
      if (grade == 4) {
        g4 = 4;
      }
    });
    $("input[name=grade]:not(:checked)").each(function () {
      var grade = $(this).val();
      if (grade == 1) {
        g1 = 0;
      }
      if (grade == 2) {
        g2 = 0;
      }
      if (grade == 3) {
        g3 = 0;
      }
      if (grade == 4) {
        g4 = 0;
      }
    });
    $("input[name=ptype]:checked").each(function () {
      var ptype = $(this).val();
      if (ptype == "T01") {
        t1 = "아이디어 도출";
      }
      if (ptype == "T03") {
        t3 = "개발 완료";
      }
    });

    table.draw();
  });


  $('#zzzz tbody').on('click', 'tr', function () {
    location.href = '/proj_info?num=' + (table.row(this).index() + 1);
  });
});