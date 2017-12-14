function submit_form() {
  var data = {
    id: $('#id').val(),
    name: $('#name').val(),
    password: $('#password').val(),
    major: $('#major').val(),
    grade: $('#grade').val(),
    address: $('#address').val(),
    encrollment: $('#encrollment').val(),
    user_type: $('input:radio[name="user_type"]:checked').val(),
    professor: $('#professor').val()
  };

  data.id == '' || data.name == '' || data.password == '' || data.major == '' || data.grade == '' || data.address == '' || !data.user_type || data.professor == ''
    ? alert('입력되지 않은 정보가 있습니다.') : gogo(data);

  console.log(data);
}

function gogo(data) {
  $.ajax({
    url: '/adduser',
    type: 'POST',
    data: data,
    dataType: 'json',
    success: function (res) {
      if (res.result) {
        location.href = '/'
      } else {
        alert('문제가 발생하였습니다');
        location.href = '/'
      }
    },
    error: function (err) {
      console.log(err);
    }
  });
}