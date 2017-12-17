$(document).ready(function () {
  $('#datatable-keytable').on('click', 'button', function () {
    project_number = $(this).closest('tr').find('td:eq(0)').text().trim();
    //project_number = $('#datatable-keytable').cell($(this).closest('tr'), 1).data();
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
    var project_list = [];
    $('.selected').each(function () {
      project_list.push(JSON.stringify(
        {
          number: $(this).closest('tr').find('td:eq(0)').text().trim(),
          title: $(this).closest('tr').find('td:eq(1)').text().trim()
        }
      ));
    });
    if (project_list.indexOf('{"number":"","title":""}') != -1)
      project_list.splice(project_list.indexOf('{"number":"","title":""}'), 1);
    console.log(project_list);
    location.href = '/addReferList?pn=' + JSON.stringify(project_list);
  });

});