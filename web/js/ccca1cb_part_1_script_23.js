function include(scriptUrl) {
    document.write('<script src="' + scriptUrl + '"></script>');
}
function isIE() {
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}
;(function ($) {
    if (isIE() && isIE() < 11) {
        $('html').addClass('lt-ie11');
        $(document).ready(function () {
            PointerEventsPolyfill.initialize({});
        });
    }
})(jQuery);
;(function ($) {
    var o = $('html');
    if (o.hasClass('desktop')) {
        $(document).ready(function () {
            $('#stuck_container').TMStickUp({})
        });
    }
})(jQuery);
;(function ($) {
    var o = $('html');
    if (o.hasClass('desktop')) {
        $(document).ready(function () {
            $().UItoTop({easingType: 'easeOutQuart', containerClass: 'toTop fa fa-chevron-up'});
        });
    }
})(jQuery);
;(function ($) {
    var currentYear = (new Date).getFullYear();
    $(document).ready(function () {
        $("#copyright-year").text((new Date).getFullYear());
    });
})(jQuery);
;(function ($) {
    var o = document.getElementById("google-map");
    if (o) {
        $(document).ready(function () {
            var o = $('#google-map');
            if (o.length > 0) {
                o.googleMap();
            }
        });
    }
})
(jQuery);
;(function ($) {
    var o = $('.rd-mailform');
    if (o.length > 0) {
        $(document).ready(function () {
            var o = $('.rd-mailform');
            if (o.length) {
                o.rdMailForm({
                    validator: {
                        'constraints': {
                            '@LettersOnly': {message: 'Please use letters only!'},
                            '@NumbersOnly': {message: 'Please use numbers only!'},
                            '@NotEmpty': {message: 'Field should not be empty!'},
                            '@Email': {message: 'Enter valid e-mail address!'},
                            '@Phone': {message: 'Enter valid phone number!'},
                            '@Date': {message: 'Use MM/DD/YYYY format!'},
                            '@SelectRequired': {message: 'Please choose an option!'}
                        }
                    }
                }, {
                    'MF000': 'Sent',
                    'MF001': 'Recipients are not set!',
                    'MF002': 'Form will not work locally!',
                    'MF003': 'Please, define email field in your form!',
                    'MF004': 'Please, define type of your form!',
                    'MF254': 'Something went wrong with PHPMailer!',
                    'MF255': 'Aw, snap! Something went wrong.'
                });
            }
        });
    }
})(jQuery);
$(function () {
    var viewportmeta = document.querySelector && document.querySelector('meta[name="viewport"]'), ua = navigator.userAgent, gestureStart = function () {
        viewportmeta.content = "width=device-width, minimum-scale=0.25, maximum-scale=1.6, initial-scale=1.0";
    }, scaleFix = function () {
        if (viewportmeta && /iPhone|iPad/.test(ua) && !/Opera Mini/.test(ua)) {
            viewportmeta.content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0";
            document.addEventListener("gesturestart", gestureStart, false);
        }
    };
    scaleFix();
    if (window.orientation != undefined) {
        var regM = /ipod|ipad|iphone/gi, result = ua.match(regM);
        if (!result) {
            $('.sf-menus li').each(function () {
                if ($(">ul", this)[0]) {
                    $(">a", this).toggle(function () {
                        return false;
                    }, function () {
                        window.location.href = $(this).attr("href");
                    });
                }
            })
        }
    }
});
var ua = navigator.userAgent.toLocaleLowerCase(), regV = /ipod|ipad|iphone/gi, result = ua.match(regV), userScale = "";
if (!result) {
    userScale = ",user-scalable=0"
}
document.write('<meta name="viewport" content="width=device-width,initial-scale=1.0' + userScale + '">');
;(function ($) {
    var o = $('#camera');
    if (o.length > 0) {
        $(document).ready(function () {
            o.camera({
                autoAdvance: true,
                height: '34.14634146341%',
                minHeight: '700px',
                pagination: true,
                thumbnails: false,
                playPause: false,
                hover: false,
                loader: 'none',
                navigation: true,
                navigationHover: false,
                mobileNavHover: false,
                fx: 'simpleFade'
            })
        });
    }
})(jQuery);
;(function ($) {
    var o = $('.owl-carousel');
    if (o.length > 0) {
        $(document).ready(function () {
            o.owlCarousel({
                margin: 30,
                smartSpeed: 450,
                loop: false,
                dots: true,
                dotsEach: 1,
                nav: true,
                navClass: ['owl-prev fa fa-angle-left', 'owl-next fa fa-angle-right'],
                responsive: {0: {items: 1}, 768: {items: 2}, 980: {items: 4}}
            });
        });
    }
})(jQuery);
;(function ($) {
    var o = $('.owl-carousel-2');
    if (o.length > 0) {
        $(document).ready(function () {
            o.owlCarousel({
                margin: 30,
                smartSpeed: 450,
                loop: true,
                dots: true,
                dotsEach: 1,
                nav: true,
                navClass: ['owl-prev fa fa-angle-left', 'owl-next fa fa-angle-right'],
                responsive: {0: {items: 1}, 980: {items: 2}}
            });
        });
    }
})(jQuery);
;(function ($) {
    var o = $('.resp-tabs');
    if (o.length > 0) {
        $(document).ready(function () {
            o.easyResponsiveTabs();
        });
    }
})(jQuery);
;(function ($) {
    var o = $('.thumb');
    if (o.length > 0) {
        $(document).ready(function () {
            o.touchTouch();
        });
    }
})(jQuery);