// Update width on window resize
var width = window.innerWidth;
$(window).resize(function() {
    width = window.innerWidth;
});

var documentHasScroll = function() {
    return window.innerHeight <= document.body.offsetHeight;
};

// Function to show the search form
function showSearchForm() {
    // Simple fade in with a pop effect
    $('#search').fadeIn(200);
    $('#search form').addClass('pop-in');
    
    // Clear any previous search text and focus the input
    $('#search input.search_input').val('').focus();
    
    $('body').addClass('search-open');
    
    // Prevent scrolling when search is open
    $('body').css('overflow', 'hidden');
    
    // Add event listener to close search when clicking outside
    $(document).on('click.searchClose', function(event) {
        var $search = $('#search form');
        var $searchToggle = $('#searchToggle');
        
        // If click is outside search container and not on search button
        if (!$search.is(event.target) && 
            $search.has(event.target).length === 0 && 
            !$searchToggle.is(event.target) && 
            $searchToggle.has(event.target).length === 0 &&
            !$(event.target).closest('.close-search').length) {
            hideSearchForm();
        }
    });
    
    // Add escape key handler
    $(document).on('keydown.searchEscape', function(e) {
        if (e.key === 'Escape') {
            hideSearchForm();
        }
    });
    
    // Add enter key handler to submit the form
    $('#search input.search_input').on('keydown.searchSubmit', function(e) {
        if (e.key === 'Enter') {
            $('#search form').submit();
        }
    });
}

// Function to hide the search form
function hideSearchForm() {
    // Simple fade out
    $('#search form').removeClass('pop-in');
    $('#search').fadeOut(200);
    
    $('body').removeClass('search-open');
    
    // Restore scrolling
    $('body').css('overflow', '');
    
    // Remove the document event listeners
    $(document).off('click.searchClose');
    $(document).off('keydown.searchEscape');
    $('#search input.search_input').off('keydown.searchSubmit');
}

// Function to rotate hero images with transition
function rotateHeroImages() {
    const images = $('.image-placeholder img');
    if (images.length < 2) return;
    
    let currentIndex = 0;
    
    // Initially hide all images except the first one
    images.css({
        'opacity': 0,
        'position': 'absolute',
        'top': '50%',
        'left': '50%',
        'transform': 'translate(-50%, -50%)'
    });
    
    $(images[0]).css('opacity', 1);

    setInterval(function() {
        const nextIndex = (currentIndex + 1) % images.length;
        
        // Fade out current image
        $(images[currentIndex]).animate({
            opacity: 0
        }, 500);
        
        // Fade in next image
        $(images[nextIndex]).animate({
            opacity: 1
        }, 500);
        
        currentIndex = nextIndex;
    }, 2000);
}

$(document).ready(function() {
    // $("nav").removeClass("no-transition");
	/* MENU */
	$('.navbar-nav').attr('id', 'menu'); // please don't remove this line
	$( '<div class="calendar-top"></div>' ).insertBefore( "#calendar" );
	$( '<div class="card-profile-top"></div>' ).insertBefore( ".card.profile.card-profile" );
	var divs = $(".card-profiles > div");
	for(var i = 0; i < divs.length; i+=2) {
		divs.slice(i, i+2).wrapAll( '<div class="col-xs" />');
	}

    // Initialize hero image rotation
    rotateHeroImages();

    // Make intro-items clickable
    $('.intro-item').on('click', function() {
        var href = $(this).data('href');
        if (href) {
            window.location.href = href;
        }
    });

    // Initialize tab functionality
    initTabs();
    
    // Initialize accordion functionality
    initAccordion();
    
    // Language toggle functionality
    $('.language-btn').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
    });
    
    // Search button functionality
    $('#searchToggle').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        showSearchForm();
    });

    // Prevent clicks on bottom elements from closing the menu
    $('.navbar-bottom-elements').on('click', function(e) {
        e.stopPropagation();
    });

    // Handle dropdown menu items
    $('.nav-item').children("a").each(function(){
        if($(this).attr('data-toggle') == 'dropdown'){
            $(this).removeAttr('data-toggle');
            $(this).on('click', function(e) {
                e.preventDefault();
                $(this).siblings('.dropdown-menu').toggleClass('show');
            });
        }
    });

    $("nav").removeClass("no-transition");

    // Menu toggle functionality
    $('#desktopMenuToggle').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Open the menu
        $('#headerNavbarNav').addClass('show').css({
            'right': '0',
            'opacity': '1',
            'visibility': 'visible'
        });
        
        // Hide the toggle button
        $(this).hide();
        
        $('body').addClass('menu-open');
    });
    
    // Close menu button functionality
    $('#closeMenuBtn').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Close the menu
        $('#headerNavbarNav').removeClass('show').css({
            'right': '-300px',
            'opacity': '0',
            'visibility': 'hidden'
        });
        
        // Show the toggle button again
        $('#desktopMenuToggle').show();
        
        $('body').removeClass('menu-open');
    });

    // Close menu when clicking outside
    $(document).click(function(event) {
        var $navbarNav = $('#headerNavbarNav');
        var $desktopToggle = $('#desktopMenuToggle');
        var $closeBtn = $('#closeMenuBtn');
        
        // If navbar is visible and click is outside navbar and toggle buttons
        if ($navbarNav.hasClass('show') && 
            !$navbarNav.is(event.target) && 
            $navbarNav.has(event.target).length === 0 && 
            !$desktopToggle.is(event.target) && 
            $desktopToggle.has(event.target).length === 0 &&
            !$closeBtn.is(event.target) &&
            $closeBtn.has(event.target).length === 0) {
            
            $navbarNav.removeClass('show').css({
                'right': '-300px',
                'opacity': '0',
                'visibility': 'hidden'
            });
            
            // Show the toggle button again
            $('#desktopMenuToggle').show();
            
            $('body').removeClass('menu-open');
        }
    });

    // Prevent clicks on the menu from closing it
    $('#headerNavbarNav').on('click', function(e) {
        e.stopPropagation();
    });

    // Close dropdown menus when parent menu item is clicked again
    $('.nav-item.dropdown > a').on('click', function(e) {
        e.preventDefault();
        var $dropdownMenu = $(this).siblings('.dropdown-menu');
        
        if ($dropdownMenu.hasClass('show')) {
            $dropdownMenu.removeClass('show');
        } else {
            // Close all other open dropdowns first
            $('.dropdown-menu.show').removeClass('show');
            $dropdownMenu.addClass('show');
        }
    });

    $('.work_packages .accordion-content, .messages .accordion-toggle').each(function( index, value ) {
        $(value).find('a').attr( "onclick", "window.open(this.href, '_blank');" )
    });

    $('.nav-item').children("a").each(function(){
        if($(this).attr('data-toggle') == 'dropdown'){
            $(this).removeAttr('data-toggle')
        }
    });

    $("nav").removeClass("no-transition");

    if (window.location.hash) {
        var link = window.location.hash;
        var anchorId = link.substr(link.indexOf("#") + 1);
        if($("#"+anchorId).offset()){
            $('html, body').animate({
                scrollTop: $("#"+anchorId).offset().top - 150
            }, 500);
        }else{
            $('.accordion-border').each(function(){
                var title = $(this).find(".accordion-toggle .col-xs.start-xs").text().toUpperCase();
                var toggler = $(this).find(".accordion-toggle");
                if ( title.indexOf(anchorId.toUpperCase()) >= 0 && !toggler.next(".accordion-content").is(':visible') ){
                    $('html, body').animate({
                        scrollTop: toggler.parent().offset().top - 150
                    }, 500);
                    toggler.trigger( "click" );
                }
            });
        }
    }

    $('.dropdown a').click(function(event) {

        if (location.href.indexOf("#") != -1) {
            var link = $(this).attr('href');
            var anchorId = link.substr(link.indexOf("#") + 1);
            if($("#"+anchorId).length>0){
                $('html, body').animate({
                    scrollTop: $("#"+anchorId).offset().top - 150
                }, 500);
            }else{
                // event.preventDefault();
                $("g[title='"+anchorId.toUpperCase()+"']").addClass('active_path');

                $('.accordion-border').each(function(){
                    var title = $(this).find(".accordion-toggle .col-xs.start-xs").text().toUpperCase();
                    var toggler = $(this).find(".accordion-toggle");
                    if ( title.indexOf(anchorId.toUpperCase()) >= 0 && !toggler.next(".accordion-content").is(':visible') ){
                        $('html, body').animate({
                            scrollTop: toggler.parent().offset().top - 150
                        }, 500);
                        toggler.trigger( "click" );
                        event.preventDefault();
                    }
                });
            }
        }
    });

    onHashChange();
	$(window).on("hashchange", function() {
		onHashChange();
	});

	$('.nav.nav-pills').removeAttr('id');

	var count = $("h1").text().length;
    
    $('.about .content').attr({
        'data-aos': 'fade-up',
        'data-aos-duration': '800',
        'data-aos-delay': '150',
        'data-aos-easing': 'ease-out',
        'data-aos-anchor-placement': 'top-bottom',
        'data-aos-once': 'false',
        'data-aos-mirror': 'true'
    });
    
	$('.about .about-circle-container').attr({
		'data-aos': 'fade-up',
		'data-aos-duration': '1200',
		'data-aos-easing': 'ease-out-back',
		'data-aos-anchor-placement': 'center-bottom',
		'data-aos-once': 'true',
		'data-aos-offset': '0'
	});


	$('.see_all_partners_link').hide();

    $(".timeline_container.left .blue_line").width(function() {
        return (innerWidth - $('.container').width())/2;
    });


    $('.dorsal').click(function () {
        var link = $(this);
        var parag = link.parent().parent().find('p').first();
        var partner_desc = link.parent().parent().find('.partner_description').first();
        parag.toggleClass('expand', function() {
            if (parag.hasClass('expand')) {
                link.text('Read less');
                parag.slideDown(300);
            } else {
                link.text('Read more');
                // parag.slideUp(300);
            }

        });
        partner_desc.toggleClass('expand', function() {
            if (parag.hasClass('expand')) {
                link.text('Read less');
                parag.slideDown(300);
            } else {
                link.text('Read more');
                // parag.slideUp(300);
            }

        });

    });

    $('.library .form-wrapper, .library-items').wrapAll('<div class="container-fluid bg-secondary"><div class="container"></div></div>');
    $('.library .tabs').wrapAll('<div class="container"></div>');
    $('.library_content .row.center-xs.mb-1').wrapAll('<div class="container_relative"></div>');

    if(width > 1024){
        $('.partners_list .key_0, .partners_list .key_2, .partners_list .key_4, .partners_list .key_6, .partners_list .key_8, .partners_list .key_10, .partners_list .key_12, .partners_list .key_14, .partners_list .key_16, .partners_list .key_18').wrapAll('<div class="col-md-6 col-xs-12"></div>');
        $('.partners_list .key_1, .partners_list .key_3, .partners_list .key_5, .partners_list .key_7, .partners_list .key_9, .partners_list .key_11, .partners_list .key_13, .partners_list .key_15, .partners_list .key_17, .partners_list .key_19').wrapAll('<div class="col-md-6 col-xs-12"></div>');
    }


    if($('#slick').length){
        $('#slick').slick({
            autoplay: true,
            autoplaySpeed: 4000,
            draggable: true,
            pauseOnHover: true,
            infinite: true,
            dots: false,
            arrows: true,
            speed: 1000,

            mobileFirst: true,
    
            // Default settings for mobile
            slidesToShow: 1,
            slidesToScroll: 1,
            variableWidth: true,
            
            responsive: [
                {
                    breakpoint: 992, // Large devices
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        variableWidth: true
                    }
                },
                {
                    breakpoint: 1200, // Extra large devices
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1,
                        variableWidth: true
                    }
                }
            ]
        });
        
        // Add initial state check for carousel buttons
        setTimeout(function() {
            // Custom arrow handlers for consortium carousel
            $(".trigger_prev_consortium").off('click').on('click', function(e) {
                e.preventDefault();
                $('#slick').slick('slickPrev');
            });
            
            $(".trigger_next_consortium").off('click').on('click', function(e) {
                e.preventDefault();
                $('#slick').slick('slickNext');
            });
            
            // Handle button state based on slide position
            var slick = $('#slick').slick('getSlick');
            
            $('#slick').on('beforeChange', function(event, slick, currentSlide, nextSlide) {
                // Toggle button visibility based on slide position
                if (nextSlide === 0) {
                    $('.trigger_prev_consortium').css('opacity', '0.5');
                } else {
                    $('.trigger_prev_consortium').css('opacity', '1');
                }
                
                if (nextSlide >= slick.slideCount - slick.options.slidesToShow) {
                    $('.trigger_next_consortium').css('opacity', '0.5');
                } else {
                    $('.trigger_next_consortium').css('opacity', '1');
                }
            });
            
            // Initialize button states
            if (slick.currentSlide === 0) {
                $('.trigger_prev_consortium').css('opacity', '0.5');
            }
            
            if (slick.currentSlide >= slick.slideCount - slick.options.slidesToShow) {
                $('.trigger_next_consortium').css('opacity', '0.5');
            }
        }, 100);
    }

    if($('.news-carousel').length) {
        /* News highlights carousel **/
        var $newsCarousel = $('.news-carousel');
        
        $newsCarousel.slick({
            autoplay: false,
            // autoplaySpeed: 2000,
            draggable: true,
            // pauseOnHover: true,
            centerMode: false,
            variableWidth: true,
            infinite: false,  // Change to false to prevent infinite scrolling
            slidesToShow: 3,  // Show 3 full items
            speed: 1000,
            slidesToScroll: 1,
            arrows: true, // Enable arrows but they will be hidden with CSS
            dots: false,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        arrows: false,
                        dots: true,
                        // centerMode: true,
                        // centerPadding: '2%',
                        slidesToShow: 1
                    }
                }
            ]
        });

        // Ensure carousel is fully initialized
        setTimeout(function() {
            // Custom arrow click handlers
            $(".trigger_prev, .trigger_prev_arrow").click(function(e) {
                e.preventDefault();
                $newsCarousel.slick('slickPrev');
                return false;
            });
            
            $(".trigger_next, .trigger_next_arrow").click(function(e) {
                e.preventDefault();
                $newsCarousel.slick('slickNext');
                return false;
            });
            
            // Initialize button states
            $('.trigger_prev, .trigger_prev_arrow').css('opacity', '0.5');
        }, 100);
        
        // Limit the width of the slick track to prevent excessive scrolling
        $newsCarousel.on('init', function(event, slick){
            // Add class to first visible slide
            $(slick.$slides[0]).addClass('first-visible-slide');
        });
        
        $newsCarousel.on('afterChange', function(event, slick, currentSlide){
            $('.slick-slide').removeClass('first-visible-slide');
            $(slick.$slides[currentSlide]).addClass('first-visible-slide');
        });
        
        // Ensure navigation works correctly with our constrained carousel
        $newsCarousel.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
            // If we're at the last possible slide, prevent further navigation
            if (nextSlide >= slick.slideCount - 3) {
                // Disable next button visually
                $('.trigger_next, .trigger_next_arrow').css('opacity', '0.5');
            } else {
                // Enable next button
                $('.trigger_next, .trigger_next_arrow').css('opacity', '1');
            }
            
            // If we're at the first slide, disable previous button
            if (nextSlide === 0) {
                $('.trigger_prev, .trigger_prev_arrow').css('opacity', '0.5');
            } else {
                $('.trigger_prev, .trigger_prev_arrow').css('opacity', '1');
            }
        });
    }
    
    // Read more button that follows cursor for all news items
    if(screen.width > 1024){
        $('.home-news-cover a, .related-news .home-news-cover a').on('mouseenter', function(e) {
            // Show the button immediately at the current mouse position
            var parentOffset = $(this).offset();
            var relX = e.pageX - parentOffset.left;
            var relY = e.pageY - parentOffset.top;
            
            $(this).find('.read-more-btn').css({
                display: 'block',
                opacity: 1,
                left: relX + 'px',
                top: relY + 'px'
            });
        }).on('mouseleave', function() {
            // Hide the button immediately
            $(this).find('.read-more-btn').css({
                display: 'none'
            });
        }).on('mousemove', function(e) {
            var parentOffset = $(this).offset();
            var relX = e.pageX - parentOffset.left;
            var relY = e.pageY - parentOffset.top;
            var $btn = $(this).find('.read-more-btn');
            var btnWidth = $btn.outerWidth();
            var btnHeight = $btn.outerHeight();
            var containerWidth = $(this).width();
            var containerHeight = $(this).height();
            
            // Remove all edge classes
            $btn.removeClass('edge-right edge-left edge-top edge-bottom');
            
            // Handle edge cases
            var edgeThreshold = 50; // pixels from edge
            
            // Check if near right edge
            if (relX > containerWidth - edgeThreshold) {
                $btn.addClass('edge-right');
                relX = containerWidth - 20;
            } 
            // Check if near left edge
            else if (relX < edgeThreshold) {
                $btn.addClass('edge-left');
                relX = 20;
            }
            
            // Check if near bottom edge
            if (relY > containerHeight - edgeThreshold) {
                $btn.addClass('edge-bottom');
                relY = containerHeight - 20;
            } 
            // Check if near top edge
            else if (relY < edgeThreshold) {
                $btn.addClass('edge-top');
                relY = 20;
            }
            
            // Position the button immediately for precise cursor replacement
            $btn.css({
                left: relX + 'px',
                top: relY + 'px'
            });
        });
    }
});

function type(i, t, ie, oe) {
    input = document.getElementById(ie).innerHTML;
    document.getElementById(oe).innerHTML += input.charAt(i);
    setTimeout(function(){
        ((i < input.length - 1) ? type(i+1, t, ie, oe) : false);
    }, t);
}

function onHashChange(){
	$("g").removeClass('active_path');
	$(".accordion-content").hide();
	var caseStudiesHashTitle = location.hash;

	if(caseStudiesHashTitle){
		var caseStudiesTitle = caseStudiesHashTitle.substring(1, caseStudiesHashTitle.length);
		
		// Check if the hash corresponds to a tab
		if(['about', 'work-packages', 'partners'].includes(caseStudiesTitle)) {
		    // Trigger tab click
		    $('.tab-link[data-tab="' + caseStudiesTitle + '"]').trigger('click');
		    
		    // If it's the work-packages tab, initialize the toggle functionality
		    if(caseStudiesTitle === 'work-packages') {
		        initWorkPackagesToggle();
		    }
		} else {
		    // Handle other hash values (like case studies)
		    $("g[title='"+caseStudiesTitle.toUpperCase()+"']").addClass('active_path');
		}
	}
}

function encodeURIObject(data){
    return Object.keys(data).map(function (i) {
        return encodeURIComponent(i) + '=' + encodeURIComponent(data[i])
    }).join('&');
}

function redirectAndRefresh(url){
	$(".tabs a").each(function() {
		this.href = window.location.hash;
	});
	window.open(url, '_blank');
	location.reload();
}

function isBreakpointLarge() {
    return window.innerWidth <= 991;
}

function requestFormLibrary() {
	$('#mylibraryForm').on('click', 'a', function () {
		var $form = $(this).closest('form');
		$form.request();
	})
}

function requestFormPartners() {
	$('#myPartnersForm').on('click', 'a', function () {
		var $form = $(this).closest('form');
		$form.request();
	})
}

function scrollDown(){
	var element = $('#layout-content');
	$("html, body").animate({ scrollTop: element.offset().top - 190 }, 500);
}


function hideMe(elem){
    $(elem).parent().hide();
}


function getScreenSize() {
    var myHeight = 0;
    var myWidth = 0;
    if (window.innerWidth && window.innerHeight) {
        // Netscape & Mozilla
        myHeight = window.innerHeight;
        myWidth = window.innerWidth;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        // IE > 6
        myHeight = document.documentElement.clientHeight;
        myWidth = document.documentElement.clientWidth;
    } else if (document.body.offsetWidth && document.body.offsetHeight) {
        // IE = 6
        myHeight = document.body.offsetHeight;
        myWidth = document.body.offsetWidth;
    } else if (document.body.clientWidth && document.body.clientHeight) {
        // IE < 6
        myHeight = document.body.clientHeight;
        myWidth = document.body.clientWidth;
    }

    return {'width': myWidth, 'height': myHeight};
}

function initCircleAnimation(circleBorderSelector, containerSelector) {
    const circleBorder = document.querySelector(circleBorderSelector);
    if (!circleBorder) return;
    
    const imageContainer = document.querySelector(containerSelector);
    if (imageContainer) {
        imageContainer.addEventListener('mouseenter', function() {
            circleBorder.style.animationDirection = 'reverse';
        });
        
        imageContainer.addEventListener('mouseleave', function() {
            circleBorder.style.animationDirection = 'normal';
        });
    }
}

/**
 * Handles tab switching without page refreshes
 * This function initializes tab functionality for the about page
 */
function initTabs() {
    // Hide all tab content except the active one on page load
    $('.tab-content').not('.active').css({
        'display': 'none',
        'opacity': '0'
    });
    
    // Make sure active tab is visible
    $('.tab-content.active').css({
        'display': 'block',
        'opacity': '1'
    });
    
    // Handle tab click events
    $('.tab-link').on('click', function(e) {
        e.preventDefault();
        
        // Get the tab id from data attribute
        var tabId = $(this).data('tab');
        
        // Remove active class from all tabs and add to clicked tab
        $('.tab-link').removeClass('active');
        $(this).addClass('active');
        
        // Hide all tab content
        $('.tab-content').removeClass('active').css('opacity', '0');
        
        // After a short delay, hide the inactive tabs and show the active one
        setTimeout(function() {
            $('.tab-content').not('#' + tabId).css('display', 'none');
            $('#' + tabId).css({
                'display': 'block'
            });
            
            // After ensuring the display is set, fade in the content
            setTimeout(function() {
                $('#' + tabId).addClass('active').css('opacity', '1');
                
                // If switching to work-packages tab, make sure accordion functionality is initialized
                if (tabId === 'work-packages') {
                    // Reinitialize accordion if needed
                    initAccordion();
                    // Reinitialize work packages toggle
                    initWorkPackagesToggle();
                    
                    // Re-wrap work package items if needed
                    if (width >= 1024 && !$('#work-packages .key_0').parent().hasClass('col-md-4')) {
                        // First column: items 0, 3, 6, 9, etc.
                        $('#work-packages .key_0, #work-packages .key_3, #work-packages .key_6, #work-packages .key_9, #work-packages .key_12, #work-packages .key_15').wrapAll('<div class="col-md-4 col-xs-12" />');
                        
                        // Second column: items 1, 4, 7, 10, etc.
                        $('#work-packages .key_1, #work-packages .key_4, #work-packages .key_7, #work-packages .key_10, #work-packages .key_13, #work-packages .key_16').wrapAll('<div class="col-md-4 col-xs-12" />');
                        
                        // Third column: items 2, 5, 8, 11, etc.
                        $('#work-packages .key_2, #work-packages .key_5, #work-packages .key_8, #work-packages .key_11, #work-packages .key_14, #work-packages .key_17').wrapAll('<div class="col-md-4 col-xs-12" />');
                    }
                }
            }, 50);
        }, 300);
        
        if (history.pushState) {
            history.pushState(null, null, '#' + tabId);
        } else {
            location.hash = '#' + tabId;
        }
    });
    
    if (window.location.hash) {
        var tabId = window.location.hash.substring(1);
        $('.tab-link[data-tab="' + tabId + '"]').trigger('click');
    }
}

/**
 * Initialize accordion functionality
 * This ensures accordions work properly even when they're in hidden tabs
 */
function initAccordion() {
    $('.work_packages .accordion-toggle, .mission .accordion-toggle').off('click');
    
    $('.work_packages .accordion-toggle, .mission .accordion-toggle').on('click', function () {
        if ($(this).next(".accordion-content").is(':visible')) {
            $(this).next(".accordion-content").slideUp(300);
            $(this).children().find(".plusminus").text('+');
            $(this).children(".plusminus").html('<span class="plus"></span>');
            $(this).children(".green_bullet").removeClass('toggled');
        } else {
            $(this).next(".accordion-content").slideDown(300);
            $(this).children().find(".plusminus").text('-');
            $(this).children(".plusminus").html('<span class="minus"></span>');
            $(this).children(".green_bullet").addClass('toggled');
        }
    });
}

/**
 * Initialize work packages toggle functionality
 * This ensures the read more/less buttons work properly in the work packages section
 */
function initWorkPackagesToggle() {
    $('.read-more-wp').off('click');
    
    $('.read-more-wp').on('click', function() {
        toggleWorkPackage(this);
    });
}

/**
 * Toggle work package content visibility
 * @param {HTMLElement} element - The clicked "Read more" button
 */
function toggleWorkPackage(element) {
    var $button = $(element);
    var $workPackageBox = $button.closest('.work-package-box');
    var $content = $workPackageBox.find('.wp-content');
    
    if ($content.is(':visible')) {
        $button.removeClass('arrow-up');
        $content.slideUp(300, function() {
            $button.text('Read more');
        });
    } else {
        $button.addClass('arrow-up');
        $content.slideDown(300, function() {
            $button.text('Read less');
        });
    }
}
