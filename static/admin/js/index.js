/**
 * Created by bhavyaagg on 27/08/17.
 */

$(function () {

  var $location = $(location);
  var arr = $location.attr('href').split("=");
  var $loginButton = $('#login-button');
  var $menu = $('#menu');
  var $shortCode = $('#shortcode');
  var $LongURL = $('#url');

  if (arr.length === 2) {
    $.post('/auth', {code: arr[1]}, function (authtoken) {
      if (authtoken.success === true) {
        localStorage.setItem("authtoken", authtoken.token);
        $loginButton.remove();
        $menu.append('<li><a href="#">' + authtoken.user + '</a></li>');
      } else {
        $location[0].replace("/admin");
      }
    })
  }

  $('.nav-container').load('/admin/includes/nav-container.html');

  $('#submit').click(function () {

    var URLregex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/g;

    if ($LongURL.val().length === 0) {

      $shortCode.html('<div class=\'alert alert-danger\'><strong>URL field is empty</strong> </div>   ');
      $LongURL.css('border-color', 'red');

    } else if (URLregex.test($LongURL.val()) === false) {

      $shortCode.html('<div class=\'alert alert-warning\'><strong>Invalid URL format</strong> <p> The URL must be of form </br>\"www.example.com"\ </br> \"https://example.com\" </br> \"mailto:foo@bar.com\" </p> </div> ');
      $LongURL.css('border-color', 'red');

    } else {

      $.post('/api/v1/shorten', {
        url: $LongURL.val(),
        secret: $('#secret').val(),
        code: $('#code').val()
      }, function (data) {

        if (typeof data === 'string') {
          $shortCode.html(data)
        } else {
          $shortCode.html("<div class=\"shortcode hovercard-light\">" +
            (data.existed ? "Already existed : " : "") +
            '<a href=' + '"/' + data.shortcode + '">' +
            window.location.origin + '/' + data.shortcode +
            (data.existed ?
              '</a> : pointing to : <a href="' + data.longURL + '">' + data.longURL :
              "") +
            '</a></div>'
          );
          $('.shortcode.hovercard-light').append(`<button class="btn btn-filled hover-light copy"> Copy </button>`);
        }
      }) //post request ends here
    } //end of if else block
  });

  $shortCode.on('click', '.shortcode button', function () {

    var range = document.createRange();
    range.selectNode($('.shortcode a')[0]);
    window.getSelection().addRange(range);
    document.execCommand("Copy");
    window.alert('Link Copied to your clipboard')
  });

  var $heading = $('#homeHeading');
  var $form = $('#shortcodeform');
  $("#shortForm").click(function () {
    $heading.css('display', 'none');
    $form.css('display', "block");
  });


});