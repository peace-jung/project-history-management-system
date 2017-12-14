(function ($) {
  $(function () {
    var selectFormGroup = function (event) {
      event.preventDefault();

      var $selectGroup = $(this).closest('.input-group-select');
      var param = $(this).attr("href").replace("#", "");
      var concept = $(this).text();

      $selectGroup.find('.concept').text(concept);
      $selectGroup.find('.input-group-select-val').val(param);

    }

    var countFormGroup = function ($form) {
      return $form.find('.form-group').length;
    };

    $(document).on('click', '.dropdown-menu a', selectFormGroup);

  });
})(jQuery);

$('#contactsvalue').keydown(function () {
  if (event.keyCode === 13) {
    event.preventDefault();
    $('#submit_btn').click();
  }
});

function sendData(id) {
  // URL 에서 params = num 값찾아옴
  var project_number = new RegExp('[\?&]num=([^&#]*)').exec(window.location.href)[1];
  var formData = {
    project_number: project_number,
    user_id: id,
    point: $('.concept').text().length,
    context: $("#contactsvalue").val()
  };
  $.ajax({
    url: '/addComment',
    data: formData,
    dataType: 'json',
    type: 'POST',
    success: function (res) {
      if (res.result) {
        alert('평가가 등록되었습니다!');
        location.reload();
      } else {
        alert('이미 평가하셨습니다.');
      }
    },
    err: function (err) {
      console.log(err);
    }
  });
}