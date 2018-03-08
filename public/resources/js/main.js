
var body = $('body');

body.removeClass('nojs');

// check if there is a vertical scrollbar
var hasScrollbar = function(){
  var root = document.compatMode == 'BackCompat' ? document.body : document.documentElement;
  return (root.scrollHeight > root.clientHeight);
}


// replace standard checkboxes/radio buttons with nicer ones
$('input[type="checkbox"]').each(function(){
  var checkbox = $(this);
  checkbox.addClass('hide').after('<label for="' + checkbox.attr('id') + '" class="check' + (checkbox.hasClass('nolabel') ? ' nolabel' : '' )+ '"></label>');
});
$('input[type="radio"]').each(function(){
  var radio = $(this);
  radio.addClass('hide').after('<label for="' + radio.attr('id') + '" class="radio"></label>');
});


// check if IE
var ie = (window.navigator.userAgent.indexOf("MSIE ") > 0);
if (ie) {
  body.addClass('ie');
}

// mobile device?
var isMobile = (typeof(mobilecheck) === 'function' ? mobilecheck() : false);
if (isMobile) {
  body.addClass('mobile').removeClass('stickymenu');
}


// fix the footer to the bottom if there are no scrollbars
if(!hasScrollbar()) {
  body.addClass('noscroll');
}
$(window).resize(function() {
  if(!hasScrollbar()) {
    body.addClass('noscroll');
  }
  else {
    body.removeClass('noscroll');
  }
});


// show or hide main menu
$('#show-menu').on('click', function(e){
  showMainMenu();
});
// if (!isMobile) {
//  $('#show-menu-hover').on('mouseenter', function(){
//    showMainMenu();
//  });
// }
$('nav.main').on('click', function(e){
  e.stopPropagation();
});
$('.close-menu').on('click', function(){
  hideMainMenu();
});
$('html').on('click', function(e){
  hideMainMenu();
});
$('#hide-menu').on('click', function(){
  body.removeClass('stickymenu');
})


// for mobile devices only
if (isMobile) {
  $('main').swipe({
    swipeRight: function(e) {
      showMainMenu();
    },
    tap: function(e) {
      hideMainMenu();
    }
  });
}


function showMainMenu() {
  $('nav.main').animate({
    left: 0
  }, 200);
}

function hideMainMenu() {
  var mainMenu = $('nav.main');
  if (parseInt(mainMenu.css('left')) > -250) {
    mainMenu.animate({
      left: '-250px'
    }, 200);
  }
}

/* main menu - sub items */
$('nav.main .subitems').on('click', function(e){
  $(this).toggleClass('open').parent().find('>ul').slideToggle();
});
$('nav.main .item').on('click', function(e){
  $(this).toggleClass('open').next('ul').slideToggle();
});

/* sticky menu */
$('.glyphicon-pushpin').on('click', function() {
  body.toggleClass('stickymenu');
  
  if(body.hasClass('stickymenu')) {
    $.cookie('stickymenu', 'true', { expires: 365 });
  } else {
    $.cookie('stickymenu', 'false', { expires: 365 });
  }
});

if (typeof $.cookie('stickymenu') === 'undefined') {
  $.cookie('stickymenu', 'true', { expires: 365 });
}

if ($.cookie('stickymenu') == 'false') {
  body.removeClass('stickymenu');
}



