/**
 * Created by bhavyaagg on 27/08/17.
 */

$(function () {
  $('.nav-container').load('/admin/includes/nav-container.html', function () {
    let search = $('#searchByLongUrl');
    console.log(search)
    search.attr('title', 'Shorten');
    search.attr('href', '/admin');
    search.text('Shorten');

  });

  $('#submit').click(function () {
    $.post('/api/v1/search', {
      longcode: $('#url').val(),
      secret: $('#secret').val()
    }).done(function (data) {
      if (data.status === 200) {
        let $shortcode = $('#shortcode');
        let str= "";
        for(let i =0;i<data.urls.length;i++){
          str+=`<a href=/${data.urls[i].codeStr}>cb.lk/${data.urls[i].codeStr}</a><br>`
        }
        $shortcode.append("<div class=\"shortcode hovercard-light\" style='height: auto!important;'>"+str+"</div>");

      }
    }).fail(function (err) {
      console.log(err);
    })
  });



  var $heading = $('#homeHeading');
  var $form = $('#shortcodeform');
  $("#shortForm").click(function () {
    $heading.css('display', 'none');
    $form.css('display', "block");
  });

});