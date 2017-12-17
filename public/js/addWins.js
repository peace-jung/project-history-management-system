$(document).ready(function () {
  var hide = true;
  $(".reference").hide();

  $("#nowp").click(function () {
    if (hide) {
      $(".reference").show('slide');
      hide = false;
    }
    else {
      $(".reference").hide('slide');
      hide = true;
    }
  });
  
  $(".next").hide();
  $(".btn-prev").hide();
  $(".btn-save").hide();

  $("button#next").click(function () {
    $(".prev").hide();
    $(".next").show('slide');

    $(".btn-next").hide();
    $(".btn-close").hide();
    $(".btn-prev").show();
    $(".btn-save").show();
  });

  $("button#prev").click(function () {
    $(".prev").show('slide');
    $(".next").hide();

    $(".btn-next").show();
    $(".btn-close").show();
    $(".btn-prev").hide();
    $(".btn-save").hide();
  });

  function getQuerystring(paramName) {
    var _tempUrl = window.location.search.substring(1);
    var _tempArray = _tempUrl.split('&');
    for (var i = 0; _tempArray.length; i++) {
      var _keyValuePair = _tempArray[i].split('=');
      if (_keyValuePair[0] == paramName) {
        return _keyValuePair[1];
      }
    }
  }


  // 공모전 등록
  $("#submit1").click(function () {
    sendData = {
      project_number: getQuerystring('num'),
      contest_title: $('#contest_title').val(),
      award: $('#award').val(),
      context: $('#context').val(),
      host: $('#host').val(),
      date: $('#date').val()
    }
    console.log(sendData);
    $.ajax({
      url: '/addContest',
      type: 'POST',
      data: sendData,
      dataType: 'json',
      success: function (req, res) {
        if (req.result) {
          location.reload();
        } else {
          alert("오류 발생! NO DATA FOUND");
        }
      },
      error: function (err) {
        console.log(err);
      }
    });
  });


  // 논문 등록
  var author = []; // {id, name}

  $("#addAuthor").click(function () {
    var context = "<tr><td>" + $('#aid').val()
      + "</td><td>" + $('#aname').val() + "</td></tr>";
    console.log(context);

    $('tbody.author-body').append(context);
    author.push(JSON.stringify({ id: $('#aid').val(), name: $('#aname').val() }));
    console.log(author, 'add');
  });

  $('#delAuthor')
    .on('click', function () {
      if (author.length != 0) {
        $('tbody.author-body > tr').eq(author.length - 1).remove();
        author.pop();
        console.log(author, 'del');
      }
    });

  $("#submit2").click(function () {
    sendData = {
      project_number: getQuerystring('num'),
      paper_title: $('#paper_title').val(),
      paper_type: $('select#paper_type option:checked').val(),
      summary: $('#summary').val(),
      academy: $('#academy').val(),
      submission: $('#submission').val(),
      date: $('#date2').val(),
      author: JSON.stringify(author)
    }
    console.log(sendData);
    $.ajax({
      url: '/addPaper',
      type: 'POST',
      data: sendData,
      dataType: 'json',
      success: function (res) {
        if (res.result) {
          location.reload();
        } else {
          alert("오류 발생! NO DATA FOUND");
        }
      },
      error: function (err) {
        console.log(err);
      }
    });
  });

  // 특허 등록
  var inventor = [];

  $("#addInventor").click(function () {
    var context = "<tr><td>" + $('#iid').val()
      + "</td><td>" + $('#iname').val() + "</td></tr>";
    console.log(context);

    $('tbody.inventor-body').append(context);
    inventor.push(JSON.stringify({ id: $('#iid').val(), name: $('#iname').val() }));
    console.log(inventor, 'add');
  });

  $('#delInventor')
    .on('click', function () {
      if (inventor.length != 0) {
        $('tbody.inventor-body > tr').eq(inventor.length - 1).remove();
        inventor.pop();
        //console.log(inventor, 'del');
      }
    });

  $("#submit3").click(function () {
    sendData = {
      project_number: getQuerystring('num'),
      patent_number: $('#patent_number').val(),
      patent_title: $('#patent_title').val(),
      patent_context: $('#patent_context').val(),
      date: $('#date3').val(),
      regist_number: $('#regist_number').val(),
      regist_date: $('#regist_date').val(),
      inventor: JSON.stringify(inventor)
    }
    console.log(sendData);

    $.ajax({
      url: '/addPatent',
      type: 'POST',
      data: sendData,
      dataType: 'json',
      success: function (res) {
        if (res.result) {
          location.reload();
        } else {
          alert("오류 발생! NO DATA FOUND");
        }
      },
      error: function (err) {
        console.log(err);
      }
    });
  });
});