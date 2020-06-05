const arrowShape = { 
  x0: 10,
  x1: 60, y1: 50,
  x2: 65, y2: 45,
  x3: 20
}

const flickityDots = (dots, dotBox) => {
  dots.each(function(index, dot) {
    $(dot).html(index + 1);
  })
  $(dotBox).append(`<li class="dot total">${dots.length}</li>`)
}


// ANIMATION SPECIFIC CODE

// debounce function to prevent jankyness when scrolling for animations and such
function debounce(func, wait=20, immediate = true) {
  var timeout;

  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if(!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if(callNow) func.apply(context, args);
  };

};

let oldScroll = 0

const onScrollWindow = (e, navbar) => {
// FALSE if UP and TRUE if DOWN
  console.log(window.scrollY)
  if(window.scrollY > 100)  {
    navbar.classList.add('small');
  } else {
    navbar.classList.remove('small');
  }
  if (oldScroll < window.pageYOffset && oldScroll > 10){
    navbar.style.opacity = 0
  } else {
    navbar.style.opacity = 1
  }

  oldScroll = window.pageYOffset
}


// NEW ANIMATION IMPLEMENTATION
// Helper function from: http://stackoverflow.com/a/7557433/274826
const isElementInViewport = (el) => {
// special bonus for those using jQuery
if (typeof jQuery === "function" && el instanceof jQuery) {
  el = el[0];
}
var rect = el.getBoundingClientRect();
return (
  (rect.top <= 0
    && rect.bottom >= 0)
  ||
  (rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.top <= (window.innerHeight || document.documentElement.clientHeight))
  ||
  (rect.top >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight))
);
}

const scroll = window.requestAnimationFrame || function(callback){ window.setTimeout(callback, 1000/60)};

const animationLoop = () => {
const elements = document.querySelectorAll('.will-animate');
elements.forEach(elem => {
  const animation = elem.dataset.animate.split(' ')
  if(isElementInViewport(elem)){
    elem.classList.add(...animation)
  } else {
    elem.classList.remove(...animation)
  }
})
scroll(animationLoop)
}
$(document).ready(function() {
  let navbar =  document.getElementById('nav');  
  let links = $('#nav .links');
  let navClose = $('#nav .nav-close')
  animationLoop()
  if (window.innerWidth > 650){
    window.addEventListener('scroll', debounce((e) => {onScrollWindow(e, navbar)}))
  }
  
  $('.nav-toggle').on('click', function(){
    console.log('toggle');
    links.addClass('active');
    navClose.addClass('active');
  })
  navClose.on('click', function() {
    links.removeClass('active');
    navClose.removeClass('active');
  })
  $('.about-gallery-carousel').flickity({
    contain: true, 
    arrowShape: arrowShape, 
    wrapAround: true, 
    autoPlay: true,
    fullscreen: true,
    on : {
      ready: function() {
        const dots = $('.about-gallery-carousel .dot')
        const dotBox = $('.about-gallery-carousel .flickity-page-dots')
        flickityDots(dots, dotBox);
      }
    }
  });
  $('.team-gallery').flickity({ 
    arrowShape: arrowShape, 
    wrapAround: true, 
    contain: true,
    imagesLoaded: true,
    on: {
      ready: function() {
        const dots = $('.team-gallery .dot')
        const dotBox = $('.team-gallery .flickity-page-dots')
        flickityDots(dots, dotBox);
      }
    }
  });

  // $('#trailer').hover(function toggleControls() {
  //     if (this.hasAttribute("controls")) {
  //         this.removeAttribute("controls")
  //     } else {
  //         this.setAttribute("controls", "controls")
  //     }
  // })

  $('#trailer').mouseenter(function(){
    this.setAttribute("controls", "controls")
  })

  $('#trailer').mouseleave(function(){
    this.removeAttribute("controls")
  })
  // Select all links with hashes
  $('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          
        });
      }
    }
  });
})