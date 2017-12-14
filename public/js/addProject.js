$(document).ready(function () {

  var member = new Array();


  $('.step_no').css('background', '#ccc');

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
  });

  $('.delBtn')
    .on('click', function () {
      if (member.length != 0) {
        $('tbody.radio-group > tr').eq(member.length).remove();
        member.pop();
        //refresh();
        console.log(member, 'del');
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
      console.log(member);

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

  $('#submit').click(function () {
    if (submitData()) {
      var act = [];
      for(var i in member) {
        act.push($(`#act${i}`).val());
      }

      console.log(JSON.stringify(act));

      var sendData = {
        type: $('#type').text(),
        title: $('#title').val(),
        date: $('#update').val(),
        imageURL: $('#imageURL').val(),
        resultURL: $('#resultURL').val(),
        topic: $('#topic').val(),
        member: JSON.stringify(member),
        act: JSON.stringify(act),
        leader: $('input:radio[name="optradio"]:checked').val(),
        context: $('#message').val(),
        leader_grade: JSON.parse(member[$('input:radio[name="optradio"]:checked').val()]).grade
      }

      if (sendData.type == '아이디어 도출')
        sendData.type = 'P01';
      else sendData.type = 'P03'

      console.log('sendData: ', sendData);

      $.ajax({
        url: '/addProject',
        type: 'POST',
        data: sendData,
        dataType: 'json',
        success: function (res) {
          if (res.result) {
            location.href = '/proj_info?num=' + res.id;
          } else {
            alert('문제가 발생하였습니다');
            location.href = '/projects';
          }
        },
        error: function (err) {
          console.log(err);
        }
      });
    }
  });

});