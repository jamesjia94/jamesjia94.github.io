var TOP_NAVBAR_HEIGHT_OFFSET = 60;
// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        var width =  $($anchor.attr('href')).offset().top;
        if ($(window).width() < 768){
            width -= TOP_NAVBAR_HEIGHT_OFFSET;
        }
        $('html, body').stop().animate({
            scrollTop: width
        }, 1000, 'easeInOutExpo');
        event.preventDefault();
    });
    setupScrollSpy();

    $(window).resize(function() {
        setupScrollSpy();
        var $affix = $(".affix");
        var $parent = $affix.parent();
        $affix.width($parent.width()); 
    });
});

function setupScrollSpy() {
    $isMobile = $(window).width() < 768;
    if ($isMobile) {
        $('body').scrollspy({
            offset: TOP_NAVBAR_HEIGHT_OFFSET
        });
    }
    else {
        $('body').scrollspy({
            offset: 20
        });
    }
}

