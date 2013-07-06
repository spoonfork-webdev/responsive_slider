
(function ( $ ) {

  $.responsiveSlider = function (elem) {
    var slider,
        nav,
        base = this,
        methods = {};

    function Module (elem) {
      this.elem = elem;

      this.elem.getActiveSlide = function () {
        return this.children('.active');
      };

      this.elem.swapActiveClass = function (targetIndex) {
        this.children('.slide')
        .removeClass('active')
        .eq(targetIndex)
            .addClass('active');

        return this;
      };

      return this;
    }

    slider = new Module($(elem));

    Module.prototype = { navCounter: 1 };
    Module.prototype.slideCount = slider.elem.children().length;

    slider.hidden = {
      "display": "none",
      "float": "none",
      "opacity": 1,
      "z-index": 0
    };
    slider.staged = {
      "display": "block",
      "float": "left",
      "opacity": 1,
      "z-index": 1
    };


    /*Private Methods*/
    methods.init = function () {
      var htmlTag = document.getElementsByTagName('html')[0];

      slider.elem.children()
      .addClass('slide')
      .css(slider.hidden)
      .eq(0)
        .addClass('active')
        .css({'z-index': 2, 'display': 'block'})
        .clone()
        .removeAttr('class')
        .css({'opacity': 0, 'position': 'relative', 'z-index': 0})
        .appendTo(slider.elem);

      this.buildNav()
      .navInit();

      Module.prototype.detectTransitions = $(htmlTag).hasClass('csstransitions');
      Module.prototype.playing = false;

      if (Module.prototype.detectTransitions) {
        slider.elem.children().show()
        .css({
            "-webkit-transition": "opacity 600ms ease-out",
            "-moz-transition": "opacity 600ms ease-out",
            "-o-transition": "opacity 600ms ease-out",
            "transition": "opacity 600ms ease-out"
        });
      }
    };

    methods.buildNav = function () {
      var wrapper = $("<div class='navWrapper'></div>"),
          container = $("<div class='navContainer' style='overflow: hidden; position: relative;'></div>"),
          carousel = $("<ul class='navCarousel'></ul>"),
          pageButtons = $("<a class='pageLeft' href='#'></a><a class='pageRight' href='#'></a>");
          resume = $("<a class='resume' href='#'></a>");

      slider.elem.children('.slide').each(function () {
        var img = $(this).find('img');

        if (img.length !== 1) {
          if (!img.length) {
            img = $("<div style='display: block; width: 100%;'></div>");
        } else if (img.hasClass('slider-image')) {
            img.each(function () {
              if ($(this).hasClass('slider-image')) {
                img = $(this);
                return false;
              }
            });
        } else {
          img = image.eq(0);
          }
        }

        img = img.get(0).outerHTML;
        $("<li class='slide'>"+img+'</li>').appendTo(carousel);
      });

      container.append(carousel);

      wrapper.append(container)
      .append(pageButtons);

      slider.elem.after(wrapper)
      .append("<a class='resume' href='#'></a>");

      return this;
    };

    methods.navInit = function () {
      nav = new Module(slider.elem.next('.navWrapper').find('.navCarousel'));

      nav.slides = nav.elem.children('.slide');

      nav.slides.eq(0).addClass('active');
      nav.slideWidth = nav.slides.outerWidth(true);
      nav.carouselWidth = nav.slideWidth * Module.prototype.slideCount;

      $('.navWrapper .pageLeft, .navWrapper .pageRight').click(function (event) {
        event.preventDefault();
        if ($(this).siblings('.navCarousel').filter(':animated').length === 0) {
          nav.page.call(base, this.className);
        }
      });

      nav.slides.click(function (event) {
        if($(this).siblings('.slide.active').length) {
          var $this = $(this),
              $activeSlide = $this.siblings('.slide.active'),
              targetIndex = $this.prev('.slide').length;

          $activeSlide.removeClass('active');
          $this.addClass('active');

          slider.moveToSlide.call(base, $activeSlide, $this, targetIndex);


        }
      });

      nav.elem.parent().click(function (event) {
          slider.pause.call(base);
          slider.elem.children('.resume').show.call(base);
      });

      slider.elem.children('.resume').click(function () {
          slider.play.call(base);
      });

      return this;
    };

    methods.init();


    /*Slider Public Methods*/
    slider.iterate = function () {
      var activeSlide = slider.elem.getActiveSlide(),
          activeIndex = activeSlide.index(),
          targetIndex,
          targetSlide,
          vars = nav.getMeasurements();

      if (activeIndex >= (Module.prototype.slideCount - 1)) {
        targetSlide = slider.elem.children('.slide').eq(0);
        Module.prototype.navCounter = 1;
        nav.elem.animate({marginLeft: 0}, 600);
        nav.elem.swapActiveClass(0);
        slider.moveToSlide(activeSlide, targetSlide, 0);
      } else {
        ++Module.prototype.navCounter;
        targetIndex = activeIndex + 1;

        if (Module.prototype.navCounter > vars.viewportCapacity) {
          newOffset = vars.navOffset  - vars.pixelsToMove;
          nav.pageRight(vars);
          Module.prototype.navCounter = 1;
        } else {
          targetSlide = slider.elem.children('.slide').eq(targetIndex);

          if (!targetSlide.hasClass('active')) {
            nav.elem.swapActiveClass(targetIndex);
            slider.moveToSlide(activeSlide, targetSlide, targetIndex);
          }
        }
      }
    };

    if (Module.prototype.detectTransitions) {
      slider.moveToSlide = function (activeSlide, targetSlide, targetIndex) {
        targetSlide.css(slider.staged);
        activeSlide.css('opacity', 0)
        .get(0)
        .addEventListener("webkitTransitionEnd", function () {
          targetSlide.css('z-index', 2);
          activeSlide.css(slider.hidden);
          slider.elem.swapActiveClass(targetIndex);
        }, true);

        return this;
      };
    } else {
      slider.moveToSlide = function (activeSlide, targetSlide, targetIndex) {
        var activeSlide = slider.elem.getActiveSlide(),
            $targetSlide = 

        targetSlide.css(slider.staged);
        activeSlide.fadeOut(600, function () {
          targetSlide.css('z-index', 2);
          activeSlide.css(slider.hidden).css('opacity', 0);
          slider.elem.swapActiveClass(targetIndex);
        });

        return this;
      };
    }

    slider.play = function () {
      Module.prototype.playerId = setInterval(slider.iterate.bind(base), 5000);
      Module.prototype.playing = true;
    };

    slider.pause = function () {
      clearInterval(Module.prototype.playerId);
      Module.prototype.playing = false;
    };

    /*Nav Public Methods*/
    nav.getMeasurements = function () {
        var vars = {};
        vars.parentWidth = parseInt(this.elem.parent().css('width'), 10);
        vars.navOffset = parseInt(this.elem.css('margin-left'), 10);
        vars.viewportCapacity = Math.floor(vars.parentWidth / this.slideWidth);
        vars.pixelsToMove = (vars.viewportCapacity * this.slideWidth);

        return vars;
    };

    nav.page = function (direction) {
      var vars = nav.getMeasurements();

      if (slider.playing) { slider.pause(); }

      nav[direction](vars);
    };
    nav.pageRight = function (vars) {
      if ((nav.carouselWidth - vars.parentWidth) > -vars.navOffset) {
        var availablePixels = (vars.navOffset - vars.pixelsToMove) + nav.carouselWidth;

        if (availablePixels <= vars.pixelsToMove) {
          availablePixels = availablePixels - (vars.parentWidth - vars.pixelsToMove);
          newOffset = vars.navOffset - availablePixels;
        } else {
          newOffset = vars.navOffset  - vars.pixelsToMove;
        }
        nav.elem.animate({marginLeft: newOffset}, 600, function () {
          nav.setActiveSlide(newOffset);
        });
      }
    };
    nav.pageLeft = function (vars) {
      if (vars.navOffset < 0) {
        var availablePixels = -vars.navOffset;

        if (availablePixels < vars.pixelsToMove) {
          newOffset = 0;
        } else {
          newOffset = vars.navOffset + vars.pixelsToMove;
        }
        nav.elem.animate({marginLeft: newOffset}, 600, function () {
          nav.setActiveSlide(newOffset);
        });
      }
    };
    nav.setActiveSlide = function (offsetVal) {
      var targetIndex = Math.ceil(-offsetVal / nav.slideWidth),
          sliderActive,
          sliderTarget;

      sliderActive = slider.elem.getActiveSlide();
      sliderTarget = slider.elem.children('.slide').eq(targetIndex);

      nav.elem.swapActiveClass(targetIndex);
      slider.moveToSlide(sliderActive, sliderTarget, targetIndex);
    };

    $.data(elem, 'responsiveSlider', slider);

    if (!slider.playing) {
      /*slider.play();*/
    }
  };


  $.fn.responsiveSlider = function (hook) {
    if (!this.data('responsiveSlider')) {
      this.each(function () {
        new $.responsiveSlider(this);
      });
    } else if (typeof hook === 'string') {
        var $slider = this.data('responsiveSlider');
        $slider[hook]();
    }
  };

}( jQuery ));
