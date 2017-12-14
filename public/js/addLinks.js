$(document).ready(function () {

  var member = new Array();
  var projects = new Array();
  var referData = new Array();

  /* $('.step_no').css('background', '#ccc');

  $('.step_no').click(function () {
    $('.step_no').css('background', '#ccc');
    $('#type').text($(this).context.nextSibling.nextSibling.children[0].innerHTML);
    $(this).css('background', '#34495E');
  });

  $("#addItemBtn").click(function () {
    // item 의 최대번호 구하기
    var lastItemNo = $("#example tr:last").attr("class").replace("item", "");

    var newitem = $("#example tr:eq(1)").clone();
    newitem.removeClass();
    newitem.find("td:eq(0)").attr("rowspan", "1");
    newitem.addClass("item" + (parseInt(lastItemNo) + 1));

    $("#example").append(newitem);
  }); */

  $('.delBtn')
    .on('click', function () {
      if (member.length != 0) {
        $('tbody.radio-group > tr').eq(member.length).remove();
        member.pop();
      }
    });

  $('.pdelBtn')
    .on('click', function () {
      if (projects.length != 0) {
        $('tbody.project-group > tr').eq(projects.length).remove();
        projects.pop();
      }
    });

  $('.getStd').keydown(function (e) {
    if (e.keyCode == 13) {
      var id = $(this).val();
      $('.getStd').val('');

      $.ajax({
        url: '/searchId',
        type: 'POST',
        data: {
          id: id
        },
        dataType: 'json',
        success: function (res) {
          addMember(res);
        },
        error: function (err) {
          console.log(err);
        }
      });
    }
  });

  $('.proj_id').keydown(function (e) {
    if (e.keyCode == 13) {
      var proj_id = $(this).val();
      $('.proj_id').val('');

      $.ajax({
        url: '/search_proj_id',
        type: 'POST',
        data: {
          proj_id: proj_id
        },
        dataType: 'json',
        success: function (res) {
          addProject(res);
        },
        error: function (err) {
          console.log(err);
        }
      });
    }
  });

  $('.referAddBtn').click(function () {
    var context = `<tr>
          <td><input type="text" name="" id="referURL`
      + (referData.length) +
      `" class="form-control input-sm"></td>
          <td><input type="text" name="" id="referBook`
      + (referData.length) +
      `" class="form-control input-sm"></td>
      <td><input type="text" name="" id="referContext`
      + (referData.length) +
      `" class="form-control input-sm"></td></tr>`;
    console.log(context);
    $('tbody.refer-group').append(context);
    referData.push("");
  });


  $('.referDelBtn')
    .on('click', function () {
      if (referData.length != 0) {
        $('tbody.refer-group > tr').eq(referData.length).remove();
        referData.pop();
      }
    });

  function addProject(res) {
    var project = { project_number: res.project_number, title: res.title, context: "null" };
    console.log(JSON.stringify(project));

    let z = true;
    if (res.project_number) {

      for (var i in projects) {
        if (projects[i] != JSON.stringify(project)) {
          if (i == projects.length - 1) z = true;
        } else {
          z = false;
          break;
        }
      }
      if (z) {
        projects.push(JSON.stringify(project));

        var context = `<tr>
          <td>`+ project.project_number + `</td>
          <td>`+ project.title + `</td><td>
          <input type="text" name="" id="ref`
          + (projects.length - 1) +
          `" class="form-control input-sm">
          </td></tr>`;
        console.log(context);
        $('tbody.project-group').append(context);
      }
    } else {
      alert('해당 프로젝트가 없습니다.');
    }
  }

  function addMember(res) {
    var std = { id: res.id, name: res.name, grade: res.grade };
    console.log(JSON.stringify(std));

    let z = true;
    if (res.id) {

      for (var i in member) {
        if (member[i] != JSON.stringify(std)) {
          if (i == member.length - 1) z = true;
        } else {
          z = false;
          break;
        }
      }
      if (z) {
        member.push(JSON.stringify(std));

        var context = `<tr><td>${std.id}</td><td>${std.name}</td>
          <td><input type="text" name="act${(member.length - 1)}" id="act${(member.length - 1)}" value=""></td>
          <td><div class="radio">
          <label><input type="radio" name="optradio" value="${(member.length - 1)}"></label>
          </div></td></tr>`;

        $('tbody.radio-group').append(context);
      }

    } else {
      alert('해당 사용자가 없습니다.');
    }
  }


  function submitData() {
    console.log($('input:radio[name="optradio"]:checked').val());

    if (!$('#title').val()) {
      $('#title').focus();
      return false;
    }
    if (!$('#update').val()) {
      $('#update').focus();
      return false;
    }
    if (member.length == 0) {
      alert('참여자를 입력하세요!');
      return false;
    }
    if (!$('input:radio[name="optradio"]:checked').val()) {
      alert('팀장을 선택해주세요!');
      return false;
    }
    if (!$('#message').val()) {
      $('#message').focus();
      return false;
    }
    return true;
  }

  $('input[type="text"]').keydown(function () {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  });


  $('#submit').click(function () {
    if (submitData()) {
      refJSON = {};
      var refData = [];
      for (var i in projects) {
        refJSON = JSON.parse(projects[i]);
        refJSON.context = $(`#ref${i}`).val();
        refData.push(JSON.stringify(refJSON));
      }

      var act = [];
      for (var i in member) {
        act.push($(`#act${i}`).val());
      }

      var referArray = new Array();
      for (var i in referData) {
        referArray.push(JSON.stringify({ referURL: $(`#referURL${i}`).val(), referBook: $(`#referBook${i}`).val(), referContext: $(`#referContext${i}`).val() }));
      }

      console.log(referArray);

      var formData = new FormData();
      formData.append('imageURL', $('#imageURL')[0].files[0]);
      formData.append('title', $('#title').val());
      formData.append('type', $('select#project_type option:selected').val());
      formData.append('date', $('#update').val());
      formData.append('resultURL', $('#resultURL')[0].files[0]);
      formData.append('topic', $('#topic').val());
      formData.append('member', JSON.stringify(member));
      formData.append('act', JSON.stringify(act));
      formData.append('context', $('#message').val());
      formData.append('leader', $('input:radio[name="optradio"]:checked').val());
      formData.append('leader_grade', JSON.parse(member[$('input:radio[name="optradio"]:checked').val()]).grade);
      formData.append('refProject', projects.length != 0 ? JSON.stringify(refData) : "null");
      formData.append('referURL', referArray.length != 0 ? JSON.stringify(referArray) : "null");



      $.ajax({
        url: '/addLinks',
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (res) {
          if (res.result) {
            location.href = '/proj_info?num=' + res.id;
          } else {
            alert('문제가 발생하였습니다');
            location.href = '/projects';
          }
        },
        err: function (err) {
          console.log(err);
        }
      });
    }
  });

});