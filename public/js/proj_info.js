$(document).ready(function () {
  $("#proj_wins").hide();
  $("#refer_proj").hide();

  $("#home-tab").click(function () {
    $("#proj_context").fadeIn();
    $("#proj_wins").hide();
    $("#refer_proj").hide();
  });

  $("#profile-tab").click(function () {
    $("#proj_wins").fadeIn();
    $("#proj_context").hide();
    $("#refer_proj").hide();
  });

  $("#profile-tab2").click(function () {
    $("#refer_proj").fadeIn();
    $("#proj_context").hide();
    $("#proj_wins").hide();
  });
});