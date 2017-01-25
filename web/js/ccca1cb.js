;(function($){$.TMSearch=function(o){var defaults={form:'.search-form',input:'.search-form_input',toggle:'.search-form_toggle',liveout:'.search-form_liveout',out:'#search-results',scope:1,handler:'bat/SearchHandler.php'}
var options=$.extend({},defaults,o);var $form=$(options.form),$input=$(options.input,$form),$liveout=$(options.liveout,$form),$toggle=$(options.toggle),$out=$(options.out);if($toggle.length>0){$toggle.click(function(){$form.toggleClass('on');if(!$toggle.hasClass('active')){$(this).parents().eq(options.scope).find(options.form).find('input').val('').focus();}
$toggle.toggleClass('active');return false;});$(document).click(function(e){if($toggle.hasClass('active')&&e.target.className.indexOf(options.form.substr(1,options.form.length- 1))){$toggle.removeClass('active');$form.removeClass('on');}});}
if($('html').hasClass('desktop')){$input.on("keyup",function(){$.get(options.handler,{s:$(this).val(),liveSearch:"true",dataType:"html"},onSuccess);function onSuccess(data){$liveout.html(data);}});$input.on('focusout',function(){setTimeout(function(){$liveout.html('');},300);})}
if($out.length>0){$out.height(0);var s=location.search.replace(/^\?.*s=([^&]+)/,'$1'),ifr=$('<iframe width="100%" height="100%" frameborder="0" marginheight="0" marginwidth="0" allowTransparency="true"></iframe>')
if($out.length){ifr.attr({src:options.handler+'?s='+ s}).appendTo($out),$input.val(decodeURI(s));}
window._resize=function(h){$out.height(h)}}}})(jQuery);$(document).ready(function(){$.TMSearch();});
/*!
 * Bootstrap v3.3.7 (http://getbootstrap.com)
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 3)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.7
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.7
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.7'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector === '#' ? [] : selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.7
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.7'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d).prop(d, true)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d).prop(d, false)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target).closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"], input[type="checkbox"]'))) {
        // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
        e.preventDefault()
        // The target component still receive the focus
        if ($btn.is('input,button')) $btn.trigger('focus')
        else $btn.find('input:visible,button:visible').first().trigger('focus')
      }
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.7
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.7'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.7
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/* jshint latedef: false */

+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.7'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.7
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.7'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.7
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.7'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (document !== e.target &&
            this.$element[0] !== e.target &&
            !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.7
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.7'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      if (that.$element) { // TODO: Check whether guarding this code with this `if` is really necessary.
        that.$element
          .removeAttr('aria-describedby')
          .trigger('hidden.bs.' + that.type)
      }
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var isSvg = window.SVGElement && el instanceof window.SVGElement
    // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
    // See https://github.com/twbs/bootstrap/issues/20280
    var elOffset  = isBody ? { top: 0, left: 0 } : (isSvg ? null : $element.offset())
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
      that.$element = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.7
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.7'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.7
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.7'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.7
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.7'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.7
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.7'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);

/*!
 * Bootstrap v3.3.7 (http://getbootstrap.com)
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under the MIT license
 */
if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(a){"use strict";var b=a.fn.jquery.split(" ")[0].split(".");if(b[0]<2&&b[1]<9||1==b[0]&&9==b[1]&&b[2]<1||b[0]>3)throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4")}(jQuery),+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]};return!1}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one("bsTransitionEnd",function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b(),a.support.transition&&(a.event.special.bsTransitionEnd={bindType:a.support.transition.end,delegateType:a.support.transition.end,handle:function(b){if(a(b.target).is(this))return b.handleObj.handler.apply(this,arguments)}})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var c=a(this),e=c.data("bs.alert");e||c.data("bs.alert",e=new d(this)),"string"==typeof b&&e[b].call(c)})}var c='[data-dismiss="alert"]',d=function(b){a(b).on("click",c,this.close)};d.VERSION="3.3.7",d.TRANSITION_DURATION=150,d.prototype.close=function(b){function c(){g.detach().trigger("closed.bs.alert").remove()}var e=a(this),f=e.attr("data-target");f||(f=e.attr("href"),f=f&&f.replace(/.*(?=#[^\s]*$)/,""));var g=a("#"===f?[]:f);b&&b.preventDefault(),g.length||(g=e.closest(".alert")),g.trigger(b=a.Event("close.bs.alert")),b.isDefaultPrevented()||(g.removeClass("in"),a.support.transition&&g.hasClass("fade")?g.one("bsTransitionEnd",c).emulateTransitionEnd(d.TRANSITION_DURATION):c())};var e=a.fn.alert;a.fn.alert=b,a.fn.alert.Constructor=d,a.fn.alert.noConflict=function(){return a.fn.alert=e,this},a(document).on("click.bs.alert.data-api",c,d.prototype.close)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.button"),f="object"==typeof b&&b;e||d.data("bs.button",e=new c(this,f)),"toggle"==b?e.toggle():b&&e.setState(b)})}var c=function(b,d){this.$element=a(b),this.options=a.extend({},c.DEFAULTS,d),this.isLoading=!1};c.VERSION="3.3.7",c.DEFAULTS={loadingText:"loading..."},c.prototype.setState=function(b){var c="disabled",d=this.$element,e=d.is("input")?"val":"html",f=d.data();b+="Text",null==f.resetText&&d.data("resetText",d[e]()),setTimeout(a.proxy(function(){d[e](null==f[b]?this.options[b]:f[b]),"loadingText"==b?(this.isLoading=!0,d.addClass(c).attr(c,c).prop(c,!0)):this.isLoading&&(this.isLoading=!1,d.removeClass(c).removeAttr(c).prop(c,!1))},this),0)},c.prototype.toggle=function(){var a=!0,b=this.$element.closest('[data-toggle="buttons"]');if(b.length){var c=this.$element.find("input");"radio"==c.prop("type")?(c.prop("checked")&&(a=!1),b.find(".active").removeClass("active"),this.$element.addClass("active")):"checkbox"==c.prop("type")&&(c.prop("checked")!==this.$element.hasClass("active")&&(a=!1),this.$element.toggleClass("active")),c.prop("checked",this.$element.hasClass("active")),a&&c.trigger("change")}else this.$element.attr("aria-pressed",!this.$element.hasClass("active")),this.$element.toggleClass("active")};var d=a.fn.button;a.fn.button=b,a.fn.button.Constructor=c,a.fn.button.noConflict=function(){return a.fn.button=d,this},a(document).on("click.bs.button.data-api",'[data-toggle^="button"]',function(c){var d=a(c.target).closest(".btn");b.call(d,"toggle"),a(c.target).is('input[type="radio"], input[type="checkbox"]')||(c.preventDefault(),d.is("input,button")?d.trigger("focus"):d.find("input:visible,button:visible").first().trigger("focus"))}).on("focus.bs.button.data-api blur.bs.button.data-api",'[data-toggle^="button"]',function(b){a(b.target).closest(".btn").toggleClass("focus",/^focus(in)?$/.test(b.type))})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.carousel"),f=a.extend({},c.DEFAULTS,d.data(),"object"==typeof b&&b),g="string"==typeof b?b:f.slide;e||d.data("bs.carousel",e=new c(this,f)),"number"==typeof b?e.to(b):g?e[g]():f.interval&&e.pause().cycle()})}var c=function(b,c){this.$element=a(b),this.$indicators=this.$element.find(".carousel-indicators"),this.options=c,this.paused=null,this.sliding=null,this.interval=null,this.$active=null,this.$items=null,this.options.keyboard&&this.$element.on("keydown.bs.carousel",a.proxy(this.keydown,this)),"hover"==this.options.pause&&!("ontouchstart"in document.documentElement)&&this.$element.on("mouseenter.bs.carousel",a.proxy(this.pause,this)).on("mouseleave.bs.carousel",a.proxy(this.cycle,this))};c.VERSION="3.3.7",c.TRANSITION_DURATION=600,c.DEFAULTS={interval:5e3,pause:"hover",wrap:!0,keyboard:!0},c.prototype.keydown=function(a){if(!/input|textarea/i.test(a.target.tagName)){switch(a.which){case 37:this.prev();break;case 39:this.next();break;default:return}a.preventDefault()}},c.prototype.cycle=function(b){return b||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},c.prototype.getItemIndex=function(a){return this.$items=a.parent().children(".item"),this.$items.index(a||this.$active)},c.prototype.getItemForDirection=function(a,b){var c=this.getItemIndex(b),d="prev"==a&&0===c||"next"==a&&c==this.$items.length-1;if(d&&!this.options.wrap)return b;var e="prev"==a?-1:1,f=(c+e)%this.$items.length;return this.$items.eq(f)},c.prototype.to=function(a){var b=this,c=this.getItemIndex(this.$active=this.$element.find(".item.active"));if(!(a>this.$items.length-1||a<0))return this.sliding?this.$element.one("slid.bs.carousel",function(){b.to(a)}):c==a?this.pause().cycle():this.slide(a>c?"next":"prev",this.$items.eq(a))},c.prototype.pause=function(b){return b||(this.paused=!0),this.$element.find(".next, .prev").length&&a.support.transition&&(this.$element.trigger(a.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},c.prototype.next=function(){if(!this.sliding)return this.slide("next")},c.prototype.prev=function(){if(!this.sliding)return this.slide("prev")},c.prototype.slide=function(b,d){var e=this.$element.find(".item.active"),f=d||this.getItemForDirection(b,e),g=this.interval,h="next"==b?"left":"right",i=this;if(f.hasClass("active"))return this.sliding=!1;var j=f[0],k=a.Event("slide.bs.carousel",{relatedTarget:j,direction:h});if(this.$element.trigger(k),!k.isDefaultPrevented()){if(this.sliding=!0,g&&this.pause(),this.$indicators.length){this.$indicators.find(".active").removeClass("active");var l=a(this.$indicators.children()[this.getItemIndex(f)]);l&&l.addClass("active")}var m=a.Event("slid.bs.carousel",{relatedTarget:j,direction:h});return a.support.transition&&this.$element.hasClass("slide")?(f.addClass(b),f[0].offsetWidth,e.addClass(h),f.addClass(h),e.one("bsTransitionEnd",function(){f.removeClass([b,h].join(" ")).addClass("active"),e.removeClass(["active",h].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger(m)},0)}).emulateTransitionEnd(c.TRANSITION_DURATION)):(e.removeClass("active"),f.addClass("active"),this.sliding=!1,this.$element.trigger(m)),g&&this.cycle(),this}};var d=a.fn.carousel;a.fn.carousel=b,a.fn.carousel.Constructor=c,a.fn.carousel.noConflict=function(){return a.fn.carousel=d,this};var e=function(c){var d,e=a(this),f=a(e.attr("data-target")||(d=e.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,""));if(f.hasClass("carousel")){var g=a.extend({},f.data(),e.data()),h=e.attr("data-slide-to");h&&(g.interval=!1),b.call(f,g),h&&f.data("bs.carousel").to(h),c.preventDefault()}};a(document).on("click.bs.carousel.data-api","[data-slide]",e).on("click.bs.carousel.data-api","[data-slide-to]",e),a(window).on("load",function(){a('[data-ride="carousel"]').each(function(){var c=a(this);b.call(c,c.data())})})}(jQuery),+function(a){"use strict";function b(b){var c,d=b.attr("data-target")||(c=b.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,"");return a(d)}function c(b){return this.each(function(){var c=a(this),e=c.data("bs.collapse"),f=a.extend({},d.DEFAULTS,c.data(),"object"==typeof b&&b);!e&&f.toggle&&/show|hide/.test(b)&&(f.toggle=!1),e||c.data("bs.collapse",e=new d(this,f)),"string"==typeof b&&e[b]()})}var d=function(b,c){this.$element=a(b),this.options=a.extend({},d.DEFAULTS,c),this.$trigger=a('[data-toggle="collapse"][href="#'+b.id+'"],[data-toggle="collapse"][data-target="#'+b.id+'"]'),this.transitioning=null,this.options.parent?this.$parent=this.getParent():this.addAriaAndCollapsedClass(this.$element,this.$trigger),this.options.toggle&&this.toggle()};d.VERSION="3.3.7",d.TRANSITION_DURATION=350,d.DEFAULTS={toggle:!0},d.prototype.dimension=function(){var a=this.$element.hasClass("width");return a?"width":"height"},d.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var b,e=this.$parent&&this.$parent.children(".panel").children(".in, .collapsing");if(!(e&&e.length&&(b=e.data("bs.collapse"),b&&b.transitioning))){var f=a.Event("show.bs.collapse");if(this.$element.trigger(f),!f.isDefaultPrevented()){e&&e.length&&(c.call(e,"hide"),b||e.data("bs.collapse",null));var g=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[g](0).attr("aria-expanded",!0),this.$trigger.removeClass("collapsed").attr("aria-expanded",!0),this.transitioning=1;var h=function(){this.$element.removeClass("collapsing").addClass("collapse in")[g](""),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return h.call(this);var i=a.camelCase(["scroll",g].join("-"));this.$element.one("bsTransitionEnd",a.proxy(h,this)).emulateTransitionEnd(d.TRANSITION_DURATION)[g](this.$element[0][i])}}}},d.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var b=a.Event("hide.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.dimension();this.$element[c](this.$element[c]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded",!1),this.$trigger.addClass("collapsed").attr("aria-expanded",!1),this.transitioning=1;var e=function(){this.transitioning=0,this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")};return a.support.transition?void this.$element[c](0).one("bsTransitionEnd",a.proxy(e,this)).emulateTransitionEnd(d.TRANSITION_DURATION):e.call(this)}}},d.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()},d.prototype.getParent=function(){return a(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each(a.proxy(function(c,d){var e=a(d);this.addAriaAndCollapsedClass(b(e),e)},this)).end()},d.prototype.addAriaAndCollapsedClass=function(a,b){var c=a.hasClass("in");a.attr("aria-expanded",c),b.toggleClass("collapsed",!c).attr("aria-expanded",c)};var e=a.fn.collapse;a.fn.collapse=c,a.fn.collapse.Constructor=d,a.fn.collapse.noConflict=function(){return a.fn.collapse=e,this},a(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(d){var e=a(this);e.attr("data-target")||d.preventDefault();var f=b(e),g=f.data("bs.collapse"),h=g?"toggle":e.data();c.call(f,h)})}(jQuery),+function(a){"use strict";function b(b){var c=b.attr("data-target");c||(c=b.attr("href"),c=c&&/#[A-Za-z]/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,""));var d=c&&a(c);return d&&d.length?d:b.parent()}function c(c){c&&3===c.which||(a(e).remove(),a(f).each(function(){var d=a(this),e=b(d),f={relatedTarget:this};e.hasClass("open")&&(c&&"click"==c.type&&/input|textarea/i.test(c.target.tagName)&&a.contains(e[0],c.target)||(e.trigger(c=a.Event("hide.bs.dropdown",f)),c.isDefaultPrevented()||(d.attr("aria-expanded","false"),e.removeClass("open").trigger(a.Event("hidden.bs.dropdown",f)))))}))}function d(b){return this.each(function(){var c=a(this),d=c.data("bs.dropdown");d||c.data("bs.dropdown",d=new g(this)),"string"==typeof b&&d[b].call(c)})}var e=".dropdown-backdrop",f='[data-toggle="dropdown"]',g=function(b){a(b).on("click.bs.dropdown",this.toggle)};g.VERSION="3.3.7",g.prototype.toggle=function(d){var e=a(this);if(!e.is(".disabled, :disabled")){var f=b(e),g=f.hasClass("open");if(c(),!g){"ontouchstart"in document.documentElement&&!f.closest(".navbar-nav").length&&a(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(a(this)).on("click",c);var h={relatedTarget:this};if(f.trigger(d=a.Event("show.bs.dropdown",h)),d.isDefaultPrevented())return;e.trigger("focus").attr("aria-expanded","true"),f.toggleClass("open").trigger(a.Event("shown.bs.dropdown",h))}return!1}},g.prototype.keydown=function(c){if(/(38|40|27|32)/.test(c.which)&&!/input|textarea/i.test(c.target.tagName)){var d=a(this);if(c.preventDefault(),c.stopPropagation(),!d.is(".disabled, :disabled")){var e=b(d),g=e.hasClass("open");if(!g&&27!=c.which||g&&27==c.which)return 27==c.which&&e.find(f).trigger("focus"),d.trigger("click");var h=" li:not(.disabled):visible a",i=e.find(".dropdown-menu"+h);if(i.length){var j=i.index(c.target);38==c.which&&j>0&&j--,40==c.which&&j<i.length-1&&j++,~j||(j=0),i.eq(j).trigger("focus")}}}};var h=a.fn.dropdown;a.fn.dropdown=d,a.fn.dropdown.Constructor=g,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=h,this},a(document).on("click.bs.dropdown.data-api",c).on("click.bs.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.bs.dropdown.data-api",f,g.prototype.toggle).on("keydown.bs.dropdown.data-api",f,g.prototype.keydown).on("keydown.bs.dropdown.data-api",".dropdown-menu",g.prototype.keydown)}(jQuery),+function(a){"use strict";function b(b,d){return this.each(function(){var e=a(this),f=e.data("bs.modal"),g=a.extend({},c.DEFAULTS,e.data(),"object"==typeof b&&b);f||e.data("bs.modal",f=new c(this,g)),"string"==typeof b?f[b](d):g.show&&f.show(d)})}var c=function(b,c){this.options=c,this.$body=a(document.body),this.$element=a(b),this.$dialog=this.$element.find(".modal-dialog"),this.$backdrop=null,this.isShown=null,this.originalBodyPad=null,this.scrollbarWidth=0,this.ignoreBackdropClick=!1,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,a.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};c.VERSION="3.3.7",c.TRANSITION_DURATION=300,c.BACKDROP_TRANSITION_DURATION=150,c.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},c.prototype.toggle=function(a){return this.isShown?this.hide():this.show(a)},c.prototype.show=function(b){var d=this,e=a.Event("show.bs.modal",{relatedTarget:b});this.$element.trigger(e),this.isShown||e.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.setScrollbar(),this.$body.addClass("modal-open"),this.escape(),this.resize(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.$dialog.on("mousedown.dismiss.bs.modal",function(){d.$element.one("mouseup.dismiss.bs.modal",function(b){a(b.target).is(d.$element)&&(d.ignoreBackdropClick=!0)})}),this.backdrop(function(){var e=a.support.transition&&d.$element.hasClass("fade");d.$element.parent().length||d.$element.appendTo(d.$body),d.$element.show().scrollTop(0),d.adjustDialog(),e&&d.$element[0].offsetWidth,d.$element.addClass("in"),d.enforceFocus();var f=a.Event("shown.bs.modal",{relatedTarget:b});e?d.$dialog.one("bsTransitionEnd",function(){d.$element.trigger("focus").trigger(f)}).emulateTransitionEnd(c.TRANSITION_DURATION):d.$element.trigger("focus").trigger(f)}))},c.prototype.hide=function(b){b&&b.preventDefault(),b=a.Event("hide.bs.modal"),this.$element.trigger(b),this.isShown&&!b.isDefaultPrevented()&&(this.isShown=!1,this.escape(),this.resize(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"),this.$dialog.off("mousedown.dismiss.bs.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",a.proxy(this.hideModal,this)).emulateTransitionEnd(c.TRANSITION_DURATION):this.hideModal())},c.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(a){document===a.target||this.$element[0]===a.target||this.$element.has(a.target).length||this.$element.trigger("focus")},this))},c.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keydown.dismiss.bs.modal",a.proxy(function(a){27==a.which&&this.hide()},this)):this.isShown||this.$element.off("keydown.dismiss.bs.modal")},c.prototype.resize=function(){this.isShown?a(window).on("resize.bs.modal",a.proxy(this.handleUpdate,this)):a(window).off("resize.bs.modal")},c.prototype.hideModal=function(){var a=this;this.$element.hide(),this.backdrop(function(){a.$body.removeClass("modal-open"),a.resetAdjustments(),a.resetScrollbar(),a.$element.trigger("hidden.bs.modal")})},c.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},c.prototype.backdrop=function(b){var d=this,e=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var f=a.support.transition&&e;if(this.$backdrop=a(document.createElement("div")).addClass("modal-backdrop "+e).appendTo(this.$body),this.$element.on("click.dismiss.bs.modal",a.proxy(function(a){return this.ignoreBackdropClick?void(this.ignoreBackdropClick=!1):void(a.target===a.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus():this.hide()))},this)),f&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!b)return;f?this.$backdrop.one("bsTransitionEnd",b).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):b()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var g=function(){d.removeBackdrop(),b&&b()};a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",g).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):g()}else b&&b()},c.prototype.handleUpdate=function(){this.adjustDialog()},c.prototype.adjustDialog=function(){var a=this.$element[0].scrollHeight>document.documentElement.clientHeight;this.$element.css({paddingLeft:!this.bodyIsOverflowing&&a?this.scrollbarWidth:"",paddingRight:this.bodyIsOverflowing&&!a?this.scrollbarWidth:""})},c.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:"",paddingRight:""})},c.prototype.checkScrollbar=function(){var a=window.innerWidth;if(!a){var b=document.documentElement.getBoundingClientRect();a=b.right-Math.abs(b.left)}this.bodyIsOverflowing=document.body.clientWidth<a,this.scrollbarWidth=this.measureScrollbar()},c.prototype.setScrollbar=function(){var a=parseInt(this.$body.css("padding-right")||0,10);this.originalBodyPad=document.body.style.paddingRight||"",this.bodyIsOverflowing&&this.$body.css("padding-right",a+this.scrollbarWidth)},c.prototype.resetScrollbar=function(){this.$body.css("padding-right",this.originalBodyPad)},c.prototype.measureScrollbar=function(){var a=document.createElement("div");a.className="modal-scrollbar-measure",this.$body.append(a);var b=a.offsetWidth-a.clientWidth;return this.$body[0].removeChild(a),b};var d=a.fn.modal;a.fn.modal=b,a.fn.modal.Constructor=c,a.fn.modal.noConflict=function(){return a.fn.modal=d,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(c){var d=a(this),e=d.attr("href"),f=a(d.attr("data-target")||e&&e.replace(/.*(?=#[^\s]+$)/,"")),g=f.data("bs.modal")?"toggle":a.extend({remote:!/#/.test(e)&&e},f.data(),d.data());d.is("a")&&c.preventDefault(),f.one("show.bs.modal",function(a){a.isDefaultPrevented()||f.one("hidden.bs.modal",function(){d.is(":visible")&&d.trigger("focus")})}),b.call(f,g,this)})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tooltip"),f="object"==typeof b&&b;!e&&/destroy|hide/.test(b)||(e||d.data("bs.tooltip",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.type=null,this.options=null,this.enabled=null,this.timeout=null,this.hoverState=null,this.$element=null,this.inState=null,this.init("tooltip",a,b)};c.VERSION="3.3.7",c.TRANSITION_DURATION=150,c.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1,viewport:{selector:"body",padding:0}},c.prototype.init=function(b,c,d){if(this.enabled=!0,this.type=b,this.$element=a(c),this.options=this.getOptions(d),this.$viewport=this.options.viewport&&a(a.isFunction(this.options.viewport)?this.options.viewport.call(this,this.$element):this.options.viewport.selector||this.options.viewport),this.inState={click:!1,hover:!1,focus:!1},this.$element[0]instanceof document.constructor&&!this.options.selector)throw new Error("`selector` option must be specified when initializing "+this.type+" on the window.document object!");for(var e=this.options.trigger.split(" "),f=e.length;f--;){var g=e[f];if("click"==g)this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this));else if("manual"!=g){var h="hover"==g?"mouseenter":"focusin",i="hover"==g?"mouseleave":"focusout";this.$element.on(h+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(i+"."+this.type,this.options.selector,a.proxy(this.leave,this))}}this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.getOptions=function(b){return b=a.extend({},this.getDefaults(),this.$element.data(),b),b.delay&&"number"==typeof b.delay&&(b.delay={show:b.delay,hide:b.delay}),b},c.prototype.getDelegateOptions=function(){var b={},c=this.getDefaults();return this._options&&a.each(this._options,function(a,d){c[a]!=d&&(b[a]=d)}),b},c.prototype.enter=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),b instanceof a.Event&&(c.inState["focusin"==b.type?"focus":"hover"]=!0),c.tip().hasClass("in")||"in"==c.hoverState?void(c.hoverState="in"):(clearTimeout(c.timeout),c.hoverState="in",c.options.delay&&c.options.delay.show?void(c.timeout=setTimeout(function(){"in"==c.hoverState&&c.show()},c.options.delay.show)):c.show())},c.prototype.isInStateTrue=function(){for(var a in this.inState)if(this.inState[a])return!0;return!1},c.prototype.leave=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);if(c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),b instanceof a.Event&&(c.inState["focusout"==b.type?"focus":"hover"]=!1),!c.isInStateTrue())return clearTimeout(c.timeout),c.hoverState="out",c.options.delay&&c.options.delay.hide?void(c.timeout=setTimeout(function(){"out"==c.hoverState&&c.hide()},c.options.delay.hide)):c.hide()},c.prototype.show=function(){var b=a.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){this.$element.trigger(b);var d=a.contains(this.$element[0].ownerDocument.documentElement,this.$element[0]);if(b.isDefaultPrevented()||!d)return;var e=this,f=this.tip(),g=this.getUID(this.type);this.setContent(),f.attr("id",g),this.$element.attr("aria-describedby",g),this.options.animation&&f.addClass("fade");var h="function"==typeof this.options.placement?this.options.placement.call(this,f[0],this.$element[0]):this.options.placement,i=/\s?auto?\s?/i,j=i.test(h);j&&(h=h.replace(i,"")||"top"),f.detach().css({top:0,left:0,display:"block"}).addClass(h).data("bs."+this.type,this),this.options.container?f.appendTo(this.options.container):f.insertAfter(this.$element),this.$element.trigger("inserted.bs."+this.type);var k=this.getPosition(),l=f[0].offsetWidth,m=f[0].offsetHeight;if(j){var n=h,o=this.getPosition(this.$viewport);h="bottom"==h&&k.bottom+m>o.bottom?"top":"top"==h&&k.top-m<o.top?"bottom":"right"==h&&k.right+l>o.width?"left":"left"==h&&k.left-l<o.left?"right":h,f.removeClass(n).addClass(h)}var p=this.getCalculatedOffset(h,k,l,m);this.applyPlacement(p,h);var q=function(){var a=e.hoverState;e.$element.trigger("shown.bs."+e.type),e.hoverState=null,"out"==a&&e.leave(e)};a.support.transition&&this.$tip.hasClass("fade")?f.one("bsTransitionEnd",q).emulateTransitionEnd(c.TRANSITION_DURATION):q()}},c.prototype.applyPlacement=function(b,c){var d=this.tip(),e=d[0].offsetWidth,f=d[0].offsetHeight,g=parseInt(d.css("margin-top"),10),h=parseInt(d.css("margin-left"),10);isNaN(g)&&(g=0),isNaN(h)&&(h=0),b.top+=g,b.left+=h,a.offset.setOffset(d[0],a.extend({using:function(a){d.css({top:Math.round(a.top),left:Math.round(a.left)})}},b),0),d.addClass("in");var i=d[0].offsetWidth,j=d[0].offsetHeight;"top"==c&&j!=f&&(b.top=b.top+f-j);var k=this.getViewportAdjustedDelta(c,b,i,j);k.left?b.left+=k.left:b.top+=k.top;var l=/top|bottom/.test(c),m=l?2*k.left-e+i:2*k.top-f+j,n=l?"offsetWidth":"offsetHeight";d.offset(b),this.replaceArrow(m,d[0][n],l)},c.prototype.replaceArrow=function(a,b,c){this.arrow().css(c?"left":"top",50*(1-a/b)+"%").css(c?"top":"left","")},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},c.prototype.hide=function(b){function d(){"in"!=e.hoverState&&f.detach(),e.$element&&e.$element.removeAttr("aria-describedby").trigger("hidden.bs."+e.type),b&&b()}var e=this,f=a(this.$tip),g=a.Event("hide.bs."+this.type);if(this.$element.trigger(g),!g.isDefaultPrevented())return f.removeClass("in"),a.support.transition&&f.hasClass("fade")?f.one("bsTransitionEnd",d).emulateTransitionEnd(c.TRANSITION_DURATION):d(),this.hoverState=null,this},c.prototype.fixTitle=function(){var a=this.$element;(a.attr("title")||"string"!=typeof a.attr("data-original-title"))&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},c.prototype.hasContent=function(){return this.getTitle()},c.prototype.getPosition=function(b){b=b||this.$element;var c=b[0],d="BODY"==c.tagName,e=c.getBoundingClientRect();null==e.width&&(e=a.extend({},e,{width:e.right-e.left,height:e.bottom-e.top}));var f=window.SVGElement&&c instanceof window.SVGElement,g=d?{top:0,left:0}:f?null:b.offset(),h={scroll:d?document.documentElement.scrollTop||document.body.scrollTop:b.scrollTop()},i=d?{width:a(window).width(),height:a(window).height()}:null;return a.extend({},e,h,i,g)},c.prototype.getCalculatedOffset=function(a,b,c,d){return"bottom"==a?{top:b.top+b.height,left:b.left+b.width/2-c/2}:"top"==a?{top:b.top-d,left:b.left+b.width/2-c/2}:"left"==a?{top:b.top+b.height/2-d/2,left:b.left-c}:{top:b.top+b.height/2-d/2,left:b.left+b.width}},c.prototype.getViewportAdjustedDelta=function(a,b,c,d){var e={top:0,left:0};if(!this.$viewport)return e;var f=this.options.viewport&&this.options.viewport.padding||0,g=this.getPosition(this.$viewport);if(/right|left/.test(a)){var h=b.top-f-g.scroll,i=b.top+f-g.scroll+d;h<g.top?e.top=g.top-h:i>g.top+g.height&&(e.top=g.top+g.height-i)}else{var j=b.left-f,k=b.left+f+c;j<g.left?e.left=g.left-j:k>g.right&&(e.left=g.left+g.width-k)}return e},c.prototype.getTitle=function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||("function"==typeof c.title?c.title.call(b[0]):c.title)},c.prototype.getUID=function(a){do a+=~~(1e6*Math.random());while(document.getElementById(a));return a},c.prototype.tip=function(){if(!this.$tip&&(this.$tip=a(this.options.template),1!=this.$tip.length))throw new Error(this.type+" `template` option must consist of exactly 1 top-level element!");return this.$tip},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},c.prototype.enable=function(){this.enabled=!0},c.prototype.disable=function(){this.enabled=!1},c.prototype.toggleEnabled=function(){this.enabled=!this.enabled},c.prototype.toggle=function(b){var c=this;b&&(c=a(b.currentTarget).data("bs."+this.type),c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c))),b?(c.inState.click=!c.inState.click,c.isInStateTrue()?c.enter(c):c.leave(c)):c.tip().hasClass("in")?c.leave(c):c.enter(c)},c.prototype.destroy=function(){var a=this;clearTimeout(this.timeout),this.hide(function(){a.$element.off("."+a.type).removeData("bs."+a.type),a.$tip&&a.$tip.detach(),a.$tip=null,a.$arrow=null,a.$viewport=null,a.$element=null})};var d=a.fn.tooltip;a.fn.tooltip=b,a.fn.tooltip.Constructor=c,a.fn.tooltip.noConflict=function(){return a.fn.tooltip=d,this}}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.popover"),f="object"==typeof b&&b;!e&&/destroy|hide/.test(b)||(e||d.data("bs.popover",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.init("popover",a,b)};if(!a.fn.tooltip)throw new Error("Popover requires tooltip.js");c.VERSION="3.3.7",c.DEFAULTS=a.extend({},a.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),c.prototype=a.extend({},a.fn.tooltip.Constructor.prototype),c.prototype.constructor=c,c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.options.html?"html":"text"](b),a.find(".popover-content").children().detach().end()[this.options.html?"string"==typeof c?"html":"append":"text"](c),a.removeClass("fade top bottom left right in"),a.find(".popover-title").html()||a.find(".popover-title").hide()},c.prototype.hasContent=function(){return this.getTitle()||this.getContent()},c.prototype.getContent=function(){var a=this.$element,b=this.options;return a.attr("data-content")||("function"==typeof b.content?b.content.call(a[0]):b.content)},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")};var d=a.fn.popover;a.fn.popover=b,a.fn.popover.Constructor=c,a.fn.popover.noConflict=function(){return a.fn.popover=d,this}}(jQuery),+function(a){"use strict";function b(c,d){this.$body=a(document.body),this.$scrollElement=a(a(c).is(document.body)?window:c),this.options=a.extend({},b.DEFAULTS,d),this.selector=(this.options.target||"")+" .nav li > a",this.offsets=[],this.targets=[],this.activeTarget=null,this.scrollHeight=0,this.$scrollElement.on("scroll.bs.scrollspy",a.proxy(this.process,this)),this.refresh(),this.process()}function c(c){return this.each(function(){var d=a(this),e=d.data("bs.scrollspy"),f="object"==typeof c&&c;e||d.data("bs.scrollspy",e=new b(this,f)),"string"==typeof c&&e[c]()})}b.VERSION="3.3.7",b.DEFAULTS={offset:10},b.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)},b.prototype.refresh=function(){var b=this,c="offset",d=0;this.offsets=[],this.targets=[],this.scrollHeight=this.getScrollHeight(),a.isWindow(this.$scrollElement[0])||(c="position",d=this.$scrollElement.scrollTop()),this.$body.find(this.selector).map(function(){var b=a(this),e=b.data("target")||b.attr("href"),f=/^#./.test(e)&&a(e);return f&&f.length&&f.is(":visible")&&[[f[c]().top+d,e]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){b.offsets.push(this[0]),b.targets.push(this[1])})},b.prototype.process=function(){var a,b=this.$scrollElement.scrollTop()+this.options.offset,c=this.getScrollHeight(),d=this.options.offset+c-this.$scrollElement.height(),e=this.offsets,f=this.targets,g=this.activeTarget;if(this.scrollHeight!=c&&this.refresh(),b>=d)return g!=(a=f[f.length-1])&&this.activate(a);if(g&&b<e[0])return this.activeTarget=null,this.clear();for(a=e.length;a--;)g!=f[a]&&b>=e[a]&&(void 0===e[a+1]||b<e[a+1])&&this.activate(f[a])},b.prototype.activate=function(b){
this.activeTarget=b,this.clear();var c=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',d=a(c).parents("li").addClass("active");d.parent(".dropdown-menu").length&&(d=d.closest("li.dropdown").addClass("active")),d.trigger("activate.bs.scrollspy")},b.prototype.clear=function(){a(this.selector).parentsUntil(this.options.target,".active").removeClass("active")};var d=a.fn.scrollspy;a.fn.scrollspy=c,a.fn.scrollspy.Constructor=b,a.fn.scrollspy.noConflict=function(){return a.fn.scrollspy=d,this},a(window).on("load.bs.scrollspy.data-api",function(){a('[data-spy="scroll"]').each(function(){var b=a(this);c.call(b,b.data())})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tab");e||d.data("bs.tab",e=new c(this)),"string"==typeof b&&e[b]()})}var c=function(b){this.element=a(b)};c.VERSION="3.3.7",c.TRANSITION_DURATION=150,c.prototype.show=function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.data("target");if(d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),!b.parent("li").hasClass("active")){var e=c.find(".active:last a"),f=a.Event("hide.bs.tab",{relatedTarget:b[0]}),g=a.Event("show.bs.tab",{relatedTarget:e[0]});if(e.trigger(f),b.trigger(g),!g.isDefaultPrevented()&&!f.isDefaultPrevented()){var h=a(d);this.activate(b.closest("li"),c),this.activate(h,h.parent(),function(){e.trigger({type:"hidden.bs.tab",relatedTarget:b[0]}),b.trigger({type:"shown.bs.tab",relatedTarget:e[0]})})}}},c.prototype.activate=function(b,d,e){function f(){g.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!1),b.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded",!0),h?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu").length&&b.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!0),e&&e()}var g=d.find("> .active"),h=e&&a.support.transition&&(g.length&&g.hasClass("fade")||!!d.find("> .fade").length);g.length&&h?g.one("bsTransitionEnd",f).emulateTransitionEnd(c.TRANSITION_DURATION):f(),g.removeClass("in")};var d=a.fn.tab;a.fn.tab=b,a.fn.tab.Constructor=c,a.fn.tab.noConflict=function(){return a.fn.tab=d,this};var e=function(c){c.preventDefault(),b.call(a(this),"show")};a(document).on("click.bs.tab.data-api",'[data-toggle="tab"]',e).on("click.bs.tab.data-api",'[data-toggle="pill"]',e)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.affix"),f="object"==typeof b&&b;e||d.data("bs.affix",e=new c(this,f)),"string"==typeof b&&e[b]()})}var c=function(b,d){this.options=a.extend({},c.DEFAULTS,d),this.$target=a(this.options.target).on("scroll.bs.affix.data-api",a.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",a.proxy(this.checkPositionWithEventLoop,this)),this.$element=a(b),this.affixed=null,this.unpin=null,this.pinnedOffset=null,this.checkPosition()};c.VERSION="3.3.7",c.RESET="affix affix-top affix-bottom",c.DEFAULTS={offset:0,target:window},c.prototype.getState=function(a,b,c,d){var e=this.$target.scrollTop(),f=this.$element.offset(),g=this.$target.height();if(null!=c&&"top"==this.affixed)return e<c&&"top";if("bottom"==this.affixed)return null!=c?!(e+this.unpin<=f.top)&&"bottom":!(e+g<=a-d)&&"bottom";var h=null==this.affixed,i=h?e:f.top,j=h?g:b;return null!=c&&e<=c?"top":null!=d&&i+j>=a-d&&"bottom"},c.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(c.RESET).addClass("affix");var a=this.$target.scrollTop(),b=this.$element.offset();return this.pinnedOffset=b.top-a},c.prototype.checkPositionWithEventLoop=function(){setTimeout(a.proxy(this.checkPosition,this),1)},c.prototype.checkPosition=function(){if(this.$element.is(":visible")){var b=this.$element.height(),d=this.options.offset,e=d.top,f=d.bottom,g=Math.max(a(document).height(),a(document.body).height());"object"!=typeof d&&(f=e=d),"function"==typeof e&&(e=d.top(this.$element)),"function"==typeof f&&(f=d.bottom(this.$element));var h=this.getState(g,b,e,f);if(this.affixed!=h){null!=this.unpin&&this.$element.css("top","");var i="affix"+(h?"-"+h:""),j=a.Event(i+".bs.affix");if(this.$element.trigger(j),j.isDefaultPrevented())return;this.affixed=h,this.unpin="bottom"==h?this.getPinnedOffset():null,this.$element.removeClass(c.RESET).addClass(i).trigger(i.replace("affix","affixed")+".bs.affix")}"bottom"==h&&this.$element.offset({top:g-b-f})}};var d=a.fn.affix;a.fn.affix=b,a.fn.affix.Constructor=c,a.fn.affix.noConflict=function(){return a.fn.affix=d,this},a(window).on("load",function(){a('[data-spy="affix"]').each(function(){var c=a(this),d=c.data();d.offset=d.offset||{},null!=d.offsetBottom&&(d.offset.bottom=d.offsetBottom),null!=d.offsetTop&&(d.offset.top=d.offsetTop),b.call(c,d)})})}(jQuery);
;(function($){$.fn.camera=function(opts,callback){var defaults={alignment:'center',autoAdvance:true,mobileAutoAdvance:true,barDirection:'leftToRight',barPosition:'bottom',cols:6,easing:'easeInOutExpo',mobileEasing:'',fx:'random',mobileFx:'',gridDifference:250,height:'50%',imagePath:'images/',hover:true,loader:'pie',loaderColor:'#eeeeee',loaderBgColor:'#222222',loaderOpacity:.8,loaderPadding:2,loaderStroke:7,minHeight:'200px',navigation:true,navigationHover:true,mobileNavHover:true,opacityOnGrid:false,overlayer:true,pagination:true,playPause:true,pauseOnClick:true,pieDiameter:38,piePosition:'rightTop',portrait:false,rows:4,slicedCols:12,slicedRows:8,slideOn:'random',thumbnails:false,time:7000,transPeriod:1500,onEndTransition:function(){},onLoaded:function(){},onStartLoading:function(){},onStartTransition:function(){}};function isMobile(){if(navigator.userAgent.match(/Android/i)||navigator.userAgent.match(/webOS/i)||navigator.userAgent.match(/iPad/i)||navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPod/i)){return true;}}
var opts=$.extend({},defaults,opts);var wrap=$(this).addClass('camera_wrap');wrap.wrapInner('<div class="camera_src" />').wrapInner('<div class="camera_fakehover" />');var fakeHover=$('.camera_fakehover',wrap);fakeHover.append('<div class="camera_target"></div>');if(opts.overlayer==true){fakeHover.append('<div class="camera_overlayer"></div>')}
fakeHover.append('<div class="camera_target_content"></div>');var loader;if(opts.loader=='pie'&&$.browser.msie&&$.browser.version<9){loader='bar';}else{loader=opts.loader;}
if(loader=='pie'){fakeHover.append('<div class="camera_pie"></div>')}else if(loader=='bar'){fakeHover.append('<div class="camera_bar"></div>')}else{fakeHover.append('<div class="camera_bar" style="display:none"></div>')}
if(opts.playPause==true){fakeHover.append('<div class="camera_commands"></div>')}
if(opts.navigation==true){fakeHover.append('<div class="camera_nav"></div>');$('.camera_nav').append('<div class="camera_prev"></div>').append('<div class="camera_next"></div>').append('<div class="camera_index"></div>');}
if(opts.thumbnails==true){wrap.append('<div class="camera_thumbs_cont" />');}
if(opts.thumbnails==true&&opts.pagination!=true){$('.camera_thumbs_cont',wrap).wrap('<div />').wrap('<div class="camera_thumbs" />').wrap('<div />').wrap('<div class="camera_command_wrap" />');}
if(opts.pagination==true){wrap.append('<div class="camera_pag"></div>');}
wrap.append('<div class="camera_loader"></div>');$('.camera_caption',wrap).each(function(){$(this).wrapInner('<div />');});var pieID='pie_'+wrap.index(),elem=$('.camera_src',wrap),target=$('.camera_target',wrap),content=$('.camera_target_content',wrap),pieContainer=$('.camera_pie',wrap),barContainer=$('.camera_bar',wrap),prevNav=$('.camera_prev',wrap),nextNav=$('.camera_next',wrap),commands=$('.camera_commands',wrap),pagination=$('.camera_pag',wrap),thumbs=$('.camera_thumbs_cont',wrap);var w,h;var allImg=new Array();$('> div',elem).each(function(){allImg.push($(this).attr('data-src'));});var allLinks=new Array();$('> div',elem).each(function(){if($(this).attr('data-link')){allLinks.push($(this).attr('data-link'));}else{allLinks.push('');}});var allTargets=new Array();$('> div',elem).each(function(){if($(this).attr('data-target')){allTargets.push($(this).attr('data-target'));}else{allTargets.push('');}});var allPor=new Array();$('> div',elem).each(function(){if($(this).attr('data-portrait')){allPor.push($(this).attr('data-portrait'));}else{allPor.push('');}});var allAlign=new Array();$('> div',elem).each(function(){if($(this).attr('data-alignment')){allAlign.push($(this).attr('data-alignment'));}else{allAlign.push('');}});var allThumbs=new Array();$('> div',elem).each(function(){if($(this).attr('data-thumb')){allThumbs.push($(this).attr('data-thumb'));}else{allThumbs.push('');}});var amountSlide=allImg.length;$(content).append('<div class="cameraContents" />');var loopMove;for(loopMove=0;loopMove<amountSlide;loopMove++)
{$('.cameraContents',content).append('<div class="cameraContent" />');if(allLinks[loopMove]!=''){var dataBox=$('> div ',elem).eq(loopMove).attr('data-box');if(typeof dataBox!=='undefined'&&dataBox!==false&&dataBox!=''){dataBox='data-box="'+$('> div ',elem).eq(loopMove).attr('data-box')+'"';}else{dataBox='';}
$('.camera_target_content .cameraContent:eq('+loopMove+')',wrap).append('<a class="camera_link" href="'+allLinks[loopMove]+'" '+dataBox+' target="'+allTargets[loopMove]+'"></a>');}}
$('.camera_caption',wrap).each(function(){var ind=$(this).parent().index(),cont=wrap.find('.cameraContent').eq(ind);$(this).appendTo(cont);});target.append('<div class="cameraCont" />');var cameraCont=$('.cameraCont',wrap);var loop;for(loop=0;loop<amountSlide;loop++)
{cameraCont.append('<div class="cameraSlide cameraSlide_'+loop+'" />');var div=$('> div:eq('+loop+')',elem);target.find('.cameraSlide_'+loop).clone(div);}
function thumbnailVisible(){var wTh=$(thumbs).width();$('li',thumbs).removeClass('camera_visThumb');$('li',thumbs).each(function(){var pos=$(this).position(),ulW=$('ul',thumbs).outerWidth(),offUl=$('ul',thumbs).offset().left,offDiv=$('> div',thumbs).offset().left,ulLeft=offDiv-offUl;if(ulLeft>0){$('.camera_prevThumbs',camera_thumbs_wrap).removeClass('hideNav');}else{$('.camera_prevThumbs',camera_thumbs_wrap).addClass('hideNav');}
if((ulW-ulLeft)>wTh){$('.camera_nextThumbs',camera_thumbs_wrap).removeClass('hideNav');}else{$('.camera_nextThumbs',camera_thumbs_wrap).addClass('hideNav');}
var left=pos.left,right=pos.left+($(this).width());if(right-ulLeft<=wTh&&left-ulLeft>=0){$(this).addClass('camera_visThumb');}});}
$(window).bind('load resize pageshow',function(){thumbnailPos();thumbnailVisible();});cameraCont.append('<div class="cameraSlide cameraSlide_'+loop+'" />');var started;wrap.show();var w=target.width();var h=target.height();var setPause;$(window).bind('resize pageshow',function(){if(started==true){resizeImage();}
$('ul',thumbs).animate({'margin-top':0},0,thumbnailPos);if(!elem.hasClass('paused')){elem.addClass('paused');if($('.camera_stop',camera_thumbs_wrap).length){$('.camera_stop',camera_thumbs_wrap).hide()
$('.camera_play',camera_thumbs_wrap).show();if(loader!='none'){$('#'+pieID).hide();}}else{if(loader!='none'){$('#'+pieID).hide();}}
clearTimeout(setPause);setPause=setTimeout(function(){elem.removeClass('paused');if($('.camera_play',camera_thumbs_wrap).length){$('.camera_play',camera_thumbs_wrap).hide();$('.camera_stop',camera_thumbs_wrap).show();if(loader!='none'){$('#'+pieID).fadeIn();}}else{if(loader!='none'){$('#'+pieID).fadeIn();}}},1500);}});function resizeImage(){var res;function resizeImageWork(){w=wrap.width();if(opts.height.indexOf('%')!=-1){var startH=Math.round(w/(100/parseFloat(opts.height)));if(opts.minHeight!=''&&startH<parseFloat(opts.minHeight)){h=parseFloat(opts.minHeight);}else{h=startH;}
wrap.css({height:h});}else if(opts.height=='auto'){h=wrap.height();}else{h=parseFloat(opts.height);wrap.css({height:h});}
$('.camerarelative',target).css({'width':w,'height':h});$('.imgLoaded',target).each(function(){var t=$(this),wT=t.attr('width'),hT=t.attr('height'),imgLoadIn=t.index(),mTop,mLeft,alignment=t.attr('data-alignment'),portrait=t.attr('data-portrait');if(typeof alignment==='undefined'||alignment===false||alignment===''){alignment=opts.alignment;}
if(typeof portrait==='undefined'||portrait===false||portrait===''){portrait=opts.portrait;}
if(portrait==false||portrait=='false'){if((wT/hT)<(w/h)){var r=w/wT;var d=(Math.abs(h-(hT*r)))*0.5;switch(alignment){case'topLeft':mTop=0;break;case'topCenter':mTop=0;break;case'topRight':mTop=0;break;case'centerLeft':mTop='-'+d+'px';break;case'center':mTop='-'+d+'px';break;case'centerRight':mTop='-'+d+'px';break;case'bottomLeft':mTop='-'+d*2+'px';break;case'bottomCenter':mTop='-'+d*2+'px';break;case'bottomRight':mTop='-'+d*2+'px';break;}
t.css({'height':hT*r,'margin-left':0,'margin-top':mTop,'position':'absolute','visibility':'visible','width':w});}
else{var r=h/hT;var d=(Math.abs(w-(wT*r)))*0.5;switch(alignment){case'topLeft':mLeft=0;break;case'topCenter':mLeft='-'+d+'px';break;case'topRight':mLeft='-'+d*2+'px';break;case'centerLeft':mLeft=0;break;case'center':mLeft='-'+d+'px';break;case'centerRight':mLeft='-'+d*2+'px';break;case'bottomLeft':mLeft=0;break;case'bottomCenter':mLeft='-'+d+'px';break;case'bottomRight':mLeft='-'+d*2+'px';break;}
t.css({'height':h,'margin-left':mLeft,'margin-top':0,'position':'absolute','visibility':'visible','width':wT*r});}}else{if((wT/hT)<(w/h)){var r=h/hT;var d=(Math.abs(w-(wT*r)))*0.5;switch(alignment){case'topLeft':mLeft=0;break;case'topCenter':mLeft=d+'px';break;case'topRight':mLeft=d*2+'px';break;case'centerLeft':mLeft=0;break;case'center':mLeft=d+'px';break;case'centerRight':mLeft=d*2+'px';break;case'bottomLeft':mLeft=0;break;case'bottomCenter':mLeft=d+'px';break;case'bottomRight':mLeft=d*2+'px';break;}
t.css({'height':h,'margin-left':mLeft,'margin-top':0,'position':'absolute','visibility':'visible','width':wT*r});}
else{var r=w/wT;var d=(Math.abs(h-(hT*r)))*0.5;switch(alignment){case'topLeft':mTop=0;break;case'topCenter':mTop=0;break;case'topRight':mTop=0;break;case'centerLeft':mTop=d+'px';break;case'center':mTop=d+'px';break;case'centerRight':mTop=d+'px';break;case'bottomLeft':mTop=d*2+'px';break;case'bottomCenter':mTop=d*2+'px';break;case'bottomRight':mTop=d*2+'px';break;}
t.css({'height':hT*r,'margin-left':0,'margin-top':mTop,'position':'absolute','visibility':'visible','width':w});}}});}
if(started==true){clearTimeout(res);res=setTimeout(resizeImageWork,200);}else{resizeImageWork();}
started=true;}
var u,setT;var clickEv,autoAdv,navHover,commands,pagination;var videoHover,videoPresent;if(isMobile()&&opts.mobileAutoAdvance!=''){autoAdv=opts.mobileAutoAdvance;}else{autoAdv=opts.autoAdvance;}
if(autoAdv==false){elem.addClass('paused');}
if(isMobile()&&opts.mobileNavHover!=''){navHover=opts.mobileNavHover;}else{navHover=opts.navigationHover;}
if(elem.length!=0){var selector=$('.cameraSlide',target);selector.wrapInner('<div class="camerarelative" />');var navSlide;var barDirection=opts.barDirection;var camera_thumbs_wrap=wrap;$('iframe',fakeHover).each(function(){var t=$(this);var src=t.attr('src');t.attr('data-src',src);var divInd=t.parent().index('.camera_src > div');$('.camera_target_content .cameraContent:eq('+divInd+')',wrap).append(t);});function imgFake(){$('iframe',fakeHover).each(function(){$('.camera_caption',fakeHover).show();var t=$(this);var cloneSrc=t.attr('data-src');t.attr('src',cloneSrc);var imgFakeUrl=opts.imagePath+'blank.gif';var imgFake=new Image();imgFake.src=imgFakeUrl;if(opts.height.indexOf('%')!=-1){var startH=Math.round(w/(100/parseFloat(opts.height)));if(opts.minHeight!=''&&startH<parseFloat(opts.minHeight)){h=parseFloat(opts.minHeight);}else{h=startH;}}else if(opts.height=='auto'){h=wrap.height();}else{h=parseFloat(opts.height);}
t.after($(imgFake).attr({'class':'imgFake','width':w,'height':h}));var clone=t.clone();t.remove();$(imgFake).bind('click',function(){if($(this).css('position')=='absolute'){$(this).remove();if(cloneSrc.indexOf('vimeo')!=-1||cloneSrc.indexOf('youtube')!=-1){if(cloneSrc.indexOf('?')!=-1){autoplay='&autoplay=1';}else{autoplay='?autoplay=1';}}else if(cloneSrc.indexOf('dailymotion')!=-1){if(cloneSrc.indexOf('?')!=-1){autoplay='&autoPlay=1';}else{autoplay='?autoPlay=1';}}
clone.attr('src',cloneSrc+autoplay);videoPresent=true;}else{$(this).css({position:'absolute',top:0,left:0,zIndex:10}).after(clone);clone.css({position:'absolute',top:0,left:0,zIndex:9});}});});}
imgFake();if(opts.hover==true){if(!isMobile()){fakeHover.hover(function(){elem.addClass('hovered');},function(){elem.removeClass('hovered');});}}
$('.camera_stop',camera_thumbs_wrap).live('click',function(){autoAdv=false;elem.addClass('paused');if($('.camera_stop',camera_thumbs_wrap).length){$('.camera_stop',camera_thumbs_wrap).hide()
$('.camera_play',camera_thumbs_wrap).show();if(loader!='none'){$('#'+pieID).hide();}}else{if(loader!='none'){$('#'+pieID).hide();}}});$('.camera_play',camera_thumbs_wrap).live('click',function(){autoAdv=true;elem.removeClass('paused');if($('.camera_play',camera_thumbs_wrap).length){$('.camera_play',camera_thumbs_wrap).hide();$('.camera_stop',camera_thumbs_wrap).show();if(loader!='none'){$('#'+pieID).show();}}else{if(loader!='none'){$('#'+pieID).show();}}});if(opts.pauseOnClick==true){$('.camera_target_content',fakeHover).mouseup(function(){autoAdv=false;elem.addClass('paused');$('.camera_stop',camera_thumbs_wrap).hide()
$('.camera_play',camera_thumbs_wrap).show();$('#'+pieID).hide();});}
$('.cameraContent, .imgFake',fakeHover).hover(function(){videoHover=true;},function(){videoHover=false;});$('.cameraContent, .imgFake',fakeHover).bind('click',function(){if(videoPresent==true&&videoHover==true){autoAdv=false;$('.camera_caption',fakeHover).hide();elem.addClass('paused');$('.camera_stop',camera_thumbs_wrap).hide()
$('.camera_play',camera_thumbs_wrap).show();$('#'+pieID).hide();}});}
function shuffle(arr){for(var j,x,i=arr.length;i;j=parseInt(Math.random()*i),x=arr[--i],arr[i]=arr[j],arr[j]=x);return arr;}
function isInteger(s){return Math.ceil(s)==Math.floor(s);}
if(loader!='pie'){barContainer.append('<span class="camera_bar_cont" />');$('.camera_bar_cont',barContainer).animate({opacity:opts.loaderOpacity},0).css({'position':'absolute','left':0,'right':0,'top':0,'bottom':0,'background-color':opts.loaderBgColor}).append('<span id="'+pieID+'" />');$('#'+pieID).animate({opacity:0},0);var canvas=$('#'+pieID);canvas.css({'position':'absolute','background-color':opts.loaderColor});switch(opts.barPosition){case'left':barContainer.css({right:'auto',width:opts.loaderStroke});break;case'right':barContainer.css({left:'auto',width:opts.loaderStroke});break;case'top':barContainer.css({bottom:'auto',height:opts.loaderStroke});break;case'bottom':barContainer.css({top:'auto',height:opts.loaderStroke});break;}
switch(barDirection){case'leftToRight':canvas.css({'left':0,'right':0,'top':opts.loaderPadding,'bottom':opts.loaderPadding});break;case'rightToLeft':canvas.css({'left':0,'right':0,'top':opts.loaderPadding,'bottom':opts.loaderPadding});break;case'topToBottom':canvas.css({'left':opts.loaderPadding,'right':opts.loaderPadding,'top':0,'bottom':0});break;case'bottomToTop':canvas.css({'left':opts.loaderPadding,'right':opts.loaderPadding,'top':0,'bottom':0});break;}}else{pieContainer.append('<canvas id="'+pieID+'"></canvas>');var G_vmlCanvasManager;var canvas=document.getElementById(pieID);canvas.setAttribute("width",opts.pieDiameter);canvas.setAttribute("height",opts.pieDiameter);var piePosition;switch(opts.piePosition){case'leftTop':piePosition='left:0; top:0;';break;case'rightTop':piePosition='right:0; top:0;';break;case'leftBottom':piePosition='left:0; bottom:0;';break;case'rightBottom':piePosition='right:0; bottom:0;';break;}
canvas.setAttribute("style","position:absolute; z-index:1002; "+piePosition);var rad;var radNew;if(canvas&&canvas.getContext){var ctx=canvas.getContext("2d");ctx.rotate(Math.PI*(3/2));ctx.translate(-opts.pieDiameter,0);}}
if(loader=='none'||autoAdv==false){$('#'+pieID).hide();$('.camera_canvas_wrap',camera_thumbs_wrap).hide();}
if($(pagination).length){$(pagination).append('<ul class="camera_pag_ul" />');var li;for(li=0;li<amountSlide;li++){$('.camera_pag_ul',wrap).append('<li class="pag_nav_'+li+'" style="position:relative; z-index:1002"><span><span>'+li+'</span></span></li>');}
$('.camera_pag_ul li',wrap).hover(function(){$(this).addClass('camera_hover');if($('.camera_thumb',this).length){var wTh=$('.camera_thumb',this).outerWidth(),hTh=$('.camera_thumb',this).outerHeight(),wTt=$(this).outerWidth();$('.camera_thumb',this).show().css({'top':'-'+hTh+'px','left':'-'+(wTh-wTt)/2+'px'}).animate({'opacity':1,'margin-top':'-3px'},200);
$('.thumb_arrow',this).show().animate({'opacity':1,'margin-top':'-3px'},200);}},function(){$(this).removeClass('camera_hover');$('.camera_thumb',this).animate({'margin-top':'-20px','opacity':0},200,function(){$(this).css({marginTop:'5px'}).hide();});$('.thumb_arrow',this).animate({'margin-top':'-20px','opacity':0},200,function(){$(this).css({marginTop:'5px'}).hide();});});}
if($(thumbs).length){var thumbUrl;if(!$(pagination).length){$(thumbs).append('<div />');$(thumbs).before('<div class="camera_prevThumbs hideNav"><div></div></div>').before('<div class="camera_nextThumbs hideNav"><div></div></div>');$('> div',thumbs).append('<ul />');$.each(allThumbs,function(i,val){if($('> div',elem).eq(i).attr('data-thumb')!=''){var thumbUrl=$('> div',elem).eq(i).attr('data-thumb'),newImg=new Image();newImg.src=thumbUrl;$('ul',thumbs).append('<li class="pix_thumb pix_thumb_'+i+'" />');$('li.pix_thumb_'+i,thumbs).append($(newImg).attr('class','camera_thumb'));}});}else{$.each(allThumbs,function(i,val){if($('> div',elem).eq(i).attr('data-thumb')!=''){var thumbUrl=$('> div',elem).eq(i).attr('data-thumb'),newImg=new Image();newImg.src=thumbUrl;$('li.pag_nav_'+i,pagination).append($(newImg).attr('class','camera_thumb').css({'position':'absolute'}).animate({opacity:0},0));$('li.pag_nav_'+i+' > img',pagination).after('<div class="thumb_arrow" />');$('li.pag_nav_'+i+' > .thumb_arrow',pagination).animate({opacity:0},0);}});wrap.css({marginBottom:$(pagination).outerHeight()});}}else if(!$(thumbs).length&&$(pagination).length){wrap.css({marginBottom:$(pagination).outerHeight()});}
var firstPos=true;function thumbnailPos(){if($(thumbs).length&&!$(pagination).length){var wTh=$(thumbs).outerWidth(),owTh=$('ul > li',thumbs).outerWidth(),pos=$('li.cameracurrent',thumbs).length?$('li.cameracurrent',thumbs).position():'',ulW=($('ul > li',thumbs).length*$('ul > li',thumbs).outerWidth()),offUl=$('ul',thumbs).offset().left,offDiv=$('> div',thumbs).offset().left,ulLeft;if(offUl<0){ulLeft='-'+(offDiv-offUl);}else{ulLeft=offDiv-offUl;}
if(firstPos==true){$('ul',thumbs).width($('ul > li',thumbs).length*$('ul > li',thumbs).outerWidth());if($(thumbs).length&&!$(pagination).lenght){wrap.css({marginBottom:$(thumbs).outerHeight()});}
thumbnailVisible();$('ul',thumbs).width($('ul > li',thumbs).length*$('ul > li',thumbs).outerWidth());if($(thumbs).length&&!$(pagination).lenght){wrap.css({marginBottom:$(thumbs).outerHeight()});}}
firstPos=false;var left=$('li.cameracurrent',thumbs).length?pos.left:'',right=$('li.cameracurrent',thumbs).length?pos.left+($('li.cameracurrent',thumbs).outerWidth()):'';if(left<$('li.cameracurrent',thumbs).outerWidth()){left=0;}
if(right-ulLeft>wTh){if((left+wTh)<ulW){$('ul',thumbs).animate({'margin-left':'-'+(left)+'px'},500,thumbnailVisible);}else{$('ul',thumbs).animate({'margin-left':'-'+($('ul',thumbs).outerWidth()-wTh)+'px'},500,thumbnailVisible);}}else if(left-ulLeft<0){$('ul',thumbs).animate({'margin-left':'-'+(left)+'px'},500,thumbnailVisible);}else{$('ul',thumbs).css({'margin-left':'auto','margin-right':'auto'});setTimeout(thumbnailVisible,100);}}}
if($(commands).length){$(commands).append('<div class="camera_play"></div>').append('<div class="camera_stop"></div>');if(autoAdv==true){$('.camera_play',camera_thumbs_wrap).hide();$('.camera_stop',camera_thumbs_wrap).show();}else{$('.camera_stop',camera_thumbs_wrap).hide();$('.camera_play',camera_thumbs_wrap).show();}}
function canvasLoader(){rad=0;var barWidth=$('.camera_bar_cont',camera_thumbs_wrap).width(),barHeight=$('.camera_bar_cont',camera_thumbs_wrap).height();if(loader!='pie'){switch(barDirection){case'leftToRight':$('#'+pieID).css({'right':barWidth});break;case'rightToLeft':$('#'+pieID).css({'left':barWidth});break;case'topToBottom':$('#'+pieID).css({'bottom':barHeight});break;case'bottomToTop':$('#'+pieID).css({'top':barHeight});break;}}else{ctx.clearRect(0,0,opts.pieDiameter,opts.pieDiameter);}}
canvasLoader();$('.moveFromLeft, .moveFromRight, .moveFromTop, .moveFromBottom, .fadeIn, .fadeFromLeft, .fadeFromRight, .fadeFromTop, .fadeFromBottom',fakeHover).each(function(){$(this).css('visibility','hidden');});opts.onStartLoading.call(this);nextSlide();function nextSlide(navSlide){elem.addClass('camerasliding');videoPresent=false;var vis=parseFloat($('div.cameraSlide.cameracurrent',target).index());if(navSlide>0){var slideI=navSlide-1;}else if(vis==amountSlide-1){var slideI=0;}else{var slideI=vis+1;}
var slide=$('.cameraSlide:eq('+slideI+')',target);var slideNext=$('.cameraSlide:eq('+(slideI+1)+')',target).addClass('cameranext');if(vis!=slideI+1){slideNext.hide();}
$('.cameraContent',fakeHover).fadeOut(600);$('.camera_caption',fakeHover).show();$('.camerarelative',slide).append($('> div ',elem).eq(slideI).find('> div.camera_effected'));$('.camera_target_content .cameraContent:eq('+slideI+')',wrap).append($('> div ',elem).eq(slideI).find('> div'));if(!$('.imgLoaded',slide).length){var imgUrl=allImg[slideI];var imgLoaded=new Image();imgLoaded.src=imgUrl+"?"+ new Date().getTime();slide.css('visibility','hidden');slide.prepend($(imgLoaded).attr('class','imgLoaded').css('visibility','hidden'));var wT,hT;if(!$(imgLoaded).get(0).complete||wT=='0'||hT=='0'||typeof wT==='undefined'||wT===false||typeof hT==='undefined'||hT===false){$('.camera_loader',wrap).delay(500).fadeIn(400);imgLoaded.onload=function(){wT=imgLoaded.naturalWidth;hT=imgLoaded.naturalHeight;$(imgLoaded).attr('data-alignment',allAlign[slideI]).attr('data-portrait',allPor[slideI]);$(imgLoaded).attr('width',wT);$(imgLoaded).attr('height',hT);target.find('.cameraSlide_'+slideI).hide().css('visibility','visible');resizeImage();nextSlide(slideI+1);};}}else{if(allImg.length>(slideI+1)&&!$('.imgLoaded',slideNext).length){var imgUrl2=allImg[(slideI+1)];var imgLoaded2=new Image();imgLoaded2.src=imgUrl2+"?"+ new Date().getTime();slideNext.prepend($(imgLoaded2).attr('class','imgLoaded').css('visibility','hidden'));imgLoaded2.onload=function(){wT=imgLoaded2.naturalWidth;hT=imgLoaded2.naturalHeight;$(imgLoaded2).attr('data-alignment',allAlign[slideI+1]).attr('data-portrait',allPor[slideI+1]);$(imgLoaded2).attr('width',wT);$(imgLoaded2).attr('height',hT);resizeImage();};}
opts.onLoaded.call(this);if($('.camera_loader',wrap).is(':visible')){$('.camera_loader',wrap).fadeOut(400);}else{$('.camera_loader',wrap).css({'visibility':'hidden'});$('.camera_loader',wrap).fadeOut(400,function(){$('.camera_loader',wrap).css({'visibility':'visible'});});}
var rows=opts.rows,cols=opts.cols,couples=1,difference=0,dataSlideOn,time,transPeriod,fx,easing,randomFx=new Array('simpleFade','curtainTopLeft','curtainTopRight','curtainBottomLeft','curtainBottomRight','curtainSliceLeft','curtainSliceRight','blindCurtainTopLeft','blindCurtainTopRight','blindCurtainBottomLeft','blindCurtainBottomRight','blindCurtainSliceBottom','blindCurtainSliceTop','stampede','mosaic','mosaicReverse','mosaicRandom','mosaicSpiral','mosaicSpiralReverse','topLeftBottomRight','bottomRightTopLeft','bottomLeftTopRight','topRightBottomLeft','scrollLeft','scrollRight','scrollTop','scrollBottom','scrollHorz');marginLeft=0,marginTop=0,opacityOnGrid=0;if(opts.opacityOnGrid==true){opacityOnGrid=0;}else{opacityOnGrid=1;}
var dataFx=$(' > div',elem).eq(slideI).attr('data-fx');if(isMobile()&&opts.mobileFx!=''&&opts.mobileFx!='default'){fx=opts.mobileFx;}else{if(typeof dataFx!=='undefined'&&dataFx!==false&&dataFx!=='default'){fx=dataFx;}else{fx=opts.fx;}}
if(fx=='random'){fx=shuffle(randomFx);fx=fx[0];}else{fx=fx;if(fx.indexOf(',')>0){fx=fx.replace(/ /g,'');fx=fx.split(',');fx=shuffle(fx);fx=fx[0];}}
dataEasing=$(' > div',elem).eq(slideI).attr('data-easing');mobileEasing=$(' > div',elem).eq(slideI).attr('data-mobileEasing');if(isMobile()&&opts.mobileEasing!=''&&opts.mobileEasing!='default'){if(typeof mobileEasing!=='undefined'&&mobileEasing!==false&&mobileEasing!=='default'){easing=mobileEasing;}else{easing=opts.mobileEasing;}}else{if(typeof dataEasing!=='undefined'&&dataEasing!==false&&dataEasing!=='default'){easing=dataEasing;}else{easing=opts.easing;}}
dataSlideOn=$(' > div',elem).eq(slideI).attr('data-slideOn');if(typeof dataSlideOn!=='undefined'&&dataSlideOn!==false){slideOn=dataSlideOn;}else{if(opts.slideOn=='random'){var slideOn=new Array('next','prev');slideOn=shuffle(slideOn);slideOn=slideOn[0];}else{slideOn=opts.slideOn;}}
var dataTime=$(' > div',elem).eq(slideI).attr('data-time');if(typeof dataTime!=='undefined'&&dataTime!==false&&dataTime!==''){time=parseFloat(dataTime);}else{time=opts.time;}
var dataTransPeriod=$(' > div',elem).eq(slideI).attr('data-transPeriod');if(typeof dataTransPeriod!=='undefined'&&dataTransPeriod!==false&&dataTransPeriod!==''){transPeriod=parseFloat(dataTransPeriod);}else{transPeriod=opts.transPeriod;}
if(!$(elem).hasClass('camerastarted')){fx='simpleFade';slideOn='next';easing='';transPeriod=400;$(elem).addClass('camerastarted')}
switch(fx){case'simpleFade':cols=1;rows=1;break;case'curtainTopLeft':if(opts.slicedCols==0){cols=opts.cols;}else{cols=opts.slicedCols;}
rows=1;break;case'curtainTopRight':if(opts.slicedCols==0){cols=opts.cols;}else{cols=opts.slicedCols;}
rows=1;break;case'curtainBottomLeft':if(opts.slicedCols==0){cols=opts.cols;}else{cols=opts.slicedCols;}
rows=1;break;case'curtainBottomRight':if(opts.slicedCols==0){cols=opts.cols;}else{cols=opts.slicedCols;}
rows=1;break;case'curtainSliceLeft':if(opts.slicedCols==0){cols=opts.cols;}else{cols=opts.slicedCols;}
rows=1;break;case'curtainSliceRight':if(opts.slicedCols==0){cols=opts.cols;}else{cols=opts.slicedCols;}
rows=1;break;case'blindCurtainTopLeft':if(opts.slicedRows==0){rows=opts.rows;}else{rows=opts.slicedRows;}
cols=1;break;case'blindCurtainTopRight':if(opts.slicedRows==0){rows=opts.rows;}else{rows=opts.slicedRows;}
cols=1;break;case'blindCurtainBottomLeft':if(opts.slicedRows==0){rows=opts.rows;}else{rows=opts.slicedRows;}
cols=1;break;case'blindCurtainBottomRight':if(opts.slicedRows==0){rows=opts.rows;}else{rows=opts.slicedRows;}
cols=1;break;case'blindCurtainSliceTop':if(opts.slicedRows==0){rows=opts.rows;}else{rows=opts.slicedRows;}
cols=1;break;case'blindCurtainSliceBottom':if(opts.slicedRows==0){rows=opts.rows;}else{rows=opts.slicedRows;}
cols=1;break;case'stampede':difference='-'+transPeriod;break;case'mosaic':difference=opts.gridDifference;break;case'mosaicReverse':difference=opts.gridDifference;break;case'mosaicRandom':break;case'mosaicSpiral':difference=opts.gridDifference;couples=1.7;break;case'mosaicSpiralReverse':difference=opts.gridDifference;couples=1.7;break;case'topLeftBottomRight':difference=opts.gridDifference;couples=6;break;case'bottomRightTopLeft':difference=opts.gridDifference;couples=6;break;case'bottomLeftTopRight':difference=opts.gridDifference;couples=6;break;case'topRightBottomLeft':difference=opts.gridDifference;couples=6;break;case'scrollLeft':cols=1;rows=1;break;case'scrollRight':cols=1;rows=1;break;case'scrollTop':cols=1;rows=1;break;case'scrollBottom':cols=1;rows=1;break;case'scrollHorz':cols=1;rows=1;break;}
var cycle=0;var blocks=rows*cols;var leftScrap=w-(Math.floor(w/cols)*cols);var topScrap=h-(Math.floor(h/rows)*rows);var addLeft;var addTop;var tAppW=0;var tAppH=0;var arr=new Array();var delay=new Array();var order=new Array();while(cycle<blocks){arr.push(cycle);delay.push(cycle);cameraCont.append('<div class="cameraappended" style="display:none; overflow:hidden; position:absolute; z-index:1000" />');var tApp=$('.cameraappended:eq('+cycle+')',target);if(fx=='scrollLeft'||fx=='scrollRight'||fx=='scrollTop'||fx=='scrollBottom'||fx=='scrollHorz'){selector.eq(slideI).clone().show().appendTo(tApp);}else{if(slideOn=='next'){selector.eq(slideI).clone().show().appendTo(tApp);}else{selector.eq(vis).clone().show().appendTo(tApp);}}
if(cycle%cols<leftScrap){addLeft=1;}else{addLeft=0;}
if(cycle%cols==0){tAppW=0;}
if(Math.floor(cycle/cols)<topScrap){addTop=1;}else{addTop=0;}
tApp.css({'height':Math.floor((h/rows)+addTop+1),'left':tAppW,'top':tAppH,'width':Math.floor((w/cols)+addLeft+1)});$('> .cameraSlide',tApp).css({'height':h,'margin-left':'-'+tAppW+'px','margin-top':'-'+tAppH+'px','width':w});tAppW=tAppW+tApp.width()-1;if(cycle%cols==cols-1){tAppH=tAppH+ tApp.height()- 1;}
cycle++;}
switch(fx){case'curtainTopLeft':break;case'curtainBottomLeft':break;case'curtainSliceLeft':break;case'curtainTopRight':arr=arr.reverse();break;case'curtainBottomRight':arr=arr.reverse();break;case'curtainSliceRight':arr=arr.reverse();break;case'blindCurtainTopLeft':break;case'blindCurtainBottomLeft':arr=arr.reverse();break;case'blindCurtainSliceTop':break;case'blindCurtainTopRight':break;case'blindCurtainBottomRight':arr=arr.reverse();break;case'blindCurtainSliceBottom':arr=arr.reverse();break;case'stampede':arr=shuffle(arr);break;case'mosaic':break;case'mosaicReverse':arr=arr.reverse();break;case'mosaicRandom':arr=shuffle(arr);break;case'mosaicSpiral':var rows2=rows/2,x,y,z,n=0;for(z=0;z<rows2;z++){y=z;for(x=z;x<cols- z- 1;x++){order[n++]=y*cols+ x;}
x=cols- z- 1;for(y=z;y<rows- z- 1;y++){order[n++]=y*cols+ x;}
y=rows- z- 1;for(x=cols- z- 1;x>z;x--){order[n++]=y*cols+ x;}
x=z;for(y=rows- z- 1;y>z;y--){order[n++]=y*cols+ x;}}
arr=order;break;case'mosaicSpiralReverse':var rows2=rows/2,x,y,z,n=blocks-1;for(z=0;z<rows2;z++){y=z;for(x=z;x<cols- z- 1;x++){order[n--]=y*cols+ x;}
x=cols- z- 1;for(y=z;y<rows- z- 1;y++){order[n--]=y*cols+ x;}
y=rows- z- 1;for(x=cols- z- 1;x>z;x--){order[n--]=y*cols+ x;}
x=z;for(y=rows- z- 1;y>z;y--){order[n--]=y*cols+ x;}}
arr=order;break;case'topLeftBottomRight':for(var y=0;y<rows;y++)
for(var x=0;x<cols;x++){order.push(x+ y);}
delay=order;break;case'bottomRightTopLeft':for(var y=0;y<rows;y++)
for(var x=0;x<cols;x++){order.push(x+ y);}
delay=order.reverse();break;case'bottomLeftTopRight':for(var y=rows;y>0;y--)
for(var x=0;x<cols;x++){order.push(x+ y);}
delay=order;break;case'topRightBottomLeft':for(var y=0;y<rows;y++)
for(var x=cols;x>0;x--){order.push(x+ y);}
delay=order;break;}
$.each(arr,function(index,value){if(value%cols<leftScrap){addLeft=1;}else{addLeft=0;}
if(value%cols==0){tAppW=0;}
if(Math.floor(value/cols)<topScrap){addTop=1;}else{addTop=0;}
switch(fx){case'simpleFade':height=h;width=w;opacityOnGrid=0;break;case'curtainTopLeft':height=0,width=Math.floor((w/cols)+addLeft+1),marginTop='-'+Math.floor((h/rows)+addTop+1)+'px';break;case'curtainTopRight':height=0,width=Math.floor((w/cols)+addLeft+1),marginTop='-'+Math.floor((h/rows)+addTop+1)+'px';break;case'curtainBottomLeft':height=0,width=Math.floor((w/cols)+addLeft+1),marginTop=Math.floor((h/rows)+addTop+1)+'px';break;case'curtainBottomRight':height=0,width=Math.floor((w/cols)+addLeft+1),marginTop=Math.floor((h/rows)+addTop+1)+'px';break;case'curtainSliceLeft':height=0,width=Math.floor((w/cols)+addLeft+1);if(value%2==0){marginTop=Math.floor((h/rows)+addTop+1)+'px';}else{marginTop='-'+Math.floor((h/rows)+addTop+1)+'px';}
break;case'curtainSliceRight':height=0,width=Math.floor((w/cols)+addLeft+1);if(value%2==0){marginTop=Math.floor((h/rows)+addTop+1)+'px';}else{marginTop='-'+Math.floor((h/rows)+addTop+1)+'px';}
break;case'blindCurtainTopLeft':height=Math.floor((h/rows)+addTop+1),width=0,marginLeft='-'+Math.floor((w/cols)+addLeft+1)+'px';break;case'blindCurtainTopRight':height=Math.floor((h/rows)+addTop+1),width=0,marginLeft=Math.floor((w/cols)+addLeft+1)+'px';break;case'blindCurtainBottomLeft':height=Math.floor((h/rows)+addTop+1),width=0,marginLeft='-'+Math.floor((w/cols)+addLeft+1)+'px';break;case'blindCurtainBottomRight':height=Math.floor((h/rows)+addTop+1),width=0,marginLeft=Math.floor((w/cols)+addLeft+1)+'px';break;case'blindCurtainSliceBottom':height=Math.floor((h/rows)+addTop+1),width=0;if(value%2==0){marginLeft='-'+Math.floor((w/cols)+addLeft+1)+'px';}else{marginLeft=Math.floor((w/cols)+addLeft+1)+'px';}
break;case'blindCurtainSliceTop':height=Math.floor((h/rows)+addTop+1),width=0;if(value%2==0){marginLeft='-'+Math.floor((w/cols)+addLeft+1)+'px';}else{marginLeft=Math.floor((w/cols)+addLeft+1)+'px';}
break;case'stampede':height=0;width=0;marginLeft=(w*0.2)*(((index)%cols)-(cols-(Math.floor(cols/2))))+'px';marginTop=(h*0.2)*((Math.floor(index/cols)+1)-(rows-(Math.floor(rows/2))))+'px';break;case'mosaic':height=0;width=0;break;case'mosaicReverse':height=0;width=0;marginLeft=Math.floor((w/cols)+addLeft+1)+'px';marginTop=Math.floor((h/rows)+addTop+1)+'px';break;case'mosaicRandom':height=0;width=0;marginLeft=Math.floor((w/cols)+addLeft+1)*0.5+'px';marginTop=Math.floor((h/rows)+addTop+1)*0.5+'px';break;case'mosaicSpiral':height=0;width=0;marginLeft=Math.floor((w/cols)+addLeft+1)*0.5+'px';marginTop=Math.floor((h/rows)+addTop+1)*0.5+'px';break;case'mosaicSpiralReverse':height=0;width=0;marginLeft=Math.floor((w/cols)+addLeft+1)*0.5+'px';marginTop=Math.floor((h/rows)+addTop+1)*0.5+'px';break;case'topLeftBottomRight':height=0;width=0;break;case'bottomRightTopLeft':height=0;width=0;marginLeft=Math.floor((w/cols)+addLeft+1)+'px';marginTop=Math.floor((h/rows)+addTop+1)+'px';break;case'bottomLeftTopRight':height=0;width=0;marginLeft=0;marginTop=Math.floor((h/rows)+addTop+1)+'px';break;case'topRightBottomLeft':height=0;width=0;marginLeft=Math.floor((w/cols)+addLeft+1)+'px';marginTop=0;break;case'scrollRight':height=h;width=w;marginLeft=-w;break;case'scrollLeft':height=h;width=w;marginLeft=w;break;case'scrollTop':height=h;width=w;marginTop=h;break;case'scrollBottom':height=h;width=w;marginTop=-h;break;case'scrollHorz':height=h;width=w;if(vis==0&&slideI==amountSlide-1){marginLeft=-w;}else if(vis<slideI||(vis==amountSlide-1&&slideI==0)){marginLeft=w;}else{marginLeft=-w;}
break;}
var tApp=$('.cameraappended:eq('+value+')',target);if(typeof u!=='undefined'){clearInterval(u);clearTimeout(setT);setT=setTimeout(canvasLoader,transPeriod+difference);}
if($(pagination).length){$('.camera_pag li',wrap).removeClass('cameracurrent');$('.camera_pag li',wrap).eq(slideI).addClass('cameracurrent');}
if($(thumbs).length){$('li',thumbs).removeClass('cameracurrent');$('li',thumbs).eq(slideI).addClass('cameracurrent');$('li',thumbs).not('.cameracurrent').find('img').animate({opacity:.5},0);$('li.cameracurrent img',thumbs).animate({opacity:1},0);$('li',thumbs).hover(function(){$('img',this).stop(true,false).animate({opacity:1},150);},function(){if(!$(this).hasClass('cameracurrent')){$('img',this).stop(true,false).animate({opacity:.5},150);}});}
var easedTime=parseFloat(transPeriod)+parseFloat(difference);function cameraeased(){$(this).addClass('cameraeased');if($('.cameraeased',target).length>=0){$(thumbs).css({visibility:'visible'});}
if($('.cameraeased',target).length==blocks){thumbnailPos();$('.moveFromLeft, .moveFromRight, .moveFromTop, .moveFromBottom, .fadeIn, .fadeFromLeft, .fadeFromRight, .fadeFromTop, .fadeFromBottom',fakeHover).each(function(){$(this).css('visibility','hidden');});selector.eq(slideI).show().css('z-index','999').removeClass('cameranext').addClass('cameracurrent');selector.eq(vis).css('z-index','1').removeClass('cameracurrent');$('.cameraContent',fakeHover).eq(slideI).addClass('cameracurrent');if(vis>=0){$('.cameraContent',fakeHover).eq(vis).removeClass('cameracurrent');}
opts.onEndTransition.call(this);if($('> div',elem).eq(slideI).attr('data-video')!='hide'&&$('.cameraContent.cameracurrent .imgFake',fakeHover).length){$('.cameraContent.cameracurrent .imgFake',fakeHover).click();}
var lMoveIn=selector.eq(slideI).find('.fadeIn').length;var lMoveInContent=$('.cameraContent',fakeHover).eq(slideI).find('.moveFromLeft, .moveFromRight, .moveFromTop, .moveFromBottom, .fadeIn, .fadeFromLeft, .fadeFromRight, .fadeFromTop, .fadeFromBottom').length;if(lMoveIn!=0){$('.cameraSlide.cameracurrent .fadeIn',fakeHover).each(function(){if($(this).attr('data-easing')!=''){var easeMove=$(this).attr('data-easing');}else{var easeMove=easing;}
var t=$(this);if(typeof t.attr('data-outerWidth')==='undefined'||t.attr('data-outerWidth')===false||t.attr('data-outerWidth')===''){var wMoveIn=t.outerWidth();t.attr('data-outerWidth',wMoveIn);}else{var wMoveIn=t.attr('data-outerWidth');}
if(typeof t.attr('data-outerHeight')==='undefined'||t.attr('data-outerHeight')===false||t.attr('data-outerHeight')===''){var hMoveIn=t.outerHeight();t.attr('data-outerHeight',hMoveIn);}else{var hMoveIn=t.attr('data-outerHeight');}
var pos=t.position();var left=pos.left;var top=pos.top;var tClass=t.attr('class');var ind=t.index();var hRel=t.parents('.camerarelative').outerHeight();var wRel=t.parents('.camerarelative').outerWidth();if(tClass.indexOf("fadeIn")!=-1){t.animate({opacity:0},0).css('visibility','visible').delay((time/lMoveIn)*(0.1*(ind-1))).animate({opacity:1},(time/lMoveIn)*0.15,easeMove);}else{t.css('visibility','visible');}});}
$('.cameraContent.cameracurrent',fakeHover).show();if(lMoveInContent!=0){$('.cameraContent.cameracurrent .moveFromLeft, .cameraContent.cameracurrent .moveFromRight, .cameraContent.cameracurrent .moveFromTop, .cameraContent.cameracurrent .moveFromBottom, .cameraContent.cameracurrent .fadeIn, .cameraContent.cameracurrent .fadeFromLeft, .cameraContent.cameracurrent .fadeFromRight, .cameraContent.cameracurrent .fadeFromTop, .cameraContent.cameracurrent .fadeFromBottom',fakeHover).each(function(){if($(this).attr('data-easing')!=''){var easeMove=$(this).attr('data-easing');}else{var easeMove=easing;}
var t=$(this);var pos=t.position();var left=pos.left;var top=pos.top;var tClass=t.attr('class');var ind=t.index();var thisH=t.outerHeight();if(tClass.indexOf("moveFromLeft")!=-1){t.css({'left':'-'+(w)+'px','right':'auto'});t.css('visibility','visible').delay((time/lMoveInContent)*(0.1*(ind-1))).animate({'left':pos.left},(time/lMoveInContent)*0.15,easeMove);}else if(tClass.indexOf("moveFromRight")!=-1){t.css({'left':w+'px','right':'auto'});t.css('visibility','visible').delay((time/lMoveInContent)*(0.1*(ind-1))).animate({'left':pos.left},(time/lMoveInContent)*0.15,easeMove);}else if(tClass.indexOf("moveFromTop")!=-1){t.css({'top':'-'+h+'px','bottom':'auto'});t.css('visibility','visible').delay((time/lMoveInContent)*(0.1*(ind-1))).animate({'top':pos.top},(time/lMoveInContent)*0.15,easeMove,function(){t.css({top:'auto',bottom:0});});}else if(tClass.indexOf("moveFromBottom")!=-1){t.css({'top':h+'px','bottom':'auto'});t.css('visibility','visible').delay((time/lMoveInContent)*(0.1*(ind-1))).animate({'top':pos.top},(time/lMoveInContent)*0.15,easeMove);}else if(tClass.indexOf("fadeFromLeft")!=-1){t.animate({opacity:0},0).css({'left':'-'+(w)+'px','right':'auto'});t.css('visibility','visible').delay((time/lMoveInContent)*(0.1*(ind-1))).animate({'left':pos.left,opacity:1},(time/lMoveInContent)*0.15,easeMove);}else if(tClass.indexOf("fadeFromRight")!=-1){t.animate({opacity:0},0).css({'left':(w)+'px','right':'auto'});t.css('visibility','visible').delay((time/lMoveInContent)*(0.1*(ind-1))).animate({'left':pos.left,opacity:1},(time/lMoveInContent)*0.15,easeMove);}else if(tClass.indexOf("fadeFromTop")!=-1){t.animate({opacity:0},0).css({'top':'-'+(h)+'px','bottom':'auto'});t.css('visibility','visible').delay((time/lMoveInContent)*(0.1*(ind-1))).animate({'top':pos.top,opacity:1},(time/lMoveInContent)*0.15,easeMove,function(){t.css({top:'auto',bottom:0});});}else if(tClass.indexOf("fadeFromBottom")!=-1){t.animate({opacity:0},0).css({'bottom':'-'+thisH+'px'});t.css('visibility','visible').delay((time/lMoveInContent)*(0.1*(ind-1))).animate({'bottom':'0',opacity:1},(time/lMoveInContent)*0.15,easeMove);}else if(tClass.indexOf("fadeIn")!=-1){t.animate({opacity:0},0).css('visibility','visible').delay((time/lMoveInContent)*(0.1*(ind-1))).animate({opacity:1},(time/lMoveInContent)*0.15,easeMove);}else{t.css('visibility','visible');}});}
$('.cameraappended',target).remove();elem.removeClass('camerasliding');selector.eq(vis).hide();var barWidth=$('.camera_bar_cont',camera_thumbs_wrap).width(),barHeight=$('.camera_bar_cont',camera_thumbs_wrap).height(),radSum;if(loader!='pie'){radSum=0.05;}else{radSum=0.005;}
$('#'+pieID).animate({opacity:opts.loaderOpacity},200);u=setInterval(function(){if(elem.hasClass('stopped')){clearInterval(u);}
if(loader!='pie'){if(rad<=1.002&&!elem.hasClass('stopped')&&!elem.hasClass('paused')&&!elem.hasClass('hovered')){rad=(rad+radSum);}else if(rad<=1&&(elem.hasClass('stopped')||elem.hasClass('paused')||elem.hasClass('stopped')||elem.hasClass('hovered'))){rad=rad;}else{if(!elem.hasClass('stopped')&&!elem.hasClass('paused')&&!elem.hasClass('hovered')){clearInterval(u);imgFake();$('#'+pieID).animate({opacity:0},200,function(){clearTimeout(setT);setT=setTimeout(canvasLoader,easedTime);nextSlide();opts.onStartLoading.call(this);});}}
switch(barDirection){case'leftToRight':$('#'+pieID).animate({'right':barWidth-(barWidth*rad)},(time*radSum),'linear');break;case'rightToLeft':$('#'+pieID).animate({'left':barWidth-(barWidth*rad)},(time*radSum),'linear');break;case'topToBottom':$('#'+pieID).animate({'bottom':barHeight-(barHeight*rad)},(time*radSum),'linear');break;case'bottomToTop':$('#'+pieID).animate({'bottom':barHeight-(barHeight*rad)},(time*radSum),'linear');break;}}else{radNew=rad;ctx.clearRect(0,0,opts.pieDiameter,opts.pieDiameter);ctx.globalCompositeOperation='destination-over';ctx.beginPath();ctx.arc((opts.pieDiameter)/2, (opts.pieDiameter)/2, (opts.pieDiameter)/2-opts.loaderStroke,0,Math.PI*2,false);
ctx.lineWidth=opts.loaderStroke;ctx.strokeStyle=opts.loaderBgColor;ctx.stroke();ctx.closePath();ctx.globalCompositeOperation='source-over';ctx.beginPath();ctx.arc((opts.pieDiameter)/2, (opts.pieDiameter)/2, (opts.pieDiameter)/2-opts.loaderStroke,0,Math.PI*2*radNew,false);
ctx.lineWidth=opts.loaderStroke-(opts.loaderPadding*2);ctx.strokeStyle=opts.loaderColor;ctx.stroke();ctx.closePath();if(rad<=1.002&&!elem.hasClass('stopped')&&!elem.hasClass('paused')&&!elem.hasClass('hovered')){rad=(rad+radSum);}else if(rad<=1&&(elem.hasClass('stopped')||elem.hasClass('paused')||elem.hasClass('hovered'))){rad=rad;}else{if(!elem.hasClass('stopped')&&!elem.hasClass('paused')&&!elem.hasClass('hovered')){clearInterval(u);imgFake();$('#'+pieID+', .camera_canvas_wrap',camera_thumbs_wrap).animate({opacity:0},200,function(){clearTimeout(setT);setT=setTimeout(canvasLoader,easedTime);nextSlide();opts.onStartLoading.call(this);});}}}},time*radSum);}}
if(fx=='scrollLeft'||fx=='scrollRight'||fx=='scrollTop'||fx=='scrollBottom'||fx=='scrollHorz'){opts.onStartTransition.call(this);easedTime=0;tApp.delay((((transPeriod+difference)/blocks)*delay[index]*couples)*0.5).css({
'display':'block','height':height,'margin-left':marginLeft,'margin-top':marginTop,'width':width}).animate({'height':Math.floor((h/rows)+addTop+1),'margin-top':0,'margin-left':0,'width':Math.floor((w/cols)+addLeft+1)},(transPeriod-difference),easing,cameraeased);selector.eq(vis).delay((((transPeriod+difference)/blocks)*delay[index]*couples)*0.5).animate({
'margin-left':marginLeft*(-1),'margin-top':marginTop*(-1)},(transPeriod-difference),easing,function(){$(this).css({'margin-top':0,'margin-left':0});});}else{opts.onStartTransition.call(this);easedTime=parseFloat(transPeriod)+parseFloat(difference);if(slideOn=='next'){tApp.delay((((transPeriod+difference)/blocks)*delay[index]*couples)*0.5).css({
'display':'block','height':height,'margin-left':marginLeft,'margin-top':marginTop,'width':width,'opacity':opacityOnGrid}).animate({'height':Math.floor((h/rows)+addTop+1),'margin-top':0,'margin-left':0,'opacity':1,'width':Math.floor((w/cols)+addLeft+1)},(transPeriod-difference),easing,cameraeased);}else{selector.eq(slideI).show().css('z-index','999').addClass('cameracurrent');selector.eq(vis).css('z-index','1').removeClass('cameracurrent');$('.cameraContent',fakeHover).eq(slideI).addClass('cameracurrent');$('.cameraContent',fakeHover).eq(vis).removeClass('cameracurrent');tApp.delay((((transPeriod+difference)/blocks)*delay[index]*couples)*0.5).css({
'display':'block','height':Math.floor((h/rows)+addTop+1),'margin-top':0,'margin-left':0,'opacity':1,'width':Math.floor((w/cols)+addLeft+1)}).animate({'height':height,'margin-left':marginLeft,'margin-top':marginTop,'width':width,'opacity':opacityOnGrid},(transPeriod-difference),easing,cameraeased);}}});}}
if($(prevNav).length){$(prevNav).click(function(){if(!elem.hasClass('camerasliding')){var idNum=parseFloat($('.cameraSlide.cameracurrent',target).index());clearInterval(u);imgFake();$('#'+pieID+', .camera_canvas_wrap',wrap).animate({opacity:0},0);canvasLoader();if(idNum!=0){nextSlide(idNum);}else{nextSlide(amountSlide);}
opts.onStartLoading.call(this);}});}
if($(nextNav).length){$(nextNav).click(function(){if(!elem.hasClass('camerasliding')){var idNum=parseFloat($('.cameraSlide.cameracurrent',target).index());clearInterval(u);imgFake();$('#'+pieID+', .camera_canvas_wrap',camera_thumbs_wrap).animate({opacity:0},0);canvasLoader();if(idNum==amountSlide-1){nextSlide(1);}else{nextSlide(idNum+2);}
opts.onStartLoading.call(this);}});}
if(isMobile()){fakeHover.bind('swipeleft',function(event){if(!elem.hasClass('camerasliding')){var idNum=parseFloat($('.cameraSlide.cameracurrent',target).index());clearInterval(u);imgFake();$('#'+pieID+', .camera_canvas_wrap',camera_thumbs_wrap).animate({opacity:0},0);canvasLoader();if(idNum==amountSlide-1){nextSlide(1);}else{nextSlide(idNum+2);}
opts.onStartLoading.call(this);}});fakeHover.bind('swiperight',function(event){if(!elem.hasClass('camerasliding')){var idNum=parseFloat($('.cameraSlide.cameracurrent',target).index());clearInterval(u);imgFake();$('#'+pieID+', .camera_canvas_wrap',camera_thumbs_wrap).animate({opacity:0},0);canvasLoader();if(idNum!=0){nextSlide(idNum);}else{nextSlide(amountSlide);}
opts.onStartLoading.call(this);}});}
if($(pagination).length){$('.camera_pag li',wrap).click(function(){if(!elem.hasClass('camerasliding')){var idNum=parseFloat($(this).index());var curNum=parseFloat($('.cameraSlide.cameracurrent',target).index());if(idNum!=curNum){clearInterval(u);imgFake();$('#'+pieID+', .camera_canvas_wrap',camera_thumbs_wrap).animate({opacity:0},0);canvasLoader();nextSlide(idNum+1);opts.onStartLoading.call(this);}}});}
if($(thumbs).length){$('.pix_thumb img',thumbs).click(function(){if(!elem.hasClass('camerasliding')){var idNum=parseFloat($(this).parents('li').index());var curNum=parseFloat($('.cameracurrent',target).index());if(idNum!=curNum){clearInterval(u);imgFake();$('#'+pieID+', .camera_canvas_wrap',camera_thumbs_wrap).animate({opacity:0},0);$('.pix_thumb',thumbs).removeClass('cameracurrent');$(this).parents('li').addClass('cameracurrent');canvasLoader();nextSlide(idNum+1);thumbnailPos();opts.onStartLoading.call(this);}}});$('.camera_thumbs_cont .camera_prevThumbs',camera_thumbs_wrap).hover(function(){$(this).stop(true,false).animate({opacity:1},250);},function(){$(this).stop(true,false).animate({opacity:.7},250);});$('.camera_prevThumbs',camera_thumbs_wrap).click(function(){var sum=0,wTh=$(thumbs).outerWidth(),offUl=$('ul',thumbs).offset().left,offDiv=$('> div',thumbs).offset().left,ulLeft=offDiv-offUl;$('.camera_visThumb',thumbs).each(function(){var tW=$(this).outerWidth();sum=sum+tW;});if(ulLeft-sum>0){$('ul',thumbs).animate({'margin-left':'-'+(ulLeft-sum)+'px'},500,thumbnailVisible);}else{$('ul',thumbs).animate({'margin-left':0},500,thumbnailVisible);}});$('.camera_thumbs_cont .camera_nextThumbs',camera_thumbs_wrap).hover(function(){$(this).stop(true,false).animate({opacity:1},250);},function(){$(this).stop(true,false).animate({opacity:.7},250);});$('.camera_nextThumbs',camera_thumbs_wrap).click(function(){var sum=0,wTh=$(thumbs).outerWidth(),ulW=$('ul',thumbs).outerWidth(),offUl=$('ul',thumbs).offset().left,offDiv=$('> div',thumbs).offset().left,ulLeft=offDiv-offUl;$('.camera_visThumb',thumbs).each(function(){var tW=$(this).outerWidth();sum=sum+tW;});if(ulLeft+sum+sum<ulW){$('ul',thumbs).animate({'margin-left':'-'+(ulLeft+sum)+'px'},500,thumbnailVisible);}else{$('ul',thumbs).animate({'margin-left':'-'+(ulW-wTh)+'px'},500,thumbnailVisible);}});}}})(jQuery);;(function($){$.fn.cameraStop=function(){var wrap=$(this),elem=$('.camera_src',wrap),pieID='pie_'+wrap.index();elem.addClass('stopped');if($('.camera_showcommands').length){var camera_thumbs_wrap=$('.camera_thumbs_wrap',wrap);}else{var camera_thumbs_wrap=wrap;}}})(jQuery);;(function($){$.fn.cameraPause=function(){var wrap=$(this);var elem=$('.camera_src',wrap);elem.addClass('paused');}})(jQuery);;(function($){$.fn.cameraResume=function(){var wrap=$(this);var elem=$('.camera_src',wrap);if(typeof autoAdv==='undefined'||autoAdv!==true){elem.removeClass('paused');}}})(jQuery);
/*! device.js 0.1.61 */
(function(){var a,b,c,d,e,f,g,h,i,j;a=window.device,window.device={},c=window.document.documentElement,j=window.navigator.userAgent.toLowerCase(),device.ios=function(){return device.iphone()||device.ipod()||device.ipad()},device.iphone=function(){return d("iphone")},device.ipod=function(){return d("ipod")},device.ipad=function(){return d("ipad")},device.android=function(){return d("android")},device.androidPhone=function(){return device.android()&&d("mobile")},device.androidTablet=function(){return device.android()&&!d("mobile")},device.blackberry=function(){return d("blackberry")||d("bb10")||d("rim")},device.blackberryPhone=function(){return device.blackberry()&&!d("tablet")},device.blackberryTablet=function(){return device.blackberry()&&d("tablet")},device.windows=function(){return d("windows")},device.windowsPhone=function(){return device.windows()&&d("phone")},device.windowsTablet=function(){return device.windows()&&d("touch")&&!device.windowsPhone()},device.fxos=function(){return(d("(mobile;")||d("(tablet;"))&&d("; rv:")},device.fxosPhone=function(){return device.fxos()&&d("mobile")},device.fxosTablet=function(){return device.fxos()&&d("tablet")},device.meego=function(){return d("meego")},device.cordova=function(){return window.cordova&&"file:"===location.protocol},device.nodeWebkit=function(){return"object"==typeof window.process},device.mobile=function(){return device.androidPhone()||device.iphone()||device.ipod()||device.windowsPhone()||device.blackberryPhone()||device.fxosPhone()||device.meego()},device.tablet=function(){return device.ipad()||device.androidTablet()||device.blackberryTablet()||device.windowsTablet()||device.fxosTablet()},device.desktop=function(){return!device.tablet()&&!device.mobile()},device.portrait=function(){return window.innerHeight/window.innerWidth>1},device.landscape=function(){return window.innerHeight/window.innerWidth<1},device.noConflict=function(){return window.device=a,this},d=function(a){return-1!==j.indexOf(a)},f=function(a){var b;return b=new RegExp(a,"i"),c.className.match(b)},b=function(a){return f(a)?void 0:c.className+=" "+a},h=function(a){return f(a)?c.className=c.className.replace(a,""):void 0},device.ios()?device.ipad()?b("ios ipad tablet"):device.iphone()?b("ios iphone mobile"):device.ipod()&&b("ios ipod mobile"):b(device.android()?device.androidTablet()?"android tablet":"android mobile":device.blackberry()?device.blackberryTablet()?"blackberry tablet":"blackberry mobile":device.windows()?device.windowsTablet()?"windows tablet":device.windowsPhone()?"windows mobile":"desktop":device.fxos()?device.fxosTablet()?"fxos tablet":"fxos mobile":device.meego()?"meego mobile":device.nodeWebkit()?"node-webkit":"desktop"),device.cordova()&&b("cordova"),e=function(){return device.landscape()?(h("portrait"),b("landscape")):(h("landscape"),b("portrait"))},i="onorientationchange"in window,g=i?"orientationchange":"resize",window.addEventListener?window.addEventListener(g,e,!1):window.attachEvent?window.attachEvent(g,e):window[g]=e,e()}).call(this);
/*!
 * jQuery Migrate - v1.2.1 - 2013-05-08
 * https://github.com/jquery/jquery-migrate
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors; Licensed MIT
 */
(function( jQuery, window, undefined ) {
// See http://bugs.jquery.com/ticket/13335
// "use strict";


var warnedAbout = {};

// List of warnings already given; public read only
jQuery.migrateWarnings = [];

// Set to true to prevent console output; migrateWarnings still maintained
// jQuery.migrateMute = false;

// Show a message on the console so devs know we're active
if ( !jQuery.migrateMute && window.console && window.console.log ) {
	window.console.log("JQMIGRATE: Logging is active");
}

// Set to false to disable traces that appear with warnings
if ( jQuery.migrateTrace === undefined ) {
	jQuery.migrateTrace = true;
}

// Forget any warnings we've already given; public
jQuery.migrateReset = function() {
	warnedAbout = {};
	jQuery.migrateWarnings.length = 0;
};

function migrateWarn( msg) {
	var console = window.console;
	if ( !warnedAbout[ msg ] ) {
		warnedAbout[ msg ] = true;
		jQuery.migrateWarnings.push( msg );
		if ( console && console.warn && !jQuery.migrateMute ) {
			console.warn( "JQMIGRATE: " + msg );
			if ( jQuery.migrateTrace && console.trace ) {
				console.trace();
			}
		}
	}
}

function migrateWarnProp( obj, prop, value, msg ) {
	if ( Object.defineProperty ) {
		// On ES5 browsers (non-oldIE), warn if the code tries to get prop;
		// allow property to be overwritten in case some other plugin wants it
		try {
			Object.defineProperty( obj, prop, {
				configurable: true,
				enumerable: true,
				get: function() {
					migrateWarn( msg );
					return value;
				},
				set: function( newValue ) {
					migrateWarn( msg );
					value = newValue;
				}
			});
			return;
		} catch( err ) {
			// IE8 is a dope about Object.defineProperty, can't warn there
		}
	}

	// Non-ES5 (or broken) browser; just set the property
	jQuery._definePropertyBroken = true;
	obj[ prop ] = value;
}

if ( document.compatMode === "BackCompat" ) {
	// jQuery has never supported or tested Quirks Mode
	migrateWarn( "jQuery is not compatible with Quirks Mode" );
}


var attrFn = jQuery( "<input/>", { size: 1 } ).attr("size") && jQuery.attrFn,
	oldAttr = jQuery.attr,
	valueAttrGet = jQuery.attrHooks.value && jQuery.attrHooks.value.get ||
		function() { return null; },
	valueAttrSet = jQuery.attrHooks.value && jQuery.attrHooks.value.set ||
		function() { return undefined; },
	rnoType = /^(?:input|button)$/i,
	rnoAttrNodeType = /^[238]$/,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	ruseDefault = /^(?:checked|selected)$/i;

// jQuery.attrFn
migrateWarnProp( jQuery, "attrFn", attrFn || {}, "jQuery.attrFn is deprecated" );

jQuery.attr = function( elem, name, value, pass ) {
	var lowerName = name.toLowerCase(),
		nType = elem && elem.nodeType;

	if ( pass ) {
		// Since pass is used internally, we only warn for new jQuery
		// versions where there isn't a pass arg in the formal params
		if ( oldAttr.length < 4 ) {
			migrateWarn("jQuery.fn.attr( props, pass ) is deprecated");
		}
		if ( elem && !rnoAttrNodeType.test( nType ) &&
			(attrFn ? name in attrFn : jQuery.isFunction(jQuery.fn[name])) ) {
			return jQuery( elem )[ name ]( value );
		}
	}

	// Warn if user tries to set `type`, since it breaks on IE 6/7/8; by checking
	// for disconnected elements we don't warn on $( "<button>", { type: "button" } ).
	if ( name === "type" && value !== undefined && rnoType.test( elem.nodeName ) && elem.parentNode ) {
		migrateWarn("Can't change the 'type' of an input or button in IE 6/7/8");
	}

	// Restore boolHook for boolean property/attribute synchronization
	if ( !jQuery.attrHooks[ lowerName ] && rboolean.test( lowerName ) ) {
		jQuery.attrHooks[ lowerName ] = {
			get: function( elem, name ) {
				// Align boolean attributes with corresponding properties
				// Fall back to attribute presence where some booleans are not supported
				var attrNode,
					property = jQuery.prop( elem, name );
				return property === true || typeof property !== "boolean" &&
					( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?

					name.toLowerCase() :
					undefined;
			},
			set: function( elem, value, name ) {
				var propName;
				if ( value === false ) {
					// Remove boolean attributes when set to false
					jQuery.removeAttr( elem, name );
				} else {
					// value is true since we know at this point it's type boolean and not false
					// Set boolean attributes to the same name and set the DOM property
					propName = jQuery.propFix[ name ] || name;
					if ( propName in elem ) {
						// Only set the IDL specifically if it already exists on the element
						elem[ propName ] = true;
					}

					elem.setAttribute( name, name.toLowerCase() );
				}
				return name;
			}
		};

		// Warn only for attributes that can remain distinct from their properties post-1.9
		if ( ruseDefault.test( lowerName ) ) {
			migrateWarn( "jQuery.fn.attr('" + lowerName + "') may use property instead of attribute" );
		}
	}

	return oldAttr.call( jQuery, elem, name, value );
};

// attrHooks: value
jQuery.attrHooks.value = {
	get: function( elem, name ) {
		var nodeName = ( elem.nodeName || "" ).toLowerCase();
		if ( nodeName === "button" ) {
			return valueAttrGet.apply( this, arguments );
		}
		if ( nodeName !== "input" && nodeName !== "option" ) {
			migrateWarn("jQuery.fn.attr('value') no longer gets properties");
		}
		return name in elem ?
			elem.value :
			null;
	},
	set: function( elem, value ) {
		var nodeName = ( elem.nodeName || "" ).toLowerCase();
		if ( nodeName === "button" ) {
			return valueAttrSet.apply( this, arguments );
		}
		if ( nodeName !== "input" && nodeName !== "option" ) {
			migrateWarn("jQuery.fn.attr('value', val) no longer sets properties");
		}
		// Does not return so that setAttribute is also used
		elem.value = value;
	}
};


var matched, browser,
	oldInit = jQuery.fn.init,
	oldParseJSON = jQuery.parseJSON,
	// Note: XSS check is done below after string is trimmed
	rquickExpr = /^([^<]*)(<[\w\W]+>)([^>]*)$/;

// $(html) "looks like html" rule change
jQuery.fn.init = function( selector, context, rootjQuery ) {
	var match;

	if ( selector && typeof selector === "string" && !jQuery.isPlainObject( context ) &&
			(match = rquickExpr.exec( jQuery.trim( selector ) )) && match[ 0 ] ) {
		// This is an HTML string according to the "old" rules; is it still?
		if ( selector.charAt( 0 ) !== "<" ) {
			migrateWarn("$(html) HTML strings must start with '<' character");
		}
		if ( match[ 3 ] ) {
			migrateWarn("$(html) HTML text after last tag is ignored");
		}
		// Consistently reject any HTML-like string starting with a hash (#9521)
		// Note that this may break jQuery 1.6.x code that otherwise would work.
		if ( match[ 0 ].charAt( 0 ) === "#" ) {
			migrateWarn("HTML string cannot start with a '#' character");
			jQuery.error("JQMIGRATE: Invalid selector string (XSS)");
		}
		// Now process using loose rules; let pre-1.8 play too
		if ( context && context.context ) {
			// jQuery object as context; parseHTML expects a DOM object
			context = context.context;
		}
		if ( jQuery.parseHTML ) {
			return oldInit.call( this, jQuery.parseHTML( match[ 2 ], context, true ),
					context, rootjQuery );
		}
	}
	return oldInit.apply( this, arguments );
};
jQuery.fn.init.prototype = jQuery.fn;

// Let $.parseJSON(falsy_value) return null
jQuery.parseJSON = function( json ) {
	if ( !json && json !== null ) {
		migrateWarn("jQuery.parseJSON requires a valid JSON string");
		return null;
	}
	return oldParseJSON.apply( this, arguments );
};

jQuery.uaMatch = function( ua ) {
	ua = ua.toLowerCase();

	var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
		/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
		/(msie) ([\w.]+)/.exec( ua ) ||
		ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
		[];

	return {
		browser: match[ 1 ] || "",
		version: match[ 2 ] || "0"
	};
};

// Don't clobber any existing jQuery.browser in case it's different
if ( !jQuery.browser ) {
	matched = jQuery.uaMatch( navigator.userAgent );
	browser = {};

	if ( matched.browser ) {
		browser[ matched.browser ] = true;
		browser.version = matched.version;
	}

	// Chrome is Webkit, but Webkit is also Safari.
	if ( browser.chrome ) {
		browser.webkit = true;
	} else if ( browser.webkit ) {
		browser.safari = true;
	}

	jQuery.browser = browser;
}

// Warn if the code tries to get jQuery.browser
migrateWarnProp( jQuery, "browser", jQuery.browser, "jQuery.browser is deprecated" );

jQuery.sub = function() {
	function jQuerySub( selector, context ) {
		return new jQuerySub.fn.init( selector, context );
	}
	jQuery.extend( true, jQuerySub, this );
	jQuerySub.superclass = this;
	jQuerySub.fn = jQuerySub.prototype = this();
	jQuerySub.fn.constructor = jQuerySub;
	jQuerySub.sub = this.sub;
	jQuerySub.fn.init = function init( selector, context ) {
		if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
			context = jQuerySub( context );
		}

		return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
	};
	jQuerySub.fn.init.prototype = jQuerySub.fn;
	var rootjQuerySub = jQuerySub(document);
	migrateWarn( "jQuery.sub() is deprecated" );
	return jQuerySub;
};


// Ensure that $.ajax gets the new parseJSON defined in core.js
jQuery.ajaxSetup({
	converters: {
		"text json": jQuery.parseJSON
	}
});


var oldFnData = jQuery.fn.data;

jQuery.fn.data = function( name ) {
	var ret, evt,
		elem = this[0];

	// Handles 1.7 which has this behavior and 1.8 which doesn't
	if ( elem && name === "events" && arguments.length === 1 ) {
		ret = jQuery.data( elem, name );
		evt = jQuery._data( elem, name );
		if ( ( ret === undefined || ret === evt ) && evt !== undefined ) {
			migrateWarn("Use of jQuery.fn.data('events') is deprecated");
			return evt;
		}
	}
	return oldFnData.apply( this, arguments );
};


var rscriptType = /\/(java|ecma)script/i,
	oldSelf = jQuery.fn.andSelf || jQuery.fn.addBack;

jQuery.fn.andSelf = function() {
	migrateWarn("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()");
	return oldSelf.apply( this, arguments );
};

// Since jQuery.clean is used internally on older versions, we only shim if it's missing
if ( !jQuery.clean ) {
	jQuery.clean = function( elems, context, fragment, scripts ) {
		// Set context per 1.8 logic
		context = context || document;
		context = !context.nodeType && context[0] || context;
		context = context.ownerDocument || context;

		migrateWarn("jQuery.clean() is deprecated");

		var i, elem, handleScript, jsTags,
			ret = [];

		jQuery.merge( ret, jQuery.buildFragment( elems, context ).childNodes );

		// Complex logic lifted directly from jQuery 1.8
		if ( fragment ) {
			// Special handling of each script element
			handleScript = function( elem ) {
				// Check if we consider it executable
				if ( !elem.type || rscriptType.test( elem.type ) ) {
					// Detach the script and store it in the scripts array (if provided) or the fragment
					// Return truthy to indicate that it has been handled
					return scripts ?
						scripts.push( elem.parentNode ? elem.parentNode.removeChild( elem ) : elem ) :
						fragment.appendChild( elem );
				}
			};

			for ( i = 0; (elem = ret[i]) != null; i++ ) {
				// Check if we're done after handling an executable script
				if ( !( jQuery.nodeName( elem, "script" ) && handleScript( elem ) ) ) {
					// Append to fragment and handle embedded scripts
					fragment.appendChild( elem );
					if ( typeof elem.getElementsByTagName !== "undefined" ) {
						// handleScript alters the DOM, so use jQuery.merge to ensure snapshot iteration
						jsTags = jQuery.grep( jQuery.merge( [], elem.getElementsByTagName("script") ), handleScript );

						// Splice the scripts into ret after their former ancestor and advance our index beyond them
						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
						i += jsTags.length;
					}
				}
			}
		}

		return ret;
	};
}

var eventAdd = jQuery.event.add,
	eventRemove = jQuery.event.remove,
	eventTrigger = jQuery.event.trigger,
	oldToggle = jQuery.fn.toggle,
	oldLive = jQuery.fn.live,
	oldDie = jQuery.fn.die,
	ajaxEvents = "ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess",
	rajaxEvent = new RegExp( "\\b(?:" + ajaxEvents + ")\\b" ),
	rhoverHack = /(?:^|\s)hover(\.\S+|)\b/,
	hoverHack = function( events ) {
		if ( typeof( events ) !== "string" || jQuery.event.special.hover ) {
			return events;
		}
		if ( rhoverHack.test( events ) ) {
			migrateWarn("'hover' pseudo-event is deprecated, use 'mouseenter mouseleave'");
		}
		return events && events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

// Event props removed in 1.9, put them back if needed; no practical way to warn them
if ( jQuery.event.props && jQuery.event.props[ 0 ] !== "attrChange" ) {
	jQuery.event.props.unshift( "attrChange", "attrName", "relatedNode", "srcElement" );
}

// Undocumented jQuery.event.handle was "deprecated" in jQuery 1.7
if ( jQuery.event.dispatch ) {
	migrateWarnProp( jQuery.event, "handle", jQuery.event.dispatch, "jQuery.event.handle is undocumented and deprecated" );
}

// Support for 'hover' pseudo-event and ajax event warnings
jQuery.event.add = function( elem, types, handler, data, selector ){
	if ( elem !== document && rajaxEvent.test( types ) ) {
		migrateWarn( "AJAX events should be attached to document: " + types );
	}
	eventAdd.call( this, elem, hoverHack( types || "" ), handler, data, selector );
};
jQuery.event.remove = function( elem, types, handler, selector, mappedTypes ){
	eventRemove.call( this, elem, hoverHack( types ) || "", handler, selector, mappedTypes );
};

jQuery.fn.error = function() {
	var args = Array.prototype.slice.call( arguments, 0);
	migrateWarn("jQuery.fn.error() is deprecated");
	args.splice( 0, 0, "error" );
	if ( arguments.length ) {
		return this.bind.apply( this, args );
	}
	// error event should not bubble to window, although it does pre-1.7
	this.triggerHandler.apply( this, args );
	return this;
};

jQuery.fn.toggle = function( fn, fn2 ) {

	// Don't mess with animation or css toggles
	if ( !jQuery.isFunction( fn ) || !jQuery.isFunction( fn2 ) ) {
		return oldToggle.apply( this, arguments );
	}
	migrateWarn("jQuery.fn.toggle(handler, handler...) is deprecated");

	// Save reference to arguments for access in closure
	var args = arguments,
		guid = fn.guid || jQuery.guid++,
		i = 0,
		toggler = function( event ) {
			// Figure out which function to execute
			var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
			jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

			// Make sure that clicks stop
			event.preventDefault();

			// and execute the function
			return args[ lastToggle ].apply( this, arguments ) || false;
		};

	// link all the functions, so any of them can unbind this click handler
	toggler.guid = guid;
	while ( i < args.length ) {
		args[ i++ ].guid = guid;
	}

	return this.click( toggler );
};

jQuery.fn.live = function( types, data, fn ) {
	migrateWarn("jQuery.fn.live() is deprecated");
	if ( oldLive ) {
		return oldLive.apply( this, arguments );
	}
	jQuery( this.context ).on( types, this.selector, data, fn );
	return this;
};

jQuery.fn.die = function( types, fn ) {
	migrateWarn("jQuery.fn.die() is deprecated");
	if ( oldDie ) {
		return oldDie.apply( this, arguments );
	}
	jQuery( this.context ).off( types, this.selector || "**", fn );
	return this;
};

// Turn global events into document-triggered events
jQuery.event.trigger = function( event, data, elem, onlyHandlers  ){
	if ( !elem && !rajaxEvent.test( event ) ) {
		migrateWarn( "Global events are undocumented and deprecated" );
	}
	return eventTrigger.call( this,  event, data, elem || document, onlyHandlers  );
};
jQuery.each( ajaxEvents.split("|"),
	function( _, name ) {
		jQuery.event.special[ name ] = {
			setup: function() {
				var elem = this;

				// The document needs no shimming; must be !== for oldIE
				if ( elem !== document ) {
					jQuery.event.add( document, name + "." + jQuery.guid, function() {
						jQuery.event.trigger( name, null, elem, true );
					});
					jQuery._data( this, name, jQuery.guid++ );
				}
				return false;
			},
			teardown: function() {
				if ( this !== document ) {
					jQuery.event.remove( document, name + "." + jQuery._data( this, name ) );
				}
				return false;
			}
		};
	}
);


})( jQuery, window );

/*! jQuery Migrate v1.2.1 | (c) 2005, 2013 jQuery Foundation, Inc. and other contributors | jquery.org/license */
jQuery.migrateMute===void 0&&(jQuery.migrateMute=!0),function(e,t,n){function r(n){var r=t.console;i[n]||(i[n]=!0,e.migrateWarnings.push(n),r&&r.warn&&!e.migrateMute&&(r.warn("JQMIGRATE: "+n),e.migrateTrace&&r.trace&&r.trace()))}function a(t,a,i,o){if(Object.defineProperty)try{return Object.defineProperty(t,a,{configurable:!0,enumerable:!0,get:function(){return r(o),i},set:function(e){r(o),i=e}}),n}catch(s){}e._definePropertyBroken=!0,t[a]=i}var i={};e.migrateWarnings=[],!e.migrateMute&&t.console&&t.console.log&&t.console.log("JQMIGRATE: Logging is active"),e.migrateTrace===n&&(e.migrateTrace=!0),e.migrateReset=function(){i={},e.migrateWarnings.length=0},"BackCompat"===document.compatMode&&r("jQuery is not compatible with Quirks Mode");var o=e("<input/>",{size:1}).attr("size")&&e.attrFn,s=e.attr,u=e.attrHooks.value&&e.attrHooks.value.get||function(){return null},c=e.attrHooks.value&&e.attrHooks.value.set||function(){return n},l=/^(?:input|button)$/i,d=/^[238]$/,p=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,f=/^(?:checked|selected)$/i;a(e,"attrFn",o||{},"jQuery.attrFn is deprecated"),e.attr=function(t,a,i,u){var c=a.toLowerCase(),g=t&&t.nodeType;return u&&(4>s.length&&r("jQuery.fn.attr( props, pass ) is deprecated"),t&&!d.test(g)&&(o?a in o:e.isFunction(e.fn[a])))?e(t)[a](i):("type"===a&&i!==n&&l.test(t.nodeName)&&t.parentNode&&r("Can't change the 'type' of an input or button in IE 6/7/8"),!e.attrHooks[c]&&p.test(c)&&(e.attrHooks[c]={get:function(t,r){var a,i=e.prop(t,r);return i===!0||"boolean"!=typeof i&&(a=t.getAttributeNode(r))&&a.nodeValue!==!1?r.toLowerCase():n},set:function(t,n,r){var a;return n===!1?e.removeAttr(t,r):(a=e.propFix[r]||r,a in t&&(t[a]=!0),t.setAttribute(r,r.toLowerCase())),r}},f.test(c)&&r("jQuery.fn.attr('"+c+"') may use property instead of attribute")),s.call(e,t,a,i))},e.attrHooks.value={get:function(e,t){var n=(e.nodeName||"").toLowerCase();return"button"===n?u.apply(this,arguments):("input"!==n&&"option"!==n&&r("jQuery.fn.attr('value') no longer gets properties"),t in e?e.value:null)},set:function(e,t){var a=(e.nodeName||"").toLowerCase();return"button"===a?c.apply(this,arguments):("input"!==a&&"option"!==a&&r("jQuery.fn.attr('value', val) no longer sets properties"),e.value=t,n)}};var g,h,v=e.fn.init,m=e.parseJSON,y=/^([^<]*)(<[\w\W]+>)([^>]*)$/;e.fn.init=function(t,n,a){var i;return t&&"string"==typeof t&&!e.isPlainObject(n)&&(i=y.exec(e.trim(t)))&&i[0]&&("<"!==t.charAt(0)&&r("$(html) HTML strings must start with '<' character"),i[3]&&r("$(html) HTML text after last tag is ignored"),"#"===i[0].charAt(0)&&(r("HTML string cannot start with a '#' character"),e.error("JQMIGRATE: Invalid selector string (XSS)")),n&&n.context&&(n=n.context),e.parseHTML)?v.call(this,e.parseHTML(i[2],n,!0),n,a):v.apply(this,arguments)},e.fn.init.prototype=e.fn,e.parseJSON=function(e){return e||null===e?m.apply(this,arguments):(r("jQuery.parseJSON requires a valid JSON string"),null)},e.uaMatch=function(e){e=e.toLowerCase();var t=/(chrome)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+)/.exec(e)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e)||/(msie) ([\w.]+)/.exec(e)||0>e.indexOf("compatible")&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e)||[];return{browser:t[1]||"",version:t[2]||"0"}},e.browser||(g=e.uaMatch(navigator.userAgent),h={},g.browser&&(h[g.browser]=!0,h.version=g.version),h.chrome?h.webkit=!0:h.webkit&&(h.safari=!0),e.browser=h),a(e,"browser",e.browser,"jQuery.browser is deprecated"),e.sub=function(){function t(e,n){return new t.fn.init(e,n)}e.extend(!0,t,this),t.superclass=this,t.fn=t.prototype=this(),t.fn.constructor=t,t.sub=this.sub,t.fn.init=function(r,a){return a&&a instanceof e&&!(a instanceof t)&&(a=t(a)),e.fn.init.call(this,r,a,n)},t.fn.init.prototype=t.fn;var n=t(document);return r("jQuery.sub() is deprecated"),t},e.ajaxSetup({converters:{"text json":e.parseJSON}});var b=e.fn.data;e.fn.data=function(t){var a,i,o=this[0];return!o||"events"!==t||1!==arguments.length||(a=e.data(o,t),i=e._data(o,t),a!==n&&a!==i||i===n)?b.apply(this,arguments):(r("Use of jQuery.fn.data('events') is deprecated"),i)};var j=/\/(java|ecma)script/i,w=e.fn.andSelf||e.fn.addBack;e.fn.andSelf=function(){return r("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()"),w.apply(this,arguments)},e.clean||(e.clean=function(t,a,i,o){a=a||document,a=!a.nodeType&&a[0]||a,a=a.ownerDocument||a,r("jQuery.clean() is deprecated");var s,u,c,l,d=[];if(e.merge(d,e.buildFragment(t,a).childNodes),i)for(c=function(e){return!e.type||j.test(e.type)?o?o.push(e.parentNode?e.parentNode.removeChild(e):e):i.appendChild(e):n},s=0;null!=(u=d[s]);s++)e.nodeName(u,"script")&&c(u)||(i.appendChild(u),u.getElementsByTagName!==n&&(l=e.grep(e.merge([],u.getElementsByTagName("script")),c),d.splice.apply(d,[s+1,0].concat(l)),s+=l.length));return d});var Q=e.event.add,x=e.event.remove,k=e.event.trigger,N=e.fn.toggle,T=e.fn.live,M=e.fn.die,S="ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess",C=RegExp("\\b(?:"+S+")\\b"),H=/(?:^|\s)hover(\.\S+|)\b/,A=function(t){return"string"!=typeof t||e.event.special.hover?t:(H.test(t)&&r("'hover' pseudo-event is deprecated, use 'mouseenter mouseleave'"),t&&t.replace(H,"mouseenter$1 mouseleave$1"))};e.event.props&&"attrChange"!==e.event.props[0]&&e.event.props.unshift("attrChange","attrName","relatedNode","srcElement"),e.event.dispatch&&a(e.event,"handle",e.event.dispatch,"jQuery.event.handle is undocumented and deprecated"),e.event.add=function(e,t,n,a,i){e!==document&&C.test(t)&&r("AJAX events should be attached to document: "+t),Q.call(this,e,A(t||""),n,a,i)},e.event.remove=function(e,t,n,r,a){x.call(this,e,A(t)||"",n,r,a)},e.fn.error=function(){var e=Array.prototype.slice.call(arguments,0);return r("jQuery.fn.error() is deprecated"),e.splice(0,0,"error"),arguments.length?this.bind.apply(this,e):(this.triggerHandler.apply(this,e),this)},e.fn.toggle=function(t,n){if(!e.isFunction(t)||!e.isFunction(n))return N.apply(this,arguments);r("jQuery.fn.toggle(handler, handler...) is deprecated");var a=arguments,i=t.guid||e.guid++,o=0,s=function(n){var r=(e._data(this,"lastToggle"+t.guid)||0)%o;return e._data(this,"lastToggle"+t.guid,r+1),n.preventDefault(),a[r].apply(this,arguments)||!1};for(s.guid=i;a.length>o;)a[o++].guid=i;return this.click(s)},e.fn.live=function(t,n,a){return r("jQuery.fn.live() is deprecated"),T?T.apply(this,arguments):(e(this.context).on(t,this.selector,n,a),this)},e.fn.die=function(t,n){return r("jQuery.fn.die() is deprecated"),M?M.apply(this,arguments):(e(this.context).off(t,this.selector||"**",n),this)},e.event.trigger=function(e,t,n,a){return n||C.test(e)||r("Global events are undocumented and deprecated"),k.call(this,e,t,n||document,a)},e.each(S.split("|"),function(t,n){e.event.special[n]={setup:function(){var t=this;return t!==document&&(e.event.add(document,n+"."+e.guid,function(){e.event.trigger(n,null,t,!0)}),e._data(this,n,e.guid++)),!1},teardown:function(){return this!==document&&e.event.remove(document,n+"."+e._data(this,n)),!1}}})}(jQuery,window);
(function(factory){if(typeof define==='function'&&define.amd){define(['jquery'],factory);}else{factory(jQuery);}}(function($){var pluses=/\+/g;function encode(s){return config.raw?s:encodeURIComponent(s);}
function decode(s){return config.raw?s:decodeURIComponent(s);}
function stringifyCookieValue(value){return encode(config.json?JSON.stringify(value):String(value));}
function parseCookieValue(s){if(s.indexOf('"')===0){s=s.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,'\\');}
try{s=decodeURIComponent(s.replace(pluses,' '));return config.json?JSON.parse(s):s;}catch(e){}}
function read(s,converter){var value=config.raw?s:parseCookieValue(s);return $.isFunction(converter)?converter(value):value;}
var config=$.cookie=function(key,value,options){if(value!==undefined&&!$.isFunction(value)){options=$.extend({},config.defaults,options);if(typeof options.expires==='number'){var days=options.expires,t=options.expires=new Date();t.setTime(+t+ days*864e+5);}
return(document.cookie=[encode(key),'=',stringifyCookieValue(value),options.expires?'; expires='+ options.expires.toUTCString():'',options.path?'; path='+ options.path:'',options.domain?'; domain='+ options.domain:'',options.secure?'; secure':''].join(''));}
var result=key?undefined:{};var cookies=document.cookie?document.cookie.split('; '):[];for(var i=0,l=cookies.length;i<l;i++){var parts=cookies[i].split('=');var name=decode(parts.shift());var cookie=parts.join('=');if(key&&key===name){result=read(cookie,value);break;}
if(!key&&(cookie=read(cookie))!==undefined){result[name]=cookie;}}
return result;};config.defaults={};$.removeCookie=function(key,options){if($.cookie(key)===undefined){return false;}
$.cookie(key,'',$.extend({},options,{expires:-1}));return!$.cookie(key);};}));
jQuery.easing['jswing']=jQuery.easing['swing'];jQuery.extend(jQuery.easing,{def:'easeOutQuad',swing:function(x,t,b,c,d){return jQuery.easing[jQuery.easing.def](x,t,b,c,d);},easeInQuad:function(x,t,b,c,d){return c*(t/=d)*t+ b;},easeOutQuad:function(x,t,b,c,d){return-c*(t/=d)*(t-2)+ b;},easeInOutQuad:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t+ b;return-c/2*((--t)*(t-2)- 1)+ b;},easeInCubic:function(x,t,b,c,d){return c*(t/=d)*t*t+ b;},easeOutCubic:function(x,t,b,c,d){return c*((t=t/d-1)*t*t+ 1)+ b;},easeInOutCubic:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t+ b;return c/2*((t-=2)*t*t+ 2)+ b;},easeInQuart:function(x,t,b,c,d){return c*(t/=d)*t*t*t+ b;},easeOutQuart:function(x,t,b,c,d){return-c*((t=t/d-1)*t*t*t- 1)+ b;},easeInOutQuart:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t+ b;return-c/2*((t-=2)*t*t*t- 2)+ b;},easeInQuint:function(x,t,b,c,d){return c*(t/=d)*t*t*t*t+ b;},easeOutQuint:function(x,t,b,c,d){return c*((t=t/d-1)*t*t*t*t+ 1)+ b;},easeInOutQuint:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t*t+ b;return c/2*((t-=2)*t*t*t*t+ 2)+ b;},easeInSine:function(x,t,b,c,d){return-c*Math.cos(t/d*(Math.PI/2))+ c+ b;},easeOutSine:function(x,t,b,c,d){return c*Math.sin(t/d*(Math.PI/2))+ b;},easeInOutSine:function(x,t,b,c,d){return-c/2*(Math.cos(Math.PI*t/d)- 1)+ b;},easeInExpo:function(x,t,b,c,d){return(t==0)?b:c*Math.pow(2,10*(t/d- 1))+ b;},easeOutExpo:function(x,t,b,c,d){return(t==d)?b+c:c*(-Math.pow(2,-10*t/d)+ 1)+ b;},easeInOutExpo:function(x,t,b,c,d){if(t==0)return b;if(t==d)return b+c;if((t/=d/2)<1)return c/2*Math.pow(2,10*(t- 1))+ b;return c/2*(-Math.pow(2,-10*--t)+ 2)+ b;},easeInCirc:function(x,t,b,c,d){return-c*(Math.sqrt(1-(t/=d)*t)- 1)+ b;},easeOutCirc:function(x,t,b,c,d){return c*Math.sqrt(1-(t=t/d-1)*t)+ b;},easeInOutCirc:function(x,t,b,c,d){if((t/=d/2)<1)return-c/2*(Math.sqrt(1- t*t)- 1)+ b;return c/2*(Math.sqrt(1-(t-=2)*t)+ 1)+ b;},easeInElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4;}
else var s=p/(2*Math.PI)*Math.asin(c/a);return-(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p )) + b;
},easeOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4;}
else var s=p/(2*Math.PI)*Math.asin(c/a);return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p ) + c + b;
},easeInOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d/2)==2)return b+c;if(!p)p=d*(.3*1.5);if(a<Math.abs(c)){a=c;var s=p/4;}
else var s=p/(2*Math.PI)*Math.asin(c/a);if(t<1)return-.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p )) + b;
return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p )*.5 + c + b;
},easeInBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*(t/=d)*t*((s+1)*t- s)+ b;},easeOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*((t=t/d-1)*t*((s+1)*t+ s)+ 1)+ b;},easeInOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t- s))+ b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+ s)+ 2)+ b;},easeInBounce:function(x,t,b,c,d){return c- jQuery.easing.easeOutBounce(x,d-t,0,c,d)+ b;},easeOutBounce:function(x,t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+ b;}else if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+.75)+ b;}else if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+ b;}else{return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+ b;}},easeInOutBounce:function(x,t,b,c,d){if(t<d/2)return jQuery.easing.easeInBounce(x,t*2,0,c,d)*.5+ b;return jQuery.easing.easeOutBounce(x,t*2-d,0,c,d)*.5+ c*.5+ b;}});
/*
* jQuery easyShare plugin
* Update on 28 december 2011
* Version 1.0
*
* Licensed under GPL <http://en.wikipedia.org/wiki/GNU_General_Public_License>
* Copyright (c) 2008, St�phane Litou <contact@mushtitude.com>
* All rights reserved.
*
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function($){
$.fn.easyPaginate = function (options) {
    var defaults = {
        paginateElement: 'li',
        hashPage: 'page',
        elementsPerPage: 10,
        effect: 'default',
        slideOffset: 200,
        firstButton: true,
        firstButtonText: '<<',
        lastButton: true,
        lastButtonText: '>>',        
        prevButton: true,
        prevButtonText: '<',        
        nextButton: true,
        nextButtonText: '>'
    }
        
    return this.each (function (instance) {        
        
        var plugin = {};
        plugin.el = $(this);
        plugin.el.addClass('easyPaginateList');

        plugin.settings = {
            pages: 0,
            objElements: Object,
            currentPage: 1
        }
        
        var getNbOfPages = function() {
            return Math.ceil(plugin.settings.objElements.length / plugin.settings.elementsPerPage);         
        };
        
        var displayNav = function() {
            htmlNav = '<div class="easyPaginateNav">';
            
            if(plugin.settings.firstButton) {
                htmlNav += '<a href="#'+plugin.settings.hashPage+':1" title="First page" rel="1" class="first">'+plugin.settings.firstButtonText+'</a>';
            }
            
            if(plugin.settings.prevButton) {
                htmlNav += '<a href="" title="Previous" rel="" class="prev">'+plugin.settings.prevButtonText+'</a>';
            }
            
            for(i = 1;i <= plugin.settings.pages;i++) {
                htmlNav += '<a href="#'+plugin.settings.hashPage+':'+i+'" title="Page '+i+'" rel="'+i+'" class="page">'+i+'</a>';
            };
            
            if(plugin.settings.nextButton) {
                htmlNav += '<a href="" title="Next" rel="" class="next">'+plugin.settings.nextButtonText+'</a>';
            }
            
            if(plugin.settings.lastButton) {
                htmlNav += '<a href="#'+plugin.settings.hashPage+':'+plugin.settings.pages+'" title="Last page" rel="'+plugin.settings.pages+'" class="last">'+plugin.settings.lastButtonText+'</a>';
            }
            
            htmlNav += '</div>';
            plugin.nav = $(htmlNav);
            plugin.nav.css({
                'width': plugin.el.width()
            });
            plugin.el.after(plugin.nav);

            var elSelector = '#' + plugin.el.get(0).id + ' + ';
            $(elSelector + ' .easyPaginateNav a.page,'
                + elSelector + ' .easyPaginateNav a.first,'
                + elSelector + ' .easyPaginateNav a.last').on('click', function(e) {
                e.preventDefault();
                displayPage($(this).attr('rel'));                
            });

            $(elSelector + ' .easyPaginateNav a.prev', plugin).on('click', function(e) {
                e.preventDefault();
                page = plugin.settings.currentPage > 1?parseInt(plugin.settings.currentPage) - 1:1;
                displayPage(page);
            });

            $(elSelector + ' .easyPaginateNav a.next', plugin).on('click', function(e) {
                e.preventDefault();
                page = plugin.settings.currentPage < plugin.settings.pages?parseInt(plugin.settings.currentPage) + 1:plugin.settings.pages;
                displayPage(page);
            });
        };
        
        var displayPage = function(page, forceEffect) {
            if(plugin.settings.currentPage != page) {
                plugin.settings.currentPage = parseInt(page);
                offsetStart = (page - 1) * plugin.settings.elementsPerPage;
                offsetEnd = page * plugin.settings.elementsPerPage;
                if(typeof(forceEffect) != 'undefined') {
                    eval("transition_"+forceEffect+"("+offsetStart+", "+offsetEnd+")");
                }else {
                    eval("transition_"+plugin.settings.effect+"("+offsetStart+", "+offsetEnd+")");
                }
                
                plugin.nav.find('.current').removeClass('current');
                plugin.nav.find('a.page:eq('+(page - 1)+')').addClass('current');
                
                switch(plugin.settings.currentPage) {
                    case 1:
                        $('.easyPaginateNav a', plugin).removeClass('disabled');
                        $('.easyPaginateNav a.first, .easyPaginateNav a.prev', plugin).addClass('disabled');
                        break;
                    case plugin.settings.pages:
                        $('.easyPaginateNav a', plugin).removeClass('disabled');
                        $('.easyPaginateNav a.last, .easyPaginateNav a.next', plugin).addClass('disabled');
                        break;
                    default:
                        $('.easyPaginateNav a', plugin).removeClass('disabled');
                        break;
                }
            }
        };
        
        var transition_default = function(offsetStart, offsetEnd) {
            plugin.currentElements.hide();
            plugin.currentElements = plugin.settings.objElements.slice(offsetStart, offsetEnd).clone();
            plugin.el.html(plugin.currentElements);
            plugin.currentElements.show();
        };
        
        var transition_fade = function(offsetStart, offsetEnd) {
            plugin.currentElements.fadeOut();
            plugin.currentElements = plugin.settings.objElements.slice(offsetStart, offsetEnd).clone();
            plugin.el.html(plugin.currentElements);
            plugin.currentElements.fadeIn();
        };
        
        var transition_slide = function(offsetStart, offsetEnd) {
            plugin.currentElements.animate({
                'margin-left': plugin.settings.slideOffset * -1,
                'opacity': 0
            }, function() {
                $(this).remove();
            });
            
            plugin.currentElements = plugin.settings.objElements.slice(offsetStart, offsetEnd).clone();
            plugin.currentElements.css({
                'margin-left': plugin.settings.slideOffset,
                'display': 'block',
                'opacity': 0,
                'min-width': plugin.el.width() / 2
            });
            plugin.el.html(plugin.currentElements);
            plugin.currentElements.animate({
                'margin-left': 0,
                'opacity': 1
            });
        };
                
        var transition_climb = function(offsetStart, offsetEnd) {            
            plugin.currentElements.each(function(i) {
                var $objThis = $(this);
                setTimeout(function() {
                    $objThis.animate({
                        'margin-left': plugin.settings.slideOffset * -1,
                        'opacity': 0
                    }, function() {
                        $(this).remove();
                    });
                }, i * 200);
            });
            
            plugin.currentElements = plugin.settings.objElements.slice(offsetStart, offsetEnd).clone();
            plugin.currentElements.css({
                'margin-left': plugin.settings.slideOffset,
                'display': 'block',
                'opacity': 0,
                'min-width': plugin.el.width() / 2
            });
            plugin.el.html(plugin.currentElements);
            plugin.currentElements.each(function(i) {
                var $objThis = $(this);
                setTimeout(function() {
                    $objThis.animate({
                        'margin-left': 0,
                        'opacity': 1
                    });
                }, i * 200);
            });
        };
                
        plugin.settings = $.extend({}, defaults, options);
        
        plugin.currentElements = $([]);
        plugin.settings.objElements = plugin.el.find(plugin.settings.paginateElement);
        plugin.settings.pages = getNbOfPages();
        if(plugin.settings.pages > 1) {
            plugin.el.html();
    
            // Here we go
            displayNav();
            
            page = 1;
            if(document.location.hash.indexOf('#'+plugin.settings.hashPage+':') != -1) {
                page = parseInt(document.location.hash.replace('#'+plugin.settings.hashPage+':', ''));
                if(page.length <= 0 || page < 1 || page > plugin.settings.pages) {
                    page = 1;
                }
            }
            
            displayPage(page, 'default');
        }
    });
};
})(jQuery);

/*!
 * jQuery Form Plugin
 * version: 3.51.0-2014.06.20
 * Requires jQuery v1.5 or later
 * Copyright (c) 2014 M. Alsup
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Project repository: https://github.com/malsup/form
 * Dual licensed under the MIT and GPL licenses.
 * https://github.com/malsup/form#copyright-and-license
 */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["../jquery"],e):e("undefined"!=typeof jQuery?jQuery:window.Zepto)}(function(e){"use strict";function t(t){var r=t.data;t.isDefaultPrevented()||(t.preventDefault(),e(t.target).ajaxSubmit(r))}function r(t){var r=t.target,a=e(r);if(!a.is("[type=submit],[type=image]")){var n=a.closest("[type=submit]");if(0===n.length)return;r=n[0]}var i=this;if(i.clk=r,"image"==r.type)if(void 0!==t.offsetX)i.clk_x=t.offsetX,i.clk_y=t.offsetY;else if("function"==typeof e.fn.offset){var o=a.offset();i.clk_x=t.pageX-o.left,i.clk_y=t.pageY-o.top}else i.clk_x=t.pageX-r.offsetLeft,i.clk_y=t.pageY-r.offsetTop;setTimeout(function(){i.clk=i.clk_x=i.clk_y=null},100)}function a(){if(e.fn.ajaxSubmit.debug){var t="[jquery.form] "+Array.prototype.join.call(arguments,"");window.console&&window.console.log?window.console.log(t):window.opera&&window.opera.postError&&window.opera.postError(t)}}var n={};n.fileapi=void 0!==e("<input type='file'/>").get(0).files,n.formdata=void 0!==window.FormData;var i=!!e.fn.prop;e.fn.attr2=function(){if(!i)return this.attr.apply(this,arguments);var e=this.prop.apply(this,arguments);return e&&e.jquery||"string"==typeof e?e:this.attr.apply(this,arguments)},e.fn.ajaxSubmit=function(t){function r(r){var a,n,i=e.param(r,t.traditional).split("&"),o=i.length,s=[];for(a=0;o>a;a++)i[a]=i[a].replace(/\+/g," "),n=i[a].split("="),s.push([decodeURIComponent(n[0]),decodeURIComponent(n[1])]);return s}function o(a){for(var n=new FormData,i=0;i<a.length;i++)n.append(a[i].name,a[i].value);if(t.extraData){var o=r(t.extraData);for(i=0;i<o.length;i++)o[i]&&n.append(o[i][0],o[i][1])}t.data=null;var s=e.extend(!0,{},e.ajaxSettings,t,{contentType:!1,processData:!1,cache:!1,type:u||"POST"});t.uploadProgress&&(s.xhr=function(){var r=e.ajaxSettings.xhr();return r.upload&&r.upload.addEventListener("progress",function(e){var r=0,a=e.loaded||e.position,n=e.total;e.lengthComputable&&(r=Math.ceil(a/n*100)),t.uploadProgress(e,a,n,r)},!1),r}),s.data=null;var c=s.beforeSend;return s.beforeSend=function(e,r){r.data=t.formData?t.formData:n,c&&c.call(this,e,r)},e.ajax(s)}function s(r){function n(e){var t=null;try{e.contentWindow&&(t=e.contentWindow.document)}catch(r){a("cannot get iframe.contentWindow document: "+r)}if(t)return t;try{t=e.contentDocument?e.contentDocument:e.document}catch(r){a("cannot get iframe.contentDocument: "+r),t=e.document}return t}function o(){function t(){try{var e=n(g).readyState;a("state = "+e),e&&"uninitialized"==e.toLowerCase()&&setTimeout(t,50)}catch(r){a("Server abort: ",r," (",r.name,")"),s(k),j&&clearTimeout(j),j=void 0}}var r=f.attr2("target"),i=f.attr2("action"),o="multipart/form-data",c=f.attr("enctype")||f.attr("encoding")||o;w.setAttribute("target",p),(!u||/post/i.test(u))&&w.setAttribute("method","POST"),i!=m.url&&w.setAttribute("action",m.url),m.skipEncodingOverride||u&&!/post/i.test(u)||f.attr({encoding:"multipart/form-data",enctype:"multipart/form-data"}),m.timeout&&(j=setTimeout(function(){T=!0,s(D)},m.timeout));var l=[];try{if(m.extraData)for(var d in m.extraData)m.extraData.hasOwnProperty(d)&&l.push(e.isPlainObject(m.extraData[d])&&m.extraData[d].hasOwnProperty("name")&&m.extraData[d].hasOwnProperty("value")?e('<input type="hidden" name="'+m.extraData[d].name+'">').val(m.extraData[d].value).appendTo(w)[0]:e('<input type="hidden" name="'+d+'">').val(m.extraData[d]).appendTo(w)[0]);m.iframeTarget||v.appendTo("body"),g.attachEvent?g.attachEvent("onload",s):g.addEventListener("load",s,!1),setTimeout(t,15);try{w.submit()}catch(h){var x=document.createElement("form").submit;x.apply(w)}}finally{w.setAttribute("action",i),w.setAttribute("enctype",c),r?w.setAttribute("target",r):f.removeAttr("target"),e(l).remove()}}function s(t){if(!x.aborted&&!F){if(M=n(g),M||(a("cannot access response document"),t=k),t===D&&x)return x.abort("timeout"),void S.reject(x,"timeout");if(t==k&&x)return x.abort("server abort"),void S.reject(x,"error","server abort");if(M&&M.location.href!=m.iframeSrc||T){g.detachEvent?g.detachEvent("onload",s):g.removeEventListener("load",s,!1);var r,i="success";try{if(T)throw"timeout";var o="xml"==m.dataType||M.XMLDocument||e.isXMLDoc(M);if(a("isXml="+o),!o&&window.opera&&(null===M.body||!M.body.innerHTML)&&--O)return a("requeing onLoad callback, DOM not available"),void setTimeout(s,250);var u=M.body?M.body:M.documentElement;x.responseText=u?u.innerHTML:null,x.responseXML=M.XMLDocument?M.XMLDocument:M,o&&(m.dataType="xml"),x.getResponseHeader=function(e){var t={"content-type":m.dataType};return t[e.toLowerCase()]},u&&(x.status=Number(u.getAttribute("status"))||x.status,x.statusText=u.getAttribute("statusText")||x.statusText);var c=(m.dataType||"").toLowerCase(),l=/(json|script|text)/.test(c);if(l||m.textarea){var f=M.getElementsByTagName("textarea")[0];if(f)x.responseText=f.value,x.status=Number(f.getAttribute("status"))||x.status,x.statusText=f.getAttribute("statusText")||x.statusText;else if(l){var p=M.getElementsByTagName("pre")[0],h=M.getElementsByTagName("body")[0];p?x.responseText=p.textContent?p.textContent:p.innerText:h&&(x.responseText=h.textContent?h.textContent:h.innerText)}}else"xml"==c&&!x.responseXML&&x.responseText&&(x.responseXML=X(x.responseText));try{E=_(x,c,m)}catch(y){i="parsererror",x.error=r=y||i}}catch(y){a("error caught: ",y),i="error",x.error=r=y||i}x.aborted&&(a("upload aborted"),i=null),x.status&&(i=x.status>=200&&x.status<300||304===x.status?"success":"error"),"success"===i?(m.success&&m.success.call(m.context,E,"success",x),S.resolve(x.responseText,"success",x),d&&e.event.trigger("ajaxSuccess",[x,m])):i&&(void 0===r&&(r=x.statusText),m.error&&m.error.call(m.context,x,i,r),S.reject(x,"error",r),d&&e.event.trigger("ajaxError",[x,m,r])),d&&e.event.trigger("ajaxComplete",[x,m]),d&&!--e.active&&e.event.trigger("ajaxStop"),m.complete&&m.complete.call(m.context,x,i),F=!0,m.timeout&&clearTimeout(j),setTimeout(function(){m.iframeTarget?v.attr("src",m.iframeSrc):v.remove(),x.responseXML=null},100)}}}var c,l,m,d,p,v,g,x,y,b,T,j,w=f[0],S=e.Deferred();if(S.abort=function(e){x.abort(e)},r)for(l=0;l<h.length;l++)c=e(h[l]),i?c.prop("disabled",!1):c.removeAttr("disabled");if(m=e.extend(!0,{},e.ajaxSettings,t),m.context=m.context||m,p="jqFormIO"+(new Date).getTime(),m.iframeTarget?(v=e(m.iframeTarget),b=v.attr2("name"),b?p=b:v.attr2("name",p)):(v=e('<iframe name="'+p+'" src="'+m.iframeSrc+'" />'),v.css({position:"absolute",top:"-1000px",left:"-1000px"})),g=v[0],x={aborted:0,responseText:null,responseXML:null,status:0,statusText:"n/a",getAllResponseHeaders:function(){},getResponseHeader:function(){},setRequestHeader:function(){},abort:function(t){var r="timeout"===t?"timeout":"aborted";a("aborting upload... "+r),this.aborted=1;try{g.contentWindow.document.execCommand&&g.contentWindow.document.execCommand("Stop")}catch(n){}v.attr("src",m.iframeSrc),x.error=r,m.error&&m.error.call(m.context,x,r,t),d&&e.event.trigger("ajaxError",[x,m,r]),m.complete&&m.complete.call(m.context,x,r)}},d=m.global,d&&0===e.active++&&e.event.trigger("ajaxStart"),d&&e.event.trigger("ajaxSend",[x,m]),m.beforeSend&&m.beforeSend.call(m.context,x,m)===!1)return m.global&&e.active--,S.reject(),S;if(x.aborted)return S.reject(),S;y=w.clk,y&&(b=y.name,b&&!y.disabled&&(m.extraData=m.extraData||{},m.extraData[b]=y.value,"image"==y.type&&(m.extraData[b+".x"]=w.clk_x,m.extraData[b+".y"]=w.clk_y)));var D=1,k=2,A=e("meta[name=csrf-token]").attr("content"),L=e("meta[name=csrf-param]").attr("content");L&&A&&(m.extraData=m.extraData||{},m.extraData[L]=A),m.forceSync?o():setTimeout(o,10);var E,M,F,O=50,X=e.parseXML||function(e,t){return window.ActiveXObject?(t=new ActiveXObject("Microsoft.XMLDOM"),t.async="false",t.loadXML(e)):t=(new DOMParser).parseFromString(e,"text/xml"),t&&t.documentElement&&"parsererror"!=t.documentElement.nodeName?t:null},C=e.parseJSON||function(e){return window.eval("("+e+")")},_=function(t,r,a){var n=t.getResponseHeader("content-type")||"",i="xml"===r||!r&&n.indexOf("xml")>=0,o=i?t.responseXML:t.responseText;return i&&"parsererror"===o.documentElement.nodeName&&e.error&&e.error("parsererror"),a&&a.dataFilter&&(o=a.dataFilter(o,r)),"string"==typeof o&&("json"===r||!r&&n.indexOf("json")>=0?o=C(o):("script"===r||!r&&n.indexOf("javascript")>=0)&&e.globalEval(o)),o};return S}if(!this.length)return a("ajaxSubmit: skipping submit process - no element selected"),this;var u,c,l,f=this;"function"==typeof t?t={success:t}:void 0===t&&(t={}),u=t.type||this.attr2("method"),c=t.url||this.attr2("action"),l="string"==typeof c?e.trim(c):"",l=l||window.location.href||"",l&&(l=(l.match(/^([^#]+)/)||[])[1]),t=e.extend(!0,{url:l,success:e.ajaxSettings.success,type:u||e.ajaxSettings.type,iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank"},t);var m={};if(this.trigger("form-pre-serialize",[this,t,m]),m.veto)return a("ajaxSubmit: submit vetoed via form-pre-serialize trigger"),this;if(t.beforeSerialize&&t.beforeSerialize(this,t)===!1)return a("ajaxSubmit: submit aborted via beforeSerialize callback"),this;var d=t.traditional;void 0===d&&(d=e.ajaxSettings.traditional);var p,h=[],v=this.formToArray(t.semantic,h);if(t.data&&(t.extraData=t.data,p=e.param(t.data,d)),t.beforeSubmit&&t.beforeSubmit(v,this,t)===!1)return a("ajaxSubmit: submit aborted via beforeSubmit callback"),this;if(this.trigger("form-submit-validate",[v,this,t,m]),m.veto)return a("ajaxSubmit: submit vetoed via form-submit-validate trigger"),this;var g=e.param(v,d);p&&(g=g?g+"&"+p:p),"GET"==t.type.toUpperCase()?(t.url+=(t.url.indexOf("?")>=0?"&":"?")+g,t.data=null):t.data=g;var x=[];if(t.resetForm&&x.push(function(){f.resetForm()}),t.clearForm&&x.push(function(){f.clearForm(t.includeHidden)}),!t.dataType&&t.target){var y=t.success||function(){};x.push(function(r){var a=t.replaceTarget?"replaceWith":"html";e(t.target)[a](r).each(y,arguments)})}else t.success&&x.push(t.success);if(t.success=function(e,r,a){for(var n=t.context||this,i=0,o=x.length;o>i;i++)x[i].apply(n,[e,r,a||f,f])},t.error){var b=t.error;t.error=function(e,r,a){var n=t.context||this;b.apply(n,[e,r,a,f])}}if(t.complete){var T=t.complete;t.complete=function(e,r){var a=t.context||this;T.apply(a,[e,r,f])}}var j=e("input[type=file]:enabled",this).filter(function(){return""!==e(this).val()}),w=j.length>0,S="multipart/form-data",D=f.attr("enctype")==S||f.attr("encoding")==S,k=n.fileapi&&n.formdata;a("fileAPI :"+k);var A,L=(w||D)&&!k;t.iframe!==!1&&(t.iframe||L)?t.closeKeepAlive?e.get(t.closeKeepAlive,function(){A=s(v)}):A=s(v):A=(w||D)&&k?o(v):e.ajax(t),f.removeData("jqxhr").data("jqxhr",A);for(var E=0;E<h.length;E++)h[E]=null;return this.trigger("form-submit-notify",[this,t]),this},e.fn.ajaxForm=function(n){if(n=n||{},n.delegation=n.delegation&&e.isFunction(e.fn.on),!n.delegation&&0===this.length){var i={s:this.selector,c:this.context};return!e.isReady&&i.s?(a("DOM not ready, queuing ajaxForm"),e(function(){e(i.s,i.c).ajaxForm(n)}),this):(a("terminating; zero elements found by selector"+(e.isReady?"":" (DOM not ready)")),this)}return n.delegation?(e(document).off("submit.form-plugin",this.selector,t).off("click.form-plugin",this.selector,r).on("submit.form-plugin",this.selector,n,t).on("click.form-plugin",this.selector,n,r),this):this.ajaxFormUnbind().bind("submit.form-plugin",n,t).bind("click.form-plugin",n,r)},e.fn.ajaxFormUnbind=function(){return this.unbind("submit.form-plugin click.form-plugin")},e.fn.formToArray=function(t,r){var a=[];if(0===this.length)return a;var i,o=this[0],s=this.attr("id"),u=t?o.getElementsByTagName("*"):o.elements;if(u&&!/MSIE [678]/.test(navigator.userAgent)&&(u=e(u).get()),s&&(i=e(':input[form="'+s+'"]').get(),i.length&&(u=(u||[]).concat(i))),!u||!u.length)return a;var c,l,f,m,d,p,h;for(c=0,p=u.length;p>c;c++)if(d=u[c],f=d.name,f&&!d.disabled)if(t&&o.clk&&"image"==d.type)o.clk==d&&(a.push({name:f,value:e(d).val(),type:d.type}),a.push({name:f+".x",value:o.clk_x},{name:f+".y",value:o.clk_y}));else if(m=e.fieldValue(d,!0),m&&m.constructor==Array)for(r&&r.push(d),l=0,h=m.length;h>l;l++)a.push({name:f,value:m[l]});else if(n.fileapi&&"file"==d.type){r&&r.push(d);var v=d.files;if(v.length)for(l=0;l<v.length;l++)a.push({name:f,value:v[l],type:d.type});else a.push({name:f,value:"",type:d.type})}else null!==m&&"undefined"!=typeof m&&(r&&r.push(d),a.push({name:f,value:m,type:d.type,required:d.required}));if(!t&&o.clk){var g=e(o.clk),x=g[0];f=x.name,f&&!x.disabled&&"image"==x.type&&(a.push({name:f,value:g.val()}),a.push({name:f+".x",value:o.clk_x},{name:f+".y",value:o.clk_y}))}return a},e.fn.formSerialize=function(t){return e.param(this.formToArray(t))},e.fn.fieldSerialize=function(t){var r=[];return this.each(function(){var a=this.name;if(a){var n=e.fieldValue(this,t);if(n&&n.constructor==Array)for(var i=0,o=n.length;o>i;i++)r.push({name:a,value:n[i]});else null!==n&&"undefined"!=typeof n&&r.push({name:this.name,value:n})}}),e.param(r)},e.fn.fieldValue=function(t){for(var r=[],a=0,n=this.length;n>a;a++){var i=this[a],o=e.fieldValue(i,t);null===o||"undefined"==typeof o||o.constructor==Array&&!o.length||(o.constructor==Array?e.merge(r,o):r.push(o))}return r},e.fieldValue=function(t,r){var a=t.name,n=t.type,i=t.tagName.toLowerCase();if(void 0===r&&(r=!0),r&&(!a||t.disabled||"reset"==n||"button"==n||("checkbox"==n||"radio"==n)&&!t.checked||("submit"==n||"image"==n)&&t.form&&t.form.clk!=t||"select"==i&&-1==t.selectedIndex))return null;if("select"==i){var o=t.selectedIndex;if(0>o)return null;for(var s=[],u=t.options,c="select-one"==n,l=c?o+1:u.length,f=c?o:0;l>f;f++){var m=u[f];if(m.selected){var d=m.value;if(d||(d=m.attributes&&m.attributes.value&&!m.attributes.value.specified?m.text:m.value),c)return d;s.push(d)}}return s}return e(t).val()},e.fn.clearForm=function(t){return this.each(function(){e("input,select,textarea",this).clearFields(t)})},e.fn.clearFields=e.fn.clearInputs=function(t){var r=/^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;return this.each(function(){var a=this.type,n=this.tagName.toLowerCase();r.test(a)||"textarea"==n?this.value="":"checkbox"==a||"radio"==a?this.checked=!1:"select"==n?this.selectedIndex=-1:"file"==a?/MSIE/.test(navigator.userAgent)?e(this).replaceWith(e(this).clone(!0)):e(this).val(""):t&&(t===!0&&/hidden/.test(a)||"string"==typeof t&&e(this).is(t))&&(this.value="")})},e.fn.resetForm=function(){return this.each(function(){("function"==typeof this.reset||"object"==typeof this.reset&&!this.reset.nodeType)&&this.reset()})},e.fn.enable=function(e){return void 0===e&&(e=!0),this.each(function(){this.disabled=!e})},e.fn.selected=function(t){return void 0===t&&(t=!0),this.each(function(){var r=this.type;if("checkbox"==r||"radio"==r)this.checked=t;else if("option"==this.tagName.toLowerCase()){var a=e(this).parent("select");t&&a[0]&&"select-one"==a[0].type&&a.find("option").selected(!1),this.selected=t}})},e.fn.ajaxSubmit.debug=!1});
!function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=[],d=c.slice,e=c.concat,f=c.push,g=c.indexOf,h={},i=h.toString,j=h.hasOwnProperty,k={},l="1.11.1",m=function(a,b){return new m.fn.init(a,b)},n=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,o=/^-ms-/,p=/-([\da-z])/gi,q=function(a,b){return b.toUpperCase()};m.fn=m.prototype={jquery:l,constructor:m,selector:"",length:0,toArray:function(){return d.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:d.call(this)},pushStack:function(a){var b=m.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a,b){return m.each(this,a,b)},map:function(a){return this.pushStack(m.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(d.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor(null)},push:f,sort:c.sort,splice:c.splice},m.extend=m.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||m.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(e=arguments[h]))for(d in e)a=g[d],c=e[d],g!==c&&(j&&c&&(m.isPlainObject(c)||(b=m.isArray(c)))?(b?(b=!1,f=a&&m.isArray(a)?a:[]):f=a&&m.isPlainObject(a)?a:{},g[d]=m.extend(j,f,c)):void 0!==c&&(g[d]=c));return g},m.extend({expando:"jQuery"+(l+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===m.type(a)},isArray:Array.isArray||function(a){return"array"===m.type(a)},isWindow:function(a){return null!=a&&a==a.window},isNumeric:function(a){return!m.isArray(a)&&a-parseFloat(a)>=0},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},isPlainObject:function(a){var b;if(!a||"object"!==m.type(a)||a.nodeType||m.isWindow(a))return!1;try{if(a.constructor&&!j.call(a,"constructor")&&!j.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}if(k.ownLast)for(b in a)return j.call(a,b);for(b in a);return void 0===b||j.call(a,b)},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?h[i.call(a)]||"object":typeof a},globalEval:function(b){b&&m.trim(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(o,"ms-").replace(p,q)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b,c){var d,e=0,f=a.length,g=r(a);if(c){if(g){for(;f>e;e++)if(d=b.apply(a[e],c),d===!1)break}else for(e in a)if(d=b.apply(a[e],c),d===!1)break}else if(g){for(;f>e;e++)if(d=b.call(a[e],e,a[e]),d===!1)break}else for(e in a)if(d=b.call(a[e],e,a[e]),d===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(n,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(r(Object(a))?m.merge(c,"string"==typeof a?[a]:a):f.call(c,a)),c},inArray:function(a,b,c){var d;if(b){if(g)return g.call(b,a,c);for(d=b.length,c=c?0>c?Math.max(0,d+c):c:0;d>c;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,b){var c=+b.length,d=0,e=a.length;while(c>d)a[e++]=b[d++];if(c!==c)while(void 0!==b[d])a[e++]=b[d++];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,f=0,g=a.length,h=r(a),i=[];if(h)for(;g>f;f++)d=b(a[f],f,c),null!=d&&i.push(d);else for(f in a)d=b(a[f],f,c),null!=d&&i.push(d);return e.apply([],i)},guid:1,proxy:function(a,b){var c,e,f;return"string"==typeof b&&(f=a[b],b=a,a=f),m.isFunction(a)?(c=d.call(arguments,2),e=function(){return a.apply(b||this,c.concat(d.call(arguments)))},e.guid=a.guid=a.guid||m.guid++,e):void 0},now:function(){return+new Date},support:k}),m.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(a,b){h["[object "+b+"]"]=b.toLowerCase()});function r(a){var b=a.length,c=m.type(a);return"function"===c||m.isWindow(a)?!1:1===a.nodeType&&b?!0:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var s=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+-new Date,v=a.document,w=0,x=0,y=gb(),z=gb(),A=gb(),B=function(a,b){return a===b&&(l=!0),0},C="undefined",D=1<<31,E={}.hasOwnProperty,F=[],G=F.pop,H=F.push,I=F.push,J=F.slice,K=F.indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(this[b]===a)return b;return-1},L="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",N="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",O=N.replace("w","w#"),P="\\["+M+"*("+N+")(?:"+M+"*([*^$|!~]?=)"+M+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+O+"))|)"+M+"*\\]",Q=":("+N+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+P+")*)|.*)\\)|)",R=new RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),S=new RegExp("^"+M+"*,"+M+"*"),T=new RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),U=new RegExp("="+M+"*([^\\]'\"]*?)"+M+"*\\]","g"),V=new RegExp(Q),W=new RegExp("^"+O+"$"),X={ID:new RegExp("^#("+N+")"),CLASS:new RegExp("^\\.("+N+")"),TAG:new RegExp("^("+N.replace("w","w*")+")"),ATTR:new RegExp("^"+P),PSEUDO:new RegExp("^"+Q),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:new RegExp("^(?:"+L+")$","i"),needsContext:new RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},Y=/^(?:input|select|textarea|button)$/i,Z=/^h\d$/i,$=/^[^{]+\{\s*\[native \w/,_=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ab=/[+~]/,bb=/'|\\/g,cb=new RegExp("\\\\([\\da-f]{1,6}"+M+"?|("+M+")|.)","ig"),db=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)};try{I.apply(F=J.call(v.childNodes),v.childNodes),F[v.childNodes.length].nodeType}catch(eb){I={apply:F.length?function(a,b){H.apply(a,J.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function fb(a,b,d,e){var f,h,j,k,l,o,r,s,w,x;if((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,d=d||[],!a||"string"!=typeof a)return d;if(1!==(k=b.nodeType)&&9!==k)return[];if(p&&!e){if(f=_.exec(a))if(j=f[1]){if(9===k){if(h=b.getElementById(j),!h||!h.parentNode)return d;if(h.id===j)return d.push(h),d}else if(b.ownerDocument&&(h=b.ownerDocument.getElementById(j))&&t(b,h)&&h.id===j)return d.push(h),d}else{if(f[2])return I.apply(d,b.getElementsByTagName(a)),d;if((j=f[3])&&c.getElementsByClassName&&b.getElementsByClassName)return I.apply(d,b.getElementsByClassName(j)),d}if(c.qsa&&(!q||!q.test(a))){if(s=r=u,w=b,x=9===k&&a,1===k&&"object"!==b.nodeName.toLowerCase()){o=g(a),(r=b.getAttribute("id"))?s=r.replace(bb,"\\$&"):b.setAttribute("id",s),s="[id='"+s+"'] ",l=o.length;while(l--)o[l]=s+qb(o[l]);w=ab.test(a)&&ob(b.parentNode)||b,x=o.join(",")}if(x)try{return I.apply(d,w.querySelectorAll(x)),d}catch(y){}finally{r||b.removeAttribute("id")}}}return i(a.replace(R,"$1"),b,d,e)}function gb(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function hb(a){return a[u]=!0,a}function ib(a){var b=n.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function jb(a,b){var c=a.split("|"),e=a.length;while(e--)d.attrHandle[c[e]]=b}function kb(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||D)-(~a.sourceIndex||D);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function lb(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function mb(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function nb(a){return hb(function(b){return b=+b,hb(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function ob(a){return a&&typeof a.getElementsByTagName!==C&&a}c=fb.support={},f=fb.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},m=fb.setDocument=function(a){var b,e=a?a.ownerDocument||a:v,g=e.defaultView;return e!==n&&9===e.nodeType&&e.documentElement?(n=e,o=e.documentElement,p=!f(e),g&&g!==g.top&&(g.addEventListener?g.addEventListener("unload",function(){m()},!1):g.attachEvent&&g.attachEvent("onunload",function(){m()})),c.attributes=ib(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ib(function(a){return a.appendChild(e.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=$.test(e.getElementsByClassName)&&ib(function(a){return a.innerHTML="<div class='a'></div><div class='a i'></div>",a.firstChild.className="i",2===a.getElementsByClassName("i").length}),c.getById=ib(function(a){return o.appendChild(a).id=u,!e.getElementsByName||!e.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if(typeof b.getElementById!==C&&p){var c=b.getElementById(a);return c&&c.parentNode?[c]:[]}},d.filter.ID=function(a){var b=a.replace(cb,db);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(cb,db);return function(a){var c=typeof a.getAttributeNode!==C&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return typeof b.getElementsByTagName!==C?b.getElementsByTagName(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return typeof b.getElementsByClassName!==C&&p?b.getElementsByClassName(a):void 0},r=[],q=[],(c.qsa=$.test(e.querySelectorAll))&&(ib(function(a){a.innerHTML="<select msallowclip=''><option selected=''></option></select>",a.querySelectorAll("[msallowclip^='']").length&&q.push("[*^$]="+M+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+M+"*(?:value|"+L+")"),a.querySelectorAll(":checked").length||q.push(":checked")}),ib(function(a){var b=e.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+M+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=$.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ib(function(a){c.disconnectedMatch=s.call(a,"div"),s.call(a,"[s!='']:x"),r.push("!=",Q)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=$.test(o.compareDocumentPosition),t=b||$.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===e||a.ownerDocument===v&&t(v,a)?-1:b===e||b.ownerDocument===v&&t(v,b)?1:k?K.call(k,a)-K.call(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,f=a.parentNode,g=b.parentNode,h=[a],i=[b];if(!f||!g)return a===e?-1:b===e?1:f?-1:g?1:k?K.call(k,a)-K.call(k,b):0;if(f===g)return kb(a,b);c=a;while(c=c.parentNode)h.unshift(c);c=b;while(c=c.parentNode)i.unshift(c);while(h[d]===i[d])d++;return d?kb(h[d],i[d]):h[d]===v?-1:i[d]===v?1:0},e):n},fb.matches=function(a,b){return fb(a,null,null,b)},fb.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(U,"='$1']"),!(!c.matchesSelector||!p||r&&r.test(b)||q&&q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return fb(b,n,null,[a]).length>0},fb.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},fb.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&E.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},fb.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},fb.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=fb.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=fb.selectors={cacheLength:50,createPseudo:hb,match:X,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(cb,db),a[3]=(a[3]||a[4]||a[5]||"").replace(cb,db),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||fb.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&fb.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return X.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&V.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(cb,db).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+M+")"+a+"("+M+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||typeof a.getAttribute!==C&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=fb.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h;if(q){if(f){while(p){l=b;while(l=l[p])if(h?l.nodeName.toLowerCase()===r:1===l.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){k=q[u]||(q[u]={}),j=k[a]||[],n=j[0]===w&&j[1],m=j[0]===w&&j[2],l=n&&q.childNodes[n];while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if(1===l.nodeType&&++m&&l===b){k[a]=[w,n,m];break}}else if(s&&(j=(b[u]||(b[u]={}))[a])&&j[0]===w)m=j[1];else while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if((h?l.nodeName.toLowerCase()===r:1===l.nodeType)&&++m&&(s&&((l[u]||(l[u]={}))[a]=[w,m]),l===b))break;return m-=e,m===d||m%d===0&&m/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||fb.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?hb(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=K.call(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:hb(function(a){var b=[],c=[],d=h(a.replace(R,"$1"));return d[u]?hb(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),!c.pop()}}),has:hb(function(a){return function(b){return fb(a,b).length>0}}),contains:hb(function(a){return function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:hb(function(a){return W.test(a||"")||fb.error("unsupported lang: "+a),a=a.replace(cb,db).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return Z.test(a.nodeName)},input:function(a){return Y.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:nb(function(){return[0]}),last:nb(function(a,b){return[b-1]}),eq:nb(function(a,b,c){return[0>c?c+b:c]}),even:nb(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:nb(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:nb(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:nb(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=lb(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=mb(b);function pb(){}pb.prototype=d.filters=d.pseudos,d.setFilters=new pb,g=fb.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){(!c||(e=S.exec(h)))&&(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=T.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(R," ")}),h=h.slice(c.length));for(g in d.filter)!(e=X[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?fb.error(a):z(a,i).slice(0)};function qb(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function rb(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=x++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j=[w,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(i=b[u]||(b[u]={}),(h=i[d])&&h[0]===w&&h[1]===f)return j[2]=h[2];if(i[d]=j,j[2]=a(b,c,g))return!0}}}function sb(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function tb(a,b,c){for(var d=0,e=b.length;e>d;d++)fb(a,b[d],c);return c}function ub(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function vb(a,b,c,d,e,f){return d&&!d[u]&&(d=vb(d)),e&&!e[u]&&(e=vb(e,f)),hb(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||tb(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:ub(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=ub(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?K.call(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=ub(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):I.apply(g,r)})}function wb(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=rb(function(a){return a===b},h,!0),l=rb(function(a){return K.call(b,a)>-1},h,!0),m=[function(a,c,d){return!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d))}];f>i;i++)if(c=d.relative[a[i].type])m=[rb(sb(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;f>e;e++)if(d.relative[a[e].type])break;return vb(i>1&&sb(m),i>1&&qb(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(R,"$1"),c,e>i&&wb(a.slice(i,e)),f>e&&wb(a=a.slice(e)),f>e&&qb(a))}m.push(c)}return sb(m)}function xb(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,m,o,p=0,q="0",r=f&&[],s=[],t=j,u=f||e&&d.find.TAG("*",k),v=w+=null==t?1:Math.random()||.1,x=u.length;for(k&&(j=g!==n&&g);q!==x&&null!=(l=u[q]);q++){if(e&&l){m=0;while(o=a[m++])if(o(l,g,h)){i.push(l);break}k&&(w=v)}c&&((l=!o&&l)&&p--,f&&r.push(l))}if(p+=q,c&&q!==p){m=0;while(o=b[m++])o(r,s,g,h);if(f){if(p>0)while(q--)r[q]||s[q]||(s[q]=G.call(i));s=ub(s)}I.apply(i,s),k&&!f&&s.length>0&&p+b.length>1&&fb.uniqueSort(i)}return k&&(w=v,j=t),r};return c?hb(f):f}return h=fb.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=wb(b[c]),f[u]?d.push(f):e.push(f);f=A(a,xb(e,d)),f.selector=a}return f},i=fb.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(cb,db),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=X.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(cb,db),ab.test(j[0].type)&&ob(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&qb(j),!a)return I.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,ab.test(a)&&ob(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ib(function(a){return 1&a.compareDocumentPosition(n.createElement("div"))}),ib(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||jb("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ib(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||jb("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),ib(function(a){return null==a.getAttribute("disabled")})||jb(L,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),fb}(a);m.find=s,m.expr=s.selectors,m.expr[":"]=m.expr.pseudos,m.unique=s.uniqueSort,m.text=s.getText,m.isXMLDoc=s.isXML,m.contains=s.contains;var t=m.expr.match.needsContext,u=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,v=/^.[^:#\[\.,]*$/;function w(a,b,c){if(m.isFunction(b))return m.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return m.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(v.test(b))return m.filter(b,a,c);b=m.filter(b,a)}return m.grep(a,function(a){return m.inArray(a,b)>=0!==c})}m.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?m.find.matchesSelector(d,a)?[d]:[]:m.find.matches(a,m.grep(b,function(a){return 1===a.nodeType}))},m.fn.extend({find:function(a){var b,c=[],d=this,e=d.length;if("string"!=typeof a)return this.pushStack(m(a).filter(function(){for(b=0;e>b;b++)if(m.contains(d[b],this))return!0}));for(b=0;e>b;b++)m.find(a,d[b],c);return c=this.pushStack(e>1?m.unique(c):c),c.selector=this.selector?this.selector+" "+a:a,c},filter:function(a){return this.pushStack(w(this,a||[],!1))},not:function(a){return this.pushStack(w(this,a||[],!0))},is:function(a){return!!w(this,"string"==typeof a&&t.test(a)?m(a):a||[],!1).length}});var x,y=a.document,z=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,A=m.fn.init=function(a,b){var c,d;if(!a)return this;if("string"==typeof a){if(c="<"===a.charAt(0)&&">"===a.charAt(a.length-1)&&a.length>=3?[null,a,null]:z.exec(a),!c||!c[1]&&b)return!b||b.jquery?(b||x).find(a):this.constructor(b).find(a);if(c[1]){if(b=b instanceof m?b[0]:b,m.merge(this,m.parseHTML(c[1],b&&b.nodeType?b.ownerDocument||b:y,!0)),u.test(c[1])&&m.isPlainObject(b))for(c in b)m.isFunction(this[c])?this[c](b[c]):this.attr(c,b[c]);return this}if(d=y.getElementById(c[2]),d&&d.parentNode){if(d.id!==c[2])return x.find(a);this.length=1,this[0]=d}return this.context=y,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):m.isFunction(a)?"undefined"!=typeof x.ready?x.ready(a):a(m):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),m.makeArray(a,this))};A.prototype=m.fn,x=m(y);var B=/^(?:parents|prev(?:Until|All))/,C={children:!0,contents:!0,next:!0,prev:!0};m.extend({dir:function(a,b,c){var d=[],e=a[b];while(e&&9!==e.nodeType&&(void 0===c||1!==e.nodeType||!m(e).is(c)))1===e.nodeType&&d.push(e),e=e[b];return d},sibling:function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c}}),m.fn.extend({has:function(a){var b,c=m(a,this),d=c.length;return this.filter(function(){for(b=0;d>b;b++)if(m.contains(this,c[b]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=t.test(a)||"string"!=typeof a?m(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&m.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?m.unique(f):f)},index:function(a){return a?"string"==typeof a?m.inArray(this[0],m(a)):m.inArray(a.jquery?a[0]:a,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(m.unique(m.merge(this.get(),m(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function D(a,b){do a=a[b];while(a&&1!==a.nodeType);return a}m.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return m.dir(a,"parentNode")},parentsUntil:function(a,b,c){return m.dir(a,"parentNode",c)},next:function(a){return D(a,"nextSibling")},prev:function(a){return D(a,"previousSibling")},nextAll:function(a){return m.dir(a,"nextSibling")},prevAll:function(a){return m.dir(a,"previousSibling")},nextUntil:function(a,b,c){return m.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return m.dir(a,"previousSibling",c)},siblings:function(a){return m.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return m.sibling(a.firstChild)},contents:function(a){return m.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:m.merge([],a.childNodes)}},function(a,b){m.fn[a]=function(c,d){var e=m.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=m.filter(d,e)),this.length>1&&(C[a]||(e=m.unique(e)),B.test(a)&&(e=e.reverse())),this.pushStack(e)}});var E=/\S+/g,F={};function G(a){var b=F[a]={};return m.each(a.match(E)||[],function(a,c){b[c]=!0}),b}m.Callbacks=function(a){a="string"==typeof a?F[a]||G(a):m.extend({},a);var b,c,d,e,f,g,h=[],i=!a.once&&[],j=function(l){for(c=a.memory&&l,d=!0,f=g||0,g=0,e=h.length,b=!0;h&&e>f;f++)if(h[f].apply(l[0],l[1])===!1&&a.stopOnFalse){c=!1;break}b=!1,h&&(i?i.length&&j(i.shift()):c?h=[]:k.disable())},k={add:function(){if(h){var d=h.length;!function f(b){m.each(b,function(b,c){var d=m.type(c);"function"===d?a.unique&&k.has(c)||h.push(c):c&&c.length&&"string"!==d&&f(c)})}(arguments),b?e=h.length:c&&(g=d,j(c))}return this},remove:function(){return h&&m.each(arguments,function(a,c){var d;while((d=m.inArray(c,h,d))>-1)h.splice(d,1),b&&(e>=d&&e--,f>=d&&f--)}),this},has:function(a){return a?m.inArray(a,h)>-1:!(!h||!h.length)},empty:function(){return h=[],e=0,this},disable:function(){return h=i=c=void 0,this},disabled:function(){return!h},lock:function(){return i=void 0,c||k.disable(),this},locked:function(){return!i},fireWith:function(a,c){return!h||d&&!i||(c=c||[],c=[a,c.slice?c.slice():c],b?i.push(c):j(c)),this},fire:function(){return k.fireWith(this,arguments),this},fired:function(){return!!d}};return k},m.extend({Deferred:function(a){var b=[["resolve","done",m.Callbacks("once memory"),"resolved"],["reject","fail",m.Callbacks("once memory"),"rejected"],["notify","progress",m.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return m.Deferred(function(c){m.each(b,function(b,f){var g=m.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&m.isFunction(a.promise)?a.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?m.extend(a,d):d}},e={};return d.pipe=d.then,m.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=d.call(arguments),e=c.length,f=1!==e||a&&m.isFunction(a.promise)?e:0,g=1===f?a:m.Deferred(),h=function(a,b,c){return function(e){b[a]=this,c[a]=arguments.length>1?d.call(arguments):e,c===i?g.notifyWith(b,c):--f||g.resolveWith(b,c)}},i,j,k;if(e>1)for(i=new Array(e),j=new Array(e),k=new Array(e);e>b;b++)c[b]&&m.isFunction(c[b].promise)?c[b].promise().done(h(b,k,c)).fail(g.reject).progress(h(b,j,i)):--f;return f||g.resolveWith(k,c),g.promise()}});var H;m.fn.ready=function(a){return m.ready.promise().done(a),this},m.extend({isReady:!1,readyWait:1,holdReady:function(a){a?m.readyWait++:m.ready(!0)},ready:function(a){if(a===!0?!--m.readyWait:!m.isReady){if(!y.body)return setTimeout(m.ready);m.isReady=!0,a!==!0&&--m.readyWait>0||(H.resolveWith(y,[m]),m.fn.triggerHandler&&(m(y).triggerHandler("ready"),m(y).off("ready")))}}});function I(){y.addEventListener?(y.removeEventListener("DOMContentLoaded",J,!1),a.removeEventListener("load",J,!1)):(y.detachEvent("onreadystatechange",J),a.detachEvent("onload",J))}function J(){(y.addEventListener||"load"===event.type||"complete"===y.readyState)&&(I(),m.ready())}m.ready.promise=function(b){if(!H)if(H=m.Deferred(),"complete"===y.readyState)setTimeout(m.ready);else if(y.addEventListener)y.addEventListener("DOMContentLoaded",J,!1),a.addEventListener("load",J,!1);else{y.attachEvent("onreadystatechange",J),a.attachEvent("onload",J);var c=!1;try{c=null==a.frameElement&&y.documentElement}catch(d){}c&&c.doScroll&&!function e(){if(!m.isReady){try{c.doScroll("left")}catch(a){return setTimeout(e,50)}I(),m.ready()}}()}return H.promise(b)};var K="undefined",L;for(L in m(k))break;k.ownLast="0"!==L,k.inlineBlockNeedsLayout=!1,m(function(){var a,b,c,d;c=y.getElementsByTagName("body")[0],c&&c.style&&(b=y.createElement("div"),d=y.createElement("div"),d.style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px",c.appendChild(d).appendChild(b),typeof b.style.zoom!==K&&(b.style.cssText="display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1",k.inlineBlockNeedsLayout=a=3===b.offsetWidth,a&&(c.style.zoom=1)),c.removeChild(d))}),function(){var a=y.createElement("div");if(null==k.deleteExpando){k.deleteExpando=!0;try{delete a.test}catch(b){k.deleteExpando=!1}}a=null}(),m.acceptData=function(a){var b=m.noData[(a.nodeName+" ").toLowerCase()],c=+a.nodeType||1;return 1!==c&&9!==c?!1:!b||b!==!0&&a.getAttribute("classid")===b};var M=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,N=/([A-Z])/g;function O(a,b,c){if(void 0===c&&1===a.nodeType){var d="data-"+b.replace(N,"-$1").toLowerCase();if(c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:M.test(c)?m.parseJSON(c):c}catch(e){}m.data(a,b,c)}else c=void 0}return c}function P(a){var b;for(b in a)if(("data"!==b||!m.isEmptyObject(a[b]))&&"toJSON"!==b)return!1;return!0}function Q(a,b,d,e){if(m.acceptData(a)){var f,g,h=m.expando,i=a.nodeType,j=i?m.cache:a,k=i?a[h]:a[h]&&h;if(k&&j[k]&&(e||j[k].data)||void 0!==d||"string"!=typeof b)return k||(k=i?a[h]=c.pop()||m.guid++:h),j[k]||(j[k]=i?{}:{toJSON:m.noop}),("object"==typeof b||"function"==typeof b)&&(e?j[k]=m.extend(j[k],b):j[k].data=m.extend(j[k].data,b)),g=j[k],e||(g.data||(g.data={}),g=g.data),void 0!==d&&(g[m.camelCase(b)]=d),"string"==typeof b?(f=g[b],null==f&&(f=g[m.camelCase(b)])):f=g,f}}function R(a,b,c){if(m.acceptData(a)){var d,e,f=a.nodeType,g=f?m.cache:a,h=f?a[m.expando]:m.expando;if(g[h]){if(b&&(d=c?g[h]:g[h].data)){m.isArray(b)?b=b.concat(m.map(b,m.camelCase)):b in d?b=[b]:(b=m.camelCase(b),b=b in d?[b]:b.split(" ")),e=b.length;while(e--)delete d[b[e]];if(c?!P(d):!m.isEmptyObject(d))return}(c||(delete g[h].data,P(g[h])))&&(f?m.cleanData([a],!0):k.deleteExpando||g!=g.window?delete g[h]:g[h]=null)}}}m.extend({cache:{},noData:{"applet ":!0,"embed ":!0,"object ":"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(a){return a=a.nodeType?m.cache[a[m.expando]]:a[m.expando],!!a&&!P(a)},data:function(a,b,c){return Q(a,b,c)},removeData:function(a,b){return R(a,b)},_data:function(a,b,c){return Q(a,b,c,!0)},_removeData:function(a,b){return R(a,b,!0)}}),m.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=m.data(f),1===f.nodeType&&!m._data(f,"parsedAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=m.camelCase(d.slice(5)),O(f,d,e[d])));m._data(f,"parsedAttrs",!0)}return e}return"object"==typeof a?this.each(function(){m.data(this,a)}):arguments.length>1?this.each(function(){m.data(this,a,b)}):f?O(f,a,m.data(f,a)):void 0},removeData:function(a){return this.each(function(){m.removeData(this,a)})}}),m.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=m._data(a,b),c&&(!d||m.isArray(c)?d=m._data(a,b,m.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=m.queue(a,b),d=c.length,e=c.shift(),f=m._queueHooks(a,b),g=function(){m.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return m._data(a,c)||m._data(a,c,{empty:m.Callbacks("once memory").add(function(){m._removeData(a,b+"queue"),m._removeData(a,c)})})}}),m.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?m.queue(this[0],a):void 0===b?this:this.each(function(){var c=m.queue(this,a,b);m._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&m.dequeue(this,a)})},dequeue:function(a){return this.each(function(){m.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=m.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=m._data(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var S=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,T=["Top","Right","Bottom","Left"],U=function(a,b){return a=b||a,"none"===m.css(a,"display")||!m.contains(a.ownerDocument,a)},V=m.access=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===m.type(c)){e=!0;for(h in c)m.access(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,m.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(m(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},W=/^(?:checkbox|radio)$/i;!function(){var a=y.createElement("input"),b=y.createElement("div"),c=y.createDocumentFragment();if(b.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",k.leadingWhitespace=3===b.firstChild.nodeType,k.tbody=!b.getElementsByTagName("tbody").length,k.htmlSerialize=!!b.getElementsByTagName("link").length,k.html5Clone="<:nav></:nav>"!==y.createElement("nav").cloneNode(!0).outerHTML,a.type="checkbox",a.checked=!0,c.appendChild(a),k.appendChecked=a.checked,b.innerHTML="<textarea>x</textarea>",k.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue,c.appendChild(b),b.innerHTML="<input type='radio' checked='checked' name='t'/>",k.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,k.noCloneEvent=!0,b.attachEvent&&(b.attachEvent("onclick",function(){k.noCloneEvent=!1}),b.cloneNode(!0).click()),null==k.deleteExpando){k.deleteExpando=!0;try{delete b.test}catch(d){k.deleteExpando=!1}}}(),function(){var b,c,d=y.createElement("div");for(b in{submit:!0,change:!0,focusin:!0})c="on"+b,(k[b+"Bubbles"]=c in a)||(d.setAttribute(c,"t"),k[b+"Bubbles"]=d.attributes[c].expando===!1);d=null}();var X=/^(?:input|select|textarea)$/i,Y=/^key/,Z=/^(?:mouse|pointer|contextmenu)|click/,$=/^(?:focusinfocus|focusoutblur)$/,_=/^([^.]*)(?:\.(.+)|)$/;function ab(){return!0}function bb(){return!1}function cb(){try{return y.activeElement}catch(a){}}m.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,n,o,p,q,r=m._data(a);if(r){c.handler&&(i=c,c=i.handler,e=i.selector),c.guid||(c.guid=m.guid++),(g=r.events)||(g=r.events={}),(k=r.handle)||(k=r.handle=function(a){return typeof m===K||a&&m.event.triggered===a.type?void 0:m.event.dispatch.apply(k.elem,arguments)},k.elem=a),b=(b||"").match(E)||[""],h=b.length;while(h--)f=_.exec(b[h])||[],o=q=f[1],p=(f[2]||"").split(".").sort(),o&&(j=m.event.special[o]||{},o=(e?j.delegateType:j.bindType)||o,j=m.event.special[o]||{},l=m.extend({type:o,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&m.expr.match.needsContext.test(e),namespace:p.join(".")},i),(n=g[o])||(n=g[o]=[],n.delegateCount=0,j.setup&&j.setup.call(a,d,p,k)!==!1||(a.addEventListener?a.addEventListener(o,k,!1):a.attachEvent&&a.attachEvent("on"+o,k))),j.add&&(j.add.call(a,l),l.handler.guid||(l.handler.guid=c.guid)),e?n.splice(n.delegateCount++,0,l):n.push(l),m.event.global[o]=!0);a=null}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,n,o,p,q,r=m.hasData(a)&&m._data(a);if(r&&(k=r.events)){b=(b||"").match(E)||[""],j=b.length;while(j--)if(h=_.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o){l=m.event.special[o]||{},o=(d?l.delegateType:l.bindType)||o,n=k[o]||[],h=h[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),i=f=n.length;while(f--)g=n[f],!e&&q!==g.origType||c&&c.guid!==g.guid||h&&!h.test(g.namespace)||d&&d!==g.selector&&("**"!==d||!g.selector)||(n.splice(f,1),g.selector&&n.delegateCount--,l.remove&&l.remove.call(a,g));i&&!n.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||m.removeEvent(a,o,r.handle),delete k[o])}else for(o in k)m.event.remove(a,o+b[j],c,d,!0);m.isEmptyObject(k)&&(delete r.handle,m._removeData(a,"events"))}},trigger:function(b,c,d,e){var f,g,h,i,k,l,n,o=[d||y],p=j.call(b,"type")?b.type:b,q=j.call(b,"namespace")?b.namespace.split("."):[];if(h=l=d=d||y,3!==d.nodeType&&8!==d.nodeType&&!$.test(p+m.event.triggered)&&(p.indexOf(".")>=0&&(q=p.split("."),p=q.shift(),q.sort()),g=p.indexOf(":")<0&&"on"+p,b=b[m.expando]?b:new m.Event(p,"object"==typeof b&&b),b.isTrigger=e?2:3,b.namespace=q.join("."),b.namespace_re=b.namespace?new RegExp("(^|\\.)"+q.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=d),c=null==c?[b]:m.makeArray(c,[b]),k=m.event.special[p]||{},e||!k.trigger||k.trigger.apply(d,c)!==!1)){if(!e&&!k.noBubble&&!m.isWindow(d)){for(i=k.delegateType||p,$.test(i+p)||(h=h.parentNode);h;h=h.parentNode)o.push(h),l=h;l===(d.ownerDocument||y)&&o.push(l.defaultView||l.parentWindow||a)}n=0;while((h=o[n++])&&!b.isPropagationStopped())b.type=n>1?i:k.bindType||p,f=(m._data(h,"events")||{})[b.type]&&m._data(h,"handle"),f&&f.apply(h,c),f=g&&h[g],f&&f.apply&&m.acceptData(h)&&(b.result=f.apply(h,c),b.result===!1&&b.preventDefault());if(b.type=p,!e&&!b.isDefaultPrevented()&&(!k._default||k._default.apply(o.pop(),c)===!1)&&m.acceptData(d)&&g&&d[p]&&!m.isWindow(d)){l=d[g],l&&(d[g]=null),m.event.triggered=p;try{d[p]()}catch(r){}m.event.triggered=void 0,l&&(d[g]=l)}return b.result}},dispatch:function(a){a=m.event.fix(a);var b,c,e,f,g,h=[],i=d.call(arguments),j=(m._data(this,"events")||{})[a.type]||[],k=m.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=m.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,g=0;while((e=f.handlers[g++])&&!a.isImmediatePropagationStopped())(!a.namespace_re||a.namespace_re.test(e.namespace))&&(a.handleObj=e,a.data=e.data,c=((m.event.special[e.origType]||{}).handle||e.handler).apply(f.elem,i),void 0!==c&&(a.result=c)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&(!a.button||"click"!==a.type))for(;i!=this;i=i.parentNode||this)if(1===i.nodeType&&(i.disabled!==!0||"click"!==a.type)){for(e=[],f=0;h>f;f++)d=b[f],c=d.selector+" ",void 0===e[c]&&(e[c]=d.needsContext?m(c,this).index(i)>=0:m.find(c,this,null,[i]).length),e[c]&&e.push(d);e.length&&g.push({elem:i,handlers:e})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},fix:function(a){if(a[m.expando])return a;var b,c,d,e=a.type,f=a,g=this.fixHooks[e];g||(this.fixHooks[e]=g=Z.test(e)?this.mouseHooks:Y.test(e)?this.keyHooks:{}),d=g.props?this.props.concat(g.props):this.props,a=new m.Event(f),b=d.length;while(b--)c=d[b],a[c]=f[c];return a.target||(a.target=f.srcElement||y),3===a.target.nodeType&&(a.target=a.target.parentNode),a.metaKey=!!a.metaKey,g.filter?g.filter(a,f):a},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,d,e,f=b.button,g=b.fromElement;return null==a.pageX&&null!=b.clientX&&(d=a.target.ownerDocument||y,e=d.documentElement,c=d.body,a.pageX=b.clientX+(e&&e.scrollLeft||c&&c.scrollLeft||0)-(e&&e.clientLeft||c&&c.clientLeft||0),a.pageY=b.clientY+(e&&e.scrollTop||c&&c.scrollTop||0)-(e&&e.clientTop||c&&c.clientTop||0)),!a.relatedTarget&&g&&(a.relatedTarget=g===a.target?b.toElement:g),a.which||void 0===f||(a.which=1&f?1:2&f?3:4&f?2:0),a}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==cb()&&this.focus)try{return this.focus(),!1}catch(a){}},delegateType:"focusin"},blur:{trigger:function(){return this===cb()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return m.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):void 0},_default:function(a){return m.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}},simulate:function(a,b,c,d){var e=m.extend(new m.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?m.event.trigger(e,null,b):m.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},m.removeEvent=y.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){var d="on"+b;a.detachEvent&&(typeof a[d]===K&&(a[d]=null),a.detachEvent(d,c))},m.Event=function(a,b){return this instanceof m.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?ab:bb):this.type=a,b&&m.extend(this,b),this.timeStamp=a&&a.timeStamp||m.now(),void(this[m.expando]=!0)):new m.Event(a,b)},m.Event.prototype={isDefaultPrevented:bb,isPropagationStopped:bb,isImmediatePropagationStopped:bb,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=ab,a&&(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=ab,a&&(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=ab,a&&a.stopImmediatePropagation&&a.stopImmediatePropagation(),this.stopPropagation()}},m.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){m.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return(!e||e!==d&&!m.contains(d,e))&&(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),k.submitBubbles||(m.event.special.submit={setup:function(){return m.nodeName(this,"form")?!1:void m.event.add(this,"click._submit keypress._submit",function(a){var b=a.target,c=m.nodeName(b,"input")||m.nodeName(b,"button")?b.form:void 0;c&&!m._data(c,"submitBubbles")&&(m.event.add(c,"submit._submit",function(a){a._submit_bubble=!0}),m._data(c,"submitBubbles",!0))})},postDispatch:function(a){a._submit_bubble&&(delete a._submit_bubble,this.parentNode&&!a.isTrigger&&m.event.simulate("submit",this.parentNode,a,!0))},teardown:function(){return m.nodeName(this,"form")?!1:void m.event.remove(this,"._submit")}}),k.changeBubbles||(m.event.special.change={setup:function(){return X.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(m.event.add(this,"propertychange._change",function(a){"checked"===a.originalEvent.propertyName&&(this._just_changed=!0)}),m.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1),m.event.simulate("change",this,a,!0)})),!1):void m.event.add(this,"beforeactivate._change",function(a){var b=a.target;X.test(b.nodeName)&&!m._data(b,"changeBubbles")&&(m.event.add(b,"change._change",function(a){!this.parentNode||a.isSimulated||a.isTrigger||m.event.simulate("change",this.parentNode,a,!0)}),m._data(b,"changeBubbles",!0))})},handle:function(a){var b=a.target;return this!==b||a.isSimulated||a.isTrigger||"radio"!==b.type&&"checkbox"!==b.type?a.handleObj.handler.apply(this,arguments):void 0},teardown:function(){return m.event.remove(this,"._change"),!X.test(this.nodeName)}}),k.focusinBubbles||m.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){m.event.simulate(b,a.target,m.event.fix(a),!0)};m.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=m._data(d,b);e||d.addEventListener(a,c,!0),m._data(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=m._data(d,b)-1;e?m._data(d,b,e):(d.removeEventListener(a,c,!0),m._removeData(d,b))}}}),m.fn.extend({on:function(a,b,c,d,e){var f,g;if("object"==typeof a){"string"!=typeof b&&(c=c||b,b=void 0);for(f in a)this.on(f,b,c,a[f],e);return this}if(null==c&&null==d?(d=b,c=b=void 0):null==d&&("string"==typeof b?(d=c,c=void 0):(d=c,c=b,b=void 0)),d===!1)d=bb;else if(!d)return this;return 1===e&&(g=d,d=function(a){return m().off(a),g.apply(this,arguments)},d.guid=g.guid||(g.guid=m.guid++)),this.each(function(){m.event.add(this,a,d,c,b)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,m(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return(b===!1||"function"==typeof b)&&(c=b,b=void 0),c===!1&&(c=bb),this.each(function(){m.event.remove(this,a,c,b)})},trigger:function(a,b){return this.each(function(){m.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?m.event.trigger(a,b,c,!0):void 0}});function db(a){var b=eb.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}var eb="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",fb=/ jQuery\d+="(?:null|\d+)"/g,gb=new RegExp("<(?:"+eb+")[\\s/>]","i"),hb=/^\s+/,ib=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,jb=/<([\w:]+)/,kb=/<tbody/i,lb=/<|&#?\w+;/,mb=/<(?:script|style|link)/i,nb=/checked\s*(?:[^=]|=\s*.checked.)/i,ob=/^$|\/(?:java|ecma)script/i,pb=/^true\/(.*)/,qb=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,rb={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:k.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},sb=db(y),tb=sb.appendChild(y.createElement("div"));rb.optgroup=rb.option,rb.tbody=rb.tfoot=rb.colgroup=rb.caption=rb.thead,rb.th=rb.td;function ub(a,b){var c,d,e=0,f=typeof a.getElementsByTagName!==K?a.getElementsByTagName(b||"*"):typeof a.querySelectorAll!==K?a.querySelectorAll(b||"*"):void 0;if(!f)for(f=[],c=a.childNodes||a;null!=(d=c[e]);e++)!b||m.nodeName(d,b)?f.push(d):m.merge(f,ub(d,b));return void 0===b||b&&m.nodeName(a,b)?m.merge([a],f):f}function vb(a){W.test(a.type)&&(a.defaultChecked=a.checked)}function wb(a,b){return m.nodeName(a,"table")&&m.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function xb(a){return a.type=(null!==m.find.attr(a,"type"))+"/"+a.type,a}function yb(a){var b=pb.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function zb(a,b){for(var c,d=0;null!=(c=a[d]);d++)m._data(c,"globalEval",!b||m._data(b[d],"globalEval"))}function Ab(a,b){if(1===b.nodeType&&m.hasData(a)){var c,d,e,f=m._data(a),g=m._data(b,f),h=f.events;if(h){delete g.handle,g.events={};for(c in h)for(d=0,e=h[c].length;e>d;d++)m.event.add(b,c,h[c][d])}g.data&&(g.data=m.extend({},g.data))}}function Bb(a,b){var c,d,e;if(1===b.nodeType){if(c=b.nodeName.toLowerCase(),!k.noCloneEvent&&b[m.expando]){e=m._data(b);for(d in e.events)m.removeEvent(b,d,e.handle);b.removeAttribute(m.expando)}"script"===c&&b.text!==a.text?(xb(b).text=a.text,yb(b)):"object"===c?(b.parentNode&&(b.outerHTML=a.outerHTML),k.html5Clone&&a.innerHTML&&!m.trim(b.innerHTML)&&(b.innerHTML=a.innerHTML)):"input"===c&&W.test(a.type)?(b.defaultChecked=b.checked=a.checked,b.value!==a.value&&(b.value=a.value)):"option"===c?b.defaultSelected=b.selected=a.defaultSelected:("input"===c||"textarea"===c)&&(b.defaultValue=a.defaultValue)}}m.extend({clone:function(a,b,c){var d,e,f,g,h,i=m.contains(a.ownerDocument,a);if(k.html5Clone||m.isXMLDoc(a)||!gb.test("<"+a.nodeName+">")?f=a.cloneNode(!0):(tb.innerHTML=a.outerHTML,tb.removeChild(f=tb.firstChild)),!(k.noCloneEvent&&k.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||m.isXMLDoc(a)))for(d=ub(f),h=ub(a),g=0;null!=(e=h[g]);++g)d[g]&&Bb(e,d[g]);if(b)if(c)for(h=h||ub(a),d=d||ub(f),g=0;null!=(e=h[g]);g++)Ab(e,d[g]);else Ab(a,f);return d=ub(f,"script"),d.length>0&&zb(d,!i&&ub(a,"script")),d=h=e=null,f},buildFragment:function(a,b,c,d){for(var e,f,g,h,i,j,l,n=a.length,o=db(b),p=[],q=0;n>q;q++)if(f=a[q],f||0===f)if("object"===m.type(f))m.merge(p,f.nodeType?[f]:f);else if(lb.test(f)){h=h||o.appendChild(b.createElement("div")),i=(jb.exec(f)||["",""])[1].toLowerCase(),l=rb[i]||rb._default,h.innerHTML=l[1]+f.replace(ib,"<$1></$2>")+l[2],e=l[0];while(e--)h=h.lastChild;if(!k.leadingWhitespace&&hb.test(f)&&p.push(b.createTextNode(hb.exec(f)[0])),!k.tbody){f="table"!==i||kb.test(f)?"<table>"!==l[1]||kb.test(f)?0:h:h.firstChild,e=f&&f.childNodes.length;while(e--)m.nodeName(j=f.childNodes[e],"tbody")&&!j.childNodes.length&&f.removeChild(j)}m.merge(p,h.childNodes),h.textContent="";while(h.firstChild)h.removeChild(h.firstChild);h=o.lastChild}else p.push(b.createTextNode(f));h&&o.removeChild(h),k.appendChecked||m.grep(ub(p,"input"),vb),q=0;while(f=p[q++])if((!d||-1===m.inArray(f,d))&&(g=m.contains(f.ownerDocument,f),h=ub(o.appendChild(f),"script"),g&&zb(h),c)){e=0;while(f=h[e++])ob.test(f.type||"")&&c.push(f)}return h=null,o},cleanData:function(a,b){for(var d,e,f,g,h=0,i=m.expando,j=m.cache,l=k.deleteExpando,n=m.event.special;null!=(d=a[h]);h++)if((b||m.acceptData(d))&&(f=d[i],g=f&&j[f])){if(g.events)for(e in g.events)n[e]?m.event.remove(d,e):m.removeEvent(d,e,g.handle);j[f]&&(delete j[f],l?delete d[i]:typeof d.removeAttribute!==K?d.removeAttribute(i):d[i]=null,c.push(f))}}}),m.fn.extend({text:function(a){return V(this,function(a){return void 0===a?m.text(this):this.empty().append((this[0]&&this[0].ownerDocument||y).createTextNode(a))},null,a,arguments.length)},append:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=wb(this,a);b.appendChild(a)}})},prepend:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=wb(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},remove:function(a,b){for(var c,d=a?m.filter(a,this):this,e=0;null!=(c=d[e]);e++)b||1!==c.nodeType||m.cleanData(ub(c)),c.parentNode&&(b&&m.contains(c.ownerDocument,c)&&zb(ub(c,"script")),c.parentNode.removeChild(c));return this},empty:function(){for(var a,b=0;null!=(a=this[b]);b++){1===a.nodeType&&m.cleanData(ub(a,!1));while(a.firstChild)a.removeChild(a.firstChild);a.options&&m.nodeName(a,"select")&&(a.options.length=0)}return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return m.clone(this,a,b)})},html:function(a){return V(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a)return 1===b.nodeType?b.innerHTML.replace(fb,""):void 0;if(!("string"!=typeof a||mb.test(a)||!k.htmlSerialize&&gb.test(a)||!k.leadingWhitespace&&hb.test(a)||rb[(jb.exec(a)||["",""])[1].toLowerCase()])){a=a.replace(ib,"<$1></$2>");try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(m.cleanData(ub(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=arguments[0];return this.domManip(arguments,function(b){a=this.parentNode,m.cleanData(ub(this)),a&&a.replaceChild(b,this)}),a&&(a.length||a.nodeType)?this:this.remove()},detach:function(a){return this.remove(a,!0)},domManip:function(a,b){a=e.apply([],a);var c,d,f,g,h,i,j=0,l=this.length,n=this,o=l-1,p=a[0],q=m.isFunction(p);if(q||l>1&&"string"==typeof p&&!k.checkClone&&nb.test(p))return this.each(function(c){var d=n.eq(c);q&&(a[0]=p.call(this,c,d.html())),d.domManip(a,b)});if(l&&(i=m.buildFragment(a,this[0].ownerDocument,!1,this),c=i.firstChild,1===i.childNodes.length&&(i=c),c)){for(g=m.map(ub(i,"script"),xb),f=g.length;l>j;j++)d=i,j!==o&&(d=m.clone(d,!0,!0),f&&m.merge(g,ub(d,"script"))),b.call(this[j],d,j);if(f)for(h=g[g.length-1].ownerDocument,m.map(g,yb),j=0;f>j;j++)d=g[j],ob.test(d.type||"")&&!m._data(d,"globalEval")&&m.contains(h,d)&&(d.src?m._evalUrl&&m._evalUrl(d.src):m.globalEval((d.text||d.textContent||d.innerHTML||"").replace(qb,"")));i=c=null}return this}}),m.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){m.fn[a]=function(a){for(var c,d=0,e=[],g=m(a),h=g.length-1;h>=d;d++)c=d===h?this:this.clone(!0),m(g[d])[b](c),f.apply(e,c.get());return this.pushStack(e)}});var Cb,Db={};function Eb(b,c){var d,e=m(c.createElement(b)).appendTo(c.body),f=a.getDefaultComputedStyle&&(d=a.getDefaultComputedStyle(e[0]))?d.display:m.css(e[0],"display");return e.detach(),f}function Fb(a){var b=y,c=Db[a];return c||(c=Eb(a,b),"none"!==c&&c||(Cb=(Cb||m("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),b=(Cb[0].contentWindow||Cb[0].contentDocument).document,b.write(),b.close(),c=Eb(a,b),Cb.detach()),Db[a]=c),c}!function(){var a;k.shrinkWrapBlocks=function(){if(null!=a)return a;a=!1;var b,c,d;return c=y.getElementsByTagName("body")[0],c&&c.style?(b=y.createElement("div"),d=y.createElement("div"),d.style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px",c.appendChild(d).appendChild(b),typeof b.style.zoom!==K&&(b.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1",b.appendChild(y.createElement("div")).style.width="5px",a=3!==b.offsetWidth),c.removeChild(d),a):void 0}}();var Gb=/^margin/,Hb=new RegExp("^("+S+")(?!px)[a-z%]+$","i"),Ib,Jb,Kb=/^(top|right|bottom|left)$/;a.getComputedStyle?(Ib=function(a){return a.ownerDocument.defaultView.getComputedStyle(a,null)},Jb=function(a,b,c){var d,e,f,g,h=a.style;return c=c||Ib(a),g=c?c.getPropertyValue(b)||c[b]:void 0,c&&(""!==g||m.contains(a.ownerDocument,a)||(g=m.style(a,b)),Hb.test(g)&&Gb.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0===g?g:g+""}):y.documentElement.currentStyle&&(Ib=function(a){return a.currentStyle},Jb=function(a,b,c){var d,e,f,g,h=a.style;return c=c||Ib(a),g=c?c[b]:void 0,null==g&&h&&h[b]&&(g=h[b]),Hb.test(g)&&!Kb.test(b)&&(d=h.left,e=a.runtimeStyle,f=e&&e.left,f&&(e.left=a.currentStyle.left),h.left="fontSize"===b?"1em":g,g=h.pixelLeft+"px",h.left=d,f&&(e.left=f)),void 0===g?g:g+""||"auto"});function Lb(a,b){return{get:function(){var c=a();if(null!=c)return c?void delete this.get:(this.get=b).apply(this,arguments)}}}!function(){var b,c,d,e,f,g,h;if(b=y.createElement("div"),b.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",d=b.getElementsByTagName("a")[0],c=d&&d.style){c.cssText="float:left;opacity:.5",k.opacity="0.5"===c.opacity,k.cssFloat=!!c.cssFloat,b.style.backgroundClip="content-box",b.cloneNode(!0).style.backgroundClip="",k.clearCloneStyle="content-box"===b.style.backgroundClip,k.boxSizing=""===c.boxSizing||""===c.MozBoxSizing||""===c.WebkitBoxSizing,m.extend(k,{reliableHiddenOffsets:function(){return null==g&&i(),g},boxSizingReliable:function(){return null==f&&i(),f},pixelPosition:function(){return null==e&&i(),e},reliableMarginRight:function(){return null==h&&i(),h}});function i(){var b,c,d,i;c=y.getElementsByTagName("body")[0],c&&c.style&&(b=y.createElement("div"),d=y.createElement("div"),d.style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px",c.appendChild(d).appendChild(b),b.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",e=f=!1,h=!0,a.getComputedStyle&&(e="1%"!==(a.getComputedStyle(b,null)||{}).top,f="4px"===(a.getComputedStyle(b,null)||{width:"4px"}).width,i=b.appendChild(y.createElement("div")),i.style.cssText=b.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",i.style.marginRight=i.style.width="0",b.style.width="1px",h=!parseFloat((a.getComputedStyle(i,null)||{}).marginRight)),b.innerHTML="<table><tr><td></td><td>t</td></tr></table>",i=b.getElementsByTagName("td"),i[0].style.cssText="margin:0;border:0;padding:0;display:none",g=0===i[0].offsetHeight,g&&(i[0].style.display="",i[1].style.display="none",g=0===i[0].offsetHeight),c.removeChild(d))}}}(),m.swap=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};var Mb=/alpha\([^)]*\)/i,Nb=/opacity\s*=\s*([^)]*)/,Ob=/^(none|table(?!-c[ea]).+)/,Pb=new RegExp("^("+S+")(.*)$","i"),Qb=new RegExp("^([+-])=("+S+")","i"),Rb={position:"absolute",visibility:"hidden",display:"block"},Sb={letterSpacing:"0",fontWeight:"400"},Tb=["Webkit","O","Moz","ms"];function Ub(a,b){if(b in a)return b;var c=b.charAt(0).toUpperCase()+b.slice(1),d=b,e=Tb.length;while(e--)if(b=Tb[e]+c,b in a)return b;return d}function Vb(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=m._data(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&U(d)&&(f[g]=m._data(d,"olddisplay",Fb(d.nodeName)))):(e=U(d),(c&&"none"!==c||!e)&&m._data(d,"olddisplay",e?c:m.css(d,"display"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}function Wb(a,b,c){var d=Pb.exec(b);return d?Math.max(0,d[1]-(c||0))+(d[2]||"px"):b}function Xb(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=m.css(a,c+T[f],!0,e)),d?("content"===c&&(g-=m.css(a,"padding"+T[f],!0,e)),"margin"!==c&&(g-=m.css(a,"border"+T[f]+"Width",!0,e))):(g+=m.css(a,"padding"+T[f],!0,e),"padding"!==c&&(g+=m.css(a,"border"+T[f]+"Width",!0,e)));return g}function Yb(a,b,c){var d=!0,e="width"===b?a.offsetWidth:a.offsetHeight,f=Ib(a),g=k.boxSizing&&"border-box"===m.css(a,"boxSizing",!1,f);if(0>=e||null==e){if(e=Jb(a,b,f),(0>e||null==e)&&(e=a.style[b]),Hb.test(e))return e;d=g&&(k.boxSizingReliable()||e===a.style[b]),e=parseFloat(e)||0}return e+Xb(a,b,c||(g?"border":"content"),d,f)+"px"}m.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Jb(a,"opacity");return""===c?"1":c}}}},cssNumber:{columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":k.cssFloat?"cssFloat":"styleFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=m.camelCase(b),i=a.style;if(b=m.cssProps[h]||(m.cssProps[h]=Ub(i,h)),g=m.cssHooks[b]||m.cssHooks[h],void 0===c)return g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b];if(f=typeof c,"string"===f&&(e=Qb.exec(c))&&(c=(e[1]+1)*e[2]+parseFloat(m.css(a,b)),f="number"),null!=c&&c===c&&("number"!==f||m.cssNumber[h]||(c+="px"),k.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),!(g&&"set"in g&&void 0===(c=g.set(a,c,d)))))try{i[b]=c}catch(j){}}},css:function(a,b,c,d){var e,f,g,h=m.camelCase(b);return b=m.cssProps[h]||(m.cssProps[h]=Ub(a.style,h)),g=m.cssHooks[b]||m.cssHooks[h],g&&"get"in g&&(f=g.get(a,!0,c)),void 0===f&&(f=Jb(a,b,d)),"normal"===f&&b in Sb&&(f=Sb[b]),""===c||c?(e=parseFloat(f),c===!0||m.isNumeric(e)?e||0:f):f}}),m.each(["height","width"],function(a,b){m.cssHooks[b]={get:function(a,c,d){return c?Ob.test(m.css(a,"display"))&&0===a.offsetWidth?m.swap(a,Rb,function(){return Yb(a,b,d)}):Yb(a,b,d):void 0},set:function(a,c,d){var e=d&&Ib(a);return Wb(a,c,d?Xb(a,b,d,k.boxSizing&&"border-box"===m.css(a,"boxSizing",!1,e),e):0)}}}),k.opacity||(m.cssHooks.opacity={get:function(a,b){return Nb.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=m.isNumeric(b)?"alpha(opacity="+100*b+")":"",f=d&&d.filter||c.filter||"";c.zoom=1,(b>=1||""===b)&&""===m.trim(f.replace(Mb,""))&&c.removeAttribute&&(c.removeAttribute("filter"),""===b||d&&!d.filter)||(c.filter=Mb.test(f)?f.replace(Mb,e):f+" "+e)}}),m.cssHooks.marginRight=Lb(k.reliableMarginRight,function(a,b){return b?m.swap(a,{display:"inline-block"},Jb,[a,"marginRight"]):void 0}),m.each({margin:"",padding:"",border:"Width"},function(a,b){m.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+T[d]+b]=f[d]||f[d-2]||f[0];return e}},Gb.test(a)||(m.cssHooks[a+b].set=Wb)}),m.fn.extend({css:function(a,b){return V(this,function(a,b,c){var d,e,f={},g=0;if(m.isArray(b)){for(d=Ib(a),e=b.length;e>g;g++)f[b[g]]=m.css(a,b[g],!1,d);return f}return void 0!==c?m.style(a,b,c):m.css(a,b)},a,b,arguments.length>1)},show:function(){return Vb(this,!0)},hide:function(){return Vb(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){U(this)?m(this).show():m(this).hide()})}});function Zb(a,b,c,d,e){return new Zb.prototype.init(a,b,c,d,e)}m.Tween=Zb,Zb.prototype={constructor:Zb,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||"swing",this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(m.cssNumber[c]?"":"px")},cur:function(){var a=Zb.propHooks[this.prop];return a&&a.get?a.get(this):Zb.propHooks._default.get(this)},run:function(a){var b,c=Zb.propHooks[this.prop];return this.pos=b=this.options.duration?m.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Zb.propHooks._default.set(this),this}},Zb.prototype.init.prototype=Zb.prototype,Zb.propHooks={_default:{get:function(a){var b;return null==a.elem[a.prop]||a.elem.style&&null!=a.elem.style[a.prop]?(b=m.css(a.elem,a.prop,""),b&&"auto"!==b?b:0):a.elem[a.prop]},set:function(a){m.fx.step[a.prop]?m.fx.step[a.prop](a):a.elem.style&&(null!=a.elem.style[m.cssProps[a.prop]]||m.cssHooks[a.prop])?m.style(a.elem,a.prop,a.now+a.unit):a.elem[a.prop]=a.now}}},Zb.propHooks.scrollTop=Zb.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},m.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2}},m.fx=Zb.prototype.init,m.fx.step={};var $b,_b,ac=/^(?:toggle|show|hide)$/,bc=new RegExp("^(?:([+-])=|)("+S+")([a-z%]*)$","i"),cc=/queueHooks$/,dc=[ic],ec={"*":[function(a,b){var c=this.createTween(a,b),d=c.cur(),e=bc.exec(b),f=e&&e[3]||(m.cssNumber[a]?"":"px"),g=(m.cssNumber[a]||"px"!==f&&+d)&&bc.exec(m.css(c.elem,a)),h=1,i=20;if(g&&g[3]!==f){f=f||g[3],e=e||[],g=+d||1;do h=h||".5",g/=h,m.style(c.elem,a,g+f);while(h!==(h=c.cur()/d)&&1!==h&&--i)}return e&&(g=c.start=+g||+d||0,c.unit=f,c.end=e[1]?g+(e[1]+1)*e[2]:+e[2]),c}]};function fc(){return setTimeout(function(){$b=void 0}),$b=m.now()}function gc(a,b){var c,d={height:a},e=0;for(b=b?1:0;4>e;e+=2-b)c=T[e],d["margin"+c]=d["padding"+c]=a;return b&&(d.opacity=d.width=a),d}function hc(a,b,c){for(var d,e=(ec[b]||[]).concat(ec["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function ic(a,b,c){var d,e,f,g,h,i,j,l,n=this,o={},p=a.style,q=a.nodeType&&U(a),r=m._data(a,"fxshow");c.queue||(h=m._queueHooks(a,"fx"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,n.always(function(){n.always(function(){h.unqueued--,m.queue(a,"fx").length||h.empty.fire()})})),1===a.nodeType&&("height"in b||"width"in b)&&(c.overflow=[p.overflow,p.overflowX,p.overflowY],j=m.css(a,"display"),l="none"===j?m._data(a,"olddisplay")||Fb(a.nodeName):j,"inline"===l&&"none"===m.css(a,"float")&&(k.inlineBlockNeedsLayout&&"inline"!==Fb(a.nodeName)?p.zoom=1:p.display="inline-block")),c.overflow&&(p.overflow="hidden",k.shrinkWrapBlocks()||n.always(function(){p.overflow=c.overflow[0],p.overflowX=c.overflow[1],p.overflowY=c.overflow[2]}));for(d in b)if(e=b[d],ac.exec(e)){if(delete b[d],f=f||"toggle"===e,e===(q?"hide":"show")){if("show"!==e||!r||void 0===r[d])continue;q=!0}o[d]=r&&r[d]||m.style(a,d)}else j=void 0;if(m.isEmptyObject(o))"inline"===("none"===j?Fb(a.nodeName):j)&&(p.display=j);else{r?"hidden"in r&&(q=r.hidden):r=m._data(a,"fxshow",{}),f&&(r.hidden=!q),q?m(a).show():n.done(function(){m(a).hide()}),n.done(function(){var b;m._removeData(a,"fxshow");for(b in o)m.style(a,b,o[b])});for(d in o)g=hc(q?r[d]:0,d,n),d in r||(r[d]=g.start,q&&(g.end=g.start,g.start="width"===d||"height"===d?1:0))}}function jc(a,b){var c,d,e,f,g;for(c in a)if(d=m.camelCase(c),e=b[d],f=a[c],m.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=m.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function kc(a,b,c){var d,e,f=0,g=dc.length,h=m.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=$b||fc(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:m.extend({},b),opts:m.extend(!0,{specialEasing:{}},c),originalProperties:b,originalOptions:c,startTime:$b||fc(),duration:c.duration,tweens:[],createTween:function(b,c){var d=m.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?h.resolveWith(a,[j,b]):h.rejectWith(a,[j,b]),this}}),k=j.props;for(jc(k,j.opts.specialEasing);g>f;f++)if(d=dc[f].call(j,a,k,j.opts))return d;return m.map(k,hc,j),m.isFunction(j.opts.start)&&j.opts.start.call(a,j),m.fx.timer(m.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}m.Animation=m.extend(kc,{tweener:function(a,b){m.isFunction(a)?(b=a,a=["*"]):a=a.split(" ");for(var c,d=0,e=a.length;e>d;d++)c=a[d],ec[c]=ec[c]||[],ec[c].unshift(b)},prefilter:function(a,b){b?dc.unshift(a):dc.push(a)}}),m.speed=function(a,b,c){var d=a&&"object"==typeof a?m.extend({},a):{complete:c||!c&&b||m.isFunction(a)&&a,duration:a,easing:c&&b||b&&!m.isFunction(b)&&b};return d.duration=m.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in m.fx.speeds?m.fx.speeds[d.duration]:m.fx.speeds._default,(null==d.queue||d.queue===!0)&&(d.queue="fx"),d.old=d.complete,d.complete=function(){m.isFunction(d.old)&&d.old.call(this),d.queue&&m.dequeue(this,d.queue)},d},m.fn.extend({fadeTo:function(a,b,c,d){return this.filter(U).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=m.isEmptyObject(a),f=m.speed(b,c,d),g=function(){var b=kc(this,m.extend({},a),f);(e||m._data(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=m.timers,g=m._data(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&cc.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));(b||!c)&&m.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=m._data(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=m.timers,g=d?d.length:0;for(c.finish=!0,m.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),m.each(["toggle","show","hide"],function(a,b){var c=m.fn[b];m.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(gc(b,!0),a,d,e)}}),m.each({slideDown:gc("show"),slideUp:gc("hide"),slideToggle:gc("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){m.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),m.timers=[],m.fx.tick=function(){var a,b=m.timers,c=0;for($b=m.now();c<b.length;c++)a=b[c],a()||b[c]!==a||b.splice(c--,1);b.length||m.fx.stop(),$b=void 0},m.fx.timer=function(a){m.timers.push(a),a()?m.fx.start():m.timers.pop()},m.fx.interval=13,m.fx.start=function(){_b||(_b=setInterval(m.fx.tick,m.fx.interval))},m.fx.stop=function(){clearInterval(_b),_b=null},m.fx.speeds={slow:600,fast:200,_default:400},m.fn.delay=function(a,b){return a=m.fx?m.fx.speeds[a]||a:a,b=b||"fx",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},function(){var a,b,c,d,e;b=y.createElement("div"),b.setAttribute("className","t"),b.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",d=b.getElementsByTagName("a")[0],c=y.createElement("select"),e=c.appendChild(y.createElement("option")),a=b.getElementsByTagName("input")[0],d.style.cssText="top:1px",k.getSetAttribute="t"!==b.className,k.style=/top/.test(d.getAttribute("style")),k.hrefNormalized="/a"===d.getAttribute("href"),k.checkOn=!!a.value,k.optSelected=e.selected,k.enctype=!!y.createElement("form").enctype,c.disabled=!0,k.optDisabled=!e.disabled,a=y.createElement("input"),a.setAttribute("value",""),k.input=""===a.getAttribute("value"),a.value="t",a.setAttribute("type","radio"),k.radioValue="t"===a.value}();var lc=/\r/g;m.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=m.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,m(this).val()):a,null==e?e="":"number"==typeof e?e+="":m.isArray(e)&&(e=m.map(e,function(a){return null==a?"":a+""})),b=m.valHooks[this.type]||m.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=m.valHooks[e.type]||m.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(lc,""):null==c?"":c)}}}),m.extend({valHooks:{option:{get:function(a){var b=m.find.attr(a,"value");return null!=b?b:m.trim(m.text(a))}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],!(!c.selected&&i!==e||(k.optDisabled?c.disabled:null!==c.getAttribute("disabled"))||c.parentNode.disabled&&m.nodeName(c.parentNode,"optgroup"))){if(b=m(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=m.makeArray(b),g=e.length;while(g--)if(d=e[g],m.inArray(m.valHooks.option.get(d),f)>=0)try{d.selected=c=!0}catch(h){d.scrollHeight}else d.selected=!1;return c||(a.selectedIndex=-1),e}}}}),m.each(["radio","checkbox"],function(){m.valHooks[this]={set:function(a,b){return m.isArray(b)?a.checked=m.inArray(m(a).val(),b)>=0:void 0}},k.checkOn||(m.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var mc,nc,oc=m.expr.attrHandle,pc=/^(?:checked|selected)$/i,qc=k.getSetAttribute,rc=k.input;m.fn.extend({attr:function(a,b){return V(this,m.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){m.removeAttr(this,a)})}}),m.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(a&&3!==f&&8!==f&&2!==f)return typeof a.getAttribute===K?m.prop(a,b,c):(1===f&&m.isXMLDoc(a)||(b=b.toLowerCase(),d=m.attrHooks[b]||(m.expr.match.bool.test(b)?nc:mc)),void 0===c?d&&"get"in d&&null!==(e=d.get(a,b))?e:(e=m.find.attr(a,b),null==e?void 0:e):null!==c?d&&"set"in d&&void 0!==(e=d.set(a,c,b))?e:(a.setAttribute(b,c+""),c):void m.removeAttr(a,b))},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(E);if(f&&1===a.nodeType)while(c=f[e++])d=m.propFix[c]||c,m.expr.match.bool.test(c)?rc&&qc||!pc.test(c)?a[d]=!1:a[m.camelCase("default-"+c)]=a[d]=!1:m.attr(a,c,""),a.removeAttribute(qc?c:d)},attrHooks:{type:{set:function(a,b){if(!k.radioValue&&"radio"===b&&m.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}}}),nc={set:function(a,b,c){return b===!1?m.removeAttr(a,c):rc&&qc||!pc.test(c)?a.setAttribute(!qc&&m.propFix[c]||c,c):a[m.camelCase("default-"+c)]=a[c]=!0,c}},m.each(m.expr.match.bool.source.match(/\w+/g),function(a,b){var c=oc[b]||m.find.attr;oc[b]=rc&&qc||!pc.test(b)?function(a,b,d){var e,f;return d||(f=oc[b],oc[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,oc[b]=f),e}:function(a,b,c){return c?void 0:a[m.camelCase("default-"+b)]?b.toLowerCase():null}}),rc&&qc||(m.attrHooks.value={set:function(a,b,c){return m.nodeName(a,"input")?void(a.defaultValue=b):mc&&mc.set(a,b,c)}}),qc||(mc={set:function(a,b,c){var d=a.getAttributeNode(c);return d||a.setAttributeNode(d=a.ownerDocument.createAttribute(c)),d.value=b+="","value"===c||b===a.getAttribute(c)?b:void 0}},oc.id=oc.name=oc.coords=function(a,b,c){var d;return c?void 0:(d=a.getAttributeNode(b))&&""!==d.value?d.value:null},m.valHooks.button={get:function(a,b){var c=a.getAttributeNode(b);return c&&c.specified?c.value:void 0},set:mc.set},m.attrHooks.contenteditable={set:function(a,b,c){mc.set(a,""===b?!1:b,c)}},m.each(["width","height"],function(a,b){m.attrHooks[b]={set:function(a,c){return""===c?(a.setAttribute(b,"auto"),c):void 0}}})),k.style||(m.attrHooks.style={get:function(a){return a.style.cssText||void 0},set:function(a,b){return a.style.cssText=b+""}});var sc=/^(?:input|select|textarea|button|object)$/i,tc=/^(?:a|area)$/i;m.fn.extend({prop:function(a,b){return V(this,m.prop,a,b,arguments.length>1)},removeProp:function(a){return a=m.propFix[a]||a,this.each(function(){try{this[a]=void 0,delete this[a]}catch(b){}})}}),m.extend({propFix:{"for":"htmlFor","class":"className"},prop:function(a,b,c){var d,e,f,g=a.nodeType;if(a&&3!==g&&8!==g&&2!==g)return f=1!==g||!m.isXMLDoc(a),f&&(b=m.propFix[b]||b,e=m.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=m.find.attr(a,"tabindex");return b?parseInt(b,10):sc.test(a.nodeName)||tc.test(a.nodeName)&&a.href?0:-1}}}}),k.hrefNormalized||m.each(["href","src"],function(a,b){m.propHooks[b]={get:function(a){return a.getAttribute(b,4)}}}),k.optSelected||(m.propHooks.selected={get:function(a){var b=a.parentNode;return b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex),null}}),m.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){m.propFix[this.toLowerCase()]=this}),k.enctype||(m.propFix.enctype="encoding");var uc=/[\t\r\n\f]/g;m.fn.extend({addClass:function(a){var b,c,d,e,f,g,h=0,i=this.length,j="string"==typeof a&&a;if(m.isFunction(a))return this.each(function(b){m(this).addClass(a.call(this,b,this.className))});if(j)for(b=(a||"").match(E)||[];i>h;h++)if(c=this[h],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(uc," "):" ")){f=0;while(e=b[f++])d.indexOf(" "+e+" ")<0&&(d+=e+" ");g=m.trim(d),c.className!==g&&(c.className=g)}return this},removeClass:function(a){var b,c,d,e,f,g,h=0,i=this.length,j=0===arguments.length||"string"==typeof a&&a;if(m.isFunction(a))return this.each(function(b){m(this).removeClass(a.call(this,b,this.className))});if(j)for(b=(a||"").match(E)||[];i>h;h++)if(c=this[h],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(uc," "):"")){f=0;while(e=b[f++])while(d.indexOf(" "+e+" ")>=0)d=d.replace(" "+e+" "," ");g=a?m.trim(d):"",c.className!==g&&(c.className=g)}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):this.each(m.isFunction(a)?function(c){m(this).toggleClass(a.call(this,c,this.className,b),b)}:function(){if("string"===c){var b,d=0,e=m(this),f=a.match(E)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else(c===K||"boolean"===c)&&(this.className&&m._data(this,"__className__",this.className),this.className=this.className||a===!1?"":m._data(this,"__className__")||"")})},hasClass:function(a){for(var b=" "+a+" ",c=0,d=this.length;d>c;c++)if(1===this[c].nodeType&&(" "+this[c].className+" ").replace(uc," ").indexOf(b)>=0)return!0;return!1}}),m.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){m.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),m.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}});var vc=m.now(),wc=/\?/,xc=/(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;m.parseJSON=function(b){if(a.JSON&&a.JSON.parse)return a.JSON.parse(b+"");var c,d=null,e=m.trim(b+"");return e&&!m.trim(e.replace(xc,function(a,b,e,f){return c&&b&&(d=0),0===d?a:(c=e||b,d+=!f-!e,"")}))?Function("return "+e)():m.error("Invalid JSON: "+b)},m.parseXML=function(b){var c,d;if(!b||"string"!=typeof b)return null;try{a.DOMParser?(d=new DOMParser,c=d.parseFromString(b,"text/xml")):(c=new ActiveXObject("Microsoft.XMLDOM"),c.async="false",c.loadXML(b))}catch(e){c=void 0}return c&&c.documentElement&&!c.getElementsByTagName("parsererror").length||m.error("Invalid XML: "+b),c};var yc,zc,Ac=/#.*$/,Bc=/([?&])_=[^&]*/,Cc=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Dc=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Ec=/^(?:GET|HEAD)$/,Fc=/^\/\//,Gc=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,Hc={},Ic={},Jc="*/".concat("*");try{zc=location.href}catch(Kc){zc=y.createElement("a"),zc.href="",zc=zc.href}yc=Gc.exec(zc.toLowerCase())||[];function Lc(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(E)||[];if(m.isFunction(c))while(d=f[e++])"+"===d.charAt(0)?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function Mc(a,b,c,d){var e={},f=a===Ic;function g(h){var i;return e[h]=!0,m.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function Nc(a,b){var c,d,e=m.ajaxSettings.flatOptions||{};for(d in b)void 0!==b[d]&&((e[d]?a:c||(c={}))[d]=b[d]);return c&&m.extend(!0,a,c),a}function Oc(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===e&&(e=a.mimeType||b.getResponseHeader("Content-Type"));if(e)for(g in h)if(h[g]&&h[g].test(e)){i.unshift(g);break}if(i[0]in c)f=i[0];else{for(g in c){if(!i[0]||a.converters[g+" "+i[0]]){f=g;break}d||(d=g)}f=f||d}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function Pc(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}m.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:zc,type:"GET",isLocal:Dc.test(yc[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Jc,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":m.parseJSON,"text xml":m.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?Nc(Nc(a,m.ajaxSettings),b):Nc(m.ajaxSettings,a)},ajaxPrefilter:Lc(Hc),ajaxTransport:Lc(Ic),ajax:function(a,b){"object"==typeof a&&(b=a,a=void 0),b=b||{};var c,d,e,f,g,h,i,j,k=m.ajaxSetup({},b),l=k.context||k,n=k.context&&(l.nodeType||l.jquery)?m(l):m.event,o=m.Deferred(),p=m.Callbacks("once memory"),q=k.statusCode||{},r={},s={},t=0,u="canceled",v={readyState:0,getResponseHeader:function(a){var b;if(2===t){if(!j){j={};while(b=Cc.exec(f))j[b[1].toLowerCase()]=b[2]}b=j[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===t?f:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return t||(a=s[c]=s[c]||a,r[a]=b),this},overrideMimeType:function(a){return t||(k.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>t)for(b in a)q[b]=[q[b],a[b]];else v.always(a[v.status]);return this},abort:function(a){var b=a||u;return i&&i.abort(b),x(0,b),this}};if(o.promise(v).complete=p.add,v.success=v.done,v.error=v.fail,k.url=((a||k.url||zc)+"").replace(Ac,"").replace(Fc,yc[1]+"//"),k.type=b.method||b.type||k.method||k.type,k.dataTypes=m.trim(k.dataType||"*").toLowerCase().match(E)||[""],null==k.crossDomain&&(c=Gc.exec(k.url.toLowerCase()),k.crossDomain=!(!c||c[1]===yc[1]&&c[2]===yc[2]&&(c[3]||("http:"===c[1]?"80":"443"))===(yc[3]||("http:"===yc[1]?"80":"443")))),k.data&&k.processData&&"string"!=typeof k.data&&(k.data=m.param(k.data,k.traditional)),Mc(Hc,k,b,v),2===t)return v;h=k.global,h&&0===m.active++&&m.event.trigger("ajaxStart"),k.type=k.type.toUpperCase(),k.hasContent=!Ec.test(k.type),e=k.url,k.hasContent||(k.data&&(e=k.url+=(wc.test(e)?"&":"?")+k.data,delete k.data),k.cache===!1&&(k.url=Bc.test(e)?e.replace(Bc,"$1_="+vc++):e+(wc.test(e)?"&":"?")+"_="+vc++)),k.ifModified&&(m.lastModified[e]&&v.setRequestHeader("If-Modified-Since",m.lastModified[e]),m.etag[e]&&v.setRequestHeader("If-None-Match",m.etag[e])),(k.data&&k.hasContent&&k.contentType!==!1||b.contentType)&&v.setRequestHeader("Content-Type",k.contentType),v.setRequestHeader("Accept",k.dataTypes[0]&&k.accepts[k.dataTypes[0]]?k.accepts[k.dataTypes[0]]+("*"!==k.dataTypes[0]?", "+Jc+"; q=0.01":""):k.accepts["*"]);for(d in k.headers)v.setRequestHeader(d,k.headers[d]);if(k.beforeSend&&(k.beforeSend.call(l,v,k)===!1||2===t))return v.abort();u="abort";for(d in{success:1,error:1,complete:1})v[d](k[d]);if(i=Mc(Ic,k,b,v)){v.readyState=1,h&&n.trigger("ajaxSend",[v,k]),k.async&&k.timeout>0&&(g=setTimeout(function(){v.abort("timeout")},k.timeout));try{t=1,i.send(r,x)}catch(w){if(!(2>t))throw w;x(-1,w)}}else x(-1,"No Transport");function x(a,b,c,d){var j,r,s,u,w,x=b;2!==t&&(t=2,g&&clearTimeout(g),i=void 0,f=d||"",v.readyState=a>0?4:0,j=a>=200&&300>a||304===a,c&&(u=Oc(k,v,c)),u=Pc(k,u,v,j),j?(k.ifModified&&(w=v.getResponseHeader("Last-Modified"),w&&(m.lastModified[e]=w),w=v.getResponseHeader("etag"),w&&(m.etag[e]=w)),204===a||"HEAD"===k.type?x="nocontent":304===a?x="notmodified":(x=u.state,r=u.data,s=u.error,j=!s)):(s=x,(a||!x)&&(x="error",0>a&&(a=0))),v.status=a,v.statusText=(b||x)+"",j?o.resolveWith(l,[r,x,v]):o.rejectWith(l,[v,x,s]),v.statusCode(q),q=void 0,h&&n.trigger(j?"ajaxSuccess":"ajaxError",[v,k,j?r:s]),p.fireWith(l,[v,x]),h&&(n.trigger("ajaxComplete",[v,k]),--m.active||m.event.trigger("ajaxStop")))}return v},getJSON:function(a,b,c){return m.get(a,b,c,"json")},getScript:function(a,b){return m.get(a,void 0,b,"script")}}),m.each(["get","post"],function(a,b){m[b]=function(a,c,d,e){return m.isFunction(c)&&(e=e||d,d=c,c=void 0),m.ajax({url:a,type:b,dataType:e,data:c,success:d})}}),m.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){m.fn[b]=function(a){return this.on(b,a)}}),m._evalUrl=function(a){return m.ajax({url:a,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})},m.fn.extend({wrapAll:function(a){if(m.isFunction(a))return this.each(function(b){m(this).wrapAll(a.call(this,b))});if(this[0]){var b=m(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&1===a.firstChild.nodeType)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){return this.each(m.isFunction(a)?function(b){m(this).wrapInner(a.call(this,b))}:function(){var b=m(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=m.isFunction(a);return this.each(function(c){m(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){m.nodeName(this,"body")||m(this).replaceWith(this.childNodes)}).end()}}),m.expr.filters.hidden=function(a){return a.offsetWidth<=0&&a.offsetHeight<=0||!k.reliableHiddenOffsets()&&"none"===(a.style&&a.style.display||m.css(a,"display"))},m.expr.filters.visible=function(a){return!m.expr.filters.hidden(a)};var Qc=/%20/g,Rc=/\[\]$/,Sc=/\r?\n/g,Tc=/^(?:submit|button|image|reset|file)$/i,Uc=/^(?:input|select|textarea|keygen)/i;function Vc(a,b,c,d){var e;if(m.isArray(b))m.each(b,function(b,e){c||Rc.test(a)?d(a,e):Vc(a+"["+("object"==typeof e?b:"")+"]",e,c,d)});else if(c||"object"!==m.type(b))d(a,b);else for(e in b)Vc(a+"["+e+"]",b[e],c,d)}m.param=function(a,b){var c,d=[],e=function(a,b){b=m.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(void 0===b&&(b=m.ajaxSettings&&m.ajaxSettings.traditional),m.isArray(a)||a.jquery&&!m.isPlainObject(a))m.each(a,function(){e(this.name,this.value)});else for(c in a)Vc(c,a[c],b,e);return d.join("&").replace(Qc,"+")},m.fn.extend({serialize:function(){return m.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=m.prop(this,"elements");return a?m.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!m(this).is(":disabled")&&Uc.test(this.nodeName)&&!Tc.test(a)&&(this.checked||!W.test(a))}).map(function(a,b){var c=m(this).val();return null==c?null:m.isArray(c)?m.map(c,function(a){return{name:b.name,value:a.replace(Sc,"\r\n")}}):{name:b.name,value:c.replace(Sc,"\r\n")}}).get()}}),m.ajaxSettings.xhr=void 0!==a.ActiveXObject?function(){return!this.isLocal&&/^(get|post|head|put|delete|options)$/i.test(this.type)&&Zc()||$c()}:Zc;var Wc=0,Xc={},Yc=m.ajaxSettings.xhr();a.ActiveXObject&&m(a).on("unload",function(){for(var a in Xc)Xc[a](void 0,!0)}),k.cors=!!Yc&&"withCredentials"in Yc,Yc=k.ajax=!!Yc,Yc&&m.ajaxTransport(function(a){if(!a.crossDomain||k.cors){var b;return{send:function(c,d){var e,f=a.xhr(),g=++Wc;if(f.open(a.type,a.url,a.async,a.username,a.password),a.xhrFields)for(e in a.xhrFields)f[e]=a.xhrFields[e];a.mimeType&&f.overrideMimeType&&f.overrideMimeType(a.mimeType),a.crossDomain||c["X-Requested-With"]||(c["X-Requested-With"]="XMLHttpRequest");for(e in c)void 0!==c[e]&&f.setRequestHeader(e,c[e]+"");f.send(a.hasContent&&a.data||null),b=function(c,e){var h,i,j;if(b&&(e||4===f.readyState))if(delete Xc[g],b=void 0,f.onreadystatechange=m.noop,e)4!==f.readyState&&f.abort();else{j={},h=f.status,"string"==typeof f.responseText&&(j.text=f.responseText);try{i=f.statusText}catch(k){i=""}h||!a.isLocal||a.crossDomain?1223===h&&(h=204):h=j.text?200:404}j&&d(h,i,j,f.getAllResponseHeaders())},a.async?4===f.readyState?setTimeout(b):f.onreadystatechange=Xc[g]=b:b()},abort:function(){b&&b(void 0,!0)}}}});function Zc(){try{return new a.XMLHttpRequest}catch(b){}}function $c(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}m.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(a){return m.globalEval(a),a}}}),m.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),m.ajaxTransport("script",function(a){if(a.crossDomain){var b,c=y.head||m("head")[0]||y.documentElement;return{send:function(d,e){b=y.createElement("script"),b.async=!0,a.scriptCharset&&(b.charset=a.scriptCharset),b.src=a.url,b.onload=b.onreadystatechange=function(a,c){(c||!b.readyState||/loaded|complete/.test(b.readyState))&&(b.onload=b.onreadystatechange=null,b.parentNode&&b.parentNode.removeChild(b),b=null,c||e(200,"success"))},c.insertBefore(b,c.firstChild)},abort:function(){b&&b.onload(void 0,!0)}}}});var _c=[],ad=/(=)\?(?=&|$)|\?\?/;m.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=_c.pop()||m.expando+"_"+vc++;return this[a]=!0,a}}),m.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(ad.test(b.url)?"url":"string"==typeof b.data&&!(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&ad.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=m.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(ad,"$1"+e):b.jsonp!==!1&&(b.url+=(wc.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||m.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,_c.push(e)),g&&m.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),m.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||y;var d=u.exec(a),e=!c&&[];return d?[b.createElement(d[1])]:(d=m.buildFragment([a],b,e),e&&e.length&&m(e).remove(),m.merge([],d.childNodes))};var bd=m.fn.load;m.fn.load=function(a,b,c){if("string"!=typeof a&&bd)return bd.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");return h>=0&&(d=m.trim(a.slice(h,a.length)),a=a.slice(0,h)),m.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(f="POST"),g.length>0&&m.ajax({url:a,type:f,dataType:"html",data:b}).done(function(a){e=arguments,g.html(d?m("<div>").append(m.parseHTML(a)).find(d):a)}).complete(c&&function(a,b){g.each(c,e||[a.responseText,b,a])}),this},m.expr.filters.animated=function(a){return m.grep(m.timers,function(b){return a===b.elem}).length};var cd=a.document.documentElement;function dd(a){return m.isWindow(a)?a:9===a.nodeType?a.defaultView||a.parentWindow:!1}m.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=m.css(a,"position"),l=m(a),n={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=m.css(a,"top"),i=m.css(a,"left"),j=("absolute"===k||"fixed"===k)&&m.inArray("auto",[f,i])>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),m.isFunction(b)&&(b=b.call(a,c,h)),null!=b.top&&(n.top=b.top-h.top+g),null!=b.left&&(n.left=b.left-h.left+e),"using"in b?b.using.call(a,n):l.css(n)}},m.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){m.offset.setOffset(this,a,b)});var b,c,d={top:0,left:0},e=this[0],f=e&&e.ownerDocument;if(f)return b=f.documentElement,m.contains(b,e)?(typeof e.getBoundingClientRect!==K&&(d=e.getBoundingClientRect()),c=dd(f),{top:d.top+(c.pageYOffset||b.scrollTop)-(b.clientTop||0),left:d.left+(c.pageXOffset||b.scrollLeft)-(b.clientLeft||0)}):d},position:function(){if(this[0]){var a,b,c={top:0,left:0},d=this[0];return"fixed"===m.css(d,"position")?b=d.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),m.nodeName(a[0],"html")||(c=a.offset()),c.top+=m.css(a[0],"borderTopWidth",!0),c.left+=m.css(a[0],"borderLeftWidth",!0)),{top:b.top-c.top-m.css(d,"marginTop",!0),left:b.left-c.left-m.css(d,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||cd;while(a&&!m.nodeName(a,"html")&&"static"===m.css(a,"position"))a=a.offsetParent;return a||cd})}}),m.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c=/Y/.test(b);m.fn[a]=function(d){return V(this,function(a,d,e){var f=dd(a);return void 0===e?f?b in f?f[b]:f.document.documentElement[d]:a[d]:void(f?f.scrollTo(c?m(f).scrollLeft():e,c?e:m(f).scrollTop()):a[d]=e)},a,d,arguments.length,null)}}),m.each(["top","left"],function(a,b){m.cssHooks[b]=Lb(k.pixelPosition,function(a,c){return c?(c=Jb(a,b),Hb.test(c)?m(a).position()[b]+"px":c):void 0})}),m.each({Height:"height",Width:"width"},function(a,b){m.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){m.fn[d]=function(d,e){var f=arguments.length&&(c||"boolean"!=typeof d),g=c||(d===!0||e===!0?"margin":"border");return V(this,function(b,c,d){var e;return m.isWindow(b)?b.document.documentElement["client"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body["scroll"+a],e["scroll"+a],b.body["offset"+a],e["offset"+a],e["client"+a])):void 0===d?m.css(b,c,g):m.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),m.fn.size=function(){return this.length},m.fn.andSelf=m.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return m});var ed=a.jQuery,fd=a.$;return m.noConflict=function(b){return a.$===m&&(a.$=fd),b&&a.jQuery===m&&(a.jQuery=ed),m},typeof b===K&&(a.jQuery=a.$=m),m});
//	jQuery Mobile framework customized for Camera slideshow, made by
//	'jquery.mobile.define.js',
//	'jquery.ui.widget.js',
//	'jquery.mobile.widget.js',
//	'jquery.mobile.media.js',
//	'jquery.mobile.support.js',
//	'jquery.mobile.vmouse.js',
//	'jquery.mobile.event.js',
//	'jquery.mobile.core.js'
window.define=function(){Array.prototype.slice.call(arguments).pop()(window.jQuery)};define(["jquery"],function(a){(function(a,b){if(a.cleanData){var c=a.cleanData;a.cleanData=function(b){for(var d=0,e;(e=b[d])!=null;d++){a(e).triggerHandler("remove")}c(b)}}else{var d=a.fn.remove;a.fn.remove=function(b,c){return this.each(function(){if(!c){if(!b||a.filter(b,[this]).length){a("*",this).add([this]).each(function(){a(this).triggerHandler("remove")})}}return d.call(a(this),b,c)})}}a.widget=function(b,c,d){var e=b.split(".")[0],f;b=b.split(".")[1];f=e+"-"+b;if(!d){d=c;c=a.Widget}a.expr[":"][f]=function(c){return!!a.data(c,b)};a[e]=a[e]||{};a[e][b]=function(a,b){if(arguments.length){this._createWidget(a,b)}};var g=new c;g.options=a.extend(true,{},g.options);a[e][b].prototype=a.extend(true,g,{namespace:e,widgetName:b,widgetEventPrefix:a[e][b].prototype.widgetEventPrefix||b,widgetBaseClass:f},d);a.widget.bridge(b,a[e][b])};a.widget.bridge=function(c,d){a.fn[c]=function(e){var f=typeof e==="string",g=Array.prototype.slice.call(arguments,1),h=this;e=!f&&g.length?a.extend.apply(null,[true,e].concat(g)):e;if(f&&e.charAt(0)==="_"){return h}if(f){this.each(function(){var d=a.data(this,c);if(!d){throw"cannot call methods on "+c+" prior to initialization; "+"attempted to call method '"+e+"'"}if(!a.isFunction(d[e])){throw"no such method '"+e+"' for "+c+" widget instance"}var f=d[e].apply(d,g);if(f!==d&&f!==b){h=f;return false}})}else{this.each(function(){var b=a.data(this,c);if(b){b.option(e||{})._init()}else{a.data(this,c,new d(e,this))}})}return h}};a.Widget=function(a,b){if(arguments.length){this._createWidget(a,b)}};a.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:false},_createWidget:function(b,c){a.data(c,this.widgetName,this);this.element=a(c);this.options=a.extend(true,{},this.options,this._getCreateOptions(),b);var d=this;this.element.bind("remove."+this.widgetName,function(){d.destroy()});this._create();this._trigger("create");this._init()},_getCreateOptions:function(){var b={};if(a.metadata){b=a.metadata.get(element)[this.widgetName]}return b},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName);this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled "+"ui-state-disabled")},widget:function(){return this.element},option:function(c,d){var e=c;if(arguments.length===0){return a.extend({},this.options)}if(typeof c==="string"){if(d===b){return this.options[c]}e={};e[c]=d}this._setOptions(e);return this},_setOptions:function(b){var c=this;a.each(b,function(a,b){c._setOption(a,b)});return this},_setOption:function(a,b){this.options[a]=b;if(a==="disabled"){this.widget()[b?"addClass":"removeClass"](this.widgetBaseClass+"-disabled"+" "+"ui-state-disabled").attr("aria-disabled",b)}return this},enable:function(){return this._setOption("disabled",false)},disable:function(){return this._setOption("disabled",true)},_trigger:function(b,c,d){var e=this.options[b];c=a.Event(c);c.type=(b===this.widgetEventPrefix?b:this.widgetEventPrefix+b).toLowerCase();d=d||{};if(c.originalEvent){for(var f=a.event.props.length,g;f;){g=a.event.props[--f];c[g]=c.originalEvent[g]}}this.element.trigger(c,d);return!(a.isFunction(e)&&e.call(this.element[0],c,d)===false||c.isDefaultPrevented())}}})(jQuery)});define(["jquery","./jquery.ui.widget"],function(a){(function(a,b){a.widget("mobile.widget",{_createWidget:function(){a.Widget.prototype._createWidget.apply(this,arguments);this._trigger("init")},_getCreateOptions:function(){var c=this.element,d={};a.each(this.options,function(a){var e=c.jqmData(a.replace(/[A-Z]/g,function(a){return"-"+a.toLowerCase()}));if(e!==b){d[a]=e}});return d},enhanceWithin:function(b){var c=a.mobile.closestPageData(a(b)),d=c&&c.keepNativeSelector()||"";a(this.options.initSelector,b).not(d)[this.widgetName]()}})})(jQuery)});define(["jquery","./jquery.mobile.core"],function(a){(function(a,b){var c=a(window),d=a("html");a.mobile.media=function(){var b={},c=a("<div id='jquery-mediatest'>"),e=a("<body>").append(c);return function(a){if(!(a in b)){var f=document.createElement("style"),g="@media "+a+" { #jquery-mediatest { position:absolute; } }";f.type="text/css";if(f.styleSheet){f.styleSheet.cssText=g}else{f.appendChild(document.createTextNode(g))}d.prepend(e).prepend(f);b[a]=c.css("position")==="absolute";e.add(f).remove()}return b[a]}}()})(jQuery)});define(["jquery","./jquery.mobile.media"],function(a){(function(a,b){function m(){var b=location.protocol+"//"+location.host+location.pathname+"ui-dir/",d=a("head base"),e=null,f="",g,h;if(!d.length){d=e=a("<base>",{href:b}).appendTo("head")}else{f=d.attr("href")}g=a("<a href='testurl' />").prependTo(c);h=g[0].href;d[0].href=f||location.pathname;if(e){e.remove()}return h.indexOf(b)===0}function l(){var b="transform-3d";return k("perspective","10px","moz")||a.mobile.media("(-"+e.join("-"+b+"),(-")+"-"+b+"),("+b+")")}function k(a,b,c){var d=document.createElement("div"),f=function(a){return a.charAt(0).toUpperCase()+a.substr(1)},g=function(a){return"-"+a.charAt(0).toLowerCase()+a.substr(1)+"-"},h=function(c){var e=g(c)+a+": "+b+";",h=f(c),i=h+f(a);d.setAttribute("style",e);if(!!d.style[i]){k=true}},j=c?[c]:e,k;for(i=0;i<j.length;i++){h(j[i])}return!!k}function j(a){var c=a.charAt(0).toUpperCase()+a.substr(1),f=(a+" "+e.join(c+" ")+c).split(" ");for(var g in f){if(d[f[g]]!==b){return true}}}var c=a("<body>").prependTo("html"),d=c[0].style,e=["Webkit","Moz","O"],f="palmGetResource"in window,g=window.operamini&&{}.toString.call(window.operamini)==="[object OperaMini]",h=window.blackberry;a.extend(a.mobile,{browser:{}});a.mobile.browser.ie=function(){var a=3,b=document.createElement("div"),c=b.all||[];while(b.innerHTML="<!--[if gt IE "+ ++a+"]><br><![endif]-->",c[0]){}return a>4?a:!a}();a.extend(a.support,{orientation:"orientation"in window&&"onorientationchange"in window,touch:"ontouchend"in document,cssTransitions:"WebKitTransitionEvent"in window||k("transition","height 100ms linear"),pushState:"pushState"in history&&"replaceState"in history,mediaquery:a.mobile.media("only all"),cssPseudoElement:!!j("content"),touchOverflow:!!j("overflowScrolling"),cssTransform3d:l(),boxShadow:!!j("boxShadow")&&!h,scrollTop:("pageXOffset"in window||"scrollTop"in document.documentElement||"scrollTop"in c[0])&&!f&&!g,dynamicBaseTag:m()});c.remove();var n=function(){var a=window.navigator.userAgent;return a.indexOf("Nokia")>-1&&(a.indexOf("Symbian/3")>-1||a.indexOf("Series60/5")>-1)&&a.indexOf("AppleWebKit")>-1&&a.match(/(BrowserNG|NokiaBrowser)\/7\.[0-3]/)}();a.mobile.ajaxBlacklist=window.blackberry&&!window.WebKitPoint||g||n;if(n){a(function(){a("head link[rel='stylesheet']").attr("rel","alternate stylesheet").attr("rel","stylesheet")})}if(!a.support.boxShadow){a("html").addClass("ui-mobile-nosupport-boxshadow")}})(jQuery)});define(["jquery"],function(a){(function(a,b,c,d){function O(b){var c=b.substr(1);return{setup:function(d,f){if(!M(this)){a.data(this,e,{})}var g=a.data(this,e);g[b]=true;k[b]=(k[b]||0)+1;if(k[b]===1){t.bind(c,H)}a(this).bind(c,N);if(s){k["touchstart"]=(k["touchstart"]||0)+1;if(k["touchstart"]===1){t.bind("touchstart",I).bind("touchend",L).bind("touchmove",K).bind("scroll",J)}}},teardown:function(d,f){--k[b];if(!k[b]){t.unbind(c,H)}if(s){--k["touchstart"];if(!k["touchstart"]){t.unbind("touchstart",I).unbind("touchmove",K).unbind("touchend",L).unbind("scroll",J)}}var g=a(this),h=a.data(this,e);if(h){h[b]=false}g.unbind(c,N);if(!M(this)){g.removeData(e)}}}}function N(){}function M(b){var c=a.data(b,e),d;if(c){for(d in c){if(c[d]){return true}}}return false}function L(a){if(r){return}B();var b=y(a.target),c;G("vmouseup",a,b);if(!o){var d=G("vclick",a,b);if(d&&d.isDefaultPrevented()){c=w(a).changedTouches[0];p.push({touchID:v,x:c.clientX,y:c.clientY});q=true}}G("vmouseout",a,b);o=false;E()}function K(b){if(r){return}var c=w(b).touches[0],d=o,e=a.vmouse.moveDistanceThreshold;o=o||Math.abs(c.pageX-m)>e||Math.abs(c.pageY-n)>e,flags=y(b.target);if(o&&!d){G("vmousecancel",b,flags)}G("vmousemove",b,flags);E()}function J(a){if(r){return}if(!o){G("vmousecancel",a,y(a.target))}o=true;E()}function I(b){var c=w(b).touches,d,e;if(c&&c.length===1){d=b.target;e=y(d);if(e.hasVirtualBinding){v=u++;a.data(d,f,v);F();D();o=false;var g=w(b).touches[0];m=g.pageX;n=g.pageY;G("vmouseover",b,e);G("vmousedown",b,e)}}}function H(b){var c=a.data(b.target,f);if(!q&&(!v||v!==c)){var d=G("v"+b.type,b);if(d){if(d.isDefaultPrevented()){b.preventDefault()}if(d.isPropagationStopped()){b.stopPropagation()}if(d.isImmediatePropagationStopped()){b.stopImmediatePropagation()}}}}function G(b,c,d){var e;if(d&&d[b]||!d&&z(c.target,b)){e=x(c,b);a(c.target).trigger(e)}return e}function F(){if(l){clearTimeout(l);l=0}}function E(){F();l=setTimeout(function(){l=0;C()},a.vmouse.resetTimerDuration)}function D(){A()}function C(){v=0;p.length=0;q=false;B()}function B(){r=true}function A(){r=false}function z(b,c){var d;while(b){d=a.data(b,e);if(d&&(!c||d[c])){return b}b=b.parentNode}return null}function y(b){var c={},d,f;while(b){d=a.data(b,e);for(f in d){if(d[f]){c[f]=c.hasVirtualBinding=true}}b=b.parentNode}return c}function x(b,c){var e=b.type,f,g,i,k,l,m,n,o;b=a.Event(b);b.type=c;f=b.originalEvent;g=a.event.props;if(e.search(/mouse/)>-1){g=j}if(f){for(n=g.length,k;n;){k=g[--n];b[k]=f[k]}}if(e.search(/mouse(down|up)|click/)>-1&&!b.which){b.which=1}if(e.search(/^touch/)!==-1){i=w(f);e=i.touches;l=i.changedTouches;m=e&&e.length?e[0]:l&&l.length?l[0]:d;if(m){for(o=0,len=h.length;o<len;o++){k=h[o];b[k]=m[k]}}}return b}function w(a){while(a&&typeof a.originalEvent!=="undefined"){a=a.originalEvent}return a}var e="virtualMouseBindings",f="virtualTouchID",g="vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "),h="clientX clientY pageX pageY screenX screenY".split(" "),i=a.event.mouseHooks?a.event.mouseHooks.props:[],j=a.event.props.concat(i),k={},l=0,m=0,n=0,o=false,p=[],q=false,r=false,s="addEventListener"in c,t=a(c),u=1,v=0;a.vmouse={moveDistanceThreshold:10,clickDistanceThreshold:10,resetTimerDuration:1500};for(var P=0;P<g.length;P++){a.event.special[g[P]]=O(g[P])}if(s){c.addEventListener("click",function(b){var c=p.length,d=b.target,e,g,h,i,j,k;if(c){e=b.clientX;g=b.clientY;threshold=a.vmouse.clickDistanceThreshold;h=d;while(h){for(i=0;i<c;i++){j=p[i];k=0;if(h===d&&Math.abs(j.x-e)<threshold&&Math.abs(j.y-g)<threshold||a.data(h,f)===j.touchID){b.preventDefault();b.stopPropagation();return}}h=h.parentNode}}},true)}})(jQuery,window,document)});define(["jquery","./jquery.mobile.core","./jquery.mobile.media","./jquery.mobile.support","./jquery.mobile.vmouse"],function(a){(function(a,b,c){function i(b,c,d){var e=d.type;d.type=c;a.event.handle.call(b,d);d.type=e}a.each(("touchstart touchmove touchend orientationchange throttledresize "+"tap taphold swipe swipeleft swiperight scrollstart scrollstop").split(" "),function(b,c){a.fn[c]=function(a){return a?this.bind(c,a):this.trigger(c)};a.attrFn[c]=true});var d=a.support.touch,e="touchmove scroll",f=d?"touchstart":"mousedown",g=d?"touchend":"mouseup",h=d?"touchmove":"mousemove";a.event.special.scrollstart={enabled:true,setup:function(){function g(a,c){d=c;i(b,d?"scrollstart":"scrollstop",a)}var b=this,c=a(b),d,f;c.bind(e,function(b){if(!a.event.special.scrollstart.enabled){return}if(!d){g(b,true)}clearTimeout(f);f=setTimeout(function(){g(b,false)},50)})}};a.event.special.tap={setup:function(){var b=this,c=a(b);c.bind("vmousedown",function(d){function k(a){j();if(e==a.target){i(b,"tap",a)}}function j(){h();c.unbind("vclick",k).unbind("vmouseup",h);a(document).unbind("vmousecancel",j)}function h(){clearTimeout(g)}if(d.which&&d.which!==1){return false}var e=d.target,f=d.originalEvent,g;c.bind("vmouseup",h).bind("vclick",k);a(document).bind("vmousecancel",j);g=setTimeout(function(){i(b,"taphold",a.Event("taphold"))},750)})}};a.event.special.swipe={scrollSupressionThreshold:10,durationThreshold:1e3,horizontalDistanceThreshold:30,verticalDistanceThreshold:75,setup:function(){var b=this,d=a(b);d.bind(f,function(b){function j(b){if(!f){return}var c=b.originalEvent.touches?b.originalEvent.touches[0]:b;i={time:(new Date).getTime(),coords:[c.pageX,c.pageY]};if(Math.abs(f.coords[0]-i.coords[0])>a.event.special.swipe.scrollSupressionThreshold){b.preventDefault()}}var e=b.originalEvent.touches?b.originalEvent.touches[0]:b,f={time:(new Date).getTime(),coords:[e.pageX,e.pageY],origin:a(b.target)},i;d.bind(h,j).one(g,function(b){d.unbind(h,j);if(f&&i){if(i.time-f.time<a.event.special.swipe.durationThreshold&&Math.abs(f.coords[0]-i.coords[0])>a.event.special.swipe.horizontalDistanceThreshold&&Math.abs(f.coords[1]-i.coords[1])<a.event.special.swipe.verticalDistanceThreshold){f.origin.trigger("swipe").trigger(f.coords[0]>i.coords[0]?"swipeleft":"swiperight")}}f=i=c})})}};(function(a,b){function j(){var a=e();if(a!==f){f=a;c.trigger("orientationchange")}}var c=a(b),d,e,f,g,h,i={0:true,180:true};if(a.support.orientation){g=a.mobile.media("all and (orientation: landscape)");h=i[b.orientation];if(g&&h||!g&&!h){i={"-90":true,90:true}}}a.event.special.orientationchange=d={setup:function(){if(a.support.orientation&&a.mobile.orientationChangeEnabled){return false}f=e();c.bind("throttledresize",j)},teardown:function(){if(a.support.orientation&&a.mobile.orientationChangeEnabled){return false}c.unbind("throttledresize",j)},add:function(a){var b=a.handler;a.handler=function(a){a.orientation=e();return b.apply(this,arguments)}}};a.event.special.orientationchange.orientation=e=function(){var c=true,d=document.documentElement;if(a.support.orientation){c=i[b.orientation]}else{c=d&&d.clientWidth/d.clientHeight<1.1}return c?"portrait":"landscape"}})(jQuery,b);(function(){a.event.special.throttledresize={setup:function(){a(this).bind("resize",c)},teardown:function(){a(this).unbind("resize",c)}};var b=250,c=function(){f=(new Date).getTime();g=f-d;if(g>=b){d=f;a(this).trigger("throttledresize")}else{if(e){clearTimeout(e)}e=setTimeout(c,b-g)}},d=0,e,f,g})();a.each({scrollstop:"scrollstart",taphold:"tap",swipeleft:"swipe",swiperight:"swipe"},function(b,c){a.event.special[b]={setup:function(){a(this).bind(c,a.noop)}}})})(jQuery,this)});define(["jquery","../external/requirejs/text!../version.txt","./jquery.mobile.widget"],function(a,b){(function(a,c,d){var e={};a.mobile=a.extend({},{version:b,ns:"",subPageUrlKey:"ui-page",activePageClass:"ui-page-active",activeBtnClass:"ui-btn-active",focusClass:"ui-focus",ajaxEnabled:true,hashListeningEnabled:true,linkBindingEnabled:true,defaultPageTransition:"fade",maxTransitionWidth:false,minScrollBack:10,touchOverflowEnabled:false,defaultDialogTransition:"pop",loadingMessage:"loading",pageLoadErrorMessage:"Error Loading Page",loadingMessageTextVisible:false,loadingMessageTheme:"a",pageLoadErrorMessageTheme:"e",autoInitializePage:true,pushStateEnabled:true,orientationChangeEnabled:true,gradeA:function(){return a.support.mediaquery||a.mobile.browser.ie&&a.mobile.browser.ie>=7},keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91},silentScroll:function(b){if(a.type(b)!=="number"){b=a.mobile.defaultHomeScroll}a.event.special.scrollstart.enabled=false;setTimeout(function(){c.scrollTo(0,b);a(document).trigger("silentscroll",{x:0,y:b})},20);setTimeout(function(){a.event.special.scrollstart.enabled=true},150)},nsNormalizeDict:e,nsNormalize:function(b){if(!b){return}return e[b]||(e[b]=a.camelCase(a.mobile.ns+b))},getInheritedTheme:function(a,b){var c=a[0],d="",e=/ui-(bar|body)-([a-z])\b/,f,g;while(c){var f=c.className||"";if((g=e.exec(f))&&(d=g[2])){break}c=c.parentNode}return d||b||"a"},closestPageData:function(a){return a.closest(':jqmData(role="page"), :jqmData(role="dialog")').data("page")}},a.mobile);a.fn.jqmData=function(b,c){var d;if(typeof b!="undefined"){d=this.data(b?a.mobile.nsNormalize(b):b,c)}return d};a.jqmData=function(b,c,d){var e;if(typeof c!="undefined"){e=a.data(b,c?a.mobile.nsNormalize(c):c,d)}return e};a.fn.jqmRemoveData=function(b){return this.removeData(a.mobile.nsNormalize(b))};a.jqmRemoveData=function(b,c){return a.removeData(b,a.mobile.nsNormalize(c))};a.fn.removeWithDependents=function(){a.removeWithDependents(this)};a.removeWithDependents=function(b){var c=a(b);(c.jqmData("dependents")||a()).remove();c.remove()};a.fn.addDependents=function(b){a.addDependents(a(this),b)};a.addDependents=function(b,c){var d=a(b).jqmData("dependents")||a();a(b).jqmData("dependents",a.merge(d,c))};a.fn.getEncodedText=function(){return a("<div/>").text(a(this).text()).html()};var f=a.find,g=/:jqmData\(([^)]*)\)/g;a.find=function(b,c,d,e){b=b.replace(g,"[data-"+(a.mobile.ns||"")+"$1]");return f.call(this,b,c,d,e)};a.extend(a.find,f);a.find.matches=function(b,c){return a.find(b,null,null,c)};a.find.matchesSelector=function(b,c){return a.find(c,null,null,[b]).length>0}})(jQuery,this)})
;(function($){'use strict'
var def_settings={cntClass:'map',mapClass:'map_model',locationsClass:'map_locations',marker:{basic:'images/gmap_marker.png',active:'images/gmap_marker_active.png'},styles:[]},defaults={map:{x:-73.9924068,y:40.646197,zoom:14},locations:[]};var getLocations=function($map,settings){var $locations=$map.parent().find('.'+ settings.locationsClass).find('li');var locations=[];if($locations.length>0){$locations.each(function(i){var $loc=$(this);if($loc.data('x')&&$loc.data('y')){locations[i]={x:$loc.data('x'),y:$loc.data('y'),basic:$loc.data('basic')?$loc.data('basic'):settings.marker.basic,active:$loc.data('active')?$loc.data('active'):settings.marker.active}
if(!$.trim($loc.html())){locations[i].content=false;}else{locations[i].content='<div class="iw-content">'+ $loc.html()+'</div>';}}});}
return locations;}
$.fn.googleMap=function(settings){settings=$.extend(true,{},def_settings,settings);$(this).each(function(){var $this=$(this);var options=$.extend(true,{},defaults,{map:{x:$this.data('x'),y:$this.data('y'),zoom:$this.data('zoom')},locations:getLocations($this,settings)});var map=new google.maps.Map(this,{center:new google.maps.LatLng(parseFloat(options.map.y),parseFloat(options.map.x)),scrollwheel:false,styles:settings.styles,zoom:options.map.zoom}),infowindow=new google.maps.InfoWindow(),markers=[];for(var i in options.locations){markers[i]=new google.maps.Marker({position:new google.maps.LatLng(parseFloat(options.locations[i].y),parseFloat(options.locations[i].x)),map:map,icon:options.locations[i].basic,index:i});if(options.locations[i].content){google.maps.event.addListener(markers[i],'click',function(){for(var j in markers){markers[j].setIcon(options.locations[j].basic);}
infowindow.setContent(options.locations[this.index].content);infowindow.open(map,this);$('.gm-style-iw').parent().parent().addClass("gm-wrapper");this.setIcon(options.locations[this.index].active);});google.maps.event.addListener(infowindow,'closeclick',function(){for(var j in markers){markers[j].setIcon(options.locations[j].basic);}});}}
google.maps.event.addDomListener(window,'resize',function(){map.setCenter(new google.maps.LatLng(parseFloat(options.map.y),parseFloat(options.map.x)));});});};})(jQuery);
!function(e){function t(i,o){this.options=e.extend({},t.Defaults,o),this.$element=e(i),this._plugins={},this._handlers={"mf.success mf.fail":e.proxy(this.update,this),"mf.process":e.proxy(this.process,this),reset:e.proxy(this.reset,this)},e.each(t.Plugins,e.proxy(function(e,t){this._plugins[e[0].toLowerCase()+e.slice(1)]=new t(this)},this)),this.initialize()}var i;i={MF000:"Sent",MF001:"Recipients are not set!",MF002:"Form will not work locally!",MF003:"Please, define email field in your form!",MF004:"Please, define type of your form!",MF254:"Something went wrong with PHPMailer!",MF255:"Aw, snap! Something went wrong."},t.Defaults={baseClass:"rd-mailform"},t.Plugins={},t.prototype.initialize=function(){this.$element.trigger("mf.initialize"),this.$element.addClass(this.options.baseClass).trigger("reset"),this.create(),this.watch(),this.$element.trigger("mf.initialized")},t.prototype.create=function(){},t.prototype.watch=function(){var e=this;e.$element.ajaxForm({beforeSubmit:function(){e.$element.trigger("mf.process")},error:function(t){e.$element.trigger("mf.fail",{code:t,message:i[t]})},success:function(t){console.log(t),"MF000"==t?e.$element.trigger("mf.success",{code:t,message:i[t]}):(t=5==t.length?t:"MF255",e.$element.trigger("mf.fail",{code:t,message:i[t]}))}}).on(this._handlers)},t.prototype.process=function(){this.$element.addClass("process")},t.prototype.update=function(t,i){this.$element.removeClass("process"),this.$element.addClass("MF000"===i.code?"success":"fail"),setTimeout(e.proxy(function(){this.$element.trigger("reset")},this),3e3)},t.prototype.reset=function(){this.$element.removeClass("success"),this.$element.removeClass("fail"),this.$element.trigger("mf.reset")},e.fn.rdMailForm=function(i){return this.each(function(){e(this).data("rdMailForm")||e(this).data("rdMailForm",new t(this,i))})},e.fn.rdMailForm.Constructor=t}(window.jQuery,window,document),function(e){var t=e.fn.rdMailForm.Constructor.Plugins.Validator=function(i){this._core=i,this._handlers={"mfValidator.validate":this.validate,"mfValidator.error":this.error,"mfValidator.valid":this.valid,"mfValidator.reset":this.reset,"mfValidator.click":e.noop()},this._core.options=e.extend({},t.Defaults,this._core.options),this.initialize()};t.Defaults={validator:{applyTo:"[data-constraints]","class":"mfValidation",constraints:{"@LettersOnly":{rule:"^([a-zA-Zа-яА-ЯіїёІЇЁєЄҐґ\\s]{0,})$",message:"Please use letters only!"},"@NumbersOnly":{rule:"^-?\\d*\\.?\\d*$",message:"Please use numbers only!"},"@NotEmpty":{rule:"([^\\s])",message:"Field should not be empty!"},"@Email":{rule:"^(([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)){0,}$",message:"Enter valid e-mail address!"},"@Phone":{rule:"^(\\+?\\d{0,3}\\s*\\(?\\d{1,3}\\)?\\s*\\d{3}\\s*\\d{4}){0,}$",message:"Enter valid phone number!"},"@Date":{rule:function(e){return navigator.userAgent.match(/(iPod|iPhone|iPad)/)?!0:new RegExp("^($)|(((0[13578]|10|12)(-|\\/)((0[1-9])|([12])([0-9])|(3[01]?))(-|\\/)((19)([2-9])(\\d{1})|(20)([01])(\\d{1})|([8901])(\\d{1}))|(0?[2469]|11)(-|/)(([1-9])|(0[1-9])|([12])([0-9]?)|(3[0]?))(-|/)((19)([2-9])(\\d{1})|(20)([01])(\\d{1})|([8901])(\\d{1}))))$").test(e.val())},message:"Use MM/DD/YYYY format!"},"@SelectRequired":{rule:function(e){return 0!==e.find("option:selected").index()},message:"Please choose an option!"}}}},t.prototype.initialize=function(){this._core.$element.trigger("mfValidator.initialize"),this.create(),this.watch(),this._core.$element.trigger("mfValidator.initialized")},t.prototype.create=function(){var t=this;this._core.$element.find(this._core.options.validator.applyTo).each(function(){e(this).parent().append(e("<span/>",{"class":t._core.options.validator["class"]}))})},t.prototype.watch=function(){var t=this;this._core.$element.find(this._core.options.validator.applyTo).on("keyup",function(){e(this).is("input")&&e(this).parent().trigger("mfValidator.validate",{options:t._core.options.validator})}).on("change",function(){e(this).parent().trigger("mfValidator.validate",{options:t._core.options.validator})}).parent().on(this._handlers).find("."+this._core.options.validator["class"]).on("click",function(){e(this).removeClass("error").removeClass("show").addClass("hide").parent().trigger("mfValidator.click").find(t._core.options.validator.applyTo).focus()}),this._core.$element.on("submit",e.proxy(function(i){return this._core.$element.find(this._core.options.validator.applyTo).each(function(){e(this).parent().trigger("mfValidator.validate",{options:t._core.options.validator})}),this._core.$element.find(".error").length?(i.preventDefault(),!1):void 0},this)).on("reset",e.proxy(function(){this._core.$element.find(this._core.options.validator.applyTo).each(function(){e(this).parent().trigger("mfValidator.reset",{options:t._core.options.validator})})},this))},t.prototype.validate=function(t,i){var o=[],s=e(this),n=s.find(i.options.applyTo),r=n.data("constraints").match(/\@\w+/g),a=n.val();for(var c in r)if(i.options.constraints[r[c]])switch(typeof i.options.constraints[r[c]].rule){case"function":i.options.constraints[r[c]].rule(n)||o.push(i.options.constraints[r[c]].message);break;default:new RegExp(i.options.constraints[r[c]].rule).test(a)||o.push(i.options.constraints[r[c]].message)}o.length?e(this).trigger("mfValidator.error",{options:i.options,errors:o}):e(this).trigger("mfValidator.valid",{options:i.options})},t.prototype.error=function(t,i){e(this).find("."+i.options["class"]).removeClass("valid").removeClass("hide").addClass("show").addClass("error").text(i.errors)},t.prototype.valid=function(t,i){e(this).find("."+i.options["class"]).removeClass("error").removeClass("show").addClass("valid").addClass("hide").text(i.errors)},t.prototype.reset=function(t,i){e(this).find("."+i.options["class"]).removeClass("show").removeClass("hide").text("")}}(window.jQuery,window,document),function(e){var t=e.fn.rdMailForm.Constructor.Plugins.Input=function(i){this._core=i,this._handlers={"mfInput.focus":this.focus,"mfInput.blur":this.blur,"mfInput.type":this.type,"mfInput.delete":this["delete"],"mfInput.fill":this.fill,"mfInput.empty":this.empty,"mfInput.idle":this.idle,"mfInput.reset":this.reset,click:function(e){return e.preventDefault(),!1}},this._core.options=e.extend({},t.Defaults,this._core.options),this.initialize()};t.Defaults={input:{applyto:'input[type="text"], input[type="date"], textarea',"class":"mfInput"}},t.prototype.initialize=function(){this._core.$element.trigger("mfInput.initialize"),this.create(),this.watch(),this._core.$element.trigger("mfInput.initialized")},t.prototype.create=function(){this._core.$element.find(this._core.options.input.applyto).parent().addClass(this._core.options.input["class"])},t.prototype.watch=function(){this._core.$element.find(this._core.options.input.applyto).on("focus",function(){e(this).parent().trigger("mfInput.focus")}).on("blur",function(){e(this).parent().trigger("mfInput.blur"),""===e(this).val()&&e(this).parent().trigger("mfInput.void")}).on("keydown",this,function(t){t.data.ignore(t)||((8===t.keyCode||46===t.keyCode)&&e(this).parent().trigger("mfInput.delete"),(32===t.keyCode||t.keyCode>46)&&e(this).parent().trigger("mfInput.type"))}).on("keyup",this,function(t){var i=e(this);t.data.ignore(t)||(""===i.val()&&i.parent().trigger("mfInput.empty"),8===t.keyCode||46===t.keyCode?(self.timer&&clearTimeout(self.timer),self.timer=setTimeout(function(){i.parent().trigger("mfInput.idle")},1e3)):(i.parent().trigger("mfInput.fill"),i.parent().trigger("mfInput.type"),self.timer&&clearTimeout(self.timer),self.timer=setTimeout(function(){i.parent().trigger("mfInput.idle")},1e3)))}).on("keypress",this,function(t){if(!t.data.ignore(t.keyCode)){var i=e(this);self.timer&&clearTimeout(self.timer),self.timer=setTimeout(function(){i.parent().trigger("mfInput.idle")},1e3)}}).parent().on(this._handlers),this._core.$element.on("mf.reset",this,function(t){e(this).find("."+t.data._core.options.input["class"]).each(function(){e(this).trigger("mfInput.reset")})})},t.prototype.focus=function(){e(this).addClass("focused")},t.prototype.blur=function(){e(this).removeClass("focused")},t.prototype.type=function(){e(this).removeClass("deleting"),e(this).addClass("typing")},t.prototype["delete"]=function(){e(this).removeClass("typing"),e(this).addClass("deleting")},t.prototype.fill=function(){e(this).addClass("filled")},t.prototype.empty=function(){e(this).removeClass("filled")},t.prototype.idle=function(){e(this).removeClass("typing"),e(this).removeClass("deleting")},t.prototype.reset=function(){e(this).removeClass("focused"),e(this).removeClass("deleting"),e(this).removeClass("filled"),e(this).removeClass("typing"),e(this).removeClass("error")},t.prototype.ignore=function(e){return 144===e.keyCode||20===e.keyCode||17===e.keyCode||37===e.keyCode||38===e.keyCode||39===e.keyCode||40===e.keyCode||112===e.keyCode||113===e.keyCode||114===e.keyCode||115===e.keyCode||116===e.keyCode||117===e.keyCode||118===e.keyCode||119===e.keyCode||120===e.keyCode||121===e.keyCode||122===e.keyCode||123===e.keyCode||9===e.keyCode||e.ctrlKey?!0:!1}}(window.jQuery,window,document),function(e){var t=e.fn.rdMailForm.Constructor.Plugins.Select=function(i){this._core=i,this._handlers={"mfSelect.close":this.close,"mfSelect.open":this.open,"mfSelect.select":this.select,click:function(e){e.preventDefault(),e.stopPropagation()}},this._core.options=e.extend({},t.Defaults,this._core.options),this.initialize()};t.Defaults={select:{applyTo:"select","class":"mfSelect"}},t.prototype.initialize=function(){this._core.$element.trigger("mfSelect.initialize"),this.create(),this.watch(),this._core.$element.trigger("mfSelect.initialized")},t.prototype.create=function(){this._core.$element.find(this._core.options.select.applyTo).each(function(){var t=e(this);t.css({position:"absolute",left:"50%",width:"0",height:"0",overflow:"hidden",opacity:"0"}).parent().append(e("<div/>",{"class":"value",text:t.find("option:selected").text()})).append(e("<ul/>",{"class":"dropdown"})).end().find("option").each(function(t){if(0!=t){var i=e(this);i.parent().parent().find(".dropdown").append(e("<li/>",{"class":"option",text:i.text()}).addClass(i.is(":selected")?"selected":""))}})}).parent().addClass(this._core.options.select["class"])},t.prototype.watch=function(){var t=this;this._core.$element.find(t._core.options.select.applyTo).on("focus",this.focus).on("blur",function(){e(this).parent().trigger("mfSelect.close").removeClass("focus")}).on("keydown",function(t){38==t.keyCode&&e(this).val(e(this).find("option").eq(e(this).find("option:selected").index()>0?e(this).find("option:selected").index()-1:0).text()).trigger("change"),40==t.keyCode&&e(this).val(e(this).find("option").eq(e(this).find("option:selected").index()<e(this).find("option").length-1?e(this).find("option:selected").index()+1:e(this).find("option").length-1).text()).trigger("change"),13==t.keyCode&&e(this).parent().trigger(e(this).parent().hasClass("show")?"mfSelect.close":"mfSelect.open"),(32==t.keyCode||37==t.keyCode||38==t.keyCode||39==t.keyCode||40==t.keyCode||13==t.keyCode)&&t.preventDefault()}).on("change",function(){e(this).parent().trigger("mfSelect.open").find(".value").text(e(this).val());var t=e(this).find("option:selected").index(),i=e(this).parent().find(".option").removeClass("selected");t>0&&i.eq(t-1).addClass("selected")}).parent().on(this._handlers).find(".value").on("click",function(){var i=e(this),o=i.parent().find("select"),s=o.find("option").eq(0).text();if(i.text(s),o.trigger("focus").off("focus",t.focus),!e(this).parent().hasClass("show")){o.on("focus",t.focus);var n=e(this).parent().find(".option.selected");n.length&&i.text(n.text())}}).parent().find(".option").on("click",function(){e(this).parent().find(".option").removeClass("selected"),e(this).addClass("selected"),e(this).parent().parent().find("select").focus().on("focus",t.focus),e(this).parent().parent().trigger("mfSelect.select",{options:t._core.options.select,value:e(this).text()})}).parents("body").on("click",function(i){var o=t._core.$element.find("."+t._core.options.select["class"]);o.length&&(o.is(i.target)||0!==o.has(i.target).length||o.find("select").each(function(){var t=e(this).parent().find(".option.selected");t.length&&e(this).parent().find(".value").text(t.text())}).on("focus",t.focus))}),this._core.$element.on("mf.reset",function(){e(this).find(t._core.options.select.applyTo).each(function(){e(this).parent().find(".value").text(e(this).prop("selectedIndex",0).val()),e(this).parent().find(".option").removeClass("selected")})})},t.prototype.focus=function(){e(this).parent().trigger("mfSelect.open").addClass("focus")},t.prototype.close=function(){navigator.userAgent.match(/(iPod|iPhone|iPad)/)||e(this).hasClass("show")&&e(this).removeClass("show")},t.prototype.open=function(){navigator.userAgent.match(/(iPod|iPhone|iPad)/)||e(this).hasClass("show")||e(this).addClass("show")},t.prototype.select=function(t,i){e(this).find(i.options.applyTo).val(i.value).trigger("change"),e(this).trigger("mfSelect.close")}}(window.jQuery,window,document),function(e){var t=e.fn.rdMailForm.Constructor.Plugins.DatePicker=function(i){this._core=i,this._handlers={"mfDatePicker.close":this.close,"mfDatePicker.open":this.open,"mfDatePicker.next":this.next,"mfDatePicker.prev":this.prev,"mfDatePicker.update":this.update,"mfDatePicker.refresh":this.refresh,"mfDatePicker.pick":this.pick},this._core.options=e.extend({},t.Defaults,this._core.options),this.initialize()};t.Defaults={datepicker:{applyTo:'input[type="date"]',"class":"mfDatePicker",days:["Su","Mo","Tu","We","Th","Fr","Sa"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],format:"MM-DD-YYYY",prevMonth:"",nextMonth:""}},t.prototype.initialize=function(){this._core.$element.trigger("mfDatePicker.initialize"),this.create(),this.watch(),this._core.$element.trigger("mfDatePicker.initialized")},t.prototype.create=function(){var t=this;t._core.$element.find(t._core.options.datepicker.applyTo).each(function(){e(this).attr({type:navigator.userAgent.match(/(iPod|iPhone|iPad)/)?"date":"text","data-type":"date"}).after(e("<div/>",{"class":t._core.options.datepicker["class"]}).data("date",new Date))}).parent().find("."+t._core.options.datepicker["class"]).each(function(){e.proxy(t.update,this,{},t._core.options.datepicker).call(),e.proxy(t.refresh,this,{},t._core.options.datepicker).call()})},t.prototype.watch=function(){var t=this;t._core.$element.find("."+t._core.options.datepicker["class"]).on("click","."+t._core.options.datepicker["class"]+"_next",function(){var i=e(this).parents("."+t._core.options.datepicker["class"]);i.trigger("mfDatePicker.next"),i.trigger("mfDatePicker.update",t._core.options.datepicker),i.trigger("mfDatePicker.refresh",t._core.options.datepicker)}).on("click","."+t._core.options.datepicker["class"]+"_prev",function(){var i=e(this).parents("."+t._core.options.datepicker["class"]);i.trigger("mfDatePicker.prev"),i.trigger("mfDatePicker.update",t._core.options.datepicker),i.trigger("mfDatePicker.refresh",t._core.options.datepicker)}).on("click",".dp-day",function(){var i=e(this).parents("."+t._core.options.datepicker["class"]);i.trigger("mfDatePicker.pick",{opt:t._core.options.datepicker,day:e(this)}),i.parent().find("input").on("blur",t.blur).trigger("blur").trigger("keyup")}).on("click",function(){}).on(this._handlers).parent().on("click",function(e){return e.preventDefault(),!1}).find("input").on("focus",function(){e(this).parent().find("."+t._core.options.datepicker["class"]).trigger("mfDatePicker.open")}).on("blur",this.blur).on("keydown",function(i){(9==i.keyCode||i.shiftKey&&9==i.keyCode)&&e(this).on("blur",t.blur)}).parents("body").on("mousedown",function(e){var i=t._core.$element.find("."+t._core.options.datepicker["class"]).parent();i.length&&(i.is(e.target)||0!==i.has(e.target).length?i.find("input").off("blur",t.blur):i.find("input").on("blur",t.blur).trigger("blur"))}),t._core.$element.on("mf.reset",function(){e(this).find("."+t._core.options.datepicker["class"]).each(function(){e(this).trigger("mfDatePicker.close")})})},t.prototype.blur=function(){e(this).parent().find(".mfDatePicker").trigger("mfDatePicker.close")},t.prototype.close=function(){navigator.userAgent.match(/(iPod|iPhone|iPad)/)||e(this).hasClass("open")&&e(this).removeClass("open")},t.prototype.open=function(){navigator.userAgent.match(/(iPod|iPhone|iPad)/)||e(this).hasClass("open")||e(this).addClass("open")},t.prototype.next=function(){var t=e(this),i=t.data("date");i=11==i.getMonth()?new Date(i.getFullYear()+1,0,1):new Date(i.getFullYear(),i.getMonth()+1,1),t.data("date",i)},t.prototype.prev=function(){var t=e(this),i=t.data("date");i=0==i.getMonth()?new Date(i.getFullYear()-1,11,1):new Date(i.getFullYear(),i.getMonth()-1,1),t.data("date",i)},t.prototype.pick=function(t,i){var o=e(this);o.data("pickedDate",i.day.addClass("dp-selected").data("date")),o.find(".dp-day").not(i.day).removeClass("dp-selected"),o.parent().find("input").val((o.data("pickedDate").getMonth()+1<10?"0"+(o.data("pickedDate").getMonth()+1):o.data("pickedDate").getMonth()+1)+"/"+(o.data("pickedDate").getDate()<10?"0"+o.data("pickedDate").getDate():o.data("pickedDate").getDate())+"/"+o.data("pickedDate").getFullYear())},t.prototype.update=function(t,i){var o=e(this),s=e("<div/>",{"class":i["class"]+"_panel"});s.append(e("<a/>",{"class":i["class"]+"_prev",text:i.prevMonth})),s.append(e("<a/>",{"class":i["class"]+"_next",text:i.nextMonth})),s.append(e("<div/>",{"class":i["class"]+"_title",text:i.months[o.data("date").getMonth()]+" "+o.data("date").getFullYear()}));var n=o.find("."+i["class"]+"_panel");n.length?n.replaceWith(s):s.appendTo(o)},t.prototype.refresh=function(t,i){for(var o=e(this),s=e("<table/>"),n=e("<tr/>"),r=0;r<i.days.length;r++)n.append(e("<th/>",{"class":"dp-weekday",text:i.days[r]}));s.append(n);for(var a=o.data("date"),c=o.data("pickedDate"),l=new Date(a.getFullYear(),a.getMonth()+1,0).getDate(),p=new Date(a.getFullYear(),a.getMonth(),0).getDate(),d=new Date(a.getFullYear(),a.getMonth(),1).getDay(),f=1,r=0;7>r;r++){n=e("<tr/>");for(var h=0;7>h;h++){var u,m=7*r+h+1,g=e("<td/>",{"class":"dp-day"}),y=new Date;if(y.setHours(0),y.setMinutes(0),y.setSeconds(0),y.setMilliseconds(0),0==h&&m>l+d)break;1>m-d?(g.text(p+(m-d)).addClass("dp-offset"),u=new Date(a.getFullYear(),a.getMonth()-1,p+(m-d))):l+d>=m?(g.text(m-d),u=new Date(a.getFullYear(),a.getMonth(),m-d)):(g.text(f).addClass("dp-offset"),u=new Date(a.getFullYear(),a.getMonth()+1,f++)),u.valueOf()==y.valueOf()&&g.addClass("dp-today"),c&&u.valueOf()==c.valueOf()&&g.addClass("dp-selected"),n.append(g.data("date",u))}""!=n.html()&&s.append(n)}var v=o.find("table");v.length?v.replaceWith(s):s.appendTo(o)}}(window.jQuery,window,document),function(e){var t=e.fn.rdMailForm.Constructor.Plugins.Icon=function(i){this._core=i,this._core.options=e.extend({},t.Defaults,this._core.options),this.initialize()};this._handlers={"mfIcon.change":this.change},t.Defaults={icon:{applyTo:"[data-add-icon]","class":"mfIcon",states:{".mfInput":{"mfIcon.default":["mfInput.blur","mfInput.idle","mfInput.reset"],"mfIcon.state-1":["mfInput.type"],"mfIcon.state-2":["mfInput.delete"]}}}},t.prototype.initialize=function(){this._core.$element.trigger("mfIcon.initialize"),this.create(),this.watch(),this._core.$element.trigger("mfIcon.initialized")},t.prototype.create=function(){var t=this;t._core.$element.find(t._core.options.icon.applyTo).each(function(){var i=e(this);i.append(e("<span/>",{"class":t._core.options.icon["class"]}).append(e("<span/>")))})},t.prototype.watch=function(){var t=this;t._core.$element.find("."+t._core.options.icon["class"]).on(t._handlers);for(var i in t._core.options.icon.states){var o=t._core.$element.find(i);for(var s in t._core.options.icon.states[i])for(var n in t._core.options.icon.states[i][s])o.on(t._core.options.icon.states[i][s][n],{state:s},function(i){e(this).find("."+t._core.options.icon["class"]).attr("class",i.data.state.replace("."," "))})}}}(window.jQuery,window,document),function(e){var t=e.fn.rdMailForm.Constructor.Plugins.Placeholder=function(i){this._core=i,this._core.options=e.extend({},t.Defaults,this._core.options),this.initialize()};this._handlers={"mfIcon.change":this.change},t.Defaults={placeholder:{applyTo:"[data-add-placeholder]","class":"mfPlaceHolder",states:{".mfInput":{"mfPlaceHolder.default":["mfInput.void","mfInput.reset"],"mfPlaceHolder.state-1":["mfInput.fill","mfInput.focus"]}}}},t.prototype.initialize=function(){this._core.$element.trigger("mfPlaceHolder.initialize"),this.create(),this.watch(),this._core.$element.trigger("mfPlaceHolder.initialized")},t.prototype.create=function(){var t=this;t._core.$element.find(t._core.options.placeholder.applyTo).each(function(){var i=e(this);i.append(e("<span/>",{"class":t._core.options.placeholder["class"],text:i.find("[placeholder]").attr("placeholder")?i.find("[placeholder]").attr("placeholder"):i.find("[data-placeholder]").attr("data-placeholder")})).find("[placeholder]").removeAttr("placeholder").removeAttr("data-placeholder")})},t.prototype.watch=function(){var t=this;t._core.$element.find("."+t._core.options.placeholder["class"]).on("click",function(){e(this).parent().find("input, textarea").trigger("focus")}).on(t._handlers);for(var i in t._core.options.icon.states){var o=t._core.$element.find(i);for(var s in t._core.options.placeholder.states[i])for(var n in t._core.options.placeholder.states[i][s])o.on(t._core.options.placeholder.states[i][s][n],{state:s},function(i){e(this).find("."+t._core.options.placeholder["class"]).attr("class",i.data.state.replace("."," "))})}}}(window.jQuery,window,document),function(e){var t=e.fn.rdMailForm.Constructor.Plugins.Progress=function(i){this._core=i,this._core.options=e.extend({},t.Defaults,this._core.options),this.initialize()};t.Defaults={progress:{applyTo:"button[type='submit']","class":"mfProgress"}},t.prototype.initialize=function(){this._core.$element.trigger("mfProgress.initialize"),this.create(),this.watch(),this._core.$element.trigger("mfProgress.initialized")},t.prototype.create=function(){var t=this;t._core.$element.find(t._core.options.progress.applyTo).each(function(){var i=e(this);i.addClass(t._core.options.progress["class"]).wrapInner(e("<span/>",{"class":"cnt"})).append(e("<span/>",{"class":"loader"})).append(e("<span/>",{"class":"msg"}))})},t.prototype.watch=function(){var t=this;t._core.$element.on("mf.process",function(){e(this).find("."+t._core.options.progress["class"]).addClass("sending")}).on("mf.fail",function(i,o){e(this).find("."+t._core.options.progress["class"]).removeClass("sending").addClass("fail").find(".msg").text(o.message),setTimeout(e.proxy(function(){e(this).find("."+t._core.options.progress["class"]).removeClass("fail").find(".msg").text("")},this),3e3)}).on("mf.success",function(i,o){e(this).find("."+t._core.options.progress["class"]).removeClass("sending").addClass("success").find(".msg").text(o.message),setTimeout(e.proxy(function(){e(this).find("."+t._core.options.progress["class"]).removeClass("success").find(".msg").text("")},this),1500)}).on("mf.reset",function(){e(this).find("."+t._core.options.progress["class"]).removeClass("sending").removeClass("fail").removeClass("success").find(".msg").text("")})}}(window.jQuery,window,document),function(e,t,i){e(i).ready(function(){var t=e(".mailform");t.length&&t.rdMailForm()})}(window.jQuery,window,document);
;(function($){var settings={cntClass:'rd-mobilemenu',menuClass:'rd-mobilemenu_ul',submenuClass:'rd-mobilemenu_submenu',panelClass:'rd-mobilepanel',toggleClass:'rd-mobilepanel_toggle',titleClass:'rd-mobilepanel_title'},lastY,dir;var RDMobileMenu=function(element,options){this.options=options;this.$source=$(element);};RDMobileMenu.prototype={init:function(){var nav=this;nav.createDOM();nav.createListeners();},createDOM:function(){var nav=this;$('body').append($('<div/>',{'class':settings.cntClass}).append(nav.createNavDOM())).append($('<div/>',{'class':settings.panelClass}).append($('<button/>',{'class':settings.toggleClass}).append($('<span/>'))).append($('<h2/>',{'class':settings.titleClass,'text':document.title})));},createNavDOM:function(){var nav=this;var menu=$('<ul>',{'class':settings.menuClass});var li=nav.$source.children();for(var i=0;i<li.length;i++){var o=li[i].children,item=null;for(var j=0;j<o.length;j++){if(o[j].tagName){if(!item){item=document.createElement('li');if(li[i].className.indexOf('active')>-1){item.className='active';}}
switch(o[j].tagName.toLowerCase()){case'a':var link=o[j].cloneNode(true);item.appendChild(link);break;case'ul':var submenu=o[j].cloneNode(true);submenu.className=settings.submenuClass;$(submenu).css({"display":"none"});item.appendChild(submenu);$(item).find('> a').each(function(){$this=$(this);$this.addClass('rd-with-ul').append($('<span/>',{class:'rd-submenu-toggle'})).find('.rd-submenu-toggle').on('click',function(e){e.preventDefault();$this=$(this).parent();if($this.hasClass('rd-with-ul')&&!$this.hasClass('active')){$('.rd-with-ul').removeClass('active');var submenu=$this.addClass('active').parent().find('.'+ settings.submenuClass);submenu.stop().slideDown();$('.'+ settings.submenuClass).not(submenu).stop().slideUp();}else{var submenu=$this.removeClass('active').parent().find('.'+ settings.submenuClass);submenu.stop().slideUp();}});});break;default:break;}}}
if(item){menu.append(item);}}
return menu;},createListeners:function(){var nav=this;nav.createToggleListener();nav.createResizeListener();},createToggleListener:function(){var nav=this,type;if(nav.isMobile()){type='touchstart';}else{type='click';}
$('body').delegate('.'+ settings.toggleClass,type,function(){var o=$('.'+ settings.cntClass);$(this).toggleClass('active');if(o.hasClass('active')){$(this).removeClass('active');o.removeClass('active');$('body').undelegate('*','mousewheel',nav.scroll);$('body').undelegate('*','touchmove',nav.scroll);$('body').undelegate('*','touchend',nav.touchend);$('body').undelegate('*','touchstart',nav.close);$('body').undelegate('*:not(.'+ settings.toggleClass+' span)','click',nav.close);}else{$(this).addClass('active');o.addClass('active');$('body').delegate('*','mousewheel',nav.scroll);$('body').delegate('*','touchmove',nav.scroll);$('body').delegate('*','touchend',nav.touchend);$('body').delegate('*','touchstart',{type:type},nav.close);$('body').delegate('*:not(.'+ settings.toggleClass+' span)','click',{type:type},nav.close);}});},createResizeListener:function(){var nav=this;$(window).on('resize',function(){var o=$('.'+ settings.cntClass);if(o.css('display')=='none'){o.removeClass('active');$('.'+ settings.toggleClass).removeClass('active');$('body').undelegate('*','mousewheel',nav.scroll);$('body').undelegate('*','touchmove',nav.scroll);$('body').undelegate('*','touchend',nav.touchend);$('body').undelegate('*','touchstart',nav.close);$('body').undelegate('*:not(.'+ settings.toggleClass+' span)','click',nav.close);}});},scroll:function(e){e.preventDefault();var menu=$('.'+ settings.menuClass);var x=e.originalEvent.targetTouches?e.originalEvent.targetTouches[0].pageX:e.pageX,y=e.originalEvent.targetTouches?e.originalEvent.targetTouches[0].pageY:e.pageY;if(y>menu.offset().top&&y<(menu.offset().top+ menu.outerHeight())&&x>menu.offset().left&&x<(menu.offset().left+ menu.outerWidth())){var delta=0;if(e.originalEvent.targetTouches){if(!lastY)lastY=y;delta=(lastY- y);lastY=y;dir=delta>0;}else{delta=(e.originalEvent.wheelDelta||-e.originalEvent.detail)*(-50)}
menu.stop().scrollTop(menu.scrollTop()+ delta);}
return false;},touchend:function(e){var menu=$('.'+ settings.menuClass);menu.stop().animate({scrollTop:menu.scrollTop()+(dir?100:-100)},3000,'easeOutQuint');lastY=undefined;},close:function(e){if(!e.originalEvent){return;}
var menu=$('.'+ settings.menuClass);var x=e.originalEvent.targetTouches?e.originalEvent.targetTouches[0].pageX:e.pageX,y=e.originalEvent.targetTouches?e.originalEvent.targetTouches[0].pageY:e.pageY;if(!(y>menu.offset().top&&y<(menu.offset().top+ menu.outerHeight())&&x>menu.offset().left&&x<(menu.offset().left+ menu.outerWidth()))){$('.'+ settings.toggleClass).trigger(e.data.type);}},isMobile:function(){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);}};$.fn.rdparallax=function(option){var o=this;if(o.length){new RDMobileMenu(o[0]).init();}
return o;};window.RDMobilemenu_autoinit=function(selector){var o=$(selector);if(o.length){new RDMobileMenu(o[0]).init();}};})(jQuery);$(document).ready(function(){RDMobilemenu_autoinit('[data-type="navbar"]');});
;(function($){var RDParallax=function(element,options){this.options=options;this.settings={'imageClass':'parallax_image','patternClass':'parallax_pattern','contentClass':'parallax_cnt','wrapClass':'parallax'}
this.$wrap=$(element);this.$image=$.noop();};RDParallax.prototype={init:function(){var parallax=this;parallax.isInit=true;parallax.createDOM();parallax.blur();parallax.createListeners();},createDOM:function(){var parallax=this;parallax.$wrap.addClass(parallax.settings.wrapClass).wrapInner($('<div/>',{'class':parallax.settings.contentClass})).prepend($('<div/>',{'class':(parallax.options.pattern?parallax.settings.patternClass:parallax.settings.imageClass)}).css({'background-image':'url('+ parallax.options.url+')','background-color':parallax.options.color}));parallax.$image=parallax.options.pattern?parallax.$wrap.find('.'+ parallax.settings.patternClass):parallax.$wrap.find('.'+ parallax.settings.imageClass);},createListeners:function(){this.createResizeListener();this.createScrollListener();},createScrollListener:function(){var parallax=this;if(parallax.isMobile()){if(!parallax.options.mobile){return;}}
$(window).bind('touchstart',function(){parallax.isTouched=true;});$(window).bind('touchend',function(){if(parallax.timer){clearTimeout(parallax.timer);}
parallax.timer=setTimeout(function(){parallax.isTouched=false;},1200);});$(window).bind('scroll',function(){parallax.move();});parallax.move();},createResizeListener:function(){var parallax=this;if(parallax.isMobile()){if(!parallax.options.mobile){return;}}
if(!parallax.isMobile()){$(window).bind('resize',function(){parallax.resize();});}
$(window).bind('orientationchange',function(){setTimeout(function(){parallax.resize();},300);});parallax.resize();},move:function(){var parallax=this;if(!parallax.isVisible()){return;}
if(parallax.isMobile()){if(!parallax.options.mobile){return;}}
var st=$(window).scrollTop(),off=parallax.$wrap.offset().top,wh=$(window).height(),h=parallax.$wrap.outerHeight(),ph=parallax.$image.height();var speed=parallax.options.speed;if(speed<0){speed=0;}
if(speed>1){speed=1;}
var step=(st-(off- wh))/ ((off + h) - (off - wh)) * speed;
if(parallax.options.direction=='normal'){var pos=step*(h- ph);}else{var pos=(1- step)*(h- ph);}
if(parallax.isIE()&&parallax.ieVersion()<=10){parallax.$image.css('top',''+ pos+'px');}
else if(parallax.isMobile()&&parallax.options.mobile){if(parallax.isTouched||parallax.isInit){parallax.$image.stop().animate({pos:pos},{step:function(pos){$(this).css('transform','translate3d(0, '+ pos+'px, 0)');},duration:parallax.options.duration},parallax.options.easing);parallax.isInit=false;}}else{parallax.$image.css('transform','translate3d(0, '+ pos+'px, 0)');}
if(parallax.isFirefox()&&window.devicePixelRatio<1){parallax.$image.css('background-color','#010101');setTimeout(function(){parallax.$image.css('background-color',parallax.options.color);},10);}},resize:function(){var parallax=this,h=Math.max($(window).height(),500);if(h<parallax.$wrap.outerHeight()){h=parallax.$wrap.outerHeight()+ $(window).height()*parallax.options.speed;}
parallax.$image.height(h);setTimeout(function(){parallax.move();parallax.blur();},300);},blur:function(){var parallax=this;if(parallax.options.blur&&!parallax.isIE()&&!parallax.options.pattern){$('<img/>',{src:parallax.options.url}).load(function(){var dh=parallax.$image.height()/ this.height,
dw=parallax.$image.width()/ this.width,
blur=Math.floor(Math.max(dh,dw));if(blur>2){parallax.$image.css({'filter':'blur('+ blur+'px)','-webkit-filter':'blur('+ blur+'px)'});}else{parallax.$image.css({'filter':'blur('+ 0+'px)','-webkit-filter':'blur('+ 0+'px)'});}});}},isVisible:function(){var parallax=this,windowScroll=$(window).scrollTop(),windowHeight=$(window).height(),parallaxOffset=parallax.$wrap.offset().top,parallaxHeight=parallax.$wrap.outerHeight();return(parallaxOffset+ parallaxHeight>=windowScroll)&&(parallaxOffset<=windowScroll+ windowHeight)},isIE:function(){if(navigator.appVersion.indexOf("MSIE")!=-1){return true;}
return false;},isMobile:function(){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);},ieVersion:function(){return parseFloat(navigator.appVersion.split("MSIE")[1]);},isFirefox:function(){return typeof InstallTrigger!=='undefined';}};$.fn.rdparallax=function(option){var element=this.each(function(){var options=$.extend({},$.fn.rdparallax.defaults,option);if(options.url){new RDParallax(this,options).init();}else{console.error('RD Parallax: data-url is not defined');}});return element;};$.fn.rdparallax.defaults={speed:0.4,direction:'normal',blur:false,mobile:false,url:false,pattern:false,duration:200,easing:'linear',color:'inherit'};window.RDParallax_autoinit=function(selector){$(selector).each(function(){var options=$.extend({},$.fn.rdparallax.defaults,{url:$(this).data('url'),speed:$(this).data('speed'),direction:$(this).data('direction'),blur:$(this).data('blur'),mobile:$(this).data('mobile'),pattern:$(this).data('pattern'),color:$(this).data('color')});if(options.url){new RDParallax(this,options).init();}else{console.error('RD Parallax: data-url is not defined');}});};})(jQuery);$(document).ready(function(){RDParallax_autoinit('.parallax');});
(function(){var overlay=$('<div id="galleryOverlay">'),slider=$('<div id="gallerySlider">'),prevArrow=$('<a id="prevArrow"></a>'),nextArrow=$('<a id="nextArrow"></a>'),overlayVisible=false;$.fn.touchTouch=function(){var placeholders=$([]),index=0,allitems=this,items=allitems;overlay.hide().appendTo('body');slider.appendTo(overlay);items.each(function(){placeholders=placeholders.add($('<div class="placeholder">'));});slider.append(placeholders).on('click',function(e){if(!$(e.target).is('img')||!$(e.target).hasClass('iframe')){hideOverlay();}});$('body').on('touchstart','#gallerySlider img, #gallerySlider .iframe',function(e){var touch=e.originalEvent,startX=touch.changedTouches[0].pageX;$("body").on('touchmove',function(e){e.preventDefault();touch=e.originalEvent.touches[0]||e.originalEvent.changedTouches[0];if(touch.pageX- startX>10){slider.off('touchmove');showPrevious();}
else if(touch.pageX- startX<-10){slider.off('touchmove');showNext();}});return false;}).on('touchend',function(){$("body").off('touchmove');});items.on('click',function(e){e.preventDefault();var $this=$(this),galleryName,selectorType,$closestGallery=$this.parent().closest('[data-gallery]');if($this.attr('data-gallery')){galleryName=$this.attr('data-gallery');selectorType='item';}else if($closestGallery.length){galleryName=$closestGallery.attr('data-gallery');selectorType='ancestor';}
if(galleryName&&selectorType=='item'){items=$('[data-gallery='+ galleryName+']');}else if(galleryName&&selectorType=='ancestor'){items=items.filter(function(){return $(this).parent().closest('[data-gallery]').length;});}
index=items.index(this);showOverlay(index);showImage(index);preload(index+ 1);preload(index- 1);});overlay.append(prevArrow).append(nextArrow);prevArrow.click(function(e){e.preventDefault();showPrevious();});nextArrow.click(function(e){e.preventDefault();showNext();});$(window).bind('keydown',function(e){if(e.keyCode==37){showPrevious();}
else if(e.keyCode==39){showNext();}
else if(e.keyCode==27){hideOverlay();}});function showOverlay(index){if(overlayVisible){return false;}
overlay.show();setTimeout(function(){overlay.addClass('visible');},100);offsetSlider(index);overlayVisible=true;}
function hideOverlay(){if(!overlayVisible){return false;}
overlay.hide().removeClass('visible');overlayVisible=false;$('.placeholder').empty();items=allitems;}
function offsetSlider(index){slider.css('left',(-index*100)+'%');}
function preload(index){setTimeout(function(){showImage(index);},1000);}
function showImage(index){if(index<0||index>=items.length){return false;}
var href=items.eq(index).attr('href');if(href.match(/(\.jpg)|(\.png)|(\.gif)/i)){loadImage(href,function(){placeholders.eq(index).html(this);});}else{loadIframe(href,function(){placeholders.eq(index).html(this);});}}
function loadImage(src,callback){var img=$('<img/>').on('load',function(){callback.call(img);});img.attr('src',src);}
function loadIframe(src,callback){var iframe=$("<div/>",{"class":"iframe-wrap"}).append($("<div/>",{"class":"iframe"}).append($('<iframe/>',{"src":src,"allowfullscreen":'allowfullscreen'})));callback.call(iframe);}
function showNext(){if(index+ 1<items.length){index++;offsetSlider(index);preload(index+ 1);}
else{slider.addClass('rightSpring');setTimeout(function(){slider.removeClass('rightSpring');},500);}}
function showPrevious(){if(index>0){index--;offsetSlider(index);preload(index- 1);}
else{slider.addClass('leftSpring');setTimeout(function(){slider.removeClass('leftSpring');},500);}}};})(jQuery);
(function($){$.fn.UItoTop=function(options){var defaults={text:'',min:500,scrollSpeed:800,containerID:'toTop',containerClass:'toTop fa fa-chevron-up',easingType:'linear'};var settings=$.extend(defaults,options);var containerIDhash='#'+ settings.containerID;var containerHoverIDHash='#'+settings.containerHoverID;$('body').append('<a href="#" id="'+settings.containerID+'" class="'+settings.containerClass+'" >'+settings.text+'</a>');$(containerIDhash).hide().click(function(){$('html, body').stop().animate({scrollTop:0},settings.scrollSpeed,settings.easingType);$('#'+settings.containerHoverID,this).stop().animate({'opacity':0},settings.inDelay,settings.easingType);return false;})
$(window).scroll(function(){var sd=$(window).scrollTop();if(typeof document.body.style.maxHeight==="undefined"){$(containerIDhash).css({'position':'absolute','top':$(window).scrollTop()+ $(window).height()- 50});}
if(sd>settings.min)
$(containerIDhash).stop(true,true).fadeIn(600);else
$(containerIDhash).fadeOut(800);});};})(jQuery);


window.google = window.google || {};
google.maps = google.maps || {};
(function() {
  
  function getScript(src) {
    document.write('<' + 'script src="' + src + '"><' + '/script>');
  }
  
  var modules = google.maps.modules = {};
  google.maps.__gjsload__ = function(name, text) {
    modules[name] = text;
  };
  
  google.maps.Load = function(apiLoad) {
    delete google.maps.Load;
    apiLoad([0.009999999776482582,[null,[["https://khms0.googleapis.com/kh?v=713\u0026hl=fr-FR\u0026","https://khms1.googleapis.com/kh?v=713\u0026hl=fr-FR\u0026"],null,null,null,1,"713",["https://khms0.google.com/kh?v=713\u0026hl=fr-FR\u0026","https://khms1.google.com/kh?v=713\u0026hl=fr-FR\u0026"]],null,null,null,null,[["https://cbks0.googleapis.com/cbk?","https://cbks1.googleapis.com/cbk?"]],[["https://khms0.googleapis.com/kh?v=102\u0026hl=fr-FR\u0026","https://khms1.googleapis.com/kh?v=102\u0026hl=fr-FR\u0026"],null,null,null,null,"102",["https://khms0.google.com/kh?v=102\u0026hl=fr-FR\u0026","https://khms1.google.com/kh?v=102\u0026hl=fr-FR\u0026"]],[["https://mts0.googleapis.com/mapslt?hl=fr-FR\u0026","https://mts1.googleapis.com/mapslt?hl=fr-FR\u0026"]],null,null,null,[["https://mts0.googleapis.com/mapslt?hl=fr-FR\u0026","https://mts1.googleapis.com/mapslt?hl=fr-FR\u0026"]]],["fr-FR","US",null,0,null,null,"https://maps.gstatic.com/mapfiles/","https://csi.gstatic.com","https://maps.googleapis.com","https://maps.googleapis.com",null,"https://maps.google.com","https://gg.google.com","https://maps.gstatic.com/maps-api-v3/api/images/","https://www.google.com/maps",0,"https://www.google.com"],["https://maps.google.com/maps-api-v3/api/js/27/9/intl/fr_ALL","3.27.9"],[162160287],1,null,null,null,null,null,"",null,null,1,"https://khms.googleapis.com/mz?v=713\u0026",null,"https://earthbuilder.googleapis.com","https://earthbuilder.googleapis.com",null,"https://mts.googleapis.com/maps/vt/icon",[["https://maps.google.com/maps/vt"],["https://maps.google.com/maps/vt"],null,null,null,null,null,null,null,null,null,null,["https://www.google.com/maps/vt"],"/maps/vt",372000000,372],2,500,[null,null,null,null,"https://www.google.com/maps/preview/log204","","https://static.panoramio.com.storage.googleapis.com/photos/",["https://geo0.ggpht.com/cbk","https://geo1.ggpht.com/cbk","https://geo2.ggpht.com/cbk","https://geo3.ggpht.com/cbk"],"https://maps.googleapis.com/maps/api/js/GeoPhotoService.GetMetadata","https://maps.googleapis.com/maps/api/js/GeoPhotoService.SingleImageSearch",["https://lh3.ggpht.com/","https://lh4.ggpht.com/","https://lh5.ggpht.com/","https://lh6.ggpht.com/"]],["https://www.google.com/maps/api/js/master?pb=!1m2!1u27!2s9!2sfr-FR!3sUS!4s27/9/intl/fr_ALL","https://www.google.com/maps/api/js/widget?pb=!1m2!1u27!2s9!2sfr-FR"],null,0,null,"/maps/api/js/ApplicationService.GetEntityDetails",0,null,null,[null,null,null,null,null,null,null,null,null,[0,0]],null,[],["27.9"]], loadScriptTime);
  };
  var loadScriptTime = (new Date).getTime();
})();
// inlined
(function(_){var Ia,Ja,Oa,Ra,ib,pb,qb,rb,sb,wb,xb,Ab,Db,zb,Eb,Ib,Qb,Wb,Xb,$b,cc,dc,fc,hc,jc,ec,gc,lc,rc,sc,xc,Lc,Oc,Uc,Tc,Vc,Wc,Xc,Yc,Zc,dd,hd,jd,ld,nd,od,Cd,Ed,Dd,Id,Jd,Nd,Od,Xd,ee,fe,ge,ue,we,ye,Be,De,Ce,Ee,Je,Ke,Le,Me,Ne,Re,Se,Te,Xe,$e,bf,cf,df,ef,ff,gf,hf,kf,lf,mf,sf,uf,Ef,Ff,Gf,Hf,If,Jf,Lf,Uf,Vf,Wf,Xf,bg,dg,mg,ng,ug,sg,vg,wg,Ag,Dg,Eg,Ig,Jg,Mg,Ng,Og,Tg,Ug,Fa,Ga;_.ba="ERROR";_.ca="INVALID_REQUEST";_.da="MAX_DIMENSIONS_EXCEEDED";_.ea="MAX_ELEMENTS_EXCEEDED";_.fa="MAX_WAYPOINTS_EXCEEDED";_.ha="NOT_FOUND";
_.ia="OK";_.ja="OVER_QUERY_LIMIT";_.ka="REQUEST_DENIED";_.la="UNKNOWN_ERROR";_.ma="ZERO_RESULTS";_.na=function(){return function(a){return a}};_.oa=function(){return function(){}};_.pa=function(a){return function(b){this[a]=b}};_.qa=function(a){return function(){return this[a]}};_.ra=function(a){return function(){return a}};_.ta=function(a){return function(){return _.sa[a].apply(this,arguments)}};_.m=function(a){return void 0!==a};_.ua=_.oa();
_.va=function(a){a.Ia=void 0;a.zb=function(){return a.Ia?a.Ia:a.Ia=new a}};
_.wa=function(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b};_.xa=function(a){return"array"==_.wa(a)};_.ya=function(a){var b=_.wa(a);return"array"==b||"object"==b&&"number"==typeof a.length};_.za=function(a){return"string"==typeof a};_.Aa=function(a){return"number"==typeof a};_.Ba=function(a){return"function"==_.wa(a)};_.Ca=function(a){var b=typeof a;return"object"==b&&null!=a||"function"==b};_.Ha=function(a){return a[Fa]||(a[Fa]=++Ga)};
Ia=function(a,b,c){return a.call.apply(a.bind,arguments)};Ja=function(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}};_.p=function(a,b,c){_.p=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?Ia:Ja;return _.p.apply(null,arguments)};_.Ka=function(){return+new Date};
_.t=function(a,b){function c(){}c.prototype=b.prototype;a.Jb=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.xg=function(a,c,f){for(var d=Array(arguments.length-2),e=2;e<arguments.length;e++)d[e-2]=arguments[e];b.prototype[c].apply(a,d)}};_.La=function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")};_.Na=function(){return-1!=_.Ma.toLowerCase().indexOf("webkit")};
_.Pa=function(a,b){var c=0;a=_.La(String(a)).split(".");b=_.La(String(b)).split(".");for(var d=Math.max(a.length,b.length),e=0;0==c&&e<d;e++){var f=a[e]||"",g=b[e]||"";do{f=/(\d*)(\D*)(.*)/.exec(f)||["","","",""];g=/(\d*)(\D*)(.*)/.exec(g)||["","","",""];if(0==f[0].length&&0==g[0].length)break;c=Oa(0==f[1].length?0:(0,window.parseInt)(f[1],10),0==g[1].length?0:(0,window.parseInt)(g[1],10))||Oa(0==f[2].length,0==g[2].length)||Oa(f[2],g[2]);f=f[3];g=g[3]}while(0==c)}return c};
Oa=function(a,b){return a<b?-1:a>b?1:0};_.Qa=function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(_.za(a))return _.za(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1};_.v=function(a,b,c){for(var d=a.length,e=_.za(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)};Ra=function(a,b){for(var c=a.length,d=_.za(a)?a.split(""):a,e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a))return e;return-1};
_.Ta=function(a,b){b=_.Qa(a,b);var c;(c=0<=b)&&_.Sa(a,b);return c};_.Sa=function(a,b){Array.prototype.splice.call(a,b,1)};_.Ua=function(a,b,c){return 2>=arguments.length?Array.prototype.slice.call(a,b):Array.prototype.slice.call(a,b,c)};_.w=function(a){return a?a.length:0};_.Wa=function(a,b){_.Va(b,function(c){a[c]=b[c]})};_.Xa=function(a){for(var b in a)return!1;return!0};_.Ya=function(a,b,c){null!=b&&(a=Math.max(a,b));null!=c&&(a=Math.min(a,c));return a};
_.Za=function(a,b,c){c-=b;return((a-b)%c+c)%c+b};_.$a=function(a,b,c){return Math.abs(a-b)<=(c||1E-9)};_.ab=function(a,b){for(var c=[],d=_.w(a),e=0;e<d;++e)c.push(b(a[e],e));return c};_.cb=function(a,b){for(var c=_.bb(void 0,_.w(b)),d=_.bb(void 0,0);d<c;++d)a.push(b[d])};_.x=function(a){return"number"==typeof a};_.db=function(a){return"object"==typeof a};_.bb=function(a,b){return null==a?b:a};_.eb=function(a){return"string"==typeof a};_.fb=function(a){return a===!!a};
_.Va=function(a,b){for(var c in a)b(c,a[c])};_.hb=function(a){return function(){var b=this,c=arguments;_.gb(function(){a.apply(b,c)})}};_.gb=function(a){return window.setTimeout(a,0)};ib=function(a,b){if(Object.prototype.hasOwnProperty.call(a,b))return a[b]};_.kb=function(a){window.console&&window.console.error&&window.console.error(a)};_.nb=function(a){a=a||window.event;_.lb(a);_.mb(a)};_.lb=function(a){a.cancelBubble=!0;a.stopPropagation&&a.stopPropagation()};
_.mb=function(a){a.preventDefault&&_.m(a.defaultPrevented)?a.preventDefault():a.returnValue=!1};_.ob=function(a){a.handled=!0;_.m(a.bubbles)||(a.returnValue="handled")};pb=function(a,b){a.__e3_||(a.__e3_={});a=a.__e3_;a[b]||(a[b]={});return a[b]};qb=function(a,b){var c=a.__e3_||{};if(b)a=c[b]||{};else for(b in a={},c)_.Wa(a,c[b]);return a};rb=function(a,b){return function(c){return b.call(a,c,this)}};
sb=function(a,b,c){return function(d){var e=[b,a];_.cb(e,arguments);_.z.trigger.apply(this,e);c&&_.ob.apply(null,arguments)}};wb=function(a,b,c,d){this.Ia=a;this.f=b;this.b=c;this.j=null;this.l=d;this.id=++tb;pb(a,b)[this.id]=this;ub&&"tagName"in a&&(vb[this.id]=this)};
xb=function(a){return a.j=function(b){b||(b=window.event);if(b&&!b.target)try{b.target=b.srcElement}catch(d){}var c;c=a.b.apply(a.Ia,[b]);return b&&"click"==b.type&&(b=b.srcElement)&&"A"==b.tagName&&"javascript:void(0)"==b.href?!1:c}};_.yb=function(a){return""+(_.Ca(a)?_.Ha(a):a)};_.A=_.oa();Ab=function(a,b){var c=b+"_changed";if(a[c])a[c]();else a.changed(b);var c=zb(a,b),d;for(d in c){var e=c[d];Ab(e.Bc,e.ab)}_.z.trigger(a,b.toLowerCase()+"_changed")};
_.Cb=function(a){return Bb[a]||(Bb[a]=a.substr(0,1).toUpperCase()+a.substr(1))};Db=function(a){a.gm_accessors_||(a.gm_accessors_={});return a.gm_accessors_};zb=function(a,b){a.gm_bindings_||(a.gm_bindings_={});a.gm_bindings_.hasOwnProperty(b)||(a.gm_bindings_[b]={});return a.gm_bindings_[b]};Eb=function(a){this.message=a;this.name="InvalidValueError";this.stack=Error().stack};_.Fb=function(a,b){var c="";if(null!=b){if(!(b instanceof Eb))return b;c=": "+b.message}return new Eb(a+c)};
_.Gb=function(a){if(!(a instanceof Eb))throw a;_.kb(a.name+": "+a.message)};_.Hb=function(a,b){var c;c=c?c+": ":"";return function(d){if(!d||!_.db(d))throw _.Fb(c+"not an Object");var e={},f;for(f in d)if(e[f]=d[f],!b&&!a[f])throw _.Fb(c+"unknown property "+f);for(f in a)try{var g=a[f](e[f]);if(_.m(g)||Object.prototype.hasOwnProperty.call(d,f))e[f]=a[f](e[f])}catch(h){throw _.Fb(c+"in property "+f,h);}return e}};Ib=function(a){try{return!!a.cloneNode}catch(b){return!1}};
_.Jb=function(a,b,c){return c?function(c){if(c instanceof a)return c;try{return new a(c)}catch(e){throw _.Fb("when calling new "+b,e);}}:function(c){if(c instanceof a)return c;throw _.Fb("not an instance of "+b);}};_.Kb=function(a){return function(b){for(var c in a)if(a[c]==b)return b;throw _.Fb(b);}};_.Lb=function(a){return function(b){if(!_.xa(b))throw _.Fb("not an Array");return _.ab(b,function(b,d){try{return a(b)}catch(e){throw _.Fb("at index "+d,e);}})}};
_.Mb=function(a,b){return function(c){if(a(c))return c;throw _.Fb(b||""+c);}};_.Nb=function(a){return function(b){for(var c=[],d=0,e=a.length;d<e;++d){var f=a[d];try{(f.Yf||f)(b)}catch(g){if(!(g instanceof Eb))throw g;c.push(g.message);continue}return(f.then||f)(b)}throw _.Fb(c.join("; and "));}};_.Ob=function(a,b){return function(c){return b(a(c))}};_.Pb=function(a){return function(b){return null==b?b:a(b)}};
Qb=function(a){return function(b){if(b&&null!=b[a])return b;throw _.Fb("no "+a+" property");}};_.Rb=function(a){return a*Math.PI/180};_.Sb=function(a){return 180*a/Math.PI};_.E=function(a,b,c){if(a&&(void 0!==a.lat||void 0!==a.lng))try{Tb(a),b=a.lng,a=a.lat,c=!1}catch(d){_.Gb(d)}a-=0;b-=0;c||(a=_.Ya(a,-90,90),180!=b&&(b=_.Za(b,-180,180)));this.lat=function(){return a};this.lng=function(){return b}};_.Ub=function(a){return _.Rb(a.lat())};_.Vb=function(a){return _.Rb(a.lng())};
Wb=function(a,b){b=Math.pow(10,b);return Math.round(a*b)/b};Xb=_.oa();_.Yb=function(a){try{if(a instanceof _.E)return a;a=Tb(a);return new _.E(a.lat,a.lng)}catch(b){throw _.Fb("not a LatLng or LatLngLiteral",b);}};_.Zb=function(a){this.b=_.Yb(a)};$b=function(a){if(a instanceof Xb)return a;try{return new _.Zb(_.Yb(a))}catch(b){}throw _.Fb("not a Geometry or LatLng or LatLngLiteral object");};_.ac=function(a,b){if(a)return function(){--a||b()};b();return _.ua};
_.bc=function(a,b,c){var d=a.getElementsByTagName("head")[0];a=a.createElement("script");a.type="text/javascript";a.charset="UTF-8";a.src=b;c&&(a.onerror=c);d.appendChild(a);return a};cc=function(a){for(var b="",c=0,d=arguments.length;c<d;++c){var e=arguments[c];e.length&&"/"==e[0]?b=e:(b&&"/"!=b[b.length-1]&&(b+="/"),b+=e)}return b};dc=function(a){this.j=window.document;this.b={};this.f=a};fc=function(){this.l={};this.f={};this.m={};this.b={};this.j=new ec};
hc=function(a,b){a.l[b]||(a.l[b]=!0,gc(a.j,function(c){for(var d=c.wh[b],e=d?d.length:0,f=0;f<e;++f){var g=d[f];a.b[g]||hc(a,g)}c=c.tm;c.b[b]||_.bc(c.j,cc(c.f,b)+".js")}))};jc=function(a,b){var c=ic;this.tm=a;this.wh=c;a={};for(var d in c)for(var e=c[d],f=0,g=e.length;f<g;++f){var h=e[f];a[h]||(a[h]=[]);a[h].push(d)}this.Fn=a;this.Jk=b};ec=function(){this.b=[]};gc=function(a,b){a.f?b(a.f):a.b.push(b)};_.F=function(a,b,c){var d=fc.zb();a=""+a;d.b[a]?b(d.b[a]):((d.f[a]=d.f[a]||[]).push(b),c||hc(d,a))};
_.kc=function(a,b){fc.zb().b[""+a]=b};lc=function(a,b,c){var d=[],e=_.ac(a.length,function(){b.apply(null,d)});_.v(a,function(a,b){_.F(a,function(a){d[b]=a;e()},c)})};_.mc=function(a){a=a||{};this.j=a.id;this.b=null;try{this.b=a.geometry?$b(a.geometry):null}catch(b){_.Gb(b)}this.f=a.properties||{}};_.I=function(a,b){this.x=a;this.y=b};rc=function(a){if(a instanceof _.I)return a;try{_.Hb({x:_.nc,y:_.nc},!0)(a)}catch(b){throw _.Fb("not a Point",b);}return new _.I(a.x,a.y)};
_.J=function(a,b,c,d){this.width=a;this.height=b;this.j=c||"px";this.f=d||"px"};sc=function(a){if(a instanceof _.J)return a;try{_.Hb({height:_.nc,width:_.nc},!0)(a)}catch(b){throw _.Fb("not a Size",b);}return new _.J(a.width,a.height)};_.tc=function(a){return function(){return this.get(a)}};_.uc=function(a,b){return b?function(c){try{this.set(a,b(c))}catch(d){_.Gb(_.Fb("set"+_.Cb(a),d))}}:function(b){this.set(a,b)}};
_.wc=function(a,b){_.Va(b,function(b,d){var c=_.tc(b);a["get"+_.Cb(b)]=c;d&&(d=_.uc(b,d),a["set"+_.Cb(b)]=d)})};_.yc=function(a){this.b=a||[];xc(this)};xc=function(a){a.set("length",a.b.length)};_.zc=function(a){this.j=a||_.yb;this.f={}};_.Ac=function(a,b){var c=a.f,d=a.j(b);c[d]||(c[d]=b,_.z.trigger(a,"insert",b),a.b&&a.b(b))};_.Bc=_.pa("b");_.Cc=function(a,b,c){this.heading=a;this.pitch=_.Ya(b,-90,90);this.zoom=Math.max(0,c)};_.Dc=function(){this.__gm=new _.A;this.m=null};_.Hc=_.na();
_.Ic=function(a,b,c){for(var d in a)b.call(c,a[d],d,a)};_.Jc=function(a){return-1!=_.Ma.indexOf(a)};_.Kc=function(){return _.Jc("Trident")||_.Jc("MSIE")};_.Mc=function(){return _.Jc("Safari")&&!(Lc()||_.Jc("Coast")||_.Jc("Opera")||_.Jc("Edge")||_.Jc("Silk")||_.Jc("Android"))};Lc=function(){return(_.Jc("Chrome")||_.Jc("CriOS"))&&!_.Jc("Edge")};Oc=function(a){_.Nc.setTimeout(function(){throw a;},0)};
Uc=function(){var a=_.Qc.f,a=Rc(a);!_.Ba(_.Nc.setImmediate)||_.Nc.Window&&_.Nc.Window.prototype&&!_.Jc("Edge")&&_.Nc.Window.prototype.setImmediate==_.Nc.setImmediate?(Sc||(Sc=Tc()),Sc(a)):_.Nc.setImmediate(a)};
Tc=function(){var a=_.Nc.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&!_.Jc("Presto")&&(a=function(){var a=window.document.createElement("IFRAME");a.style.display="none";a.src="";window.document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=(0,_.p)(function(a){if(("*"==
d||a.origin==d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&!_.Kc()){var b=new a,c={},d=c;b.port1.onmessage=function(){if(_.m(c.next)){c=c.next;var a=c.Dg;c.Dg=null;a()}};return function(a){d.next={Dg:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof window.document&&"onreadystatechange"in window.document.createElement("SCRIPT")?function(a){var b=window.document.createElement("SCRIPT");
b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};window.document.documentElement.appendChild(b)}:function(a){_.Nc.setTimeout(a,0)}};Vc=function(a,b,c){this.l=c;this.j=a;this.m=b;this.f=0;this.b=null};Wc=function(){this.f=this.b=null};Xc=function(){this.next=this.b=this.yc=null};_.Qc=function(a,b){_.Qc.b||_.Qc.m();_.Qc.j||(_.Qc.b(),_.Qc.j=!0);_.Qc.l.add(a,b)};Yc=function(a,b){return function(c){return c.yc==a&&c.context==(b||null)}};
Zc=function(a){this.P=[];this.b=a&&a.gd||_.ua;this.f=a&&a.jd||_.ua};_.ad=function(a,b,c,d){function e(){_.v(f,function(a){b.call(c||null,function(b){if(a.once){if(a.once.Bg)return;a.once.Bg=!0;_.Ta(g.P,a);g.P.length||g.b()}a.yc.call(a.context,b)})})}var f=a.P.slice(0),g=a;d&&d.ao?e():$c(e)};_.bd=function(){this.P=new Zc({gd:(0,_.p)(this.gd,this),jd:(0,_.p)(this.jd,this)})};_.cd=function(){_.bd.call(this)};_.gd=function(a){return new dd(a)};dd=function(a){_.bd.call(this);this.b=a};hd=_.oa();
jd=function(a){var b=a;if(a instanceof Array)b=Array(a.length),_.id(b,a);else if(a instanceof Object){var c=b={},d;for(d in a)a.hasOwnProperty(d)&&(c[d]=jd(a[d]))}return b};_.id=function(a,b){for(var c=0;c<b.length;++c)b.hasOwnProperty(c)&&(a[c]=jd(b[c]))};_.kd=function(a,b){a[b]||(a[b]=[]);return a[b]};
_.md=function(a,b){if(null==a||null==b)return null==a==(null==b);if(a.constructor!=Array&&a.constructor!=Object)throw Error("Invalid object type passed into JsProto.areObjectsEqual()");if(a===b)return!0;if(a.constructor!=b.constructor)return!1;for(var c in a)if(!(c in b&&ld(a[c],b[c])))return!1;for(var d in b)if(!(d in a))return!1;return!0};
ld=function(a,b){if(a===b||!(!0!==a&&1!==a||!0!==b&&1!==b)||!(!1!==a&&0!==a||!1!==b&&0!==b))return!0;if(a instanceof Object&&b instanceof Object){if(!_.md(a,b))return!1}else return!1;return!0};nd=function(a,b,c,d){this.type=a;this.label=b;this.Qk=c;this.wc=d||null};od=function(a){switch(a){case "d":case "f":case "i":case "j":case "u":case "v":case "x":case "y":case "g":case "h":case "n":case "o":case "e":return 0;case "s":case "z":case "B":return"";case "b":return!1;default:return null}};
_.pd=function(a,b,c){return new nd(a,1,_.m(b)?b:od(a),c)};_.qd=function(a,b,c){return new nd(a,2,_.m(b)?b:od(a),c)};_.rd=function(a,b,c){return new nd(a,3,c,b)};_.sd=function(a){return _.pd("i",a)};_.td=function(a){return _.pd("v",a)};_.wd=function(a){return _.pd("b",a)};_.xd=function(a){return _.pd("e",a)};_.K=function(a,b){return _.pd("m",a,b)};_.M=function(a){this.data=a||[]};_.yd=function(a,b,c){a=a.data[b];return null!=a?a:c};_.N=function(a,b,c){return _.yd(a,b,c||0)};
_.P=function(a,b,c){return _.yd(a,b,c||"")};_.Q=function(a,b){var c=a.data[b];c||(c=a.data[b]=[]);return c};_.zd=function(a,b){return _.kd(a.data,b)};_.Ad=function(a,b,c){return _.zd(a,b)[c]};_.Bd=function(a,b){return a.data[b]?a.data[b].length:0};Cd=_.oa();Ed=function(a,b,c){for(var d=1;d<b.A.length;++d){var e=b.A[d],f=a[d+(b.b||0)];if(e&&null!=f)if(3==e.label)for(var g=0;g<f.length;++g)Dd(f[g],d,e,c);else Dd(f,d,e,c)}};
Dd=function(a,b,c,d){if("m"==c.type){var e=d.length;Ed(a,c.wc,d);d.splice(e,0,[b,"m",d.length-e].join(""))}else"b"==c.type&&(a=a?"1":"0"),d.push([b,c.type,(0,window.encodeURIComponent)(a)].join(""))};_.Fd=function(){return _.Jc("iPhone")&&!_.Jc("iPod")&&!_.Jc("iPad")};_.Gd=function(a){_.Gd[" "](a);return a};Id=function(a,b){var c=Hd;return Object.prototype.hasOwnProperty.call(c,a)?c[a]:c[a]=b(a)};Jd=function(){var a=_.Nc.document;return a?a.documentMode:void 0};
_.Ld=function(a){return Id(a,function(){return 0<=_.Pa(_.Kd,a)})};_.Md=function(a,b){this.f=a||0;this.j=b||0};Nd=_.oa();Od=function(a,b){-180==a&&180!=b&&(a=180);-180==b&&180!=a&&(b=180);this.b=a;this.f=b};_.Pd=function(a){return a.b>a.f};_.Ud=function(a,b){return 1E-9>=Math.abs(b.b-a.b)%360+Math.abs(_.Td(b)-_.Td(a))};_.Vd=function(a,b){var c=b-a;return 0<=c?c:b+180-(a-180)};_.Td=function(a){return a.isEmpty()?0:_.Pd(a)?360-(a.b-a.f):a.f-a.b};
_.Wd=function(a){var b=(a.b+a.f)/2;_.Pd(a)&&(b=_.Za(b+180,-180,180));return b};Xd=function(a,b){this.f=a;this.b=b};_.Yd=function(a){return a.isEmpty()?0:a.b-a.f};_.Zd=function(a){return(a.b+a.f)/2};_.$d=function(a,b){a=a&&_.Yb(a);b=b&&_.Yb(b);if(a){b=b||a;var c=_.Ya(a.lat(),-90,90),d=_.Ya(b.lat(),-90,90);this.f=new Xd(c,d);a=a.lng();b=b.lng();360<=b-a?this.b=new Od(-180,180):(a=_.Za(a,-180,180),b=_.Za(b,-180,180),this.b=new Od(a,b))}else this.f=new Xd(1,-1),this.b=new Od(180,-180)};
_.ae=function(a,b,c,d){return new _.$d(new _.E(a,b,!0),new _.E(c,d,!0))};_.ce=function(a){if(a instanceof _.$d)return a;try{return a=be(a),_.ae(a.south,a.west,a.north,a.east)}catch(b){throw _.Fb("not a LatLngBounds or LatLngBoundsLiteral",b);}};_.de=_.pa("__gm");ee=function(){this.b={};this.j={};this.f={}};fe=function(){this.b={}};ge=function(a){this.b=new fe;var b=this;_.z.addListenerOnce(a,"addfeature",function(){_.F("data",function(c){c.b(b,a,b.b)})})};_.ie=function(a){this.b=[];try{this.b=he(a)}catch(b){_.Gb(b)}};
_.ke=function(a){this.b=(0,_.je)(a)};_.me=function(a){this.b=le(a)};_.ne=function(a){this.b=(0,_.je)(a)};_.oe=function(a){this.b=(0,_.je)(a)};_.re=function(a){this.b=pe(a)};_.te=function(a){this.b=se(a)};ue=function(a){a=a||{};a.clickable=_.bb(a.clickable,!0);a.visible=_.bb(a.visible,!0);this.setValues(a);_.F("marker",_.ua)};we=function(a){var b=ve,c=fc.zb().j;a=c.f=new jc(new dc(a),b);for(var b=0,d=c.b.length;b<d;++b)c.b[b](a);c.b.length=0};
_.xe=function(a){this.__gm={set:null,Td:null};ue.call(this,a)};ye=function(a){a=a||{};a.visible=_.bb(a.visible,!0);return a};_.ze=function(a){return a&&a.radius||6378137};Be=function(a){return a instanceof _.yc?Ae(a):new _.yc((0,_.je)(a))};De=function(a){var b;_.xa(a)||a instanceof _.yc?0==_.w(a)?b=!0:(b=a instanceof _.yc?a.getAt(0):a[0],b=_.xa(b)||b instanceof _.yc):b=!1;return b?a instanceof _.yc?Ce(Ae)(a):new _.yc(_.Lb(Be)(a)):new _.yc([Be(a)])};
Ce=function(a){return function(b){if(!(b instanceof _.yc))throw _.Fb("not an MVCArray");b.forEach(function(b,d){try{a(b)}catch(e){throw _.Fb("at index "+d,e);}});return b}};Ee=function(a){this.set("latLngs",new _.yc([new _.yc]));this.setValues(ye(a));_.F("poly",_.ua)};_.Fe=function(a){Ee.call(this,a)};_.Ge=function(a){Ee.call(this,a)};
_.He=function(a,b,c){function d(a){if(!a)throw _.Fb("not a Feature");if("Feature"!=a.type)throw _.Fb('type != "Feature"');var b=a.geometry;try{b=null==b?null:e(b)}catch(H){throw _.Fb('in property "geometry"',H);}var d=a.properties||{};if(!_.db(d))throw _.Fb("properties is not an Object");var f=c.idPropertyName;a=f?d[f]:a.id;if(null!=a&&!_.x(a)&&!_.eb(a))throw _.Fb((f||"id")+" is not a string or number");return{id:a,geometry:b,properties:d}}function e(a){if(null==a)throw _.Fb("is null");var b=(a.type+
"").toLowerCase(),c=a.coordinates;try{switch(b){case "point":return new _.Zb(h(c));case "multipoint":return new _.ne(n(c));case "linestring":return g(c);case "multilinestring":return new _.me(q(c));case "polygon":return f(c);case "multipolygon":return new _.te(u(c))}}catch(L){throw _.Fb('in property "coordinates"',L);}if("geometrycollection"==b)try{return new _.ie(y(a.geometries))}catch(L){throw _.Fb('in property "geometries"',L);}throw _.Fb("invalid type");}function f(a){return new _.re(r(a))}function g(a){return new _.ke(n(a))}
function h(a){a=l(a);return _.Yb({lat:a[1],lng:a[0]})}if(!b)return[];c=c||{};var l=_.Lb(_.nc),n=_.Lb(h),q=_.Lb(g),r=_.Lb(function(a){a=n(a);if(!a.length)throw _.Fb("contains no elements");if(!a[0].b(a[a.length-1]))throw _.Fb("first and last positions are not equal");return new _.oe(a.slice(0,-1))}),u=_.Lb(f),y=_.Lb(e),B=_.Lb(d);if("FeatureCollection"==b.type){b=b.features;try{return _.ab(B(b),function(b){return a.add(b)})}catch(D){throw _.Fb('in property "features"',D);}}if("Feature"==b.type)return[a.add(d(b))];
throw _.Fb("not a Feature or FeatureCollection");};Je=function(a){var b=this;a=a||{};this.setValues(a);this.b=new ee;_.z.forward(this.b,"addfeature",this);_.z.forward(this.b,"removefeature",this);_.z.forward(this.b,"setgeometry",this);_.z.forward(this.b,"setproperty",this);_.z.forward(this.b,"removeproperty",this);this.f=new ge(this.b);this.f.bindTo("map",this);this.f.bindTo("style",this);_.v(_.Ie,function(a){_.z.forward(b.f,a,b)});this.j=!1};Ke=function(a){a.j||(a.j=!0,_.F("drawing_impl",function(b){b.Pl(a)}))};
Le=function(a){if(!a)return null;var b;_.za(a)?(b=window.document.createElement("div"),b.style.overflow="auto",b.innerHTML=a):a.nodeType==window.Node.TEXT_NODE?(b=window.document.createElement("div"),b.appendChild(a)):b=a;return b};
Me=function(a,b){this.b=a;this.f=b;a.addListener("map_changed",(0,_.p)(this.Lm,this));this.bindTo("map",a);this.bindTo("disableAutoPan",a);this.bindTo("maxWidth",a);this.bindTo("position",a);this.bindTo("zIndex",a);this.bindTo("internalAnchor",a,"anchor");this.bindTo("internalContent",a,"content");this.bindTo("internalPixelOffset",a,"pixelOffset")};Ne=function(a,b,c,d){c?a.bindTo(b,c,d):(a.unbind(b),a.set(b,void 0))};
_.Oe=function(a){function b(){e||(e=!0,_.F("infowindow",function(a){a.mk(d)}))}window.setTimeout(function(){_.F("infowindow",_.ua)},100);a=a||{};var c=!!a.b;delete a.b;var d=new Me(this,c),e=!1;_.z.addListenerOnce(this,"anchor_changed",b);_.z.addListenerOnce(this,"map_changed",b);this.setValues(a)};_.Qe=function(a){_.Pe&&a&&_.Pe.push(a)};Re=function(a){this.setValues(a)};Se=_.oa();Te=_.oa();Xe=_.oa();_.Ye=function(){_.F("geocoder",_.ua)};
_.Ze=function(a,b,c){this.H=null;this.set("url",a);this.set("bounds",_.Pb(_.ce)(b));this.setValues(c)};$e=function(a,b){_.eb(a)?(this.set("url",a),this.setValues(b)):this.setValues(a)};_.af=function(){var a=this;_.F("layers",function(b){b.b(a)})};bf=function(a){this.setValues(a);var b=this;_.F("layers",function(a){a.f(b)})};cf=function(){var a=this;_.F("layers",function(b){b.j(a)})};df=function(a){this.data=a||[]};ef=function(a){this.data=a||[]};ff=function(a){this.data=a||[]};
gf=function(a){this.data=a||[]};hf=function(a){this.data=a||[]};_.jf=function(a){this.data=a||[]};kf=function(a){this.data=a||[]};lf=function(a){this.data=a||[]};mf=function(a){this.data=a||[]};_.nf=function(a){return _.P(a,0)};_.of=function(a){return _.P(a,1)};_.pf=function(a){return new hf(a.data[2])};
sf=function(a,b){_.Dc.call(this);_.Qe(a);this.__gm=new _.A;this.j=null;b&&b.client&&(this.j=_.qf[b.client]||null);var c=this.controls=[];_.Va(_.rf,function(a,b){c[b]=new _.yc});this.l=!0;this.f=a;this.B=!1;this.__gm.da=b&&b.da||new _.zc;this.set("standAlone",!0);this.setPov(new _.Cc(0,0,1));b&&b.ld&&!_.x(b.ld.zoom)&&(b.ld.zoom=_.x(b.zoom)?b.zoom:1);this.setValues(b);void 0==this.getVisible()&&this.setVisible(!0);_.z.addListenerOnce(this,"pano_changed",_.hb(function(){_.F("marker",(0,_.p)(function(a){a.b(this.__gm.da,
this)},this))}))};_.tf=function(){this.l=[];this.j=this.b=this.f=null};uf=function(a,b,c,d){this.R=b;this.b=_.gd(new _.Bc([]));this.B=new _.zc;new _.yc;this.D=new _.zc;this.F=new _.zc;this.l=new _.zc;var e=this.da=new _.zc;e.b=function(){delete e.b;_.F("marker",_.hb(function(b){b.b(e,a)}))};this.j=new sf(c,{visible:!1,enableCloseButton:!0,da:e});this.j.bindTo("reportErrorControl",a);this.j.l=!1;this.f=new _.tf;this.S=d};_.vf=function(){this.P=new Zc};
_.wf=function(){this.b=new _.I(128,128);this.j=256/360;this.l=256/(2*Math.PI);this.f=!0};_.xf=function(a){this.J=this.I=window.Infinity;this.M=this.L=-window.Infinity;_.v(a||[],this.extend,this)};_.yf=function(a,b,c,d){var e=new _.xf;e.I=a;e.J=b;e.L=c;e.M=d;return e};_.zf=function(a,b,c){if(a=a.fromLatLngToPoint(b))c=Math.pow(2,c),a.x*=c,a.y*=c;return a};
_.Af=function(a,b){var c=a.lat()+_.Sb(b);90<c&&(c=90);var d=a.lat()-_.Sb(b);-90>d&&(d=-90);b=Math.sin(b);var e=Math.cos(_.Rb(a.lat()));if(90==c||-90==d||1E-6>e)return new _.$d(new _.E(d,-180),new _.E(c,180));b=_.Sb(Math.asin(b/e));return new _.$d(new _.E(d,a.lng()-b),new _.E(c,a.lng()+b))};_.Bf=function(a){this.Ci=a||0;_.z.bind(this,"forceredraw",this,this.B)};_.Cf=function(a,b){a=a.style;a.width=b.width+b.j;a.height=b.height+b.f};_.Df=function(a){return new _.J(a.offsetWidth,a.offsetHeight)};
Ef=function(a){this.data=a||[]};Ff=function(a){this.data=a||[]};Gf=function(a){this.data=a||[]};Hf=function(a){this.data=a||[]};If=function(a){this.data=a||[]};Jf=function(a,b,c,d){_.Bf.call(this);this.m=b;this.l=new _.wf;this.C=c+"/maps/api/js/StaticMapService.GetMapImage";this.f=this.b=null;this.j=d;this.set("div",a);this.set("loading",!0)};Lf=function(a){var b=a.get("tilt")||_.w(a.get("styles"));a=a.get("mapTypeId");return b?null:Kf[a]};Uf=function(a){a.parentNode&&a.parentNode.removeChild(a)};
Vf=function(a,b){var c=a.f;c.onload=null;c.onerror=null;a.get("size")&&(b&&(c.parentNode||a.b.appendChild(c),_.Cf(c,a.get("size")),_.z.trigger(a,"staticmaploaded"),a.j.set(_.Ka())),a.set("loading",!1))};Wf=function(a,b){var c=a.f;b!=c.src?(Uf(c),c.onload=function(){Vf(a,!0)},c.onerror=function(){Vf(a,!1)},c.src=b):!c.parentNode&&b&&a.b.appendChild(c)};
Xf=function(a,b,c,d,e){var f=_.P(_.pf(_.R),7);this.b=a;this.f=d;this.j=_.m(e)?e:_.Ka();var g=f+"/csi?v=2&s=mapsapi3&v3v="+_.P(new mf(_.R.data[36]),0)+"&action="+a;_.Ic(c,function(a,b){g+="&"+(0,window.encodeURIComponent)(b)+"="+(0,window.encodeURIComponent)(a)});b&&(g+="&e="+b);this.l=g};_.Zf=function(a,b){var c={};c[b]=void 0;_.Yf(a,c)};
_.Yf=function(a,b){var c="";_.Ic(b,function(a,b){var d=(null!=a?a:_.Ka())-this.j;c&&(c+=",");c+=b+"."+Math.round(d);null==a&&window.performance&&window.performance.mark&&window.performance.mark("mapsapi:"+this.b+":"+b)},a);b=a.l+"&rt="+c;a.f.createElement("img").src=b;(a=_.Nc.__gm_captureCSI)&&a(b)};
_.$f=function(a,b){b=b||{};var c=b.fn||{},d=_.zd(_.R,12).join(",");d&&(c.libraries=d);var d=_.P(_.R,6),e=new df(_.R.data[33]),f=[];d&&f.push(d);_.v(e.data,function(a,b){a&&_.v(a,function(a,c){null!=a&&f.push(b+1+"_"+(c+1)+"_"+a)})});b.dl&&(f=f.concat(b.dl));return new Xf(a,f.join(","),c,b.document||window.document,b.startTime)};bg=function(){this.f=_.$f("apiboot2",{startTime:_.ag});_.Zf(this.f,"main");this.b=!1};dg=function(){var a=cg;a.b||(a.b=!0,_.Zf(a.f,"firstmap"))};_.eg=_.oa();
_.fg=function(){this.b=""};_.gg=function(a){var b=new _.fg;b.b=a;return b};_.ig=function(){this.jf="";this.Bj=_.hg;this.b=null};_.jg=function(a,b){var c=new _.ig;c.jf=a;c.b=b;return c};_.kg=function(a,b){b.parentNode&&b.parentNode.insertBefore(a,b.nextSibling)};_.lg=function(a){a&&a.parentNode&&a.parentNode.removeChild(a)};mg=function(a,b,c,d,e){this.b=!!b;this.node=null;this.f=0;this.j=!1;this.l=!c;a&&this.setPosition(a,d);this.depth=void 0!=e?e:this.f||0;this.b&&(this.depth*=-1)};
ng=function(a,b,c,d){mg.call(this,a,b,c,null,d)};_.pg=function(a){for(var b;b=a.firstChild;)_.og(b),a.removeChild(b)};_.og=function(a){a=new ng(a);try{for(;;)_.z.clearInstanceListeners(a.next())}catch(b){if(b!==_.qg)throw b;}};
ug=function(a,b){var c=_.Ka();cg&&dg();var d=new _.vf,e=b||{};e.noClear||_.pg(a);var f="undefined"==typeof window.document?null:window.document.createElement("div");f&&a.appendChild&&(a.appendChild(f),f.style.width=f.style.height="100%");_.de.call(this,new uf(this,a,f,d));_.m(e.mapTypeId)||(e.mapTypeId="roadmap");this.setValues(e);this.b=_.rg[15]&&e.noControlsOrLogging;this.mapTypes=new Nd;this.features=new _.A;_.Qe(f);this.notify("streetView");a=_.Df(f);var g=null;_.R&&sg(e.useStaticMap,a)&&(g=new Jf(f,
_.tg,_.P(_.pf(_.R),9),new dd(null)),_.z.forward(g,"staticmaploaded",this),g.set("size",a),g.bindTo("center",this),g.bindTo("zoom",this),g.bindTo("mapTypeId",this),g.bindTo("styles",this));this.overlayMapTypes=new _.yc;var h=this.controls=[];_.Va(_.rf,function(a,b){h[b]=new _.yc});var l=this,n=!0;_.F("map",function(a){l.getDiv()&&f&&a.f(l,e,f,g,n,c,d)});n=!1;this.data=new Je({map:this})};sg=function(a,b){if(_.m(a))return!!a;a=b.width;b=b.height;return 384E3>=a*b&&800>=a&&800>=b};
vg=function(){_.F("maxzoom",_.ua)};wg=function(a,b){!a||_.eb(a)||_.x(a)?(this.set("tableId",a),this.setValues(b)):this.setValues(a)};_.xg=_.oa();_.yg=function(a){this.setValues(ye(a));_.F("poly",_.ua)};_.zg=function(a){this.setValues(ye(a));_.F("poly",_.ua)};Ag=function(){this.b=null};_.Bg=function(){this.b=null};
_.Cg=function(a){this.tileSize=a.tileSize||new _.J(256,256);this.name=a.name;this.alt=a.alt;this.minZoom=a.minZoom;this.maxZoom=a.maxZoom;this.j=(0,_.p)(a.getTileUrl,a);this.b=new _.zc;this.f=null;this.set("opacity",a.opacity);var b=this;_.F("map",function(a){var c=b.f=a.b,e=b.tileSize||new _.J(256,256);b.b.forEach(function(a){var d=a.__gmimt,f=d.W,l=d.zoom,n=b.j(f,l);d.Kb=c(f,l,e,a,n,function(){_.z.trigger(a,"load")})})})};
Dg=function(a,b){null!=a.style.opacity?a.style.opacity=b:a.style.filter=b&&"alpha(opacity="+Math.round(100*b)+")"};Eg=function(a){a=a.get("opacity");return"number"==typeof a?a:1};_.Fg=function(){_.Fg.xg(this,"constructor")};_.Gg=function(a,b){_.Gg.xg(this,"constructor");this.set("styles",a);a=b||{};this.b=a.baseMapTypeId||"roadmap";this.minZoom=a.minZoom;this.maxZoom=a.maxZoom||20;this.name=a.name;this.alt=a.alt;this.projection=null;this.tileSize=new _.J(256,256)};
_.Hg=function(a,b){_.Mb(Ib,"container is not a Node")(a);this.setValues(b);_.F("controls",(0,_.p)(function(b){b.Dk(this,a)},this))};Ig=_.pa("b");Jg=function(a,b,c){for(var d=Array(b.length),e=0,f=b.length;e<f;++e)d[e]=b.charCodeAt(e);d.unshift(c);a=a.b;c=b=0;for(e=d.length;c<e;++c)b*=1729,b+=d[c],b%=a;return b};
Mg=function(){var a=_.N(new kf(_.R.data[4]),0),b=new Ig(131071),c=(0,window.unescape)("%26%74%6F%6B%65%6E%3D");return function(d){d=d.replace(Kg,"%27");var e=d+c;Lg||(Lg=/(?:https?:\/\/[^/]+)?(.*)/);d=Lg.exec(d);return e+Jg(b,d&&d[1],a)}};Ng=function(){var a=new Ig(2147483647);return function(b){return Jg(a,b,0)}};Og=function(a){for(var b=a.split("."),c=window,d=window,e=0;e<b.length;e++)if(d=c,c=c[b[e]],!c)throw _.Fb(a+" is not a function");return function(){c.apply(d)}};
Tg=function(){for(var a in Object.prototype)window.console&&window.console.error("This site adds property <"+a+"> to Object.prototype. Extending Object.prototype breaks JavaScript for..in loops, which are used heavily in Google Maps API v3.")};Ug=function(a){(a="version"in a)&&window.console&&window.console.error("You have included the Google Maps API multiple times on this page. This may cause unexpected errors.");return a};_.sa=[];_.Nc=this;Fa="closure_uid_"+(1E9*Math.random()>>>0);Ga=0;var ub,vb;_.z={};ub="undefined"!=typeof window.navigator&&-1!=window.navigator.userAgent.toLowerCase().indexOf("msie");vb={};_.z.addListener=function(a,b,c){return new wb(a,b,c,0)};_.z.hasListeners=function(a,b){b=(a=a.__e3_)&&a[b];return!!b&&!_.Xa(b)};_.z.removeListener=function(a){a&&a.remove()};_.z.clearListeners=function(a,b){_.Va(qb(a,b),function(a,b){b&&b.remove()})};_.z.clearInstanceListeners=function(a){_.Va(qb(a),function(a,c){c&&c.remove()})};
_.z.trigger=function(a,b,c){if(_.z.hasListeners(a,b)){var d=_.Ua(arguments,2),e=qb(a,b),f;for(f in e){var g=e[f];g&&g.b.apply(g.Ia,d)}}};_.z.addDomListener=function(a,b,c,d){if(a.addEventListener){var e=d?4:1;a.addEventListener(b,c,d);c=new wb(a,b,c,e)}else a.attachEvent?(c=new wb(a,b,c,2),a.attachEvent("on"+b,xb(c))):(a["on"+b]=c,c=new wb(a,b,c,3));return c};_.z.addDomListenerOnce=function(a,b,c,d){var e=_.z.addDomListener(a,b,function(){e.remove();return c.apply(this,arguments)},d);return e};
_.z.U=function(a,b,c,d){return _.z.addDomListener(a,b,rb(c,d))};_.z.bind=function(a,b,c,d){return _.z.addListener(a,b,(0,_.p)(d,c))};_.z.addListenerOnce=function(a,b,c){var d=_.z.addListener(a,b,function(){d.remove();return c.apply(this,arguments)});return d};_.z.forward=function(a,b,c){return _.z.addListener(a,b,sb(b,c))};_.z.Pa=function(a,b,c,d){return _.z.addDomListener(a,b,sb(b,c,!d))};_.z.ni=function(){var a=vb,b;for(b in a)a[b].remove();vb={};(a=_.Nc.CollectGarbage)&&a()};
_.z.wn=function(){ub&&_.z.addDomListener(window,"unload",_.z.ni)};var tb=0;wb.prototype.remove=function(){if(this.Ia){switch(this.l){case 1:this.Ia.removeEventListener(this.f,this.b,!1);break;case 4:this.Ia.removeEventListener(this.f,this.b,!0);break;case 2:this.Ia.detachEvent("on"+this.f,this.j);break;case 3:this.Ia["on"+this.f]=null}delete pb(this.Ia,this.f)[this.id];this.j=this.b=this.Ia=null;delete vb[this.id]}};_.k=_.A.prototype;_.k.get=function(a){var b=Db(this);a+="";b=ib(b,a);if(_.m(b)){if(b){a=b.ab;var b=b.Bc,c="get"+_.Cb(a);return b[c]?b[c]():b.get(a)}return this[a]}};_.k.set=function(a,b){var c=Db(this);a+="";var d=ib(c,a);if(d)if(a=d.ab,d=d.Bc,c="set"+_.Cb(a),d[c])d[c](b);else d.set(a,b);else this[a]=b,c[a]=null,Ab(this,a)};_.k.notify=function(a){var b=Db(this);a+="";(b=ib(b,a))?b.Bc.notify(b.ab):Ab(this,a)};
_.k.setValues=function(a){for(var b in a){var c=a[b],d="set"+_.Cb(b);if(this[d])this[d](c);else this.set(b,c)}};_.k.setOptions=_.A.prototype.setValues;_.k.changed=_.oa();var Bb={};_.A.prototype.bindTo=function(a,b,c,d){a+="";c=(c||a)+"";this.unbind(a);var e={Bc:this,ab:a},f={Bc:b,ab:c,yg:e};Db(this)[a]=f;zb(b,c)[_.yb(e)]=e;d||Ab(this,a)};_.A.prototype.unbind=function(a){var b=Db(this),c=b[a];c&&(c.yg&&delete zb(c.Bc,c.ab)[_.yb(c.yg)],this[a]=this.get(a),b[a]=null)};
_.A.prototype.unbindAll=function(){var a=(0,_.p)(this.unbind,this),b=Db(this),c;for(c in b)a(c)};_.A.prototype.addListener=function(a,b){return _.z.addListener(this,a,b)};_.Vg={ROADMAP:"roadmap",SATELLITE:"satellite",HYBRID:"hybrid",TERRAIN:"terrain"};_.rf={TOP_LEFT:1,TOP_CENTER:2,TOP:2,TOP_RIGHT:3,LEFT_CENTER:4,LEFT_TOP:5,LEFT:5,LEFT_BOTTOM:6,RIGHT_TOP:7,RIGHT:7,RIGHT_CENTER:8,RIGHT_BOTTOM:9,BOTTOM_LEFT:10,BOTTOM_CENTER:11,BOTTOM:11,BOTTOM_RIGHT:12,CENTER:13};var Wg={So:"Point",Qo:"LineString",POLYGON:"Polygon"};_.t(Eb,Error);var Xg,Zg;_.nc=_.Mb(_.x,"not a number");Xg=_.Ob(_.nc,function(a){if((0,window.isNaN)(a))throw _.Fb("NaN is not an accepted value");return a});_.Yg=_.Mb(_.eb,"not a string");Zg=_.Mb(_.fb,"not a boolean");_.$g=_.Pb(_.nc);_.ah=_.Pb(_.Yg);_.bh=_.Pb(Zg);var Tb=_.Hb({lat:_.nc,lng:_.nc},!0);_.E.prototype.toString=function(){return"("+this.lat()+", "+this.lng()+")"};_.E.prototype.toJSON=function(){return{lat:this.lat(),lng:this.lng()}};_.E.prototype.b=function(a){return a?_.$a(this.lat(),a.lat())&&_.$a(this.lng(),a.lng()):!1};_.E.prototype.equals=_.E.prototype.b;_.E.prototype.toUrlValue=function(a){a=_.m(a)?a:6;return Wb(this.lat(),a)+","+Wb(this.lng(),a)};_.je=_.Lb(_.Yb);_.t(_.Zb,Xb);_.Zb.prototype.getType=_.ra("Point");_.Zb.prototype.forEachLatLng=function(a){a(this.b)};_.Zb.prototype.get=_.qa("b");var he=_.Lb($b);_.va(fc);fc.prototype.cb=function(a,b){var c=this,d=c.m;gc(c.j,function(e){for(var f=e.wh[a]||[],g=e.Fn[a]||[],h=d[a]=_.ac(f.length,function(){delete d[a];b(e.Jk);for(var f=c.f[a],h=f?f.length:0,l=0;l<h;++l)f[l](c.b[a]);delete c.f[a];l=0;for(f=g.length;l<f;++l)h=g[l],d[h]&&d[h]()}),l=0,n=f.length;l<n;++l)c.b[f[l]]&&h()})};_.k=_.mc.prototype;_.k.getId=_.qa("j");_.k.getGeometry=_.qa("b");_.k.setGeometry=function(a){var b=this.b;try{this.b=a?$b(a):null}catch(c){_.Gb(c);return}_.z.trigger(this,"setgeometry",{feature:this,newGeometry:this.b,oldGeometry:b})};_.k.getProperty=function(a){return ib(this.f,a)};_.k.setProperty=function(a,b){if(void 0===b)this.removeProperty(a);else{var c=this.getProperty(a);this.f[a]=b;_.z.trigger(this,"setproperty",{feature:this,name:a,newValue:b,oldValue:c})}};
_.k.removeProperty=function(a){var b=this.getProperty(a);delete this.f[a];_.z.trigger(this,"removeproperty",{feature:this,name:a,oldValue:b})};_.k.forEachProperty=function(a){for(var b in this.f)a(this.getProperty(b),b)};_.k.toGeoJson=function(a){var b=this;_.F("data",function(c){c.f(b,a)})};_.ch=new _.I(0,0);_.I.prototype.toString=function(){return"("+this.x+", "+this.y+")"};_.I.prototype.b=function(a){return a?a.x==this.x&&a.y==this.y:!1};_.I.prototype.equals=_.I.prototype.b;_.I.prototype.round=function(){this.x=Math.round(this.x);this.y=Math.round(this.y)};_.I.prototype.Wd=_.ta(0);_.dh=new _.J(0,0);_.J.prototype.toString=function(){return"("+this.width+", "+this.height+")"};_.J.prototype.b=function(a){return a?a.width==this.width&&a.height==this.height:!1};_.J.prototype.equals=_.J.prototype.b;var eh={CIRCLE:0,FORWARD_CLOSED_ARROW:1,FORWARD_OPEN_ARROW:2,BACKWARD_CLOSED_ARROW:3,BACKWARD_OPEN_ARROW:4};_.t(_.yc,_.A);_.k=_.yc.prototype;_.k.getAt=function(a){return this.b[a]};_.k.indexOf=function(a){for(var b=0,c=this.b.length;b<c;++b)if(a===this.b[b])return b;return-1};_.k.forEach=function(a){for(var b=0,c=this.b.length;b<c;++b)a(this.b[b],b)};_.k.setAt=function(a,b){var c=this.b[a],d=this.b.length;if(a<d)this.b[a]=b,_.z.trigger(this,"set_at",a,c),this.l&&this.l(a,c);else{for(c=d;c<a;++c)this.insertAt(c,void 0);this.insertAt(a,b)}};
_.k.insertAt=function(a,b){this.b.splice(a,0,b);xc(this);_.z.trigger(this,"insert_at",a);this.f&&this.f(a)};_.k.removeAt=function(a){var b=this.b[a];this.b.splice(a,1);xc(this);_.z.trigger(this,"remove_at",a,b);this.j&&this.j(a,b);return b};_.k.push=function(a){this.insertAt(this.b.length,a);return this.b.length};_.k.pop=function(){return this.removeAt(this.b.length-1)};_.k.getArray=_.qa("b");_.k.clear=function(){for(;this.get("length");)this.pop()};_.wc(_.yc.prototype,{length:null});_.zc.prototype.remove=function(a){var b=this.f,c=this.j(a);b[c]&&(delete b[c],_.z.trigger(this,"remove",a),this.onRemove&&this.onRemove(a))};_.zc.prototype.contains=function(a){return!!this.f[this.j(a)]};_.zc.prototype.forEach=function(a){var b=this.f,c;for(c in b)a.call(this,b[c])};_.Bc.prototype.Qa=_.ta(1);_.Bc.prototype.forEach=function(a,b){_.v(this.b,function(c,d){a.call(b,c,d)})};var fh=_.Hb({zoom:_.Pb(Xg),heading:Xg,pitch:Xg});_.t(_.Dc,_.A);var gh=function(a){return function(){return a}}(null);a:{var hh=_.Nc.navigator;if(hh){var ih=hh.userAgent;if(ih){_.Ma=ih;break a}}_.Ma=""};var Sc,Rc=_.Hc;Vc.prototype.get=function(){var a;0<this.f?(this.f--,a=this.b,this.b=a.next,a.next=null):a=this.j();return a};var jh=new Vc(function(){return new Xc},function(a){a.reset()},100);Wc.prototype.add=function(a,b){var c=jh.get();c.set(a,b);this.f?this.f.next=c:this.b=c;this.f=c};Wc.prototype.remove=function(){var a=null;this.b&&(a=this.b,this.b=this.b.next,this.b||(this.f=null),a.next=null);return a};Xc.prototype.set=function(a,b){this.yc=a;this.b=b;this.next=null};Xc.prototype.reset=function(){this.next=this.b=this.yc=null};_.Qc.m=function(){if(-1!=String(_.Nc.Promise).indexOf("[native code]")){var a=_.Nc.Promise.resolve(void 0);_.Qc.b=function(){a.then(_.Qc.f)}}else _.Qc.b=function(){Uc()}};_.Qc.B=function(a){_.Qc.b=function(){Uc();a&&a(_.Qc.f)}};_.Qc.j=!1;_.Qc.l=new Wc;_.Qc.f=function(){for(var a;a=_.Qc.l.remove();){try{a.yc.call(a.b)}catch(c){Oc(c)}var b=jh;b.m(a);b.f<b.l&&(b.f++,a.next=b.b,b.b=a)}_.Qc.j=!1};Zc.prototype.addListener=function(a,b,c){c=c?{Bg:!1}:null;var d=!this.P.length,e;e=this.P;var f=Ra(e,Yc(a,b));(e=0>f?null:_.za(e)?e.charAt(f):e[f])?e.once=e.once&&c:this.P.push({yc:a,context:b||null,once:c});d&&this.f();return a};Zc.prototype.addListenerOnce=function(a,b){this.addListener(a,b,!0);return a};Zc.prototype.removeListener=function(a,b){if(this.P.length){var c=this.P;a=Ra(c,Yc(a,b));0<=a&&_.Sa(c,a);this.P.length||this.b()}};var $c=_.Qc;_.k=_.bd.prototype;_.k.jd=_.oa();_.k.gd=_.oa();_.k.addListener=function(a,b){return this.P.addListener(a,b)};_.k.addListenerOnce=function(a,b){return this.P.addListenerOnce(a,b)};_.k.removeListener=function(a,b){return this.P.removeListener(a,b)};_.k.notify=function(a){_.ad(this.P,function(a){a(this.get())},this,a)};_.t(_.cd,_.bd);_.cd.prototype.set=function(a){this.ai(a);this.notify()};_.t(dd,_.cd);dd.prototype.get=_.qa("b");dd.prototype.ai=_.pa("b");_.t(hd,_.A);_.kh=_.pd("d",void 0);_.lh=_.rd("d");_.mh=_.pd("f",void 0);_.S=_.sd();_.nh=_.qd("i",void 0);_.oh=_.rd("i");_.ph=_.rd("j",void 0,"");_.qh=_.pd("u",void 0);_.rh=_.qd("u",void 0);_.sh=_.rd("u");_.th=_.td();_.T=_.wd();_.U=_.xd();_.uh=_.rd("e");_.V=_.pd("s",void 0);_.vh=_.qd("s",void 0);_.wh=_.rd("s");_.xh=_.pd("x",void 0);_.yh=_.qd("x",void 0);_.zh=_.rd("x");_.Ah=_.rd("y");_.M.prototype.Uf=_.ta(2);var Ch;_.Bh=new Cd;Ch=/'/g;Cd.prototype.b=function(a,b){var c=[];Ed(a,b,c);return c.join("&").replace(Ch,"%27")};_.Gd[" "]=_.ua;var Ph,Hd;_.Dh=_.Jc("Opera");_.Eh=_.Kc();_.Fh=_.Jc("Edge");_.Gh=_.Jc("Gecko")&&!(_.Na()&&!_.Jc("Edge"))&&!(_.Jc("Trident")||_.Jc("MSIE"))&&!_.Jc("Edge");_.Hh=_.Na()&&!_.Jc("Edge");_.Ih=_.Jc("Macintosh");_.Jh=_.Jc("Windows");_.Kh=_.Jc("Linux")||_.Jc("CrOS");_.Lh=_.Jc("Android");_.Mh=_.Fd();_.Nh=_.Jc("iPad");_.Oh=_.Jc("iPod");
a:{var Qh="",Rh=function(){var a=_.Ma;if(_.Gh)return/rv\:([^\);]+)(\)|;)/.exec(a);if(_.Fh)return/Edge\/([\d\.]+)/.exec(a);if(_.Eh)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(_.Hh)return/WebKit\/(\S+)/.exec(a);if(_.Dh)return/(?:Version)[ \/]?(\S+)/.exec(a)}();Rh&&(Qh=Rh?Rh[1]:"");if(_.Eh){var Sh=Jd();if(null!=Sh&&Sh>(0,window.parseFloat)(Qh)){Ph=String(Sh);break a}}Ph=Qh}_.Kd=Ph;Hd={};var Uh=_.Nc.document;_.Th=Uh&&_.Eh?Jd()||("CSS1Compat"==Uh.compatMode?(0,window.parseInt)(_.Kd,10):5):void 0;_.Vh=_.Jc("Firefox");_.Wh=_.Fd()||_.Jc("iPod");_.Xh=_.Jc("iPad");_.Yh=_.Jc("Android")&&!(Lc()||_.Jc("Firefox")||_.Jc("Opera")||_.Jc("Silk"));_.Zh=Lc();_.$h=_.Mc()&&!(_.Fd()||_.Jc("iPad")||_.Jc("iPod"));_.Md.prototype.heading=_.qa("f");_.Md.prototype.b=_.ta(3);_.Md.prototype.toString=function(){return this.f+","+this.j};_.ai=new _.Md;_.t(Nd,_.A);Nd.prototype.set=function(a,b){if(null!=b&&!(b&&_.x(b.maxZoom)&&b.tileSize&&b.tileSize.width&&b.tileSize.height&&b.getTile&&b.getTile.apply))throw Error("Valeur attendue pour l\u2019int\u00e9gration de google.maps.MapType");return _.A.prototype.set.apply(this,arguments)};Od.prototype.isEmpty=function(){return 360==this.b-this.f};Od.prototype.intersects=function(a){var b=this.b,c=this.f;return this.isEmpty()||a.isEmpty()?!1:_.Pd(this)?_.Pd(a)||a.b<=this.f||a.f>=b:_.Pd(a)?a.b<=c||a.f>=b:a.b<=c&&a.f>=b};Od.prototype.contains=function(a){-180==a&&(a=180);var b=this.b,c=this.f;return _.Pd(this)?(a>=b||a<=c)&&!this.isEmpty():a>=b&&a<=c};Od.prototype.extend=function(a){this.contains(a)||(this.isEmpty()?this.b=this.f=a:_.Vd(a,this.b)<_.Vd(this.f,a)?this.b=a:this.f=a)};
Xd.prototype.isEmpty=function(){return this.f>this.b};Xd.prototype.intersects=function(a){var b=this.f,c=this.b;return b<=a.f?a.f<=c&&a.f<=a.b:b<=a.b&&b<=c};Xd.prototype.contains=function(a){return a>=this.f&&a<=this.b};Xd.prototype.extend=function(a){this.isEmpty()?this.b=this.f=a:a<this.f?this.f=a:a>this.b&&(this.b=a)};_.k=_.$d.prototype;_.k.getCenter=function(){return new _.E(_.Zd(this.f),_.Wd(this.b))};_.k.toString=function(){return"("+this.getSouthWest()+", "+this.getNorthEast()+")"};_.k.toJSON=function(){return{south:this.f.f,west:this.b.b,north:this.f.b,east:this.b.f}};_.k.toUrlValue=function(a){var b=this.getSouthWest(),c=this.getNorthEast();return[b.toUrlValue(a),c.toUrlValue(a)].join()};
_.k.Vi=function(a){if(!a)return!1;a=_.ce(a);var b=this.f,c=a.f;return(b.isEmpty()?c.isEmpty():1E-9>=Math.abs(c.f-b.f)+Math.abs(b.b-c.b))&&_.Ud(this.b,a.b)};_.$d.prototype.equals=_.$d.prototype.Vi;_.k=_.$d.prototype;_.k.contains=function(a){a=_.Yb(a);return this.f.contains(a.lat())&&this.b.contains(a.lng())};_.k.intersects=function(a){a=_.ce(a);return this.f.intersects(a.f)&&this.b.intersects(a.b)};_.k.extend=function(a){a=_.Yb(a);this.f.extend(a.lat());this.b.extend(a.lng());return this};
_.k.union=function(a){a=_.ce(a);if(!a||a.isEmpty())return this;this.extend(a.getSouthWest());this.extend(a.getNorthEast());return this};_.k.getSouthWest=function(){return new _.E(this.f.f,this.b.b,!0)};_.k.getNorthEast=function(){return new _.E(this.f.b,this.b.f,!0)};_.k.toSpan=function(){return new _.E(_.Yd(this.f),_.Td(this.b),!0)};_.k.isEmpty=function(){return this.f.isEmpty()||this.b.isEmpty()};var be=_.Hb({south:_.nc,west:_.nc,north:_.nc,east:_.nc},!1);_.t(_.de,_.A);_.k=ee.prototype;_.k.contains=function(a){return this.b.hasOwnProperty(_.yb(a))};_.k.getFeatureById=function(a){return ib(this.f,a)};
_.k.add=function(a){a=a||{};a=a instanceof _.mc?a:new _.mc(a);if(!this.contains(a)){var b=a.getId();if(b){var c=this.getFeatureById(b);c&&this.remove(c)}c=_.yb(a);this.b[c]=a;b&&(this.f[b]=a);var d=_.z.forward(a,"setgeometry",this),e=_.z.forward(a,"setproperty",this),f=_.z.forward(a,"removeproperty",this);this.j[c]=function(){_.z.removeListener(d);_.z.removeListener(e);_.z.removeListener(f)};_.z.trigger(this,"addfeature",{feature:a})}return a};
_.k.remove=function(a){var b=_.yb(a),c=a.getId();if(this.b[b]){delete this.b[b];c&&delete this.f[c];if(c=this.j[b])delete this.j[b],c();_.z.trigger(this,"removefeature",{feature:a})}};_.k.forEach=function(a){for(var b in this.b)a(this.b[b])};fe.prototype.get=function(a){return this.b[a]};fe.prototype.set=function(a,b){var c=this.b;c[a]||(c[a]={});_.Wa(c[a],b);_.z.trigger(this,"changed",a)};fe.prototype.reset=function(a){delete this.b[a];_.z.trigger(this,"changed",a)};fe.prototype.forEach=function(a){_.Va(this.b,a)};_.t(ge,_.A);ge.prototype.overrideStyle=function(a,b){this.b.set(_.yb(a),b)};ge.prototype.revertStyle=function(a){a?this.b.reset(_.yb(a)):this.b.forEach((0,_.p)(this.b.reset,this.b))};_.t(_.ie,Xb);_.k=_.ie.prototype;_.k.getType=_.ra("GeometryCollection");_.k.getLength=function(){return this.b.length};_.k.getAt=function(a){return this.b[a]};_.k.getArray=function(){return this.b.slice()};_.k.forEachLatLng=function(a){this.b.forEach(function(b){b.forEachLatLng(a)})};_.t(_.ke,Xb);_.k=_.ke.prototype;_.k.getType=_.ra("LineString");_.k.getLength=function(){return this.b.length};_.k.getAt=function(a){return this.b[a]};_.k.getArray=function(){return this.b.slice()};_.k.forEachLatLng=function(a){this.b.forEach(a)};var le=_.Lb(_.Jb(_.ke,"google.maps.Data.LineString",!0));_.t(_.me,Xb);_.k=_.me.prototype;_.k.getType=_.ra("MultiLineString");_.k.getLength=function(){return this.b.length};_.k.getAt=function(a){return this.b[a]};_.k.getArray=function(){return this.b.slice()};_.k.forEachLatLng=function(a){this.b.forEach(function(b){b.forEachLatLng(a)})};_.t(_.ne,Xb);_.k=_.ne.prototype;_.k.getType=_.ra("MultiPoint");_.k.getLength=function(){return this.b.length};_.k.getAt=function(a){return this.b[a]};_.k.getArray=function(){return this.b.slice()};_.k.forEachLatLng=function(a){this.b.forEach(a)};_.t(_.oe,Xb);_.k=_.oe.prototype;_.k.getType=_.ra("LinearRing");_.k.getLength=function(){return this.b.length};_.k.getAt=function(a){return this.b[a]};_.k.getArray=function(){return this.b.slice()};_.k.forEachLatLng=function(a){this.b.forEach(a)};var pe=_.Lb(_.Jb(_.oe,"google.maps.Data.LinearRing",!0));_.t(_.re,Xb);_.k=_.re.prototype;_.k.getType=_.ra("Polygon");_.k.getLength=function(){return this.b.length};_.k.getAt=function(a){return this.b[a]};_.k.getArray=function(){return this.b.slice()};_.k.forEachLatLng=function(a){this.b.forEach(function(b){b.forEachLatLng(a)})};var se=_.Lb(_.Jb(_.re,"google.maps.Data.Polygon",!0));_.t(_.te,Xb);_.k=_.te.prototype;_.k.getType=_.ra("MultiPolygon");_.k.getLength=function(){return this.b.length};_.k.getAt=function(a){return this.b[a]};_.k.getArray=function(){return this.b.slice()};_.k.forEachLatLng=function(a){this.b.forEach(function(b){b.forEachLatLng(a)})};var bi=_.Hb({source:_.Yg,webUrl:_.ah,iosDeepLinkId:_.ah});var ci=_.Ob(_.Hb({placeId:_.ah,query:_.ah,location:_.Yb}),function(a){if(a.placeId&&a.query)throw _.Fb("cannot set both placeId and query");if(!a.placeId&&!a.query)throw _.Fb("must set one of placeId or query");return a});_.t(ue,_.A);
_.wc(ue.prototype,{position:_.Pb(_.Yb),title:_.ah,icon:_.Pb(_.Nb([_.Yg,{Yf:Qb("url"),then:_.Hb({url:_.Yg,scaledSize:_.Pb(sc),size:_.Pb(sc),origin:_.Pb(rc),anchor:_.Pb(rc),labelOrigin:_.Pb(rc),path:_.Mb(function(a){return null==a})},!0)},{Yf:Qb("path"),then:_.Hb({path:_.Nb([_.Yg,_.Kb(eh)]),anchor:_.Pb(rc),labelOrigin:_.Pb(rc),fillColor:_.ah,fillOpacity:_.$g,rotation:_.$g,scale:_.$g,strokeColor:_.ah,strokeOpacity:_.$g,strokeWeight:_.$g,url:_.Mb(function(a){return null==a})},!0)}])),label:_.Pb(_.Nb([_.Yg,{Yf:Qb("text"),
then:_.Hb({text:_.Yg,fontSize:_.ah,fontWeight:_.ah,fontFamily:_.ah},!0)}])),shadow:_.Hc,shape:_.Hc,cursor:_.ah,clickable:_.bh,animation:_.Hc,draggable:_.bh,visible:_.bh,flat:_.Hc,zIndex:_.$g,opacity:_.$g,place:_.Pb(ci),attribution:_.Pb(bi)});var ic={main:[],common:["main"],util:["common"],adsense:["main"],controls:["util"],data:["util"],directions:["util","geometry"],distance_matrix:["util"],drawing:["main"],drawing_impl:["controls"],elevation:["util","geometry"],geocoder:["util"],geojson:["main"],imagery_viewer:["main"],geometry:["main"],infowindow:["util"],kml:["onion","util","map"],layers:["map"],map:["common"],marker:["util"],maxzoom:["util"],onion:["util","map"],overlay:["common"],panoramio:["main"],places:["main"],places_impl:["controls"],
poly:["util","map","geometry"],search:["main"],search_impl:["onion"],stats:["util"],streetview:["util","geometry"],usage:["util"],visualization:["main"],visualization_impl:["onion"],weather:["main"],zombie:["main"]};var di=_.Nc.google.maps,ei=fc.zb(),fi=(0,_.p)(ei.cb,ei);di.__gjsload__=fi;_.Va(di.modules,fi);delete di.modules;_.gi=_.Pb(_.Jb(_.de,"Map"));var hi=_.Pb(_.Jb(_.Dc,"StreetViewPanorama"));_.t(_.xe,ue);_.xe.prototype.map_changed=function(){this.__gm.set&&this.__gm.set.remove(this);var a=this.get("map");this.__gm.set=a&&a.__gm.da;this.__gm.set&&_.Ac(this.__gm.set,this)};_.xe.MAX_ZINDEX=1E6;_.wc(_.xe.prototype,{map:_.Nb([_.gi,hi])});var Ae=Ce(_.Jb(_.E,"LatLng"));_.t(Ee,_.A);Ee.prototype.map_changed=Ee.prototype.visible_changed=function(){var a=this;_.F("poly",function(b){b.f(a)})};Ee.prototype.getPath=function(){return this.get("latLngs").getAt(0)};Ee.prototype.setPath=function(a){try{this.get("latLngs").setAt(0,Be(a))}catch(b){_.Gb(b)}};_.wc(Ee.prototype,{draggable:_.bh,editable:_.bh,map:_.gi,visible:_.bh});_.t(_.Fe,Ee);_.Fe.prototype.Da=!0;_.Fe.prototype.getPaths=function(){return this.get("latLngs")};_.Fe.prototype.setPaths=function(a){this.set("latLngs",De(a))};_.t(_.Ge,Ee);_.Ge.prototype.Da=!1;_.Ie="click dblclick mousedown mousemove mouseout mouseover mouseup rightclick".split(" ");_.t(Je,_.A);_.k=Je.prototype;_.k.contains=function(a){return this.b.contains(a)};_.k.getFeatureById=function(a){return this.b.getFeatureById(a)};_.k.add=function(a){return this.b.add(a)};_.k.remove=function(a){this.b.remove(a)};_.k.forEach=function(a){this.b.forEach(a)};_.k.addGeoJson=function(a,b){return _.He(this.b,a,b)};_.k.loadGeoJson=function(a,b,c){var d=this.b;_.F("data",function(e){e.il(d,a,b,c)})};_.k.toGeoJson=function(a){var b=this.b;_.F("data",function(c){c.cl(b,a)})};
_.k.overrideStyle=function(a,b){this.f.overrideStyle(a,b)};_.k.revertStyle=function(a){this.f.revertStyle(a)};_.k.controls_changed=function(){this.get("controls")&&Ke(this)};_.k.drawingMode_changed=function(){this.get("drawingMode")&&Ke(this)};_.wc(Je.prototype,{map:_.gi,style:_.Hc,controls:_.Pb(_.Lb(_.Kb(Wg))),controlPosition:_.Pb(_.Kb(_.rf)),drawingMode:_.Pb(_.Kb(Wg))});_.ii={METRIC:0,IMPERIAL:1};_.ji={DRIVING:"DRIVING",WALKING:"WALKING",BICYCLING:"BICYCLING",TRANSIT:"TRANSIT"};_.ki={BEST_GUESS:"bestguess",OPTIMISTIC:"optimistic",PESSIMISTIC:"pessimistic"};_.li={BUS:"BUS",RAIL:"RAIL",SUBWAY:"SUBWAY",TRAIN:"TRAIN",TRAM:"TRAM"};_.mi={LESS_WALKING:"LESS_WALKING",FEWER_TRANSFERS:"FEWER_TRANSFERS"};var ni=_.Hb({routes:_.Lb(_.Mb(_.db))},!0);_.t(Me,_.A);_.k=Me.prototype;_.k.internalAnchor_changed=function(){var a=this.get("internalAnchor");Ne(this,"attribution",a);Ne(this,"place",a);Ne(this,"internalAnchorMap",a,"map");Ne(this,"internalAnchorPoint",a,"anchorPoint");a instanceof _.xe?Ne(this,"internalAnchorPosition",a,"internalPosition"):Ne(this,"internalAnchorPosition",a,"position")};
_.k.internalAnchorPoint_changed=Me.prototype.internalPixelOffset_changed=function(){var a=this.get("internalAnchorPoint")||_.ch,b=this.get("internalPixelOffset")||_.dh;this.set("pixelOffset",new _.J(b.width+Math.round(a.x),b.height+Math.round(a.y)))};_.k.internalAnchorPosition_changed=function(){var a=this.get("internalAnchorPosition");a&&this.set("position",a)};_.k.internalAnchorMap_changed=function(){this.get("internalAnchor")&&this.b.set("map",this.get("internalAnchorMap"))};
_.k.Lm=function(){var a=this.get("internalAnchor");!this.b.get("map")&&a&&a.get("map")&&this.set("internalAnchor",null)};_.k.internalContent_changed=function(){this.set("content",Le(this.get("internalContent")))};_.k.trigger=function(a){_.z.trigger(this.b,a)};_.k.close=function(){this.b.set("map",null)};_.t(_.Oe,_.A);_.wc(_.Oe.prototype,{content:_.Nb([_.ah,_.Mb(Ib)]),position:_.Pb(_.Yb),size:_.Pb(sc),map:_.Nb([_.gi,hi]),anchor:_.Pb(_.Jb(_.A,"MVCObject")),zIndex:_.$g});_.Oe.prototype.open=function(a,b){this.set("anchor",b);b?!this.get("map")&&a&&this.set("map",a):this.set("map",a)};_.Oe.prototype.close=function(){this.set("map",null)};_.Pe=[];_.t(Re,_.A);Re.prototype.changed=function(a){if("map"==a||"panel"==a){var b=this;_.F("directions",function(c){c.Ql(b,a)})}"panel"==a&&_.Qe(this.getPanel())};_.wc(Re.prototype,{directions:ni,map:_.gi,panel:_.Pb(_.Mb(Ib)),routeIndex:_.$g});Se.prototype.route=function(a,b){_.F("directions",function(c){c.Yh(a,b,!0)})};Te.prototype.getDistanceMatrix=function(a,b){_.F("distance_matrix",function(c){c.b(a,b)})};Xe.prototype.getElevationAlongPath=function(a,b){_.F("elevation",function(c){c.getElevationAlongPath(a,b)})};Xe.prototype.getElevationForLocations=function(a,b){_.F("elevation",function(c){c.getElevationForLocations(a,b)})};_.oi=_.Jb(_.$d,"LatLngBounds");_.Ye.prototype.geocode=function(a,b){_.F("geocoder",function(c){c.geocode(a,b)})};_.t(_.Ze,_.A);_.Ze.prototype.map_changed=function(){var a=this;_.F("kml",function(b){b.b(a)})};_.wc(_.Ze.prototype,{map:_.gi,url:null,bounds:null,opacity:_.$g});_.qi={UNKNOWN:"UNKNOWN",OK:_.ia,INVALID_REQUEST:_.ca,DOCUMENT_NOT_FOUND:"DOCUMENT_NOT_FOUND",FETCH_ERROR:"FETCH_ERROR",INVALID_DOCUMENT:"INVALID_DOCUMENT",DOCUMENT_TOO_LARGE:"DOCUMENT_TOO_LARGE",LIMITS_EXCEEDED:"LIMITS_EXECEEDED",TIMED_OUT:"TIMED_OUT"};_.t($e,_.A);_.k=$e.prototype;_.k.yd=function(){var a=this;_.F("kml",function(b){b.f(a)})};_.k.url_changed=$e.prototype.yd;_.k.driveFileId_changed=$e.prototype.yd;_.k.map_changed=$e.prototype.yd;_.k.zIndex_changed=$e.prototype.yd;_.wc($e.prototype,{map:_.gi,defaultViewport:null,metadata:null,status:null,url:_.ah,screenOverlays:_.bh,zIndex:_.$g});_.t(_.af,_.A);_.wc(_.af.prototype,{map:_.gi});_.t(bf,_.A);_.wc(bf.prototype,{map:_.gi});_.t(cf,_.A);_.wc(cf.prototype,{map:_.gi});_.qf={japan_prequake:20,japan_postquake2010:24};_.ri={NEAREST:"nearest",BEST:"best"};_.si={DEFAULT:"default",OUTDOOR:"outdoor"};var ti;_.t(df,_.M);var ui;_.t(ef,_.M);var vi;_.t(ff,_.M);var wi;_.t(gf,_.M);_.t(hf,_.M);_.t(_.jf,_.M);_.t(kf,_.M);_.t(lf,_.M);_.t(mf,_.M);_.t(sf,_.Dc);sf.prototype.visible_changed=function(){var a=this;!a.B&&a.getVisible()&&(a.B=!0,_.F("streetview",function(b){var c;a.j&&(c=a.j);b.dn(a,c)}))};_.wc(sf.prototype,{visible:_.bh,pano:_.ah,position:_.Pb(_.Yb),pov:_.Pb(fh),motionTracking:Zg,photographerPov:null,location:null,links:_.Lb(_.Mb(_.db)),status:null,zoom:_.$g,enableCloseButton:_.bh});sf.prototype.registerPanoProvider=function(a,b){this.set("panoProvider",{Qh:a,options:b||{}})};_.k=_.tf.prototype;_.k.Jd=_.ta(4);_.k.ib=_.ta(5);_.k.td=_.ta(6);_.k.sd=_.ta(7);_.k.rd=_.ta(8);_.t(uf,hd);_.vf.prototype.addListener=function(a,b){this.P.addListener(a,b)};_.vf.prototype.addListenerOnce=function(a,b){this.P.addListenerOnce(a,b)};_.vf.prototype.removeListener=function(a,b){this.P.removeListener(a,b)};_.vf.prototype.b=_.ta(9);_.rg={};_.wf.prototype.fromLatLngToPoint=function(a,b){b=b||new _.I(0,0);var c=this.b;b.x=c.x+a.lng()*this.j;a=_.Ya(Math.sin(_.Rb(a.lat())),-(1-1E-15),1-1E-15);b.y=c.y+.5*Math.log((1+a)/(1-a))*-this.l;return b};_.wf.prototype.fromPointToLatLng=function(a,b){var c=this.b;return new _.E(_.Sb(2*Math.atan(Math.exp((a.y-c.y)/-this.l))-Math.PI/2),(a.x-c.x)/this.j,b)};_.xf.prototype.isEmpty=function(){return!(this.I<this.L&&this.J<this.M)};_.xf.prototype.extend=function(a){a&&(this.I=Math.min(this.I,a.x),this.L=Math.max(this.L,a.x),this.J=Math.min(this.J,a.y),this.M=Math.max(this.M,a.y))};_.xf.prototype.getCenter=function(){return new _.I((this.I+this.L)/2,(this.J+this.M)/2)};_.xi=_.yf(-window.Infinity,-window.Infinity,window.Infinity,window.Infinity);_.yi=_.yf(0,0,0,0);_.t(_.Bf,_.A);_.Bf.prototype.K=function(){var a=this;a.D||(a.D=window.setTimeout(function(){a.D=void 0;a.X()},a.Ci))};_.Bf.prototype.B=function(){this.D&&window.clearTimeout(this.D);this.D=void 0;this.X()};var zi;_.t(Ef,_.M);var Ai;_.t(Ff,_.M);var Bi;_.t(Gf,_.M);var Mi;_.t(Hf,_.M);var Ni;_.t(If,_.M);If.prototype.getZoom=function(){return _.N(this,2)};If.prototype.setZoom=function(a){this.data[2]=a};_.t(Jf,_.Bf);var Kf={roadmap:0,satellite:2,hybrid:3,terrain:4},Oi={0:1,2:2,3:2,4:2};_.k=Jf.prototype;_.k.Yg=_.tc("center");_.k.lg=_.tc("zoom");_.k.changed=function(){var a=this.Yg(),b=this.lg(),c=Lf(this);if(a&&!a.b(this.G)||this.F!=b||this.O!=c)Uf(this.f),this.K(),this.F=b,this.O=c;this.G=a};
_.k.X=function(){var a="",b=this.Yg(),c=this.lg(),d=Lf(this),e=this.get("size");if(e){if(b&&(0,window.isFinite)(b.lat())&&(0,window.isFinite)(b.lng())&&1<c&&null!=d&&e&&e.width&&e.height&&this.b){_.Cf(this.b,e);var f;(b=_.zf(this.l,b,c))?(f=new _.xf,f.I=Math.round(b.x-e.width/2),f.L=f.I+e.width,f.J=Math.round(b.y-e.height/2),f.M=f.J+e.height):f=null;b=Oi[d];if(f){var a=new If,g=new Gf(_.Q(a,0));g.data[0]=f.I;g.data[1]=f.J;a.data[1]=b;a.setZoom(c);c=new Hf(_.Q(a,3));c.data[0]=f.L-f.I;c.data[1]=f.M-
f.J;c=new Ff(_.Q(a,4));c.data[0]=d;c.data[4]=_.nf(_.pf(_.R));c.data[5]=_.of(_.pf(_.R)).toLowerCase();c.data[9]=!0;c.data[11]=!0;d=this.C+(0,window.unescape)("%3F");if(!Ni){c=Ni={b:-1,A:[]};b=new Gf([]);Bi||(Bi={b:-1,A:[,_.S,_.S]});b=_.K(b,Bi);f=new Hf([]);Mi||(Mi={b:-1,A:[]},Mi.A=[,_.qh,_.qh,_.xd(1)]);f=_.K(f,Mi);g=new Ff([]);if(!Ai){var h=[];Ai={b:-1,A:h};h[1]=_.U;h[2]=_.T;h[3]=_.T;h[5]=_.V;h[6]=_.V;var l=new Ef([]);zi||(zi={b:-1,A:[,_.uh,_.T]});h[9]=_.K(l,zi);h[10]=_.T;h[11]=_.T;h[12]=_.T;h[13]=
_.uh;h[100]=_.T}g=_.K(g,Ai);h=new df([]);if(!ti){var l=ti={b:-1,A:[]},n=new ef([]);ui||(ui={b:-1,A:[,_.T]});var n=_.K(n,ui),q=new gf([]);wi||(wi={b:-1,A:[,_.T,_.T]});var q=_.K(q,wi),r=new ff([]);vi||(vi={b:-1,A:[,_.T]});l.A=[,n,,,,,,,,,q,,_.K(r,vi)]}c.A=[,b,_.U,_.qh,f,g,_.K(h,ti)]}a=_.Bh.b(a.data,Ni);a=this.m(d+a)}}this.f&&(_.Cf(this.f,e),Wf(this,a))}};
_.k.div_changed=function(){var a=this.get("div"),b=this.b;if(a)if(b)a.appendChild(b);else{b=this.b=window.document.createElement("div");b.style.overflow="hidden";var c=this.f=window.document.createElement("img");_.z.addDomListener(b,"contextmenu",function(a){_.mb(a);_.ob(a)});c.ontouchstart=c.ontouchmove=c.ontouchend=c.ontouchcancel=function(a){_.nb(a);_.ob(a)};_.Cf(c,_.dh);a.appendChild(b);this.X()}else b&&(Uf(b),this.b=null)};var cg;_.qg="StopIteration"in _.Nc?_.Nc.StopIteration:{message:"StopIteration",stack:""};_.eg.prototype.next=function(){throw _.qg;};_.eg.prototype.Le=function(){return this};_.fg.prototype.nf=!0;_.fg.prototype.Ab=_.ta(11);_.fg.prototype.mh=!0;_.fg.prototype.Qd=_.ta(13);_.gg("about:blank");_.ig.prototype.mh=!0;_.ig.prototype.Qd=_.ta(12);_.ig.prototype.nf=!0;_.ig.prototype.Ab=_.ta(10);_.hg={};_.jg("<!DOCTYPE html>",0);_.jg("",0);_.jg("<br>",0);!_.Gh&&!_.Eh||_.Eh&&9<=Number(_.Th)||_.Gh&&_.Ld("1.9.1");_.Eh&&_.Ld("9");_.t(mg,_.eg);mg.prototype.setPosition=function(a,b,c){if(this.node=a)this.f=_.Aa(b)?b:1!=this.node.nodeType?0:this.b?-1:1;_.Aa(c)&&(this.depth=c)};
mg.prototype.next=function(){var a;if(this.j){if(!this.node||this.l&&0==this.depth)throw _.qg;a=this.node;var b=this.b?-1:1;if(this.f==b){var c=this.b?a.lastChild:a.firstChild;c?this.setPosition(c):this.setPosition(a,-1*b)}else(c=this.b?a.previousSibling:a.nextSibling)?this.setPosition(c):this.setPosition(a.parentNode,-1*b);this.depth+=this.f*(this.b?-1:1)}else this.j=!0;a=this.node;if(!this.node)throw _.qg;return a};
mg.prototype.splice=function(a){var b=this.node,c=this.b?1:-1;this.f==c&&(this.f=-1*c,this.depth+=this.f*(this.b?-1:1));this.b=!this.b;mg.prototype.next.call(this);this.b=!this.b;for(var c=_.ya(arguments[0])?arguments[0]:arguments,d=c.length-1;0<=d;d--)_.kg(c[d],b);_.lg(b)};_.t(ng,mg);ng.prototype.next=function(){do ng.Jb.next.call(this);while(-1==this.f);return this.node};_.t(ug,_.de);_.k=ug.prototype;_.k.streetView_changed=function(){var a=this.get("streetView");a?a.set("standAlone",!1):this.set("streetView",this.__gm.j)};_.k.getDiv=function(){return this.__gm.R};_.k.panBy=function(a,b){var c=this.__gm;_.F("map",function(){_.z.trigger(c,"panby",a,b)})};_.k.panTo=function(a){var b=this.__gm;a=_.Yb(a);_.F("map",function(){_.z.trigger(b,"panto",a)})};_.k.panToBounds=function(a){var b=this.__gm,c=_.ce(a);_.F("map",function(){_.z.trigger(b,"pantolatlngbounds",c)})};
_.k.fitBounds=function(a){var b=this;a=_.ce(a);_.F("map",function(c){c.fitBounds(b,a)})};_.wc(ug.prototype,{bounds:null,streetView:hi,center:_.Pb(_.Yb),zoom:_.$g,mapTypeId:_.ah,projection:null,heading:_.$g,tilt:_.$g,clickableIcons:Zg});vg.prototype.getMaxZoomAtLatLng=function(a,b){_.F("maxzoom",function(c){c.getMaxZoomAtLatLng(a,b)})};_.t(wg,_.A);wg.prototype.changed=function(a){if("suppressInfoWindows"!=a&&"clickable"!=a){var b=this;_.F("onion",function(a){a.b(b)})}};_.wc(wg.prototype,{map:_.gi,tableId:_.$g,query:_.Pb(_.Nb([_.Yg,_.Mb(_.db,"not an Object")]))});_.t(_.xg,_.A);_.xg.prototype.map_changed=function(){var a=this;_.F("overlay",function(b){b.pk(a)})};_.wc(_.xg.prototype,{panes:null,projection:null,map:_.Nb([_.gi,hi])});_.t(_.yg,_.A);_.yg.prototype.map_changed=_.yg.prototype.visible_changed=function(){var a=this;_.F("poly",function(b){b.b(a)})};_.yg.prototype.center_changed=function(){_.z.trigger(this,"bounds_changed")};_.yg.prototype.radius_changed=_.yg.prototype.center_changed;_.yg.prototype.getBounds=function(){var a=this.get("radius"),b=this.get("center");if(b&&_.x(a)){var c=this.get("map"),c=c&&c.__gm.get("baseMapType");return _.Af(b,a/_.ze(c))}return null};
_.wc(_.yg.prototype,{center:_.Pb(_.Yb),draggable:_.bh,editable:_.bh,map:_.gi,radius:_.$g,visible:_.bh});_.t(_.zg,_.A);_.zg.prototype.map_changed=_.zg.prototype.visible_changed=function(){var a=this;_.F("poly",function(b){b.j(a)})};_.wc(_.zg.prototype,{draggable:_.bh,editable:_.bh,bounds:_.Pb(_.ce),map:_.gi,visible:_.bh});_.t(Ag,_.A);Ag.prototype.map_changed=function(){var a=this;_.F("streetview",function(b){b.nk(a)})};_.wc(Ag.prototype,{map:_.gi});_.Bg.prototype.getPanorama=function(a,b){var c=this.b||void 0;_.F("streetview",function(d){_.F("geometry",function(e){d.ql(a,b,e.computeHeading,e.computeOffset,c)})})};_.Bg.prototype.getPanoramaByLocation=function(a,b,c){this.getPanorama({location:a,radius:b,preference:50>(b||0)?"best":"nearest"},c)};_.Bg.prototype.getPanoramaById=function(a,b){this.getPanorama({pano:a},b)};_.t(_.Cg,_.A);_.k=_.Cg.prototype;_.k.getTile=function(a,b,c){if(!a||!c)return null;var d=c.createElement("div");c={W:a,zoom:b,Kb:null};d.__gmimt=c;_.Ac(this.b,d);var e=Eg(this);1!=e&&Dg(d,e);if(this.f){var e=this.tileSize||new _.J(256,256),f=this.j(a,b);c.Kb=this.f(a,b,e,d,f,function(){_.z.trigger(d,"load")})}return d};_.k.releaseTile=function(a){a&&this.b.contains(a)&&(this.b.remove(a),(a=a.__gmimt.Kb)&&a.release())};_.k.af=_.ta(14);
_.k.opacity_changed=function(){var a=Eg(this);this.b.forEach(function(b){Dg(b,a)})};_.k.pd=!0;_.wc(_.Cg.prototype,{opacity:_.$g});_.t(_.Fg,_.A);_.Fg.prototype.getTile=gh;_.Fg.prototype.tileSize=new _.J(256,256);_.Fg.prototype.pd=!0;_.t(_.Gg,_.Fg);_.t(_.Hg,_.A);_.wc(_.Hg.prototype,{attribution:_.Pb(bi),place:_.Pb(ci)});var Qi={Animation:{BOUNCE:1,DROP:2,To:3,Ro:4},Circle:_.yg,ControlPosition:_.rf,Data:Je,GroundOverlay:_.Ze,ImageMapType:_.Cg,InfoWindow:_.Oe,LatLng:_.E,LatLngBounds:_.$d,MVCArray:_.yc,MVCObject:_.A,Map:ug,MapTypeControlStyle:{DEFAULT:0,HORIZONTAL_BAR:1,DROPDOWN_MENU:2,INSET:3,INSET_LARGE:4},MapTypeId:_.Vg,MapTypeRegistry:Nd,Marker:_.xe,MarkerImage:function(a,b,c,d,e){this.url=a;this.size=b||e;this.origin=c;this.anchor=d;this.scaledSize=e;this.labelOrigin=null},NavigationControlStyle:{DEFAULT:0,SMALL:1,
ANDROID:2,ZOOM_PAN:3,Uo:4,Yj:5},OverlayView:_.xg,Point:_.I,Polygon:_.Fe,Polyline:_.Ge,Rectangle:_.zg,ScaleControlStyle:{DEFAULT:0},Size:_.J,StreetViewPreference:_.ri,StreetViewSource:_.si,StrokePosition:{CENTER:0,INSIDE:1,OUTSIDE:2},SymbolPath:eh,ZoomControlStyle:{DEFAULT:0,SMALL:1,LARGE:2,Yj:3},event:_.z};
_.Wa(Qi,{BicyclingLayer:_.af,DirectionsRenderer:Re,DirectionsService:Se,DirectionsStatus:{OK:_.ia,UNKNOWN_ERROR:_.la,OVER_QUERY_LIMIT:_.ja,REQUEST_DENIED:_.ka,INVALID_REQUEST:_.ca,ZERO_RESULTS:_.ma,MAX_WAYPOINTS_EXCEEDED:_.fa,NOT_FOUND:_.ha},DirectionsTravelMode:_.ji,DirectionsUnitSystem:_.ii,DistanceMatrixService:Te,DistanceMatrixStatus:{OK:_.ia,INVALID_REQUEST:_.ca,OVER_QUERY_LIMIT:_.ja,REQUEST_DENIED:_.ka,UNKNOWN_ERROR:_.la,MAX_ELEMENTS_EXCEEDED:_.ea,MAX_DIMENSIONS_EXCEEDED:_.da},DistanceMatrixElementStatus:{OK:_.ia,
NOT_FOUND:_.ha,ZERO_RESULTS:_.ma},ElevationService:Xe,ElevationStatus:{OK:_.ia,UNKNOWN_ERROR:_.la,OVER_QUERY_LIMIT:_.ja,REQUEST_DENIED:_.ka,INVALID_REQUEST:_.ca,Oo:"DATA_NOT_AVAILABLE"},FusionTablesLayer:wg,Geocoder:_.Ye,GeocoderLocationType:{ROOFTOP:"ROOFTOP",RANGE_INTERPOLATED:"RANGE_INTERPOLATED",GEOMETRIC_CENTER:"GEOMETRIC_CENTER",APPROXIMATE:"APPROXIMATE"},GeocoderStatus:{OK:_.ia,UNKNOWN_ERROR:_.la,OVER_QUERY_LIMIT:_.ja,REQUEST_DENIED:_.ka,INVALID_REQUEST:_.ca,ZERO_RESULTS:_.ma,ERROR:_.ba},KmlLayer:$e,
KmlLayerStatus:_.qi,MaxZoomService:vg,MaxZoomStatus:{OK:_.ia,ERROR:_.ba},SaveWidget:_.Hg,StreetViewCoverageLayer:Ag,StreetViewPanorama:sf,StreetViewService:_.Bg,StreetViewStatus:{OK:_.ia,UNKNOWN_ERROR:_.la,ZERO_RESULTS:_.ma},StyledMapType:_.Gg,TrafficLayer:bf,TrafficModel:_.ki,TransitLayer:cf,TransitMode:_.li,TransitRoutePreference:_.mi,TravelMode:_.ji,UnitSystem:_.ii});_.Wa(Je,{Feature:_.mc,Geometry:Xb,GeometryCollection:_.ie,LineString:_.ke,LinearRing:_.oe,MultiLineString:_.me,MultiPoint:_.ne,MultiPolygon:_.te,Point:_.Zb,Polygon:_.re});_.kc("main",{});var Kg=/'/g,Lg;var ve=arguments[0];
window.google.maps.Load(function(a,b){var c=window.google.maps;Tg();var d=Ug(c);_.R=new lf(a);_.Ri=Math.random()<_.N(_.R,0,1);_.Si=Math.round(1E15*Math.random()).toString(36);_.tg=Mg();_.pi=Ng();_.Pi=new _.yc;_.ag=b;for(a=0;a<_.Bd(_.R,8);++a)_.rg[_.Ad(_.R,8,a)]=!0;a=new _.jf(_.R.data[3]);we(_.P(a,0));_.Va(Qi,function(a,b){c[a]=b});c.version=_.P(a,1);window.setTimeout(function(){lc(["util","stats"],function(a,b){a.f.b();a.j();d&&b.b.b({ev:"api_alreadyloaded",client:_.P(_.R,6),key:_.P(_.R,16)})})},
5E3);_.z.wn();cg=new bg;(a=_.P(_.R,11))&&lc(_.zd(_.R,12),Og(a),!0)});}).call(this,{});


!function (a, b, c, d) {
    function e(b, c) {
        this.settings = null, this.options = a.extend({}, e.Defaults, c), this.$element = a(b), this.drag = a.extend({}, m), this.state = a.extend({}, n), this.e = a.extend({}, o), this._plugins = {}, this._supress = {}, this._current = null, this._speed = null, this._coordinates = [], this._breakpoint = null, this._width = null, this._items = [], this._clones = [], this._mergers = [], this._invalidated = {}, this._pipe = [], a.each(e.Plugins, a.proxy(function (a, b) {
            this._plugins[a[0].toLowerCase() + a.slice(1)] = new b(this)
        }, this)), a.each(e.Pipe, a.proxy(function (b, c) {
            this._pipe.push({filter: c.filter, run: a.proxy(c.run, this)})
        }, this)), this.setup(), this.initialize()
    }

    function f(a) {
        if (a.touches !== d)return{x: a.touches[0].pageX, y: a.touches[0].pageY};
        if (a.touches === d) {
            if (a.pageX !== d)return{x: a.pageX, y: a.pageY};
            if (a.pageX === d)return{x: a.clientX, y: a.clientY}
        }
    }

    function g(a) {
        var b, d, e = c.createElement("div"), f = a;
        for (b in f)if (d = f[b], "undefined" != typeof e.style[d])return e = null, [d, b];
        return[!1]
    }

    function h() {
        return g(["transition", "WebkitTransition", "MozTransition", "OTransition"])[1]
    }

    function i() {
        return g(["transform", "WebkitTransform", "MozTransform", "OTransform", "msTransform"])[0]
    }

    function j() {
        return g(["perspective", "webkitPerspective", "MozPerspective", "OPerspective", "MsPerspective"])[0]
    }

    function k() {
        return"ontouchstart"in b || !!navigator.msMaxTouchPoints
    }

    function l() {
        return b.navigator.msPointerEnabled
    }

    var m, n, o;
    m = {start: 0, startX: 0, startY: 0, current: 0, currentX: 0, currentY: 0, offsetX: 0, offsetY: 0, distance: null, startTime: 0, endTime: 0, updatedX: 0, targetEl: null}, n = {isTouch: !1, isScrolling: !1, isSwiping: !1, direction: !1, inMotion: !1}, o = {_onDragStart: null, _onDragMove: null, _onDragEnd: null, _transitionEnd: null, _resizer: null, _responsiveCall: null, _goToLoop: null, _checkVisibile: null}, e.Defaults = {items: 3, loop: !1, center: !1, mouseDrag: !0, touchDrag: !0, pullDrag: !0, freeDrag: !1, margin: 0, stagePadding: 0, merge: !1, mergeFit: !0, autoWidth: !1, startPosition: 0, rtl: !1, smartSpeed: 250, fluidSpeed: !1, dragEndSpeed: !1, responsive: {}, responsiveRefreshRate: 200, responsiveBaseElement: b, responsiveClass: !1, fallbackEasing: "swing", info: !1, nestedItemSelector: !1, itemElement: "div", stageElement: "div", themeClass: "owl-theme", baseClass: "owl-carousel", itemClass: "owl-item", centerClass: "center", activeClass: "active"}, e.Width = {Default: "default", Inner: "inner", Outer: "outer"}, e.Plugins = {}, e.Pipe = [
        {filter: ["width", "items", "settings"], run: function (a) {
            a.current = this._items && this._items[this.relative(this._current)]
        }},
        {filter: ["items", "settings"], run: function () {
            var a = this._clones, b = this.$stage.children(".cloned");
            (b.length !== a.length || !this.settings.loop && a.length > 0) && (this.$stage.children(".cloned").remove(), this._clones = [])
        }},
        {filter: ["items", "settings"], run: function () {
            var a, b, c = this._clones, d = this._items, e = this.settings.loop ? c.length - Math.max(2 * this.settings.items, 4) : 0;
            for (a = 0, b = Math.abs(e / 2); b > a; a++)e > 0 ? (this.$stage.children().eq(d.length + c.length - 1).remove(), c.pop(), this.$stage.children().eq(0).remove(), c.pop()) : (c.push(c.length / 2), this.$stage.append(d[c[c.length - 1]].clone().addClass("cloned")), c.push(d.length - 1 - (c.length - 1) / 2), this.$stage.prepend(d[c[c.length - 1]].clone().addClass("cloned")))
        }},
        {filter: ["width", "items", "settings"], run: function () {
            var a, b, c, d = this.settings.rtl ? 1 : -1, e = (this.width() / this.settings.items).toFixed(3), f = 0;
            for (this._coordinates = [], b = 0, c = this._clones.length + this._items.length; c > b; b++)a = this._mergers[this.relative(b)], a = this.settings.mergeFit && Math.min(a, this.settings.items) || a, f += (this.settings.autoWidth ? this._items[this.relative(b)].width() + this.settings.margin : e * a) * d, this._coordinates.push(f)
        }},
        {filter: ["width", "items", "settings"], run: function () {
            var b, c, d = (this.width() / this.settings.items).toFixed(3), e = {width: Math.abs(this._coordinates[this._coordinates.length - 1]) + 2 * this.settings.stagePadding, "padding-left": this.settings.stagePadding || "", "padding-right": this.settings.stagePadding || ""};
            if (this.$stage.css(e), e = {width: this.settings.autoWidth ? "auto" : d - this.settings.margin}, e[this.settings.rtl ? "margin-left" : "margin-right"] = this.settings.margin, !this.settings.autoWidth && a.grep(this._mergers,function (a) {
                return a > 1
            }).length > 0)for (b = 0, c = this._coordinates.length; c > b; b++)e.width = Math.abs(this._coordinates[b]) - Math.abs(this._coordinates[b - 1] || 0) - this.settings.margin, this.$stage.children().eq(b).css(e); else this.$stage.children().css(e)
        }},
        {filter: ["width", "items", "settings"], run: function (a) {
            a.current && this.reset(this.$stage.children().index(a.current))
        }},
        {filter: ["position"], run: function () {
            this.animate(this.coordinates(this._current))
        }},
        {filter: ["width", "position", "items", "settings"], run: function () {
            var a, b, c, d, e = this.settings.rtl ? 1 : -1, f = 2 * this.settings.stagePadding, g = this.coordinates(this.current()) + f, h = g + this.width() * e, i = [];
            for (c = 0, d = this._coordinates.length; d > c; c++)a = this._coordinates[c - 1] || 0, b = Math.abs(this._coordinates[c]) + f * e, (this.op(a, "<=", g) && this.op(a, ">", h) || this.op(b, "<", g) && this.op(b, ">", h)) && i.push(c);
            this.$stage.children("." + this.settings.activeClass).removeClass(this.settings.activeClass), this.$stage.children(":eq(" + i.join("), :eq(") + ")").addClass(this.settings.activeClass), this.settings.center && (this.$stage.children("." + this.settings.centerClass).removeClass(this.settings.centerClass), this.$stage.children().eq(this.current()).addClass(this.settings.centerClass))
        }}
    ], e.prototype.initialize = function () {
        if (this.trigger("initialize"), this.$element.addClass(this.settings.baseClass).addClass(this.settings.themeClass).toggleClass("owl-rtl", this.settings.rtl), this.browserSupport(), this.settings.autoWidth && this.state.imagesLoaded !== !0) {
            var b, c, e;
            if (b = this.$element.find("img"), c = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : d, e = this.$element.children(c).width(), b.length && 0 >= e)return this.preloadAutoWidthImages(b), !1
        }
        this.$element.addClass("owl-loading"), this.$stage = a("<" + this.settings.stageElement + ' class="owl-stage"/>').wrap('<div class="owl-stage-outer">'), this.$element.append(this.$stage.parent()), this.replace(this.$element.children().not(this.$stage.parent())), this._width = this.$element.width(), this.refresh(), this.$element.removeClass("owl-loading").addClass("owl-loaded"), this.eventsCall(), this.internalEvents(), this.addTriggerableEvents(), this.trigger("initialized")
    }, e.prototype.setup = function () {
        var b = this.viewport(), c = this.options.responsive, d = -1, e = null;
        c ? (a.each(c, function (a) {
            b >= a && a > d && (d = Number(a))
        }), e = a.extend({}, this.options, c[d]), delete e.responsive, e.responsiveClass && this.$element.attr("class",function (a, b) {
            return b.replace(/\b owl-responsive-\S+/g, "")
        }).addClass("owl-responsive-" + d)) : e = a.extend({}, this.options), (null === this.settings || this._breakpoint !== d) && (this.trigger("change", {property: {name: "settings", value: e}}), this._breakpoint = d, this.settings = e, this.invalidate("settings"), this.trigger("changed", {property: {name: "settings", value: this.settings}}))
    }, e.prototype.optionsLogic = function () {
        this.$element.toggleClass("owl-center", this.settings.center), this.settings.loop && this._items.length < this.settings.items && (this.settings.loop = !1), this.settings.autoWidth && (this.settings.stagePadding = !1, this.settings.merge = !1)
    }, e.prototype.prepare = function (b) {
        var c = this.trigger("prepare", {content: b});
        return c.data || (c.data = a("<" + this.settings.itemElement + "/>").addClass(this.settings.itemClass).append(b)), this.trigger("prepared", {content: c.data}), c.data
    }, e.prototype.update = function () {
        for (var b = 0, c = this._pipe.length, d = a.proxy(function (a) {
            return this[a]
        }, this._invalidated), e = {}; c > b;)(this._invalidated.all || a.grep(this._pipe[b].filter, d).length > 0) && this._pipe[b].run(e), b++;
        this._invalidated = {}
    }, e.prototype.width = function (a) {
        switch (a = a || e.Width.Default) {
            case e.Width.Inner:
            case e.Width.Outer:
                return this._width;
            default:
                return this._width - 2 * this.settings.stagePadding + this.settings.margin
        }
    }, e.prototype.refresh = function () {
        if (0 === this._items.length)return!1;
        (new Date).getTime();
        this.trigger("refresh"), this.setup(), this.optionsLogic(), this.$stage.addClass("owl-refresh"), this.update(), this.$stage.removeClass("owl-refresh"), this.state.orientation = b.orientation, this.watchVisibility(), this.trigger("refreshed")
    }, e.prototype.eventsCall = function () {
        this.e._onDragStart = a.proxy(function (a) {
            this.onDragStart(a)
        }, this), this.e._onDragMove = a.proxy(function (a) {
            this.onDragMove(a)
        }, this), this.e._onDragEnd = a.proxy(function (a) {
            this.onDragEnd(a)
        }, this), this.e._onResize = a.proxy(function (a) {
            this.onResize(a)
        }, this), this.e._transitionEnd = a.proxy(function (a) {
            this.transitionEnd(a)
        }, this), this.e._preventClick = a.proxy(function (a) {
            this.preventClick(a)
        }, this)
    }, e.prototype.onThrottledResize = function () {
        b.clearTimeout(this.resizeTimer), this.resizeTimer = b.setTimeout(this.e._onResize, this.settings.responsiveRefreshRate)
    }, e.prototype.onResize = function () {
        return this._items.length ? this._width === this.$element.width() ? !1 : this.trigger("resize").isDefaultPrevented() ? !1 : (this._width = this.$element.width(), this.invalidate("width"), this.refresh(), void this.trigger("resized")) : !1
    }, e.prototype.eventsRouter = function (a) {
        var b = a.type;
        "mousedown" === b || "touchstart" === b ? this.onDragStart(a) : "mousemove" === b || "touchmove" === b ? this.onDragMove(a) : "mouseup" === b || "touchend" === b ? this.onDragEnd(a) : "touchcancel" === b && this.onDragEnd(a)
    }, e.prototype.internalEvents = function () {
        var c = (k(), l());
        this.settings.mouseDrag ? (this.$stage.on("mousedown", a.proxy(function (a) {
            this.eventsRouter(a)
        }, this)), this.$stage.on("dragstart", function () {
            return!1
        }), this.$stage.get(0).onselectstart = function () {
            return!1
        }) : this.$element.addClass("owl-text-select-on"), this.settings.touchDrag && !c && this.$stage.on("touchstart touchcancel", a.proxy(function (a) {
            this.eventsRouter(a)
        }, this)), this.transitionEndVendor && this.on(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd, !1), this.settings.responsive !== !1 && this.on(b, "resize", a.proxy(this.onThrottledResize, this))
    }, e.prototype.onDragStart = function (d) {
        var e, g, h, i;
        if (e = d.originalEvent || d || b.event, 3 === e.which || this.state.isTouch)return!1;
        if ("mousedown" === e.type && this.$stage.addClass("owl-grab"), this.trigger("drag"), this.drag.startTime = (new Date).getTime(), this.speed(0), this.state.isTouch = !0, this.state.isScrolling = !1, this.state.isSwiping = !1, this.drag.distance = 0, g = f(e).x, h = f(e).y, this.drag.offsetX = this.$stage.position().left, this.drag.offsetY = this.$stage.position().top, this.settings.rtl && (this.drag.offsetX = this.$stage.position().left + this.$stage.width() - this.width() + this.settings.margin), this.state.inMotion && this.support3d)i = this.getTransformProperty(), this.drag.offsetX = i, this.animate(i), this.state.inMotion = !0; else if (this.state.inMotion && !this.support3d)return this.state.inMotion = !1, !1;
        this.drag.startX = g - this.drag.offsetX, this.drag.startY = h - this.drag.offsetY, this.drag.start = g - this.drag.startX, this.drag.targetEl = e.target || e.srcElement, this.drag.updatedX = this.drag.start, ("IMG" === this.drag.targetEl.tagName || "A" === this.drag.targetEl.tagName) && (this.drag.targetEl.draggable = !1), a(c).on("mousemove.owl.dragEvents mouseup.owl.dragEvents touchmove.owl.dragEvents touchend.owl.dragEvents", a.proxy(function (a) {
            this.eventsRouter(a)
        }, this))
    }, e.prototype.onDragMove = function (a) {
        var c, e, g, h, i, j;
        this.state.isTouch && (this.state.isScrolling || (c = a.originalEvent || a || b.event, e = f(c).x, g = f(c).y, this.drag.currentX = e - this.drag.startX, this.drag.currentY = g - this.drag.startY, this.drag.distance = this.drag.currentX - this.drag.offsetX, this.drag.distance < 0 ? this.state.direction = this.settings.rtl ? "right" : "left" : this.drag.distance > 0 && (this.state.direction = this.settings.rtl ? "left" : "right"), this.settings.loop ? this.op(this.drag.currentX, ">", this.coordinates(this.minimum())) && "right" === this.state.direction ? this.drag.currentX -= (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length) : this.op(this.drag.currentX, "<", this.coordinates(this.maximum())) && "left" === this.state.direction && (this.drag.currentX += (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length)) : (h = this.coordinates(this.settings.rtl ? this.maximum() : this.minimum()), i = this.coordinates(this.settings.rtl ? this.minimum() : this.maximum()), j = this.settings.pullDrag ? this.drag.distance / 5 : 0, this.drag.currentX = Math.max(Math.min(this.drag.currentX, h + j), i + j)), (this.drag.distance > 8 || this.drag.distance < -8) && (c.preventDefault !== d ? c.preventDefault() : c.returnValue = !1, this.state.isSwiping = !0), this.drag.updatedX = this.drag.currentX, (this.drag.currentY > 16 || this.drag.currentY < -16) && this.state.isSwiping === !1 && (this.state.isScrolling = !0, this.drag.updatedX = this.drag.start), this.animate(this.drag.updatedX)))
    }, e.prototype.onDragEnd = function (b) {
        var d, e, f;
        if (this.state.isTouch) {
            if ("mouseup" === b.type && this.$stage.removeClass("owl-grab"), this.trigger("dragged"), this.drag.targetEl.removeAttribute("draggable"), this.state.isTouch = !1, this.state.isScrolling = !1, this.state.isSwiping = !1, 0 === this.drag.distance && this.state.inMotion !== !0)return this.state.inMotion = !1, !1;
            this.drag.endTime = (new Date).getTime(), d = this.drag.endTime - this.drag.startTime, e = Math.abs(this.drag.distance), (e > 3 || d > 300) && this.removeClick(this.drag.targetEl), f = this.closest(this.drag.updatedX), this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed), this.current(f), this.invalidate("position"), this.update(), this.settings.pullDrag || this.drag.updatedX !== this.coordinates(f) || this.transitionEnd(), this.drag.distance = 0, a(c).off(".owl.dragEvents")
        }
    }, e.prototype.removeClick = function (c) {
        this.drag.targetEl = c, a(c).on("click.preventClick", this.e._preventClick), b.setTimeout(function () {
            a(c).off("click.preventClick")
        }, 300)
    }, e.prototype.preventClick = function (b) {
        b.preventDefault ? b.preventDefault() : b.returnValue = !1, b.stopPropagation && b.stopPropagation(), a(b.target).off("click.preventClick")
    }, e.prototype.getTransformProperty = function () {
        var a, c;
        return a = b.getComputedStyle(this.$stage.get(0), null).getPropertyValue(this.vendorName + "transform"), a = a.replace(/matrix(3d)?\(|\)/g, "").split(","), c = 16 === a.length, c !== !0 ? a[4] : a[12]
    }, e.prototype.closest = function (b) {
        var c = -1, d = 30, e = this.width(), f = this.coordinates();
        return this.settings.freeDrag || a.each(f, a.proxy(function (a, g) {
            return b > g - d && g + d > b ? c = a : this.op(b, "<", g) && this.op(b, ">", f[a + 1] || g - e) && (c = "left" === this.state.direction ? a + 1 : a), -1 === c
        }, this)), this.settings.loop || (this.op(b, ">", f[this.minimum()]) ? c = b = this.minimum() : this.op(b, "<", f[this.maximum()]) && (c = b = this.maximum())), c
    }, e.prototype.animate = function (b) {
        this.trigger("translate"), this.state.inMotion = this.speed() > 0, this.support3d ? this.$stage.css({transform: "translate3d(" + b + "px,0px, 0px)", transition: this.speed() / 1e3 + "s"}) : this.state.isTouch ? this.$stage.css({left: b + "px"}) : this.$stage.animate({left: b}, this.speed() / 1e3, this.settings.fallbackEasing, a.proxy(function () {
            this.state.inMotion && this.transitionEnd()
        }, this))
    }, e.prototype.current = function (a) {
        if (a === d)return this._current;
        if (0 === this._items.length)return d;
        if (a = this.normalize(a), this._current !== a) {
            var b = this.trigger("change", {property: {name: "position", value: a}});
            b.data !== d && (a = this.normalize(b.data)), this._current = a, this.invalidate("position"), this.trigger("changed", {property: {name: "position", value: this._current}})
        }
        return this._current
    }, e.prototype.invalidate = function (a) {
        this._invalidated[a] = !0
    }, e.prototype.reset = function (a) {
        a = this.normalize(a), a !== d && (this._speed = 0, this._current = a, this.suppress(["translate", "translated"]), this.animate(this.coordinates(a)), this.release(["translate", "translated"]))
    }, e.prototype.normalize = function (b, c) {
        var e = c ? this._items.length : this._items.length + this._clones.length;
        return!a.isNumeric(b) || 1 > e ? d : b = this._clones.length ? (b % e + e) % e : Math.max(this.minimum(c), Math.min(this.maximum(c), b))
    }, e.prototype.relative = function (a) {
        return a = this.normalize(a), a -= this._clones.length / 2, this.normalize(a, !0)
    }, e.prototype.maximum = function (a) {
        var b, c, d, e = 0, f = this.settings;
        if (a)return this._items.length - 1;
        if (!f.loop && f.center)b = this._items.length - 1; else if (f.loop || f.center)if (f.loop || f.center)b = this._items.length + f.items; else {
            if (!f.autoWidth && !f.merge)throw"Can not detect maximum absolute position.";
            for (revert = f.rtl ? 1 : -1, c = this.$stage.width() - this.$element.width(); (d = this.coordinates(e)) && !(d * revert >= c);)b = ++e
        } else b = this._items.length - f.items;
        return b
    }, e.prototype.minimum = function (a) {
        return a ? 0 : this._clones.length / 2
    }, e.prototype.items = function (a) {
        return a === d ? this._items.slice() : (a = this.normalize(a, !0), this._items[a])
    }, e.prototype.mergers = function (a) {
        return a === d ? this._mergers.slice() : (a = this.normalize(a, !0), this._mergers[a])
    }, e.prototype.clones = function (b) {
        var c = this._clones.length / 2, e = c + this._items.length, f = function (a) {
            return a % 2 === 0 ? e + a / 2 : c - (a + 1) / 2
        };
        return b === d ? a.map(this._clones, function (a, b) {
            return f(b)
        }) : a.map(this._clones, function (a, c) {
            return a === b ? f(c) : null
        })
    }, e.prototype.speed = function (a) {
        return a !== d && (this._speed = a), this._speed
    }, e.prototype.coordinates = function (b) {
        var c = null;
        return b === d ? a.map(this._coordinates, a.proxy(function (a, b) {
            return this.coordinates(b)
        }, this)) : (this.settings.center ? (c = this._coordinates[b], c += (this.width() - c + (this._coordinates[b - 1] || 0)) / 2 * (this.settings.rtl ? -1 : 1)) : c = this._coordinates[b - 1] || 0, c)
    }, e.prototype.duration = function (a, b, c) {
        return Math.min(Math.max(Math.abs(b - a), 1), 6) * Math.abs(c || this.settings.smartSpeed)
    }, e.prototype.to = function (c, d) {
        if (this.settings.loop) {
            var e = c - this.relative(this.current()), f = this.current(), g = this.current(), h = this.current() + e, i = 0 > g - h ? !0 : !1, j = this._clones.length + this._items.length;
            h < this.settings.items && i === !1 ? (f = g + this._items.length, this.reset(f)) : h >= j - this.settings.items && i === !0 && (f = g - this._items.length, this.reset(f)), b.clearTimeout(this.e._goToLoop), this.e._goToLoop = b.setTimeout(a.proxy(function () {
                this.speed(this.duration(this.current(), f + e, d)), this.current(f + e), this.update()
            }, this), 30)
        } else this.speed(this.duration(this.current(), c, d)), this.current(c), this.update()
    }, e.prototype.next = function (a) {
        a = a || !1, this.to(this.relative(this.current()) + 1, a)
    }, e.prototype.prev = function (a) {
        a = a || !1, this.to(this.relative(this.current()) - 1, a)
    }, e.prototype.transitionEnd = function (a) {
        return a !== d && (a.stopPropagation(), (a.target || a.srcElement || a.originalTarget) !== this.$stage.get(0)) ? !1 : (this.state.inMotion = !1, void this.trigger("translated"))
    }, e.prototype.viewport = function () {
        var d;
        if (this.options.responsiveBaseElement !== b)d = a(this.options.responsiveBaseElement).width(); else if (b.innerWidth)d = b.innerWidth; else {
            if (!c.documentElement || !c.documentElement.clientWidth)throw"Can not detect viewport width.";
            d = c.documentElement.clientWidth
        }
        return d
    }, e.prototype.replace = function (b) {
        this.$stage.empty(), this._items = [], b && (b = b instanceof jQuery ? b : a(b)), this.settings.nestedItemSelector && (b = b.find("." + this.settings.nestedItemSelector)), b.filter(function () {
            return 1 === this.nodeType
        }).each(a.proxy(function (a, b) {
            b = this.prepare(b), this.$stage.append(b), this._items.push(b), this._mergers.push(1 * b.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") || 1)
        }, this)), this.reset(a.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0), this.invalidate("items")
    }, e.prototype.add = function (a, b) {
        b = b === d ? this._items.length : this.normalize(b, !0), this.trigger("add", {content: a, position: b}), 0 === this._items.length || b === this._items.length ? (this.$stage.append(a), this._items.push(a), this._mergers.push(1 * a.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") || 1)) : (this._items[b].before(a), this._items.splice(b, 0, a), this._mergers.splice(b, 0, 1 * a.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") || 1)), this.invalidate("items"), this.trigger("added", {content: a, position: b})
    }, e.prototype.remove = function (a) {
        a = this.normalize(a, !0), a !== d && (this.trigger("remove", {content: this._items[a], position: a}), this._items[a].remove(), this._items.splice(a, 1), this._mergers.splice(a, 1), this.invalidate("items"), this.trigger("removed", {content: null, position: a}))
    }, e.prototype.addTriggerableEvents = function () {
        var b = a.proxy(function (b, c) {
            return a.proxy(function (a) {
                a.relatedTarget !== this && (this.suppress([c]), b.apply(this, [].slice.call(arguments, 1)), this.release([c]))
            }, this)
        }, this);
        a.each({next: this.next, prev: this.prev, to: this.to, destroy: this.destroy, refresh: this.refresh, replace: this.replace, add: this.add, remove: this.remove}, a.proxy(function (a, c) {
            this.$element.on(a + ".owl.carousel", b(c, a + ".owl.carousel"))
        }, this))
    }, e.prototype.watchVisibility = function () {
        function c(a) {
            return a.offsetWidth > 0 && a.offsetHeight > 0
        }

        function d() {
            c(this.$element.get(0)) && (this.$element.removeClass("owl-hidden"), this.refresh(), b.clearInterval(this.e._checkVisibile))
        }

        c(this.$element.get(0)) || (this.$element.addClass("owl-hidden"), b.clearInterval(this.e._checkVisibile), this.e._checkVisibile = b.setInterval(a.proxy(d, this), 500))
    }, e.prototype.preloadAutoWidthImages = function (b) {
        var c, d, e, f;
        c = 0, d = this, b.each(function (g, h) {
            e = a(h), f = new Image, f.onload = function () {
                c++, e.attr("src", f.src), e.css("opacity", 1), c >= b.length && (d.state.imagesLoaded = !0, d.initialize())
            }, f.src = e.attr("src") || e.attr("data-src") || e.attr("data-src-retina")
        })
    }, e.prototype.destroy = function () {
        this.$element.hasClass(this.settings.themeClass) && this.$element.removeClass(this.settings.themeClass), this.settings.responsive !== !1 && a(b).off("resize.owl.carousel"), this.transitionEndVendor && this.off(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd);
        for (var d in this._plugins)this._plugins[d].destroy();
        (this.settings.mouseDrag || this.settings.touchDrag) && (this.$stage.off("mousedown touchstart touchcancel"), a(c).off(".owl.dragEvents"), this.$stage.get(0).onselectstart = function () {
        }, this.$stage.off("dragstart", function () {
            return!1
        })), this.$element.off(".owl"), this.$stage.children(".cloned").remove(), this.e = null, this.$element.removeData("owlCarousel"), this.$stage.children().contents().unwrap(), this.$stage.children().unwrap(), this.$stage.unwrap()
    }, e.prototype.op = function (a, b, c) {
        var d = this.settings.rtl;
        switch (b) {
            case"<":
                return d ? a > c : c > a;
            case">":
                return d ? c > a : a > c;
            case">=":
                return d ? c >= a : a >= c;
            case"<=":
                return d ? a >= c : c >= a
        }
    }, e.prototype.on = function (a, b, c, d) {
        a.addEventListener ? a.addEventListener(b, c, d) : a.attachEvent && a.attachEvent("on" + b, c)
    }, e.prototype.off = function (a, b, c, d) {
        a.removeEventListener ? a.removeEventListener(b, c, d) : a.detachEvent && a.detachEvent("on" + b, c)
    }, e.prototype.trigger = function (b, c, d) {
        var e = {item: {count: this._items.length, index: this.current()}}, f = a.camelCase(a.grep(["on", b, d],function (a) {
            return a
        }).join("-").toLowerCase()), g = a.Event([b, "owl", d || "carousel"].join(".").toLowerCase(), a.extend({relatedTarget: this}, e, c));
        return this._supress[b] || (a.each(this._plugins, function (a, b) {
            b.onTrigger && b.onTrigger(g)
        }), this.$element.trigger(g), this.settings && "function" == typeof this.settings[f] && this.settings[f].apply(this, g)), g
    }, e.prototype.suppress = function (b) {
        a.each(b, a.proxy(function (a, b) {
            this._supress[b] = !0
        }, this))
    }, e.prototype.release = function (b) {
        a.each(b, a.proxy(function (a, b) {
            delete this._supress[b]
        }, this))
    }, e.prototype.browserSupport = function () {
        if (this.support3d = j(), this.support3d) {
            this.transformVendor = i();
            var a = ["transitionend", "webkitTransitionEnd", "transitionend", "oTransitionEnd"];
            this.transitionEndVendor = a[h()], this.vendorName = this.transformVendor.replace(/Transform/i, ""), this.vendorName = "" !== this.vendorName ? "-" + this.vendorName.toLowerCase() + "-" : ""
        }
        this.state.orientation = b.orientation
    }, a.fn.owlCarousel = function (b) {
        return this.each(function () {
            a(this).data("owlCarousel") || a(this).data("owlCarousel", new e(this, b))
        })
    }, a.fn.owlCarousel.Constructor = e
}(window.Zepto || window.jQuery, window, document), function (a, b) {
    var c = function (b) {
        this._core = b, this._loaded = [], this._handlers = {"initialized.owl.carousel change.owl.carousel": a.proxy(function (b) {
            if (b.namespace && this._core.settings && this._core.settings.lazyLoad && (b.property && "position" == b.property.name || "initialized" == b.type))for (var c = this._core.settings, d = c.center && Math.ceil(c.items / 2) || c.items, e = c.center && -1 * d || 0, f = (b.property && b.property.value || this._core.current()) + e, g = this._core.clones().length, h = a.proxy(function (a, b) {
                this.load(b)
            }, this); e++ < d;)this.load(g / 2 + this._core.relative(f)), g && a.each(this._core.clones(this._core.relative(f++)), h)
        }, this)}, this._core.options = a.extend({}, c.Defaults, this._core.options), this._core.$element.on(this._handlers)
    };
    c.Defaults = {lazyLoad: !1}, c.prototype.load = function (c) {
        var d = this._core.$stage.children().eq(c), e = d && d.find(".owl-lazy");
        !e || a.inArray(d.get(0), this._loaded) > -1 || (e.each(a.proxy(function (c, d) {
            var e, f = a(d), g = b.devicePixelRatio > 1 && f.attr("data-src-retina") || f.attr("data-src");
            this._core.trigger("load", {element: f, url: g}, "lazy"), f.is("img") ? f.one("load.owl.lazy", a.proxy(function () {
                f.css("opacity", 1), this._core.trigger("loaded", {element: f, url: g}, "lazy")
            }, this)).attr("src", g) : (e = new Image, e.onload = a.proxy(function () {
                f.css({"background-image": "url(" + g + ")", opacity: "1"}), this._core.trigger("loaded", {element: f, url: g}, "lazy")
            }, this), e.src = g)
        }, this)), this._loaded.push(d.get(0)))
    }, c.prototype.destroy = function () {
        var a, b;
        for (a in this.handlers)this._core.$element.off(a, this.handlers[a]);
        for (b in Object.getOwnPropertyNames(this))"function" != typeof this[b] && (this[b] = null)
    }, a.fn.owlCarousel.Constructor.Plugins.Lazy = c
}(window.Zepto || window.jQuery, window, document), function (a) {
    var b = function (c) {
        this._core = c, this._handlers = {"initialized.owl.carousel": a.proxy(function () {
            this._core.settings.autoHeight && this.update()
        }, this), "changed.owl.carousel": a.proxy(function (a) {
            this._core.settings.autoHeight && "position" == a.property.name && this.update()
        }, this), "loaded.owl.lazy": a.proxy(function (a) {
            this._core.settings.autoHeight && a.element.closest("." + this._core.settings.itemClass) === this._core.$stage.children().eq(this._core.current()) && this.update()
        }, this)}, this._core.options = a.extend({}, b.Defaults, this._core.options), this._core.$element.on(this._handlers)
    };
    b.Defaults = {autoHeight: !1, autoHeightClass: "owl-height"}, b.prototype.update = function () {
        this._core.$stage.parent().height(this._core.$stage.children().eq(this._core.current()).height()).addClass(this._core.settings.autoHeightClass)
    }, b.prototype.destroy = function () {
        var a, b;
        for (a in this._handlers)this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this))"function" != typeof this[b] && (this[b] = null)
    }, a.fn.owlCarousel.Constructor.Plugins.AutoHeight = b
}(window.Zepto || window.jQuery, window, document), function (a, b, c) {
    var d = function (b) {
        this._core = b, this._videos = {}, this._playing = null, this._fullscreen = !1, this._handlers = {"resize.owl.carousel": a.proxy(function (a) {
            this._core.settings.video && !this.isInFullScreen() && a.preventDefault()
        }, this), "refresh.owl.carousel changed.owl.carousel": a.proxy(function () {
            this._playing && this.stop()
        }, this), "prepared.owl.carousel": a.proxy(function (b) {
            var c = a(b.content).find(".owl-video");
            c.length && (c.css("display", "none"), this.fetch(c, a(b.content)))
        }, this)}, this._core.options = a.extend({}, d.Defaults, this._core.options), this._core.$element.on(this._handlers), this._core.$element.on("click.owl.video", ".owl-video-play-icon", a.proxy(function (a) {
            this.play(a)
        }, this))
    };
    d.Defaults = {video: !1, videoHeight: !1, videoWidth: !1}, d.prototype.fetch = function (a, b) {
        var c = a.attr("data-vimeo-id") ? "vimeo" : "youtube", d = a.attr("data-vimeo-id") || a.attr("data-youtube-id"), e = a.attr("data-width") || this._core.settings.videoWidth, f = a.attr("data-height") || this._core.settings.videoHeight, g = a.attr("href");
        if (!g)throw new Error("Missing video URL.");
        if (d = g.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/), d[3].indexOf("youtu") > -1)c = "youtube"; else {
            if (!(d[3].indexOf("vimeo") > -1))throw new Error("Video URL not supported.");
            c = "vimeo"
        }
        d = d[6], this._videos[g] = {type: c, id: d, width: e, height: f}, b.attr("data-video", g), this.thumbnail(a, this._videos[g])
    }, d.prototype.thumbnail = function (b, c) {
        var d, e, f, g = c.width && c.height ? 'style="width:' + c.width + "px;height:" + c.height + 'px;"' : "", h = b.find("img"), i = "src", j = "", k = this._core.settings, l = function (a) {
            e = '<div class="owl-video-play-icon"></div>', d = k.lazyLoad ? '<div class="owl-video-tn ' + j + '" ' + i + '="' + a + '"></div>' : '<div class="owl-video-tn" style="opacity:1;background-image:url(' + a + ')"></div>', b.after(d), b.after(e)
        };
        return b.wrap('<div class="owl-video-wrapper"' + g + "></div>"), this._core.settings.lazyLoad && (i = "data-src", j = "owl-lazy"), h.length ? (l(h.attr(i)), h.remove(), !1) : void("youtube" === c.type ? (f = "http://img.youtube.com/vi/" + c.id + "/hqdefault.jpg", l(f)) : "vimeo" === c.type && a.ajax({type: "GET", url: "http://vimeo.com/api/v2/video/" + c.id + ".json", jsonp: "callback", dataType: "jsonp", success: function (a) {
            f = a[0].thumbnail_large, l(f)
        }}))
    }, d.prototype.stop = function () {
        this._core.trigger("stop", null, "video"), this._playing.find(".owl-video-frame").remove(), this._playing.removeClass("owl-video-playing"), this._playing = null
    }, d.prototype.play = function (b) {
        this._core.trigger("play", null, "video"), this._playing && this.stop();
        var c, d, e = a(b.target || b.srcElement), f = e.closest("." + this._core.settings.itemClass), g = this._videos[f.attr("data-video")], h = g.width || "100%", i = g.height || this._core.$stage.height();
        "youtube" === g.type ? c = '<iframe width="' + h + '" height="' + i + '" src="http://www.youtube.com/embed/' + g.id + "?autoplay=1&v=" + g.id + '" frameborder="0" allowfullscreen></iframe>' : "vimeo" === g.type && (c = '<iframe src="http://player.vimeo.com/video/' + g.id + '?autoplay=1" width="' + h + '" height="' + i + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'), f.addClass("owl-video-playing"), this._playing = f, d = a('<div style="height:' + i + "px; width:" + h + 'px" class="owl-video-frame">' + c + "</div>"), e.after(d)
    }, d.prototype.isInFullScreen = function () {
        var d = c.fullscreenElement || c.mozFullScreenElement || c.webkitFullscreenElement;
        return d && a(d).parent().hasClass("owl-video-frame") && (this._core.speed(0), this._fullscreen = !0), d && this._fullscreen && this._playing ? !1 : this._fullscreen ? (this._fullscreen = !1, !1) : this._playing && this._core.state.orientation !== b.orientation ? (this._core.state.orientation = b.orientation, !1) : !0
    }, d.prototype.destroy = function () {
        var a, b;
        this._core.$element.off("click.owl.video");
        for (a in this._handlers)this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this))"function" != typeof this[b] && (this[b] = null)
    }, a.fn.owlCarousel.Constructor.Plugins.Video = d
}(window.Zepto || window.jQuery, window, document), function (a, b, c, d) {
    var e = function (b) {
        this.core = b, this.core.options = a.extend({}, e.Defaults, this.core.options), this.swapping = !0, this.previous = d, this.next = d, this.handlers = {"change.owl.carousel": a.proxy(function (a) {
            "position" == a.property.name && (this.previous = this.core.current(), this.next = a.property.value)
        }, this), "drag.owl.carousel dragged.owl.carousel translated.owl.carousel": a.proxy(function (a) {
            this.swapping = "translated" == a.type
        }, this), "translate.owl.carousel": a.proxy(function () {
            this.swapping && (this.core.options.animateOut || this.core.options.animateIn) && this.swap()
        }, this)}, this.core.$element.on(this.handlers)
    };
    e.Defaults = {animateOut: !1, animateIn: !1}, e.prototype.swap = function () {
        if (1 === this.core.settings.items && this.core.support3d) {
            this.core.speed(0);
            var b, c = a.proxy(this.clear, this), d = this.core.$stage.children().eq(this.previous), e = this.core.$stage.children().eq(this.next), f = this.core.settings.animateIn, g = this.core.settings.animateOut;
            this.core.current() !== this.previous && (g && (b = this.core.coordinates(this.previous) - this.core.coordinates(this.next), d.css({left: b + "px"}).addClass("animated owl-animated-out").addClass(g).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", c)), f && e.addClass("animated owl-animated-in").addClass(f).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", c))
        }
    }, e.prototype.clear = function (b) {
        a(b.target).css({left: ""}).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut), this.core.transitionEnd()
    }, e.prototype.destroy = function () {
        var a, b;
        for (a in this.handlers)this.core.$element.off(a, this.handlers[a]);
        for (b in Object.getOwnPropertyNames(this))"function" != typeof this[b] && (this[b] = null)
    }, a.fn.owlCarousel.Constructor.Plugins.Animate = e
}(window.Zepto || window.jQuery, window, document), function (a, b, c) {
    var d = function (b) {
        this.core = b, this.core.options = a.extend({}, d.Defaults, this.core.options), this.handlers = {"translated.owl.carousel refreshed.owl.carousel": a.proxy(function () {
            this.autoplay()
        }, this), "play.owl.autoplay": a.proxy(function (a, b, c) {
            this.play(b, c)
        }, this), "stop.owl.autoplay": a.proxy(function () {
            this.stop()
        }, this), "mouseover.owl.autoplay": a.proxy(function () {
            this.core.settings.autoplayHoverPause && this.pause()
        }, this), "mouseleave.owl.autoplay": a.proxy(function () {
            this.core.settings.autoplayHoverPause && this.autoplay()
        }, this)}, this.core.$element.on(this.handlers)
    };
    d.Defaults = {autoplay: !1, autoplayTimeout: 5e3, autoplayHoverPause: !1, autoplaySpeed: !1}, d.prototype.autoplay = function () {
        this.core.settings.autoplay && !this.core.state.videoPlay ? (b.clearInterval(this.interval), this.interval = b.setInterval(a.proxy(function () {
            this.play()
        }, this), this.core.settings.autoplayTimeout)) : b.clearInterval(this.interval)
    }, d.prototype.play = function () {
        return c.hidden === !0 || this.core.state.isTouch || this.core.state.isScrolling || this.core.state.isSwiping || this.core.state.inMotion ? void 0 : this.core.settings.autoplay === !1 ? void b.clearInterval(this.interval) : void this.core.next(this.core.settings.autoplaySpeed)
    }, d.prototype.stop = function () {
        b.clearInterval(this.interval)
    }, d.prototype.pause = function () {
        b.clearInterval(this.interval)
    }, d.prototype.destroy = function () {
        var a, c;
        b.clearInterval(this.interval);
        for (a in this.handlers)this.core.$element.off(a, this.handlers[a]);
        for (c in Object.getOwnPropertyNames(this))"function" != typeof this[c] && (this[c] = null)
    }, a.fn.owlCarousel.Constructor.Plugins.autoplay = d
}(window.Zepto || window.jQuery, window, document), function (a) {
    "use strict";
    var b = function (c) {
        this._core = c, this._initialized = !1, this._pages = [], this._controls = {}, this._templates = [], this.$element = this._core.$element, this._overrides = {next: this._core.next, prev: this._core.prev, to: this._core.to}, this._handlers = {"prepared.owl.carousel": a.proxy(function (b) {
            this._core.settings.dotsData && this._templates.push(a(b.content).find("[data-dot]").andSelf("[data-dot]").attr("data-dot"))
        }, this), "add.owl.carousel": a.proxy(function (b) {
            this._core.settings.dotsData && this._templates.splice(b.position, 0, a(b.content).find("[data-dot]").andSelf("[data-dot]").attr("data-dot"))
        }, this), "remove.owl.carousel prepared.owl.carousel": a.proxy(function (a) {
            this._core.settings.dotsData && this._templates.splice(a.position, 1)
        }, this), "change.owl.carousel": a.proxy(function (a) {
            if ("position" == a.property.name && !this._core.state.revert && !this._core.settings.loop && this._core.settings.navRewind) {
                var b = this._core.current(), c = this._core.maximum(), d = this._core.minimum();
                a.data = a.property.value > c ? b >= c ? d : c : a.property.value < d ? c : a.property.value
            }
        }, this), "changed.owl.carousel": a.proxy(function (a) {
            "position" == a.property.name && this.draw()
        }, this), "refreshed.owl.carousel": a.proxy(function () {
            this._initialized || (this.initialize(), this._initialized = !0), this._core.trigger("refresh", null, "navigation"), this.update(), this.draw(), this._core.trigger("refreshed", null, "navigation")
        }, this)}, this._core.options = a.extend({}, b.Defaults, this._core.options), this.$element.on(this._handlers)
    };
    b.Defaults = {nav: !1, navRewind: !0, navText: ["", ""], navSpeed: !1, navElement: "div", navContainer: !1, navContainerClass: "owl-nav", navClass: ["owl-prev fa fa-arrow-circle-left", "owl-next fa fa-arrow-circle-right"], slideBy: 1, dotClass: "owl-dot", dotsClass: "owl-dots", dots: !0, dotsEach: !1, dotData: !1, dotsSpeed: !1, dotsContainer: !1, controlsClass: "owl-controls"}, b.prototype.initialize = function () {
        var b, c, d = this._core.settings;
        d.dotsData || (this._templates = [a("<div>").addClass(d.dotClass).append(a("<span>")).prop("outerHTML")]), d.navContainer && d.dotsContainer || (this._controls.$container = a("<div>").addClass(d.controlsClass).appendTo(this.$element)), this._controls.$indicators = d.dotsContainer ? a(d.dotsContainer) : a("<div>").hide().addClass(d.dotsClass).appendTo(this._controls.$container), this._controls.$indicators.on("click", "div", a.proxy(function (b) {
            var c = a(b.target).parent().is(this._controls.$indicators) ? a(b.target).index() : a(b.target).parent().index();
            b.preventDefault(), this.to(c, d.dotsSpeed)
        }, this)), b = d.navContainer ? a(d.navContainer) : a("<div>").addClass(d.navContainerClass).prependTo(this._controls.$container), this._controls.$next = a("<" + d.navElement + ">"), this._controls.$previous = this._controls.$next.clone(), this._controls.$previous.addClass(d.navClass[0]).html(d.navText[0]).hide().prependTo(b).on("click", a.proxy(function () {
            this.prev(d.navSpeed)
        }, this)), this._controls.$next.addClass(d.navClass[1]).html(d.navText[1]).hide().appendTo(b).on("click", a.proxy(function () {
            this.next(d.navSpeed)
        }, this));
        for (c in this._overrides)this._core[c] = a.proxy(this[c], this)
    }, b.prototype.destroy = function () {
        var a, b, c, d;
        for (a in this._handlers)this.$element.off(a, this._handlers[a]);
        for (b in this._controls)this._controls[b].remove();
        for (d in this.overides)this._core[d] = this._overrides[d];
        for (c in Object.getOwnPropertyNames(this))"function" != typeof this[c] && (this[c] = null)
    }, b.prototype.update = function () {
        var a, b, c, d = this._core.settings, e = this._core.clones().length / 2, f = e + this._core.items().length, g = d.center || d.autoWidth || d.dotData ? 1 : d.dotsEach || d.items;
        if ("page" !== d.slideBy && (d.slideBy = Math.min(d.slideBy, d.items)), d.dots || "page" == d.slideBy)for (this._pages = [], a = e, b = 0, c = 0; f > a; a++)(b >= g || 0 === b) && (this._pages.push({start: a - e, end: a - e + g - 1}), b = 0, ++c), b += this._core.mergers(this._core.relative(a))
    }, b.prototype.draw = function () {
        var b, c, d = "", e = this._core.settings, f = (this._core.$stage.children(), this._core.relative(this._core.current()));
        if (!e.nav || e.loop || e.navRewind || (this._controls.$previous.toggleClass("disabled", 0 >= f), this._controls.$next.toggleClass("disabled", f >= this._core.maximum())), this._controls.$previous.toggle(e.nav), this._controls.$next.toggle(e.nav), e.dots) {
            if (b = this._pages.length - this._controls.$indicators.children().length, e.dotData && 0 !== b) {
                for (c = 0; c < this._controls.$indicators.children().length; c++)d += this._templates[this._core.relative(c)];
                this._controls.$indicators.html(d)
            } else b > 0 ? (d = new Array(b + 1).join(this._templates[0]), this._controls.$indicators.append(d)) : 0 > b && this._controls.$indicators.children().slice(b).remove();
            this._controls.$indicators.find(".active").removeClass("active"), this._controls.$indicators.children().eq(a.inArray(this.current(), this._pages)).addClass("active")
        }
        this._controls.$indicators.toggle(e.dots)
    }, b.prototype.onTrigger = function (b) {
        var c = this._core.settings;
        b.page = {index: a.inArray(this.current(), this._pages), count: this._pages.length, size: c && (c.center || c.autoWidth || c.dotData ? 1 : c.dotsEach || c.items)}
    }, b.prototype.current = function () {
        var b = this._core.relative(this._core.current());
        return a.grep(this._pages,function (a) {
            return a.start <= b && a.end >= b
        }).pop()
    }, b.prototype.getPosition = function (b) {
        var c, d, e = this._core.settings;
        return"page" == e.slideBy ? (c = a.inArray(this.current(), this._pages), d = this._pages.length, b ? ++c : --c, c = this._pages[(c % d + d) % d].start) : (c = this._core.relative(this._core.current()), d = this._core.items().length, b ? c += e.slideBy : c -= e.slideBy), c
    }, b.prototype.next = function (b) {
        a.proxy(this._overrides.to, this._core)(this.getPosition(!0), b)
    }, b.prototype.prev = function (b) {
        a.proxy(this._overrides.to, this._core)(this.getPosition(!1), b)
    }, b.prototype.to = function (b, c, d) {
        var e;
        d ? a.proxy(this._overrides.to, this._core)(b, c) : (e = this._pages.length, a.proxy(this._overrides.to, this._core)(this._pages[(b % e + e) % e].start, c))
    }, a.fn.owlCarousel.Constructor.Plugins.Navigation = b
}(window.Zepto || window.jQuery, window, document), function (a, b) {
    "use strict";
    var c = function (d) {
        this._core = d, this._hashes = {}, this.$element = this._core.$element, this._handlers = {"initialized.owl.carousel": a.proxy(function () {
            "URLHash" == this._core.settings.startPosition && a(b).trigger("hashchange.owl.navigation")
        }, this), "prepared.owl.carousel": a.proxy(function (b) {
            var c = a(b.content).find("[data-hash]").andSelf("[data-hash]").attr("data-hash");
            this._hashes[c] = b.content
        }, this)}, this._core.options = a.extend({}, c.Defaults, this._core.options), this.$element.on(this._handlers), a(b).on("hashchange.owl.navigation", a.proxy(function () {
            var a = b.location.hash.substring(1), c = this._core.$stage.children(), d = this._hashes[a] && c.index(this._hashes[a]) || 0;
            return a ? void this._core.to(d, !1, !0) : !1
        }, this))
    };
    c.Defaults = {URLhashListener: !1}, c.prototype.destroy = function () {
        var c, d;
        a(b).off("hashchange.owl.navigation");
        for (c in this._handlers)this._core.$element.off(c, this._handlers[c]);
        for (d in Object.getOwnPropertyNames(this))"function" != typeof this[d] && (this[d] = null)
    }, a.fn.owlCarousel.Constructor.Plugins.Hash = c
}(window.Zepto || window.jQuery, window, document);
/**/try{hbl.client.callbacks.pollevents(
{
    "capacity": false,
    "conversation_has_slot": false,
    "conversation_id": "8CULskf3qswk5lmO493Lw1ZbIORJ0E3O",
    "in_active_conversation": false,
    "ipaddress": "41.226.11.245",
    "is_popup": false,
    "last_index": 0.0,
    "machine": "nrpc70.olark.net",
    "new_events": [],
    "operator_composing_state": "active",
    "operator_has_sent_message": false,
    "operator_nickname": null,
    "resend_nickname": false,
    "resend_status": false,
    "site_is_online": false,
    "status_state": "offline",
    "visitor_id": "Ofjcjr4O2kYholzU493Lw1UbIOJ30ERs"
}
);}catch(e){}try{if(document.getElementById('olark-191485114863321')) hbl.util.remove_element('olark-191485114863321');}catch(e){}
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
;(function($){"use strict";var methods=(function(){var c={bcClass:'sf-breadcrumb',menuClass:'sf-js-enabled',anchorClass:'sf-with-ul',menuArrowClass:'sf-arrows'},ios=(function(){var ios=/iPhone|iPad|iPod/i.test(navigator.userAgent);if(ios){$(window).load(function(){$('body').children().on('click',$.noop);});}
return ios;})(),wp7=(function(){var style=document.documentElement.style;return('behavior'in style&&'fill'in style&&/iemobile/i.test(navigator.userAgent));})(),toggleMenuClasses=function($menu,o){var classes=c.menuClass;if(o.cssArrows){classes+=' '+ c.menuArrowClass;}
$menu.toggleClass(classes);},setPathToCurrent=function($menu,o){return $menu.find('li.'+ o.pathClass).slice(0,o.pathLevels).addClass(o.hoverClass+' '+ c.bcClass).filter(function(){return($(this).children(o.popUpSelector).hide().show().length);}).removeClass(o.pathClass);},toggleAnchorClass=function($li){$li.children('a').toggleClass(c.anchorClass);},toggleTouchAction=function($menu){var touchAction=$menu.css('ms-touch-action');touchAction=(touchAction==='pan-y')?'auto':'pan-y';$menu.css('ms-touch-action',touchAction);},applyHandlers=function($menu,o){var targets='li:has('+ o.popUpSelector+')';if($.fn.hoverIntent&&!o.disableHI){$menu.hoverIntent(over,out,targets);}
else{$menu.on('mouseenter.superfish',targets,over).on('mouseleave.superfish',targets,out);}
var touchevent='MSPointerDown.superfish';if(!ios){touchevent+=' touchend.superfish';}
if(wp7){touchevent+=' mousedown.superfish';}
$menu.on('focusin.superfish','li',over).on('focusout.superfish','li',out).on(touchevent,'a',o,touchHandler);},touchHandler=function(e){var $this=$(this),$ul=$this.siblings(e.data.popUpSelector);if($ul.length>0&&$ul.is(':hidden')){$this.one('click.superfish',false);if(e.type==='MSPointerDown'){$this.trigger('focus');}else{$.proxy(over,$this.parent('li'))();}}},over=function(){var $this=$(this),o=getOptions($this);clearTimeout(o.sfTimer);$this.siblings().superfish('hide').end().superfish('show');},out=function(){var $this=$(this),o=getOptions($this);if(ios){$.proxy(close,$this,o)();}
else{clearTimeout(o.sfTimer);o.sfTimer=setTimeout($.proxy(close,$this,o),o.delay);}},close=function(o){o.retainPath=($.inArray(this[0],o.$path)>-1);this.superfish('hide');if(!this.parents('.'+ o.hoverClass).length){o.onIdle.call(getMenu(this));if(o.$path.length){$.proxy(over,o.$path)();}}},getMenu=function($el){return $el.closest('.'+ c.menuClass);},getOptions=function($el){return getMenu($el).data('sf-options');};return{hide:function(instant){if(this.length){var $this=this,o=getOptions($this);if(!o){return this;}
var not=(o.retainPath===true)?o.$path:'',$ul=$this.find('li.'+ o.hoverClass).add(this).not(not).removeClass(o.hoverClass).children(o.popUpSelector),speed=o.speedOut;if(instant){$ul.show();speed=0;}
o.retainPath=false;o.onBeforeHide.call($ul);$ul.stop(true,true).animate(o.animationOut,speed,function(){var $this=$(this);o.onHide.call($this);});}
return this;},show:function(){var o=getOptions(this);if(!o){return this;}
var $this=this.addClass(o.hoverClass),$ul=$this.children(o.popUpSelector);o.onBeforeShow.call($ul);$ul.stop(true,true).animate(o.animation,o.speed,function(){o.onShow.call($ul);});return this;},destroy:function(){return this.each(function(){var $this=$(this),o=$this.data('sf-options'),$hasPopUp;if(!o){return false;}
$hasPopUp=$this.find(o.popUpSelector).parent('li');clearTimeout(o.sfTimer);toggleMenuClasses($this,o);toggleAnchorClass($hasPopUp);toggleTouchAction($this);$this.off('.superfish').off('.hoverIntent');$hasPopUp.children(o.popUpSelector).attr('style',function(i,style){return style.replace(/display[^;]+;?/g,'');});o.$path.removeClass(o.hoverClass+' '+ c.bcClass).addClass(o.pathClass);$this.find('.'+ o.hoverClass).removeClass(o.hoverClass);o.onDestroy.call($this);$this.removeData('sf-options');});},init:function(op){return this.each(function(){var $this=$(this);if($this.data('sf-options')){return false;}
var o=$.extend({},$.fn.superfish.defaults,op),$hasPopUp=$this.find(o.popUpSelector).parent('li');o.$path=setPathToCurrent($this,o);$this.data('sf-options',o);toggleMenuClasses($this,o);toggleAnchorClass($hasPopUp);toggleTouchAction($this);applyHandlers($this,o);$hasPopUp.not('.'+ c.bcClass).superfish('hide',true);o.onInit.call(this);});}};})();$.fn.superfish=function(method,args){if(methods[method]){return methods[method].apply(this,Array.prototype.slice.call(arguments,1));}
else if(typeof method==='object'||!method){return methods.init.apply(this,arguments);}
else{return $.error('Method '+ method+' does not exist on jQuery.fn.superfish');}};$.fn.superfish.defaults={popUpSelector:'ul,.sf-mega',hoverClass:'sfHover',pathClass:'overrideThisToUse',pathLevels:1,delay:800,animation:{height:'show'},animationOut:{height:'hide'},speed:'normal',speedOut:'fast',cssArrows:true,disableHI:false,onInit:$.noop,onBeforeShow:$.noop,onShow:$.noop,onBeforeHide:$.noop,onHide:$.noop,onIdle:$.noop,onDestroy:$.noop};$.fn.extend({hideSuperfishUl:methods.hide,showSuperfishUl:methods.show});})(jQuery);$(window).load(function(){$('.sf-menu').superfish()})
function include(scriptUrl){document.write('<script src="'+ scriptUrl+'"></script>');}
function isIE(){var myNav=navigator.userAgent.toLowerCase();return(myNav.indexOf('msie')!=-1)?parseInt(myNav.split('msie')[1]):false;};include('js/jquery.cookie.js');include('js/jquery.easing.1.3.js');;(function($){var o=$('html');if(o.hasClass('desktop')){include('js/tmstickup.js');$(document).ready(function(){$('#stuck_container').TMStickUp({})});}})(jQuery);;(function($){var o=$('html');if(o.hasClass('desktop')){include('js/jquery.ui.totop.js');$(document).ready(function(){$().UItoTop({easingType:'easeOutQuart',containerClass:'toTop fa fa-chevron-up'});});}})(jQuery);;(function($){var o=$('[data-equal-group]');if(o.length>0){include('js/jquery.equalheights.js');}})(jQuery);;(function($){var currentYear=(new Date).getFullYear();$(document).ready(function(){$("#copyright-year").text((new Date).getFullYear());});})(jQuery);;(function($){function include(url){document.write('<script src="js/'+ url+'"></script>');return false;}
include('superfish.js');jQuery(function(){})})(jQuery);;(function($){var o=$('.resp-tabs');if(o.length>0){include('js/jquery.responsive.tabs.js');$(document).ready(function(){o.easyResponsiveTabs();});}})(jQuery);;(function($){include('js/jquery.rd-navbar.js');})(jQuery);;(function($){var o=$('.accordion');if(o.length>0){include('js/jquery.ui.accordion.min.js');$(document).ready(function(){o.accordion({active:false,header:'.accordion_header',heightStyle:'content',collapsible:true});});}})(jQuery);;(function($){var o=document.getElementById("google-map");if(o){include('//maps.google.com/maps/api/js?sensor=false');include('js/jquery.rd-google-map.js');$(document).ready(function(){var o=$('#google-map');if(o.length>0){o.googleMap({styles:[]});}});}})
(jQuery);;(function($){var o=$('.owl-carousel');if(o.length>0){include('js/owl.carousel.min.js');$(document).ready(function(){o.owlCarousel({margin:30,smartSpeed:450,loop:true,dots:false,dotsEach:1,nav:true,navClass:['owl-prev fa fa-chevron-left','owl-next fa fa-chevron-right'],responsive:{0:{items:1},768:{items:2},980:{items:3},1080:{items:4}}});});}
var o1=$('.owl-carousel-2');if(o1.length>0){include('js/owl.carousel.min.js');$(document).ready(function(){o1.owlCarousel({margin:30,smartSpeed:450,loop:true,dots:false,dotsEach:1,nav:true,navClass:['owl-prev fa fa-chevron-left','owl-next fa fa-chevron-right'],responsive:{0:{items:1},768:{items:1},980:{items:2}}});});}})(jQuery);;(function($){var o=$('.thumb');if(o.length>0){include('js/jquery.touch-touch.js');setTimeout(function(){var o=$('.thumb');o.touchTouch();},1000);}})(jQuery);;(function($){var o=$('html');if((navigator.userAgent.toLowerCase().indexOf('msie')==-1)||(isIE()&&isIE()>9)){if(o.hasClass('desktop')){include('js/wow.js');$(document).ready(function(){new WOW().init();});}}})(jQuery);$(function(){var viewportmeta=document.querySelector&&document.querySelector('meta[name="viewport"]'),ua=navigator.userAgent,gestureStart=function(){viewportmeta.content="width=device-width, minimum-scale=0.25, maximum-scale=1.6, initial-scale=1.0";},scaleFix=function(){if(viewportmeta&&/iPhone|iPad/.test(ua)&&!/Opera Mini/.test(ua)){viewportmeta.content="width=device-width, minimum-scale=1.0, maximum-scale=1.0";document.addEventListener("gesturestart",gestureStart,false);}};scaleFix();if(window.orientation!=undefined){var regM=/ipod|ipad|iphone/gi,result=ua.match(regM);if(!result){$('.sf-menus li').each(function(){if($(">ul",this)[0]){$(">a",this).toggle(function(){return false;},function(){window.location.href=$(this).attr("href");});}})}}});var ua=navigator.userAgent.toLocaleLowerCase(),regV=/ipod|ipad|iphone/gi,result=ua.match(regV),userScale="";if(!result){userScale=",user-scalable=0"}
document.write('<meta name="viewport" content="width=device-width,initial-scale=1.0'+ userScale+'">');;(function($){var o=$('#camera');if(o.length>0){if(!(isIE()&&(isIE()>9))){include('js/jquery.mobile.customized.min.js');}
include('js/camera.js');$(document).ready(function(){o.camera({autoAdvance:true,height:'34.14634146341463%',minHeight:'500px',pagination:true,thumbnails:false,playPause:false,hover:false,loader:'none',navigation:true,navigationHover:true,mobileNavHover:false,fx:'simpleFade'})});}})(jQuery);;(function($){var o=$('.search-form');if(o.length>0){include('js/TMSearch.js');}})(jQuery);;(function($){include('js/mailform/jquery.form.min.js');include('js/mailform/jquery.rd-mailform.min.js');})(jQuery);include('js/jquery.cookie.js');$(document).ready(function(){$('head').append('<link rel="stylesheet" href="assets/tm/css/tm_docs.css" type="text/css" media="screen"><link href="css/tm_panel.css" rel="stylesheet">');$('body').prepend('<div id="panel"><div class="navbar navbar-inverse navbar-fixed-top bs-docs-nav" role="banner" id="advanced"><span class="trigger"><strong></strong><em></em></span><div class="container"><div class="navbar-header"><button class="navbar-toggle tm_offs1" type="button" data-toggle="collapse" data-target=".bs-navbar-collapse"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button></div><nav class="collapse navbar-collapse bs-navbar-collapse" role="navigation"><ul class="nav navbar-nav"><li class="home"><a href="index.html" class="glyphicon glyphicon-home"></a></li><li class="divider-vertical"></li><li><a href="assets/getting-started.html">Getting started</a></li><li><a href="assets/css.html">CSS</a></li><li><a href="assets/components.html">Components</a></li><li><a href="assets/javascript.html">JavaScript</a></li><li class="divider-vertical"></li><li class="dropdown -tm-dropdown"><a data-toggle="dropdown" href="#">TM add-ons<span class="caret"></span></a><ul class="dropdown-menu" role="menu"><li role="presentation"><a role="menuitem" tabindex="-1" href="404.html">Pages</a><ul class="pages"><li><a href="404.html" role="menuitem" tabindex="-1">404 page</a></li><li><a href="assets/under-construction.html" role="menuitem" tabindex="-1">Under Construction</a></li></ul></li><li role="presentation"><a role="menuitem" tabindex="-1" href="assets/portfolio.html">Porfolio</a></li><li role="presentation"><a role="menuitem" tabindex="-1" href="assets/slider.html">Slider</a></li><li role="presentation"><a role="menuitem" tabindex="-1" href="assets/social_media.html">Social and media</a></li></ul></li></ul></nav></div></div></div>');});$(window).scroll(function(){if($(this).scrollTop()>0){$("#advanced").css({position:'fixed'});}else{$("#advanced").css({position:'relative'});}});$(function(){var
strCookies1=$.cookie('panel1'),isAnimate=false,isOpen=false;if(strCookies1==null){$.cookie('panel1','closed');strCookies1=$.cookie('panel1');isOpen=false;}
if(strCookies1=='opened'){$("#advanced").css({marginTop:'0px'}).removeClass('closed');isOpen=true;$('#stuck_container').trigger('rePosition',50);}else{$("#advanced").css({marginTop:'-50px'}).addClass('closed');isOpen=false;$('#stuck_container').trigger('rePosition',0);}
$("#advanced .trigger").click(function(){if(!isOpen){$(this).find('strong').animate({opacity:0}).parent().parent('#advanced').removeClass('closed').animate({marginTop:'0px'},500);$.cookie('panel1','opened');strCookies1=$.cookie('panel1');isOpen=true;$('#stuck_container').trigger('rePosition',50);}else{$(this).find('strong').animate({opacity:1}).parent().parent('#advanced').addClass('closed').animate({marginTop:'-50px'},700)
$.cookie('panel1','closed');strCookies1=$.cookie('panel1');isOpen=false;$('#stuck_container').trigger('rePosition',0);}})});;(function($){include('js/jquery.rd-parallax.js');})(jQuery);
(function($,undefined){var
def={stuckClass:'isStuck'},doc=$(document),anim=false;$.fn.TMStickUp=function(opt){opt=$.extend(true,{},def,opt)
$(this).each(function(){var $this=$(this),posY,isStuck=false,clone=$this.clone().appendTo($this.parent()).addClass(opt.stuckClass),height,stuckedHeight=clone.outerHeight(),opened,tmr
$(window).resize(function(){clearTimeout(tmr)
clone.css({top:isStuck?0:-stuckedHeight,visibility:isStuck?'visible':'hidden'})
tmr=setTimeout(function(){posY=$this.offset().top
height=$this.outerHeight()
stuckedHeight=clone.outerHeight()
opened=$.cookie&&$.cookie('panel1')==='opened'
clone.css({top:isStuck?0:-stuckedHeight})},40)}).resize()
clone.css({position:'fixed',width:'100%'})
$this.on('rePosition',function(e,d){if(isStuck)
clone.animate({marginTop:d},{easing:'linear'})
if(d===0)
opened=false
else
opened=true})
doc.on('scroll',function(){var scrollTop=doc.scrollTop()
if(scrollTop>=posY&&!isStuck){clone.stop().css({visibility:'visible'}).animate({top:0,marginTop:opened?50:0},{})
isStuck=true}
if(scrollTop<posY+height&&isStuck){if($('.search-form_toggle').length>0){var o_stuck=$('.search-form_toggle'),f_stuck=$('.search-form');if(!anim&&o_stuck.hasClass('active')){anim=true;o_stuck.removeClass('active');f_stuck.removeClass('on').slideUp();anim=false;}}
$('.sf-menu ul').css('display','none');clone.stop().animate({top:-stuckedHeight,marginTop:0},{duration:200,complete:function(){clone.css({visibility:'hidden'})}});isStuck=false;}}).trigger('scroll')})}})(jQuery)
(function(){var MutationObserver,Util,WeakMap,__bind=function(fn,me){return function(){return fn.apply(me,arguments);};},__indexOf=[].indexOf||function(item){for(var i=0,l=this.length;i<l;i++){if(i in this&&this[i]===item)return i;}return-1;};Util=(function(){function Util(){}
Util.prototype.extend=function(custom,defaults){var key,value;for(key in custom){value=custom[key];if(value!=null){defaults[key]=value;}}
return defaults;};Util.prototype.isMobile=function(agent){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent);};return Util;})();WeakMap=this.WeakMap||this.MozWeakMap||(WeakMap=(function(){function WeakMap(){this.keys=[];this.values=[];}
WeakMap.prototype.get=function(key){var i,item,_i,_len,_ref;_ref=this.keys;for(i=_i=0,_len=_ref.length;_i<_len;i=++_i){item=_ref[i];if(item===key){return this.values[i];}}};WeakMap.prototype.set=function(key,value){var i,item,_i,_len,_ref;_ref=this.keys;for(i=_i=0,_len=_ref.length;_i<_len;i=++_i){item=_ref[i];if(item===key){this.values[i]=value;return;}}
this.keys.push(key);return this.values.push(value);};return WeakMap;})());MutationObserver=this.MutationObserver||this.WebkitMutationObserver||this.MozMutationObserver||(MutationObserver=(function(){function MutationObserver(){console.warn('MutationObserver is not supported by your browser.');console.warn('WOW.js cannot detect dom mutations, please call .sync() after loading new content.');}
MutationObserver.notSupported=true;MutationObserver.prototype.observe=function(){};return MutationObserver;})());this.WOW=(function(){WOW.prototype.defaults={boxClass:'wow',animateClass:'animated',offset:0,mobile:true,live:true};function WOW(options){if(options==null){options={};}
this.scrollCallback=__bind(this.scrollCallback,this);this.scrollHandler=__bind(this.scrollHandler,this);this.start=__bind(this.start,this);this.scrolled=true;this.config=this.util().extend(options,this.defaults);this.animationNameCache=new WeakMap();}
WOW.prototype.init=function(){var _ref;this.element=window.document.documentElement;if((_ref=document.readyState)==="interactive"||_ref==="complete"){this.start();}else{document.addEventListener('DOMContentLoaded',this.start);}
return this.finished=[];};WOW.prototype.start=function(){var box,_i,_len,_ref;this.stopped=false;this.boxes=this.element.getElementsByClassName(this.config.boxClass);this.all=(function(){var _i,_len,_ref,_results;_ref=this.boxes;_results=[];for(_i=0,_len=_ref.length;_i<_len;_i++){box=_ref[_i];_results.push(box);}
return _results;}).call(this);if(this.boxes.length){if(this.disabled()){this.resetStyle();}else{_ref=this.boxes;for(_i=0,_len=_ref.length;_i<_len;_i++){box=_ref[_i];this.applyStyle(box,true);}
window.addEventListener('scroll',this.scrollHandler,false);window.addEventListener('resize',this.scrollHandler,false);this.interval=setInterval(this.scrollCallback,50);}}
if(this.config.live){return new MutationObserver((function(_this){return function(records){var node,record,_j,_len1,_results;_results=[];for(_j=0,_len1=records.length;_j<_len1;_j++){record=records[_j];_results.push((function(){var _k,_len2,_ref1,_results1;_ref1=record.addedNodes||[];_results1=[];for(_k=0,_len2=_ref1.length;_k<_len2;_k++){node=_ref1[_k];_results1.push(this.doSync(node));}
return _results1;}).call(_this));}
return _results;};})(this)).observe(document.body,{childList:true,subtree:true});}};WOW.prototype.stop=function(){this.stopped=true;window.removeEventListener('scroll',this.scrollHandler,false);window.removeEventListener('resize',this.scrollHandler,false);if(this.interval!=null){return clearInterval(this.interval);}};WOW.prototype.sync=function(element){if(MutationObserver.notSupported){return this.doSync(this.element);}};WOW.prototype.doSync=function(element){var box,_i,_len,_ref,_results;if(!this.stopped){element||(element=this.element);element=element.parentNode||element;_ref=element.getElementsByClassName(this.config.boxClass);_results=[];for(_i=0,_len=_ref.length;_i<_len;_i++){box=_ref[_i];if(__indexOf.call(this.all,box)<0){this.applyStyle(box,true);this.boxes.push(box);this.all.push(box);_results.push(this.scrolled=true);}else{_results.push(void 0);}}
return _results;}};WOW.prototype.show=function(box){this.applyStyle(box);return box.className=""+ box.className+" "+ this.config.animateClass;};WOW.prototype.applyStyle=function(box,hidden){var delay,duration,iteration;duration=box.getAttribute('data-wow-duration');delay=box.getAttribute('data-wow-delay');iteration=box.getAttribute('data-wow-iteration');return this.animate((function(_this){return function(){return _this.customStyle(box,hidden,duration,delay,iteration);};})(this));};WOW.prototype.animate=(function(){if('requestAnimationFrame'in window){return function(callback){return window.requestAnimationFrame(callback);};}else{return function(callback){return callback();};}})();WOW.prototype.resetStyle=function(){var box,_i,_len,_ref,_results;_ref=this.boxes;_results=[];for(_i=0,_len=_ref.length;_i<_len;_i++){box=_ref[_i];_results.push(box.setAttribute('style','visibility: visible;'));}
return _results;};WOW.prototype.customStyle=function(box,hidden,duration,delay,iteration){if(hidden){this.cacheAnimationName(box);}
box.style.visibility=hidden?'hidden':'visible';if(duration){this.vendorSet(box.style,{animationDuration:duration});}
if(delay){this.vendorSet(box.style,{animationDelay:delay});}
if(iteration){this.vendorSet(box.style,{animationIterationCount:iteration});}
this.vendorSet(box.style,{animationName:hidden?'none':this.cachedAnimationName(box)});return box;};WOW.prototype.vendors=["moz","webkit"];WOW.prototype.vendorSet=function(elem,properties){var name,value,vendor,_results;_results=[];for(name in properties){value=properties[name];elem[""+ name]=value;_results.push((function(){var _i,_len,_ref,_results1;_ref=this.vendors;_results1=[];for(_i=0,_len=_ref.length;_i<_len;_i++){vendor=_ref[_i];_results1.push(elem[""+ vendor+(name.charAt(0).toUpperCase())+(name.substr(1))]=value);}
return _results1;}).call(this));}
return _results;};WOW.prototype.vendorCSS=function(elem,property){var result,style,vendor,_i,_len,_ref;style=window.getComputedStyle(elem);result=style.getPropertyCSSValue(property);_ref=this.vendors;for(_i=0,_len=_ref.length;_i<_len;_i++){vendor=_ref[_i];result=result||style.getPropertyCSSValue("-"+ vendor+"-"+ property);}
return result;};WOW.prototype.animationName=function(box){var animationName;try{animationName=this.vendorCSS(box,'animation-name').cssText;}catch(_error){animationName=window.getComputedStyle(box).getPropertyValue('animation-name');}
if(animationName==='none'){return'';}else{return animationName;}};WOW.prototype.cacheAnimationName=function(box){return this.animationNameCache.set(box,this.animationName(box));};WOW.prototype.cachedAnimationName=function(box){return this.animationNameCache.get(box);};WOW.prototype.scrollHandler=function(){return this.scrolled=true;};WOW.prototype.scrollCallback=function(){var box;if(this.scrolled){this.scrolled=false;this.boxes=(function(){var _i,_len,_ref,_results;_ref=this.boxes;_results=[];for(_i=0,_len=_ref.length;_i<_len;_i++){box=_ref[_i];if(!(box)){continue;}
if(this.isVisible(box)){this.show(box);continue;}
_results.push(box);}
return _results;}).call(this);if(!(this.boxes.length||this.config.live)){return this.stop();}}};WOW.prototype.offsetTop=function(element){var top;while(element.offsetTop===void 0){element=element.parentNode;}
top=element.offsetTop;while(element=element.offsetParent){top+=element.offsetTop;}
return top;};WOW.prototype.isVisible=function(box){var bottom,offset,top,viewBottom,viewTop;offset=box.getAttribute('data-wow-offset')||this.config.offset;viewTop=window.pageYOffset;viewBottom=viewTop+ this.element.clientHeight- offset;top=this.offsetTop(box);bottom=top+ box.clientHeight;return top<=viewBottom&&bottom>=viewTop;};WOW.prototype.util=function(){return this._util||(this._util=new Util());};WOW.prototype.disabled=function(){return!this.config.mobile&&this.util().isMobile(navigator.userAgent);};return WOW;})();}).call(this);