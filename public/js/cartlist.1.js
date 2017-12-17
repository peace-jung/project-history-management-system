$(document).ready(function () {
  var table = $("#xxxx").DataTable({
    'ajax': {
      'url': '/cartlist'
    },
    'columnDefs': [{
      'targets': 0,
      'searchable': false,
      'orderable': false,
      'className': 'dt-body-center',
      'render': function (data, type, full, meta) {
        return $('<div />').text(data).html();
      }
    }],
    'order': [[4, 'desc']],
    'initComplete': function () {
    }
  });

  $('#xxxx').on('draw.dt', function () {
    $('#xxxx tbody tr').each(function () {
      $(this).closest("tr").find('td:eq(0)').html(`<input type="checkbox" class="flat" name="table_records" style="position: absolute; opacity: 0;">`);
      $(this).closest("tr").find('td:eq(8)').html(`<button class="btn btn-danger btn-sm delCartBtn" style="margin:0; padding:3px 3px;">삭제</button>`);
    });
  });

  $('#xxxx').on('click', 'td:eq(2)', function () {
    location.href = `/proj_info?num=${$(this).closest("tr").find('td:eq(1)').text()}`;
  })

  $('#xxxx').on('click', 'td:eq(8) button', function () {
    project_number = table.cell($(this).closest('tr'), 1).data();
    $.ajax({
      url: '/addCart',
      data: { project_number: project_number },
      dataType: 'json',
      type: 'POST',
      success: function (res) {
        if (res.result == "F") {
          alert('관심 목록에서 삭제되었습니다!');
          location.reload();
        }
      },
      err: function (err) {
        console.log(err);
      }
    });
  });

  $('#addReferProj').click(function () {
    console.log($('.flat').length);
    
  })

});