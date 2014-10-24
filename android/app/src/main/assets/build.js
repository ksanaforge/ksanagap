;(function(){
'use strict';

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    throwError()
    return
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  function throwError () {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.exts = [
    '',
    '.js',
    '.json',
    '/index.js',
    '/index.json'
 ];

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  for (var i = 0; i < 5; i++) {
    var fullPath = path + require.exts[i];
    if (require.modules.hasOwnProperty(fullPath)) return fullPath;
    if (require.aliases.hasOwnProperty(fullPath)) return require.aliases[fullPath];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {

  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' === path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }
  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throwError()
    return
  }
  require.aliases[to] = from;

  function throwError () {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' === c) return path.slice(1);
    if ('.' === c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = segs.length;
    while (i--) {
      if (segs[i] === 'deps') {
        break;
      }
    }
    path = segs.slice(0, i + 2).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("ksanaforge-boot/index.js", function(exports, require, module){
var ksana={"platform":"remote"};

if (typeof process !="undefined") {

	if (process.versions["node-webkit"]) {
  	ksana.platform="node-webkit";
  	window.ksanagap={platform:"node-webkit"};
  	if (typeof nodeRequire!="undefined") ksana.require=nodeRequire;
  }
} else if (typeof chrome!="undefined" && chrome.fileSystem){
	ksana.platform="chrome";
}

//if (typeof React=="undefined") window.React=require('../react');

//require("../cortex");
var Require=function(arg){return require("../"+arg)};
var boot=function(appId,main,maindiv) {
	main=main||"main";
	maindiv=maindiv||"main";
	ksana.appId=appId;
	ksana.mainComponent=React.renderComponent(Require(main)(),document.getElementById(maindiv));
}
window.ksana=ksana;
window.Require=Require;
module.exports=boot;
});
require.register("brighthas-bootstrap/dist/js/bootstrap.js", function(exports, require, module){
/*!
* Bootstrap v3.0.0 by @fat and @mdo
* Copyright 2013 Twitter, Inc.
* Licensed under http://www.apache.org/licenses/LICENSE-2.0
*
* Designed and built with all the love in the world by @mdo and @fat.
*/

// if (!jQuery) { throw new Error("Bootstrap requires jQuery") }

/* ========================================================================
 * Bootstrap: transition.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */
//if (typeof jQuery=="undefined") var jQuery =  require("jquery");

+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

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
 * Bootstrap: button.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
        .prop('checked', !this.$element.hasClass('active'))
        .trigger('change')
      if ($input.prop('type') === 'radio') $parent.find('.active').removeClass('active')
    }

    this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#carousel
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition.end) {
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
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
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

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#collapse
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#dropdowns
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    var $el = $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('dropdown')

      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

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
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#modals
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

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
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal',  '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

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
        show: options.delay
      , hide: options.delay
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
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

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

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
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
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#popovers
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
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
    $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

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
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#scrollspy
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var href
    var process  = $.proxy(this.process, this)

    this.$element       = $(element).is('body') ? $(window) : $(element)
    this.$body          = $('body')
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = $([])
    this.targets        = $([])
    this.activeTarget   = null

    this.refresh()
    this.process()
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

    this.offsets = $([])
    this.targets = $([])

    var self     = this
    var $targets = this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#\w/.test(href) && $(href)

        return ($href
          && $href.length
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
    var maxScroll    = scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parents('.active')
      .removeClass('active')

    var selector = this.selector
      + '[data-target="' + target + '"],'
      + this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length)  {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tabs
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#affix
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element = $(element)
    this.affixed  =
    this.unpin    = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.$element.css('top', '')

    this.affixed = affix
    this.unpin   = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))

    if (affix == 'bottom') {
      this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

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

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })

}(jQuery);
});
require.register("ksana-document/index.js", function(exports, require, module){
﻿var API={document:require('./document')
	,xml:require('./xml')
	,api:require('./api')
	,tokenizers:require('./tokenizers')
	,typeset:require('./typeset')
	,crypto:require('./sha1')
	,customfunc:require('./customfunc')
	,configs:require('./configs')
	,languages:require('./languages')
	,kde:require("./kde") //database engine
	,kse:require('./kse') // search engine
	,kdb:require("./kdb")
	,html5fs:require("./html5fs")
	,plist:require("./plist")
	,bsearch:require("./bsearch")
	,persistentmarkup:require("./persistentmarkup_pouchdb")
	,underlines:require("./underlines")
}
if (typeof process!="undefined") {
	API.persistent=require('./persistent');
	API.indexer_kd=require('./indexer_kd');
	API.indexer=require('./indexer');
	API.projects=require('./projects');
	//API.kdb=require('./kdb');  // file format
	API.kdbw=require('./kdbw');  // create ydb
	API.xml4kdb=require('./xml4kdb');  
	API.build=require("./buildfromxml");
	API.tei=require("./tei");
	API.regex=require("./regex");
	API.setPath=function(path) {
		console.log("API set path ",path)
		API.kde.setPath(path);
	}
}
module.exports=API;
});
require.register("ksana-document/document.js", function(exports, require, module){
/*
  Multiversion text with external durable markups
  define a "fail to migrate markup" by setting length to -1
*/
(function(){"use strict";})();
var createMarkup=function(textlen,start,len,payload) {
	if (textlen==-1) textlen=1024*1024*1024; //max string size 1GB
	//the only function create a new markup instance, be friendly to V8 Hidden Class

	if (len<0) len=textlen;
	if (start<0) start=0;
	if (start>textlen) start=textlen;
	if (start+len>textlen) {
		len-=start+len-textlen;
		if (len<0) len=0;
	}

	return {start:start,len:len,payload:payload};
};
var cloneMarkup=function(m) {
	if (typeof m=='undefined') return null;
	return createMarkup(-1,m.start,m.len,JSON.parse(JSON.stringify(m.payload)));
};
/*
TODO , handle migration of fission page
*/
var migrateMarkup=function(markup, rev) {
	var end=markup.start+markup.len;
	var text=rev.payload.text||"";
	var newlen=(text.length-rev.len);
	var revend=rev.start+rev.len;
	var m=cloneMarkup(markup); //return a new copy

	if (end<=rev.start) return m;
	else if (revend<=markup.start) {
		m.start+=newlen;
		return m;
	} else { //overlap
		//  markup    x    xx      xx    xyz      xyyyz        xyz  
		//  delete   ---   ---    ---     ---      ---        ---     
		//  dout     |     |      |		   x        xz          z            
		//  insert   +++   +++    +++     +++      +++        +++
		//  iout     +++x  +++xx  +++xx  x+++yz   x+++yyyz    +++ xyz
		if (rev.start>markup.start) {
			var adv=rev.start-markup.start;  //markup in advance of rev
			var remain=( markup.len -adv) + newlen ; // remaining character after 
			if (remain<0) remain=0;
			m.len = adv + remain ;
		} else {
			m.start=rev.start;
			var behind=markup.start-rev.start;
			m.len=markup.len - (rev.len-behind);
		}
		if (m.len<0) m.len=0;
		return m;
	}
};
var applyChanges=function(sourcetext ,revisions) {
	revisions.sort(function(r1,r2){return r2.start-r1.start;});
	var text2=sourcetext;
	revisions.map(function(r){
		text2=text2.substring(0,r.start)+r.payload.text+text2.substring(r.start+r.len);
	});
	return text2;
};
var addMarkup=function(start,len,payload) {
	this.__markups__().push(createMarkup(this.inscription.length,start, len, payload ));
	this.doc.markDirty();
};
var addRevision=function(start,len,str) {
	var valid=this.__revisions__().every(function(r) {
		return (r.start+r.len<=start || r.start>=start+len);
	});
	var newrevision=createMarkup(this.inscription.length,start,len,{text:str});
	if (valid) this.__revisions__().push(newrevision);
	this.doc.markDirty();
	return valid;
};

var diff2revision=function(diff) {
	var out=[],offset=0,i=0;
	while (i<diff.length) {
		var d=diff[i];
		if (0==d[0]) {
			offset+=d[1].length;
		} else  if (d[0]<0) { //delete
			if (i<diff.length-1 && diff[i+1][0]==1) { //combine to modify
				out.push({start:offset,len:d[1].length,payload:{text:diff[i+1][1]}});
				i++;
			} else {
				out.push({start:offset,len:d[1].length,payload:{text:""}});
			}
			offset+=d[1].length;
		} else { //insert
			out.push({start:offset,len:0,payload:{text:d[1]}});
			//offset-=d[1].length;
		}
		i++;
	}
	return out;
}


var addRevisionsFromDiff=function(diff,opts) { //Google Diff format
	var revisions=diff2revision(diff);
	this.addRevisions(revisions,opts);
	return revisions.length;
}

var addMarkups=function(newmarkups,opts) {
	if (!newmarkups) return;
	if (!newmarkups.length) return;
	if (opts &&opts.clear) this.clearMarkups();
	var maxlength=this.inscription.length;
	var markups=this.__markups__();
	for (var i=0;i<newmarkups.length;i++) {
		var m=newmarkups[i];
		var newmarkup=createMarkup(maxlength, m.start, m.len, m.payload);
		markups.push(newmarkup);
	}
};
var addRevisions=function(newrevisions,opts) {
	if (!(newrevisions instanceof Array)) return;
	if (!newrevisions.length) return;
	if (opts &&opts.clear) this.clearRevisions();
	var revisions=this.__revisions__();
	var maxlength=this.inscription.length;
	for (var i=0;i<newrevisions.length;i++) {
		var m=newrevisions[i];
		var newrevision=createMarkup(maxlength, m.start, m.len, m.payload );
		revisions.push(newrevision);	
	}
};
var downgradeMarkups=function(markups) {
	var downgraded=[];

	for (var i in markups) {
		var m=markups[i];
		for (var j=0;j<this.revert.length;j++) {
			m=migrateMarkup(m,this.revert[j]);
		}
		downgraded.push(m);
	}
	return downgraded;
};
var upgradeMarkups=function(markups,revs) {
	var migratedmarkups=[];
	markups.map(function(m){
		var s=m.start, l=m.len, delta=0, deleted=false;
		revs.map(function(rev){
			if (rev.start<=s) { //this will affect the offset
				delta+= (rev.payload.text.length-rev.len);
			}
			if (rev.start<=s && rev.start+rev.len>=s+l) {
				deleted=true;
			}
		});
		var m2=cloneMarkup(m);
		m2.start+=delta;
		if (deleted) m2.len=0;
		migratedmarkups.push(m2);
	});
	return migratedmarkups;
};
var upgradeMarkupsTo=function(M,targetPage) {
	var pg=targetPage, lineage=[], doc=this.doc;
	while (true) {
			var pid=pg.parentId;
			if (!pid) break; // root	
			if (pid==pg.id)break;
			lineage.unshift(pg);
			pg=doc.getPage(pid);
	}
	lineage.map(function(pg){
		var parentPage=doc.getPage(pg.parentId);
		var rev=revertRevision(pg.revert,parentPage.inscription);
		M=parentPage.upgradeMarkups(M,rev);
	});
	return M;
};

var downgradeMarkupsTo=function(M,targetPage) {
	var pg=this,doc=this.doc;
	var ancestorId=targetPage.id;
	while (true) {
			var pid=pg.parentId;
			if (!pid) break; // root	
			M=pg.downgradeMarkups(M);
			if (pid==ancestorId)break;
			pg=doc.getPage(pid);
	}
	return M;
};
var offsprings=function() {
	var out=[];
	var page=this;
	while (page.__mutant__().length) {
		var mu=page.__mutant__();
		page=mu[mu.length-1];
		out.push(page);
	}
	return out;
}
var version=function() {  //return version number of this page
	var v=0, page=this, doc=this.doc;
	while (page.parentId) {
		v++;
		page=doc.getPage(page.parentId);
	}
	return v;
}

var hasAncestor=function(ancestor) {
	var ancestorId=ancestor.id;
	var pg=this,doc=this.doc;
	
	while (true) {
		if (!pg.parentId) return false; // root	
		if (pg.parentId==ancestorId) return true;
		pg=doc.getPage(pg.parentId);
	}
	return false;
};
var getAncestors=function() {
	var pg=this,ancestor=[], doc=this.doc;
	while (true) {
			var pid=pg.parentId;
			if (!pid) break; // root	
			pg=doc.getPage(pid);
			ancestor.unshift(pg);
	}
	return ancestor;
};

var clear=function(M,start,len,author) { //return number of item removed
	var count=0;
	if (typeof start=='undefined') {
		count=M.length;
	  M.splice(0, M.length);
	  return count;
	}
	if (len<0) len=this.inscription.length;
	var end=start+len;
	for (var i=M.length-1;i>=0;--i) {
		if (M[i].start>=start && M[i].start+M[i].len<=end) {
			if (author && author!=M[i].payload.author) continue;
			M.splice(i,1);
			count++;
		}
	}
	this.doc.markDirty();
	return count;
};
var clearRevisions=function(start,len,author) {
	clear.apply(this,[this.__revisions__(),start,len,author]);
	this.doc.markDirty();
};
var clearMarkups=function(start,len,author) {
	clear.apply(this,[this.__markups__(),start,len,author]);
	this.doc.markDirty();
};
var getOrigin=function() {
	var pg=this;
	while (pg && pg.parentId) {
		pg=this.doc.getPage(pg.parentId);
	}
	return pg;
}
var isLeafPage=function() {
	return (this.__mutant__().length===0);
};
//convert revert and revision back and forth
var revertRevision=function(revs,parentinscription) {
	var revert=[], offset=0;
	revs.sort(function(m1,m2){return m1.start-m2.start;});
	revs.map(function(r){
		var newinscription="";
		var	m=cloneMarkup(r);
		var newtext=parentinscription.substr(r.start,r.len);
		m.start+=offset;
		var text=m.payload.text||"";
		m.len=text.length;
		m.payload.text=newtext;
		offset+=m.len-newtext.length;
		revert.push(m);
	});
	revert.sort(function(a,b){return b.start-a.start;});
	return revert;
};
var markupAt=function(pos,markups) {
	var markups=markups||this.__markups__();
	return markups.filter(function(m){
		var len=m.len;if (!m.len) len=1;
		return (pos>=m.start && pos<m.start+len);
	});
};
var revisionAt=function(pos) {
	return this.__revisions__().filter(function(m){
		return (pos>=m.start && pos<=m.start+m.len);
	});
};

var compressRevert=function(R) {
	var out=[];
	for (var i in R) {
		if (R[i].payload.text==="") {
			out.push([R[i].start,R[i].len]);
		} else out.push([R[i].start,R[i].len,R[i].payload.text]);
	}
	return out;
};
var decompressRevert=function(R) {
	var out=[];
	for (var i=0;i<R.length;i++) {
		if (R[i].length) { //array format
			out.push({start:R[i][0],len:R[i][1], payload:{text:R[i][2]||""}})
		} else {
			out.push({start:R[i].s,len:R[i].l, payload:{text:R[i].t||""}});	
		}
	}
	return out;
};

var toJSONString=function(opts) {
	var obj={};
	opts=opts||{};
	if (this.name) obj.n=this.name;
	if (opts.withtext) obj.t=this.inscription;
	if (this.parentId) obj.p=this.parentId;
	if (this.revert) obj.r=compressRevert(this.revert);
	var meta=this.__meta__();
	/*
	if (meta.daugtherStart) {
		obj.ds=meta.daugtherStart;
		obj.dc=meta.daugtherCount;
	}
	*/
	return JSON.stringify(obj);
};
var compressedRevert=function() {
	return compressRevert(this.revert);
}
var filterMarkup=function(cb) {
	return this.__markups__().filter(function(m){
		return cb(m);
	});
}
var findMarkup=function(query) { //same like jquery
	var name=query.name;
	var output=[];
	this.__markups__().map(function(M){
		if (M.payload.name==name) {
			output.push(M);
		}
	});
	return output;
};
/*
var fission=function(breakpoints,opts){
	var meta=this.__meta__();
	var movetags=function(newpage,start,end) {
		var M=this.__markups__();
		M.map(function(m){
			if (m.start>=start && m.start<end) {
				newpage.addMarkup(m.start-start,m.len, m.payload);
			}
		});
	};
	meta.daugtherStart=this.doc.version;
	meta.daugtherCount=breakpoints.length+1;
	// create page ,add transclude from
	var start=0, t="";
	for (var i=0;i<=breakpoints.length;i++) {
		var end=breakpoints[i]||this.inscription.length;
		t=this.inscription.substring(start,end);
		var transclude={id:this.id, start:start };//
		var newpage=this.doc.createPage({text:t, transclude:transclude});
		newpage.__setParentId__(this.id);
		movetags.apply(this,[newpage,start,end]);
		start=end;
	}

	//when convert to json, remove the inscription in origin text
	//and retrived from fission mutant
};
*/
var toggleMarkup=function(start,len,payload) {
	var M=this.__markups__();
	for (var i=0;i<M.length;i++){
		if (start===M[i].start && len==M[i].len && payload.type==M[i].payload.type) {
			M.splice(i, 1);
			return;
		} 
	}
	this.addMarkup(start,len,payload);
};

var mergeMarkup = function(markups,offsets,type) {
	markups=markups||this.__markups__();
	var M=require("./markup");
	M.addTokenOffset(markups,offsets);
	var res= M.merge(markups, type||"suggest");
	return M.applyTokenOffset(res,offsets);
}

var strikeout=function(start,length,user,type) {
	this.clearMarkups(start,length,user);
	var markups=this.__markups__();
	var M=require("./markup");
	type=type||"suggest";
	return M.strikeout(markups,start,length,user,type);
}

var preview=function(opts) { 
	//suggestion is from UI , with insert in payload
	var revisions=require("./markup").suggestion2revision(opts.suggestions);
	return this.doc.evolvePage(this,{preview:true,revisions:revisions,markups:[]});
}

/*
  change to prototype
*/
var newPage = function(opts) {
	var PG={};
	var inscription="";
	var hasInscription=false;
	var markups=[];
	var revisions=[];
	var mutant=[];

	opts=opts||{};
	opts.id=opts.id || 0; //root id==0
	var parentId=0 ,name="";
	if (typeof opts.parent==='object') {
		inscription=opts.parent.inscription;
		name=opts.parent.name;
		hasInscription=true;
		parentId=opts.parent.id;
	}
	var doc=opts.doc;
	var meta= {name:name,id:opts.id, parentId:parentId, revert:null };

	//these are the only 2 function changing inscription,use by Doc only
	var checkLength=function(ins) {
		if (ins.length>doc.maxInscriptionLength) {
			console.error("exceed size",ins.length, ins.substring(0,100));
			ins=ins.substring(0,doc.maxInscriptionLength);
		}
		return ins;
	};
	PG.__selfEvolve__  =function(revs,M) { 
		//TODO ;make sure inscription is loaded
		var newinscription=applyChanges(inscription, revs);
		var migratedmarkups=[];
		meta.revert=revertRevision(revs,inscription);
		inscription=checkLength(newinscription);
		hasInscription=true;
		markups=upgradeMarkups(M,revs);
	};
	Object.defineProperty(PG,'inscription',{
		get : function() {
			if (meta.id===0) return ""; //root page
			if (hasInscription) return inscription;
			/*
			if (meta.daugtherStart) {
				inscription="";
				for (var i=0;i<meta.daugtherCount;i++) {//combine from daugther
					var pg=this.doc.getPage(meta.daugtherStart+i);
					inscription+=pg.inscription;
				}
			} else {
			*/
				var mu=this.getMutant(0); //revert from Mutant
				if (mu) {
					inscription=checkLength(applyChanges(mu.inscription,mu.revert));					
				} else {
					inscription="";
				}
				
			//}
			hasInscription=true;
			return inscription;
	}});
	//protected functions

	PG.__markups__     = function() { return markups;} ; 
	PG.__revisions__   = function() { return revisions;} ;
	PG.hasRevision     = function() { return revisions.length>0;} ;
	Object.defineProperty(PG,'id',{value:meta.id});
	Object.defineProperty(PG,'doc',{value:doc});
	Object.defineProperty(PG,'parentId',{get:function() {return meta.parentId;}});
	PG.__setParentId__ = function(i) { meta.parentId=i;	};
	PG.getMarkup       = function(i){ return cloneMarkup(markups[i]);} ;//protect from modification
	Object.defineProperty(PG,'markupCount',{get:function(){return markups.length;}});

	Object.defineProperty(PG,'revert',{get:function(){return meta.revert;}});
	PG.__setRevert__   = function(r) { meta.revert=decompressRevert(r);};
	//PG.__setDaugther__ = function(s,c) { meta.daugtherStart=s;meta.daugtherCount=c;};
	PG.getRevision     = function(i) { return cloneMarkup(revisions[i]);};
	PG.getMutant       = function(i) { return mutant[i]; };
	PG.__mutant__      = function()  { return mutant;};
	PG.__setmutant__   = function(c)  { mutant=c;};
	Object.defineProperty(PG,'revisionCount',{get:function(){return revisions.length;}});
		
	PG.setName           = function(n){ meta.name=n; return this;};
	Object.defineProperty(PG,'name',{get:function(){return meta.name;}});
	PG.__meta__        = function() {return meta;};
	Object.defineProperty(PG,'version',{get:version});
	//Object.defineProperty(PG,'daugtherStart',{get:function(){return meta.daugtherStart;}});
	//Object.defineProperty(PG,'daugtherCount',{get:function(){return meta.daugtherCount;}});
	PG.clearRevisions    = clearRevisions;
	PG.clearMarkups      = clearMarkups;
	PG.addMarkup         = addMarkup;
	PG.toggleMarkup      = toggleMarkup;
	PG.addMarkups        = addMarkups;
	PG.addRevision       = addRevision;
	PG.addRevisions      = addRevisions;
	PG.addRevisionsFromDiff=addRevisionsFromDiff;
	PG.hasAncestor       = hasAncestor;
	PG.upgradeMarkups    = upgradeMarkups;
	PG.downgradeMarkups  = downgradeMarkups;
	PG.upgradeMarkupsTo  = upgradeMarkupsTo;
	PG.downgradeMarkupsTo=downgradeMarkupsTo;
	PG.getAncestors      = getAncestors;
	PG.isLeafPage        = isLeafPage;
	PG.markupAt          = markupAt;
	PG.revisionAt        = revisionAt;
//	PG.getmutant          = getmutant;
	PG.toJSONString      = toJSONString;
	PG.findMarkup				 = findMarkup;
	PG.filterMarkup			 = filterMarkup;
//	PG.fission           = fission;
	PG.mergeMarkup       = mergeMarkup;
	PG.strikeout         = strikeout;
	PG.preview           = preview;
	PG.getOrigin       = getOrigin;
	PG.revertRevision = revertRevision;
	PG.offsprings       = offsprings;
	PG.compressedRevert=compressedRevert;
	Object.freeze(PG);
	return PG;
};
var createDocument = function(docjson,markupjson) {
	var DOC={};
	var pages=[];
	var names={};
	var meta={doctype:"dg1.0",filename:""};
	var dirty=0;
	var tags={};
	var sep="_.id";


	var createFromJSON=function(json) {
			rootPage.clearRevisions();
			var t=json.text||json.t ,page;
			if (t) {
				rootPage.addRevision(0,0,json.text || json.t);
				page=evolvePage(rootPage);				
			} else {
				page=createPage();
			}
			var name=json.n||json.name||"";
			if (!names[name]) {
				names[name]=pages.length-1;
			} else if (!json.p) {
				console.warn("repeat name "+name);
			}
			page.setName(name);
			if (json.p) page.__setParentId__(json.p);
			if (json.r) page.__setRevert__(json.r);
			/*
			if (json.ds) {
				page.__setDaugther__(json.ds,json.dc);
			}
			*/
			page.addMarkups(json.markups,true);
			page.addRevisions(json.revisions,true);
			return page;
	};
	var endCreatePages=function(opts) {
		//build mutant array
		if (opts&&opts.clear) pages.map(function(P){
			var mu=P.__mutant__();
			mu=[];
		});
		pages.map(function(P,idx,pages){
			if (P.parentId) pages[P.parentId].__mutant__().push(P);
		});		
	}
	var addMarkups=function(markups) {
		if (markups) for (var i=0;i<markups.length;i++){
			var m=markups[i];
			var pageid=m.i;
			pages[pageid].addMarkup(m.start,m.len,m.payload);
		}		
	}
	var createPages=function(json,markups) {
		var count=0,i;
		for (i=0;i<json.length;i++) {
			if (i==0 && !json[i].t) continue; //might be header
			createPage(json[i]);
		}

		endCreatePages({clear:true});
		addMarkups(markups);
		return this;
	};
	var createPage=function(input) {
		var id=pages.length,page;
		if (typeof input=='undefined' || typeof input.getMarkup=='function') {
			//root page
			var parent=input||0;
			page=newPage({id:id,parent:parent,doc:DOC});
			pages.push(page) ;
		} else if (typeof input=='string') { 
			page=createFromJSON({text:input});
		} else {
			page=createFromJSON(input);
		}
		return page;
	};
	var evolvePage=function(pg,opts) {//apply revisions and upgrate markup
		var nextgen;
		opts=opts||{};
		if (opts.preview) { 
			nextgen=newPage({parent:pg,doc:DOC,id:-1});  //id cannot null
		} else {
			nextgen=createPage(pg);	
		}
		if (pg.id) pg.__mutant__().push(nextgen);
		var revisions=opts.revisions||pg.__revisions__();
		var markups=opts.markups||pg.__markups__();
		nextgen.__selfEvolve__( revisions ,markups );

		return nextgen;
	};

	var findMRCA=function(pg1,pg2) {
		var ancestors1=pg1.getAncestors();
		var ancestors2=pg2.getAncestors();
		var common=0; //rootPage id
		while (ancestors1.length && ancestors2.length &&
		   ancestors1[0].id==ancestors2[0].id) {
			common=ancestors1[0];
			ancestors1.shift();ancestors2.shift();
		}
		return common;
	};

	var migrate=function(from,to) { //migrate markups of A to B
		if (typeof from=='number') from=this.getPage(from);
		var M=from.__markups__();
		var out=null;
		if (typeof to=='undefined') {
			out=from.downgradeMarkups(M);
		} else {
			if (typeof to=='number') to=this.getPage(to);
			if (from.id===to.id) {
				return M;
			} else if (to.hasAncestor(from)) {
				out=from.upgradeMarkupsTo(M,to);
			} else if (from.hasAncestor(to)){
				out=from.downgradeMarkupsTo(M,to);
			} else {
				var ancestor=findMRCA(from,to);
				out=from.downgradeMarkupsTo(M,ancestor);
				out=ancestor.upgradeMarkupsTo(out,to);
			}
		}
		return out;
	};
	var findPage=function(name) {
		for (var i=0;i<this.pageCount;i++) {
			if (name===pages[i].name) return pages[i];
		}
		return null;
	};
	var getLeafPages=function() {
		var arr=[],i=0;
		for (i=0;i<this.pageCount;i++) {arr[i]=true;}
		for (i=0;i<this.pageCount;i++) {
			var pid=pages[i].parentId;
			arr[pid]=false;
		}
		var leafpages=[];
		arr.map(function(p,i){ if (p) leafpages.push(i); });
		return {leafPages:leafpages, isLeafPages:arr};
	};
	/*
		convert revert to a string.
		starting with ascii 1
	*/
	var toJSONString=function() {
		var out=["["+JSON.stringify(meta)], s=",";
		var isLeafPages=this.getLeafPages().isLeafPages;
		for (var i=0;i<pages.length;i++) {
			if (i===0) continue;
			s+=pages[i].toJSONString({"withtext":isLeafPages[i]});
			out.push(s);
			s=",";
		}
		out[out.length-1]+="]";
		//make line number save as version number
		return out.join('\n');
	};

	//get a page , if version is not specified, return lastest
	//version ==0 first version, version==1 second ..
	var pageByName=function(name,version) {
		var parr=names[name];
		if (!parr) {
			return null; //pagename not found
		}
		if (typeof version=="undefined") {
			version=-1; //lastest
		}
		var pg=pages[parr];
		if (version==0) return pg; //the first version
		while (pg.__mutant__().length) {
			var mu=pg.__mutant__();
			pg=mu[mu.length-1];
			version--; 
			if  (version==0) break;
		}
		return pg;
	};

	var map=function(context,callback) {
		var cb=callback,ctx=context;
		if (typeof context=="function") {
			cb=context;
			ctx=this;
		}
		for (var i=1;i<this.pageCount;i++) {
			var pg=pages[i];
			if (pg.parentId!=0)  continue; //not a root page, 
			while (pg.__mutant__().length) {
				var mu=pg.__mutant__();
				pg=mu[mu.length-1];
			}
			cb.apply(ctx,[pg,i-1]);
		}
	}
	var pageNames=function() {
		var out=[];
		for (var i=1;i<this.pageCount;i++) {
			var pg=pages[i];
			if (pg.parentId!=0)  continue; //not a root page, 
			out.push(pg.name);
		}
		return out;
	}

	var rootPage=createPage();

	DOC.getPage=function(id) {return pages[id];};
	DOC.markDirty=function() {dirty++;};
	DOC.markClean=function() {dirty=0;};
	DOC.setTags=function(T)  {tags=T;};
	DOC.setSep=function(s)  {sep=s;};
	/*
		external markups must be saved with version number.
	*/


	Object.defineProperty(DOC,'meta',{value:meta});
	Object.defineProperty(DOC,'maxInscriptionLength',{value:8192});
	Object.defineProperty(DOC,'version',{get:function(){return pages.length;}});
	Object.defineProperty(DOC,'pageCount',{get:function(){return pages.length;}});
	Object.defineProperty(DOC,'dirty',{get:function() {return dirty>0; }});
	Object.defineProperty(DOC,'ags',{get:function() {return tags;}});
	Object.defineProperty(DOC,'sep',{get:function() {return sep;}});

	
	DOC.createPage=createPage;
	DOC.createPages=createPages;
	DOC.addMarkups=addMarkups;
	DOC.evolvePage=evolvePage;
	DOC.findMRCA=findMRCA;
	DOC.migrate=migrate; 
	DOC.downgrade=migrate; //downgrade to parent
	DOC.migrateMarkup=migrateMarkup; //for testing
	DOC.getLeafPages=getLeafPages;
	DOC.findPage=findPage;
	DOC.pageByName=pageByName;
	DOC.toJSONString=toJSONString;

	DOC.map=map;
	DOC.pageNames=pageNames;
	DOC.endCreatePages=endCreatePages;

	if (docjson) DOC.createPages(docjson,markupjson);
	dirty=0;
	
	Object.freeze(DOC);
	return DOC;
};
/*
	TODO move user markups to tags
*/
/*
var splitInscriptions=function(doc,starts) {
	var combined="",j=0;
	var inscriptions=[],oldunitoffsets=[0];
	for (var i=1;i<doc.pageCount;i++) {
		var page=doc.getPage(i);
		var pageStart=doc.maxInscriptionLength*i;
 		combined+=page.inscription;
		oldunitoffsets.push(combined.length);
	}
	var last=0,newunitoffsets=[0];
	starts.map(function(S){
		var till=oldunitoffsets[ S[0] ]+ S[1];
		newunitoffsets.push(till);
		inscriptions.push( combined.substring(last,till));
		last=till;
	})
	inscriptions.push( combined.substring(last));
	newunitoffsets.push(combined.length);
	return {inscriptions:inscriptions,oldunitoffsets:oldunitoffsets , newunitoffsets:newunitoffsets};
}

var sortedIndex = function (array, tofind) {
  var low = 0, high = array.length;
  while (low < high) {
    var mid = (low + high) >> 1;
    array[mid] < tofind ? low = mid + 1 : high = mid;
  }
  return low;
};

var addOldUnit=function() {
// convert old unit into tags 
}

var reunitTags=function(tags,R,newtagname) {
	var out=[];
	tags.map(function(T){
		if (T.name===newtagname) return;
		var tag=JSON.parse(JSON.stringify(T));
		var pos=R.oldunitoffsets[T.sunit]+T.soff;
		var p=sortedIndex(R.newunitoffsets,pos+1)-1;
		if (p==-1) p=0;
		tag.sunit=p;tag.soff=pos-R.newunitoffsets[p];

		eunit=T.eunit||T.sunit;eoff=T.eoff||T.soff;
		if (eunit!=T.sunit || eoff!=T.soff) {
			pos=R.oldunitoffsets[eunit]+eoff;
			p=sortedIndex(R.newunitoffsets,pos)-1;
			if (p==-1) p=0;
			if (eunit!=T.sunit) tag.eunit=p;
			if (eoff!=T.soff)   tag.eoff=pos-R.newunitoffsets[p];
		}
		out.push(tag);
	});
	return out;
}
var reunit=function(doc,tagname,opts) {
	var unitstarts=[];
	doc.tags.map(function(T){
		if (T.name===tagname)	unitstarts.push([T.sunit,T.soff]);
	});

	var R=splitInscriptions(doc,unitstarts);
	var newdoc=createDocument();
	R.inscriptions.map(function(text){newdoc.createPage(text)});

	newdoc.tags=reunitTags(doc.tags,R,tagname);
	return newdoc;
}
*/
// reunit is too complicated, change to fission
// a big chunk of text divide into smaller unit
//
module.exports={ createDocument: createDocument};
});
require.register("ksana-document/api.js", function(exports, require, module){
if (typeof nodeRequire=='undefined') var nodeRequire=(typeof ksana=="undefined")?require:ksana.require;
var appPath=""; //for servermode
var getProjectPath=function(p) {
  debugger;
  var path=nodeRequire('path');
  return path.resolve(p.filename);
};


var enumProject=function() { 
  return nodeRequire("ksana-document").projects.names();
};
var enumKdb=function(paths) {
  if (typeof paths=="string") {
    paths=[paths];
  }
  if (appPath) {
	  for (var i in paths) {
	  	  paths[i]=require('path').resolve(appPath,paths[i]);
	  }
  }
  var db=nodeRequire("ksana-document").projects.getFiles(paths,function(p){
    return p.substring(p.length-4)==".kdb";
  });
  return db.map(function(d){
    return d.shortname.substring(0,d.shortname.length-4)
  });
}
var loadDocumentJSON=function(opts) {
  var persistent=nodeRequire('ksana-document').persistent;
  var ppath=getProjectPath(opts.project);
  var path=nodeRequire('path');
  //if empty file, create a empty
  var docjson=persistent.loadLocal(  path.resolve(ppath,opts.file));
  return docjson;
};
var findProjectPath=function(dbid) {
  var fs=nodeRequire("fs");
  var path=nodeRequire('path');
  var tries=[ //TODO , allow any depth
               "./ksana_databases/"+dbid
               ,"../ksana_databases/"+dbid
               ,"../../ksana_databases/"+dbid
               ,"../../../ksana_databases/"+dbid
               ];
    for (var i=0;i<tries.length;i++){
      if (fs.existsSync(tries[i])) {
        return path.resolve(tries[i]);
      }
    }
    return null;
}
var saveMarkup=function(opts) {
  var path=nodeRequire('path');
  var persistent=nodeRequire('ksana-document').persistent;
  var filename=opts.filename;
  if (opts.dbid) {
    var projectpath=findProjectPath(opts.dbid);
    if (projectpath) filename=path.resolve(projectpath,filename);
  } 
  return persistent.saveMarkup(opts.markups, filename,opts.pageid||opts.i);
};
var saveDocument=function(opts) {
  var persistent=nodeRequire('ksana-document').persistent;
  return persistent.saveDocument(opts.doc , opts.filename);
};
var getUserSettings=function(user) {
  var fs=nodeRequire('fs');
  var defsettingfilename='./settings.json';
  if (typeof user=="undefined") {
    if (fs.existsSync(defsettingfilename)) {
      return JSON.parse(fs.readFileSync(defsettingfilename,'utf8'));  
    }
  }
  return {};
}
var buildIndex=function(projname) {
  nodeRequire('ksana-document').indexer_kd.start(projname);
}
var buildStatus=function(session) {
  return nodeRequire("ksana-document").indexer_kd.status(session);
}
var stopIndex=function(session) {
  return nodeRequire("ksana-document").indexer_kd.stop(session);
} 
var getProjectFolders=function(p) {
  return nodeRequire("ksana-document").projects.folders(p.filename);
}
var getProjectFiles=function(p) {
  return nodeRequire("ksana-document").projects.files(p.filename);
}

var search=function(opts,cb) {
  var Kde=nodeRequire("ksana-document").kde;
  Kde.createLocalEngine(opts.dbid,function(engine){
    nodeRequire("./kse").search(engine,opts.q,opts,cb);
  });
};
search.async=true;
var get=function(opts,cb) {
  require("./kde").openLocal(opts.db,function(engine){
      if (!engine) {
        throw "database not found "+opts.db;
      }
      engine.get(opts.key,opts.recursive,function(data){cb(0,data)});
  });
}
var setPath=function(path) {
  appPath=path;
  nodeRequire("ksana-document").setPath(path);
}
get.async=true;

var markup=require('./markup.js');
var users=require('./users');
var installservice=function(services) {
	var API={ 
        enumProject:enumProject
        ,enumKdb:enumKdb
        ,getProjectFolders:getProjectFolders
        ,getProjectFiles:getProjectFiles
        ,loadDocumentJSON:loadDocumentJSON
        ,saveMarkup:saveMarkup
        ,saveDocument:saveDocument
        ,login:users.login
        ,getUserSettings:getUserSettings
        ,buildIndex:buildIndex
        ,buildStatus:buildStatus
        ,stopIndex:stopIndex
        ,search:search
        ,get:get
        ,setPath:setPath
	  ,version: function() { return require('./package.json').version; }
	};
	if (services) {
		services.document=API;
	}
	return API;
};

module.exports=installservice;
});
require.register("ksana-document/xml.js", function(exports, require, module){
var D=require('./document');
var template_accelon=require('./template_accelon');
var formatJSON = function(json,meta) {
		var out=["["],s="";
		if (meta) {
			out[0]+=JSON.stringify(meta);
			s=",";
		}
		json.map(function(obj) {
			if (obj.toJSONString) s+=obj.toJSONString();
			else s+=JSON.stringify(obj);
			out.push(s);
			s=",";
		});
		out[out.length-1]+="]";
		return out.join('\n');
};
var importXML=function(lines,opts) {
	opts=opts||{};
	if (opts.template=='accelon') {
		return template_accelon(lines,opts);
	}
	return null;
};
var exportXML=function() {
	
};
module.exports={importXML:importXML,exportXML:exportXML,
	formatJSON:formatJSON};
});
require.register("ksana-document/template_accelon.js", function(exports, require, module){
var D=require('./document');
var unitsep=/<pb n="([^"]*?)"\/>/g  ;
/*
	inline tag
*/
var tags=[];
var tagstack=[];
var parseXMLTag=function(s) {
	var name="",i=0;
	if (s[0]=='/') {
		return {name:s.substring(1),type:'end'};
	}

	while (s[i] && (s.charCodeAt(i)>0x30)) {name+=s[i];i++;}

	var type="start";
	if (s[s.length-1]=='/') { type="emtpy"; }
	var attr={},count=0;
	s=s.substring(name.length+1);
	s.replace(/(.*?)="([^"]*?)"/g,function(m,m1,m2) {
		attr[m1]=m2;
		count++;
	});
	if (!count) attr=undefined;
	return {name:name,type:type,attr:attr};
};
var parseUnit=function(unitseq,unittext,doc) {
	// name,sunit, soff, eunit, eoff , attributes
	var totaltaglength=0;
	var parsed=unittext.replace(/<(.*?)>/g,function(m,m1,off){
		var tag=parseXMLTag(m1);
		tag.seq=unitseq;
		var offset=off-totaltaglength;
		totaltaglength+=m.length;
		if (tag.type=='end') {
			tag=tagstack.pop();
			if (tag.name!=m1.substring(1)) {
				throw 'unbalanced tag at unit  '+unittext;
			}
			if (tag.sunit!=unitseq) tag.eunit=unitseq;
			if (tag.soff!=offset) tag.eoff=offset;
		} else {
			tag.sunit=unitseq;tag.soff=offset;
			if (tag.type=='start') tagstack.push(tag);
			tags.push(tag);
		}
		return ""; //remove the tag from inscription
	});
	return {inscription:parsed, tags:tags};
};
var splitUnit=function(buf,sep) {
	var units=[], unit="", last=0 ,name="";
	buf.replace(sep,function(m,m1,offset){
		units.push([name,buf.substring(last,offset)]);
		name=m1;
		last=offset+m.length; 
	});
	units.push([name,buf.substring(last)]);
	return units;
};
var addMarkups=function(tags,page){
	tags.map(function(T){
		var start=T.soff;
		var len=0;
		if (T.eoff>T.soff) len=T.eoff-T.soff;
		var payload={name:T.name};
		if (T.attr) payload.attr=T.attr;
		page.addMarkup(start,len,payload);
	});
};
var importxml=function(buf,opts) {
	var doc=D.createDocument();
	if (opts.whole) {
		var name=opts.name||"";
		var out=parseUnit(0,buf,doc);
		if (opts.trim) out.inscription=out.inscription.trim();
		var page=doc.createPage({name:name,text:out.inscription});
		addMarkups(out.tags,page);
	} else {
		var units=splitUnit(buf,opts.sep || unitsep);
		units.map(function(U,i){
			var out=parseUnit(i,U[1],doc);
			if (opts.trim) out.inscription=out.inscription.trim();
			doc.createPage({text:out.inscription,name:U[0]});
		});		
	}

	if (tagstack.length) {
		throw 'tagstack not null'+JSON.stringify(tagstack);
	}
	doc.setTags(tags);
	return doc;
};
module.exports=importxml;
});
require.register("ksana-document/persistent.js", function(exports, require, module){
if (typeof nodeRequire=='undefined') var nodeRequire=(typeof ksana=="undefined")?require:ksana.require;

var maxFileSize=512*1024;//for github
var D=require("./document");
var fs=nodeRequire("fs"); 
/*
var open=function(fn,mfn) {
	var kd,kdm="";
	var kd=fs.readFileSync(fn,'utf8');
	if (!mfn) mfn=fn+"m";
	if (fs.existsSync(mfn)) {
		kdm=fs.readFileSync(mfn,'utf8');	
	}

	return {kd:kd,kdm:kdm}
}
*/
var loadLocal=function(fn,mfn) {
//if (!fs.existsSync(fn)) throw "persistent.js::open file not found ";
	if (fs.existsSync(fn)){
		var content=fs.readFileSync(fn,'utf8');
		var kd=null,kdm=null;
		try {
			kd=JSON.parse(content);
		} catch (e) {
			kd=[{"create":new Date()}];
		}		
	}
		
	if (!mfn) mfn=fn.substr(0,fn.lastIndexOf("."))+".kdm";
	if (fs.existsSync(mfn)) {
		kdm=JSON.parse(fs.readFileSync(mfn,'utf8'));	
	}
	return {kd:kd,kdm:kdm};
}
/* load json and create document */
var createLocal=function(fn,mfn) {
	var json=loadLocal(fn,mfn);
	var doc=D.createDocument(json.kd,json.kdm);
	doc.meta.filename=fn;
	return doc;
};
var serializeDocument=function(doc) {
	var out=[];
	for (var i=1;i<doc.pageCount;i++) {
		var P=doc.getPage(i);
		var obj={n:P.name, t:P.inscription};
		if (P.parentId) obj.p=P.parentId;
		out.push(JSON.stringify(obj));
	}
	return 	"[\n"+out.join("\n,")+"\n]";
};
var serializeXMLTag=function(doc) {
	if (!doc.tags)return;
	var out=[];
	for (var i=0;i<doc.tags.length;i++) {
		out.push(JSON.stringify(doc.tags[i]));
	}
	return 	"[\n"+out.join("\n,")+"\n]";
};
var serializeMarkup=function(doc) {
	var out=[];
	var sortfunc=function(a,b) {
		return a.start-b.start;
	};
	for (var i=0;i<doc.pageCount;i++) {
		var M=doc.getPage(i).__markups__();

		var markups=JSON.parse(JSON.stringify(M)).sort(sortfunc);

		for (var j=0;j<markups.length;j++) {
			var m=markups[j];
			m.i=i;
			out.push(JSON.stringify(m));
		}
	}
	return 	"[\n"+out.join("\n,")+"\n]";
};


var saveMarkup=function(markups,filename,pageid) { //same author
	if (!markups || !markups.length) return null;
	var author=markups[0].payload.author, others=[];
	var mfn=filename+'m';
	var json=loadLocal(filename,mfn);
	if (!json.kdm || !json.kdm.length) {
		others=[];
	} else {
		others=json.kdm.filter(function(m){return m.i!=pageid || m.payload.author != author});	
	}
	for (var i=0;i<markups.length;i++) {
		markups[i].i=pageid;
	}
	others=others.concat(markups);
	var sortfunc=function(a,b) {
		//each page less than 64K
		return (a.i*65536 +a.start) - (b.i*65536 +b.start);
	}
	others.sort(sortfunc);
	var out=[];
	for (var i=0;i<others.length;i++) {
		out.push(JSON.stringify(others[i]));
	}
	return fs.writeFile(mfn,"[\n"+out.join("\n,")+"\n]",'utf8',function(err){
		//		
	});
}
var saveMarkupLocal=function(doc,mfn) {
	if (!doc.meta.filename && !mfn) throw "missing filename";
	if (!doc.dirty) return;
	if (typeof mfn=="undefined") {
		mfn=doc.meta.filename+"m";
	}
	var out=serializeMarkup(doc);
	return fs.writeFile(mfn,out,'utf8',function(err){
		if (!err) doc.markClean();
	});
};

var saveDocument=function(doc,fn) {
	if (!fn) fn=doc.meta.filename;
	var out=serializeDocument(doc);
	if (out.length>maxFileSize) {
		console.error('file size too big ',out.length);
	}
	return fs.writeFileSync(fn,out,'utf8');
};

var saveDocumentTags=function(doc,fn) {
	if (!fn) fn=doc.meta.filename;
	var out=serializeXMLTag(doc);
	return fs.writeFileSync(fn,out,'utf8');
};

module.exports={
	loadLocal:loadLocal,
	createLocal:createLocal,
	saveDocument:saveDocument,
	saveDocumentTags:saveDocumentTags,
	saveMarkup:saveMarkup,
	serializeDocument:serializeDocument,
	serializeMarkup:serializeMarkup,
	serializeXMLTag:serializeXMLTag
};
});
require.register("ksana-document/tokenizers.js", function(exports, require, module){
var tibetan =function(s) {
	//continuous tsheg grouped into same token
	//shad and space grouped into same token
	var offset=0;
	var tokens=[],offsets=[];
	s=s.replace(/\r\n/g,'\n').replace(/\r/g,'\n');
	var arr=s.split('\n');

	for (var i=0;i<arr.length;i++) {
		var last=0;
		var str=arr[i];
		str.replace(/[།་ ]+/g,function(m,m1){
			tokens.push(str.substring(last,m1)+m);
			offsets.push(offset+last);
			last=m1+m.length;
		});
		if (last<str.length) {
			tokens.push(str.substring(last));
			offsets.push(last);
		}
		if (i===arr.length-1) break;
		tokens.push('\n');
		offsets.push(offset+last);
		offset+=str.length+1;
	}

	return {tokens:tokens,offsets:offsets};
};
var isSpace=function(c) {
	return (c==" ") || (c==",") || (c==".");
}
var isCJK =function(c) {return ((c>=0x3000 && c<=0x9FFF) 
|| (c>=0xD800 && c<0xDC00) || (c>=0xFF00) ) ;}
var simple1=function(s) {
	var offset=0;
	var tokens=[],offsets=[];
	s=s.replace(/\r\n/g,'\n').replace(/\r/g,'\n');
	arr=s.split('\n');

	var pushtoken=function(t,off) {
		var i=0;
		if (t.charCodeAt(0)>255) {
			while (i<t.length) {
				var c=t.charCodeAt(i);
				offsets.push(off+i);
				tokens.push(t[i]);
				if (c>=0xD800 && c<=0xDFFF) {
					tokens[tokens.length-1]+=t[i]; //extension B,C,D
				}
				i++;
			}
		} else {
			tokens.push(t);
			offsets.push(off);	
		}
	}
	for (var i=0;i<arr.length;i++) {
		var last=0,sp="";
		str=arr[i];
		str.replace(/[_0-9A-Za-z]+/g,function(m,m1){
			while (isSpace(sp=str[last]) && last<str.length) {
				tokens[tokens.length-1]+=sp;
				last++;
			}
			pushtoken(str.substring(last,m1)+m , offset+last);
			offsets.push(offset+last);
			last=m1+m.length;
		});

		if (last<str.length) {
			while (isSpace(sp=str[last]) && last<str.length) {
				tokens[tokens.length-1]+=sp;
				last++;
			}
			pushtoken(str.substring(last), offset+last);
			
		}		
		offsets.push(offset+last);
		offset+=str.length+1;
		if (i===arr.length-1) break;
		tokens.push('\n');
	}

	return {tokens:tokens,offsets:offsets};

};

var simple=function(s) {
	var token='';
	var tokens=[], offsets=[] ;
	var i=0; 
	var lastspace=false;
	var addtoken=function() {
		if (!token) return;
		tokens.push(token);
		offsets.push(i);
		token='';
	}
	while (i<s.length) {
		var c=s.charAt(i);
		var code=s.charCodeAt(i);
		if (isCJK(code)) {
			addtoken();
			token=c;
			if (code>=0xD800 && code<0xDC00) { //high sorragate
				token+=s.charAt(i+1);i++;
			}
			addtoken();
		} else {
			if (c=='&' || c=='<' || c=='?'
			|| c=='|' || c=='~' || c=='`' || c==';' 
			|| c=='>' || c==':' || c=='{' || c=='}'
			|| c=='=' || c=='@' || c=='[' || c==']' || c=='(' || c==')' || c=="-"
			|| code==0xf0b || code==0xf0d // tibetan space
			|| (code>=0x2000 && code<=0x206f)) {
				addtoken();
				if (c=='&' || c=='<') {
					var endchar='>';
					if (c=='&') endchar=';'
					while (i<s.length && s.charAt(i)!=endchar) {
						token+=s.charAt(i);
						i++;
					}
					token+=endchar;
					addtoken();
				} else {
					token=c;
					addtoken();
				}
				token='';
			} else {
				if (isSpace(c)) {
					token+=c;
					lastspace=true;
				} else {
					if (lastspace) addtoken();
					lastspace=false;
					token+=c;
				}
			}
		}
		i++;
	}
	addtoken();
	return {tokens:tokens,offsets:offsets};
}
module.exports={simple:simple,tibetan:tibetan};
});
require.register("ksana-document/markup.js", function(exports, require, module){
/*
	merge needs token offset, not char offset
*/
var splitDelete=function(m) {
	var out=[];
	for (i=0;i<m.l;i++) {
		var m2=JSON.parse(JSON.stringify(m));
		m2.s=m.s+i;
		m2.l=1;
		out.push(m2);
	}
	return out;
}
var quantize=function(markup) {
	var out=[],i=0,m=JSON.parse(JSON.stringify(markup));
	if (m.payload.insert) {
			m.s=m.s+m.l-1;
			m.l=1;
			out.push(m)
	} else {
		if (m.payload.text=="") { //delete
			out=splitDelete(m);
		} else { //replace
			if (m.l>1) {//split to delete and replace
				var m2=JSON.parse(JSON.stringify(m));
				m.payload.text="";
				m.l--;
				out=splitDelete(m);
				m2.s=m2.s+m2.l-1;
				m2.l=1;
				out.push(m2);
			} else {
				out.push(m);
			}
		}
	}
	return out;
}
var plural={
	"suggest":"suggests"
}
var combinable=function(p1,p2) {
	var t="";
	for (var i=0;i<p1.choices.length;i++) t+=p1.choices[i].text;
	for (var i=0;i<p2.choices.length;i++) t+=p2.choices[i].text;
	return (t==="");
}
var combine=function(markups) {
	var out=[],i=1,at=0;

	while (i<markups.length) {
		if (combinable(markups[at].payload,markups[i].payload)) {
			markups[at].l++;
		} else {
			out.push(markups[at]);
			at=i;
		}
		i++;
	}
	out.push(markups[at]);
	return out;
}
var merge=function(markups,type){
	var out=[],i=0;
	for (i=0;i<markups.length;i++) {
		if (markups[i].payload.type===type)	out=out.concat(quantize(markups[i]));
	}
	var type=plural[type];
	if (typeof type=="undefined") throw "cannot merge "+type;
	if (!out.length) return [];
	out.sort(function(a,b){return a.s-b.s;});
	var out2=[{s:out[0].s, l:1, payload:{type:type,choices:[out[0].payload]}}];
	for (i=1;i<out.length;i++) {
		if (out[i].s===out2[out2.length-1].s ) {
			out2[out2.length-1].payload.choices.push(out[i].payload);
		} else {
			out2.push({s:out[i].s,l:1,payload:{type:type,choices:[out[i].payload]}});
		}
	}
	return combine(out2);
}
var addTokenOffset=function(markups,offsets) {
	for (var i=0;i<markups.length;i++) {
		var m=markups[i],at,at2;
		at=offsets.indexOf(m.start); //need optimized
		if (m.len) at2=offsets.indexOf(m.start+m.len);
		if (at==-1 || at2==-1) {
			console.trace("markup position not at token boundary");
			break;
		}

		m.s=at;
		if (m.len) m.l=at2-at;
	}
	return markups;
}

var applyTokenOffset=function(markups,offsets) {
	for (var i=0;i<markups.length;i++) {
		var m=markups[i];
		m.start=offsets[m.s];
		m.len=offsets[m.s+m.l] - offsets[m.s];
		delete m.s;
		delete m.l;
	}
	return markups;
}

var suggestion2revision=function(markups) {
	var out=[];
	for (var i=0;i<markups.length;i++) {
		var m=markups[i];
		var payload=m.payload;
		if (payload.insert) {
			out.push({start:m.start+m.len,len:0,payload:payload});
		} else {
			out.push({start:m.start,len:m.len,payload:payload});
		}
	}
	return out;
}

var strikeout=function(markups,start,len,user,type) {
	var payload={type:type,author:user,text:""};
	markups.push({start:start,len:len,payload:payload});
}
module.exports={merge:merge,quantize:quantize,
	addTokenOffset:addTokenOffset,applyTokenOffset:applyTokenOffset,
	strikeout:strikeout, suggestion2revision : suggestion2revision
}
});
require.register("ksana-document/typeset.js", function(exports, require, module){
/*
		if (=="※") {
			arr[i]=React.DOM.br();
		}
*/

var classical=function(arr) {
	var i=0,inwh=false,inwarichu=false,start=0;
	var out=[];

	var newwarichu=function(now) {
		var warichu=arr.slice(start,now);
		var height=Math.round( (warichu.length)/2);
		var w1=warichu.slice(0,height);
		var w2=warichu.slice(height);

		var w=[React.DOM.span({className:"warichu-right"},w1),
		       React.DOM.span({className:"warichu-left"},w2)];
		out.push(React.DOM.span({"className":"warichu"},w));
		start=now;
	}

	var linebreak=function(now) {
		if (inwarichu) {
			newwarichu(now,true);
			start++;
		}
		out.push(React.DOM.br());
	}
	while (i<arr.length) {
		var ch=arr[i].props.ch;
		if (ch=='※') {
			linebreak(i);
		}	else if (ch=='【') { //for shuowen
			start=i+1;
			inwh=true;
		}	else if (ch=='】') {
			var wh=arr.slice(start,i);
			out.push(React.DOM.span({"className":"wh"},wh));
			inwh=false;
		} else if (ch=='﹝') {

			start=i+1;
			inwarichu=true;
		} else if (ch=='﹞') {
			if (!inwarichu) { //in previous page
				out=[];
				inwarichu=true;
				start=0; //reset
				i=0;
				continue;
			}
			newwarichu(i);
			inwarichu=false;
		} else{
			if (!inwh && !inwarichu && ch!='↩') out.push(arr[i]);
		}
		i++;
	}
	if (inwarichu) newwarichu(arr.length-1);

	return React.DOM.span({"className":"vertical"},out);
}
module.exports={classical:classical}
});
require.register("ksana-document/sha1.js", function(exports, require, module){
/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(e,m){var p={},j=p.lib={},l=function(){},f=j.Base={extend:function(a){l.prototype=this;var c=new l;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
n=j.WordArray=f.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=m?c:4*a.length},toString:function(a){return(a||h).stringify(this)},concat:function(a){var c=this.words,q=a.words,d=this.sigBytes;a=a.sigBytes;this.clamp();if(d%4)for(var b=0;b<a;b++)c[d+b>>>2]|=(q[b>>>2]>>>24-8*(b%4)&255)<<24-8*((d+b)%4);else if(65535<q.length)for(b=0;b<a;b+=4)c[d+b>>>2]=q[b>>>2];else c.push.apply(c,q);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=e.ceil(c/4)},clone:function(){var a=f.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*e.random()|0);return new n.init(c,a)}}),b=p.enc={},h=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++){var f=c[d>>>2]>>>24-8*(d%4)&255;b.push((f>>>4).toString(16));b.push((f&15).toString(16))}return b.join("")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d+=2)b[d>>>3]|=parseInt(a.substr(d,
2),16)<<24-4*(d%8);return new n.init(b,c/2)}},g=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++)b.push(String.fromCharCode(c[d>>>2]>>>24-8*(d%4)&255));return b.join("")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d++)b[d>>>2]|=(a.charCodeAt(d)&255)<<24-8*(d%4);return new n.init(b,c)}},r=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(g.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return g.parse(unescape(encodeURIComponent(a)))}},
k=j.BufferedBlockAlgorithm=f.extend({reset:function(){this._data=new n.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=r.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,b=c.words,d=c.sigBytes,f=this.blockSize,h=d/(4*f),h=a?e.ceil(h):e.max((h|0)-this._minBufferSize,0);a=h*f;d=e.min(4*a,d);if(a){for(var g=0;g<a;g+=f)this._doProcessBlock(b,g);g=b.splice(0,a);c.sigBytes-=d}return new n.init(g,d)},clone:function(){var a=f.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});j.Hasher=k.extend({cfg:f.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){k.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,b){return(new a.init(b)).finalize(c)}},_createHmacHelper:function(a){return function(b,f){return(new s.HMAC.init(a,
f)).finalize(b)}}});var s=p.algo={};return p}(Math);
(function(){var e=CryptoJS,m=e.lib,p=m.WordArray,j=m.Hasher,l=[],m=e.algo.SHA1=j.extend({_doReset:function(){this._hash=new p.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(f,n){for(var b=this._hash.words,h=b[0],g=b[1],e=b[2],k=b[3],j=b[4],a=0;80>a;a++){if(16>a)l[a]=f[n+a]|0;else{var c=l[a-3]^l[a-8]^l[a-14]^l[a-16];l[a]=c<<1|c>>>31}c=(h<<5|h>>>27)+j+l[a];c=20>a?c+((g&e|~g&k)+1518500249):40>a?c+((g^e^k)+1859775393):60>a?c+((g&e|g&k|e&k)-1894007588):c+((g^e^
k)-899497514);j=k;k=e;e=g<<30|g>>>2;g=h;h=c}b[0]=b[0]+h|0;b[1]=b[1]+g|0;b[2]=b[2]+e|0;b[3]=b[3]+k|0;b[4]=b[4]+j|0},_doFinalize:function(){var f=this._data,e=f.words,b=8*this._nDataBytes,h=8*f.sigBytes;e[h>>>5]|=128<<24-h%32;e[(h+64>>>9<<4)+14]=Math.floor(b/4294967296);e[(h+64>>>9<<4)+15]=b;f.sigBytes=4*e.length;this._process();return this._hash},clone:function(){var e=j.clone.call(this);e._hash=this._hash.clone();return e}});e.SHA1=j._createHelper(m);e.HmacSHA1=j._createHmacHelper(m)})();
module.exports=CryptoJS;
});
require.register("ksana-document/users.js", function(exports, require, module){
if (typeof nodeRequire=='undefined') var nodeRequire=(typeof ksana=="undefined")?require:ksana.require;

var passwords=[];

var loadpasswd=function(){
	var defpasswdfilename='./passwd.json';
	var fs=nodeRequire('fs');
    if (fs.existsSync(defpasswdfilename)) {
    	passwords=JSON.parse(fs.readFileSync(defpasswdfilename,'utf8'));  
    }
}
var login=function(opts) {
	opts=opts||{};
	var password=opts.password||opts.pw;
	var out={name:opts.name,error:"user not found"};
	if (!passwords.length) loadpasswd();
	for (var i=0;i<passwords.length;i++) {
		var u=passwords[i];
		if (u.name==opts.name) {
			if (u.pw!=password) {
				out.error="wrong password";
			} else {
				out=JSON.parse(JSON.stringify(u));
				delete out.pw;
				out.error="";
				return out;
			}
		}
	}
	return out;
}
module.exports={login:login}
});
require.register("ksana-document/customfunc.js", function(exports, require, module){
/* 
  custom func for building and searching ydb

  keep all version
  
  getAPI(version); //return hash of functions , if ver is omit , return lastest
	
  postings2Tree      // if version is not supply, get lastest
  tokenize(text,api) // convert a string into tokens(depends on other api)
  normalizeToken     // stemming and etc
  isSpaceChar        // not a searchable token
  isSkipChar         // 0 vpos

  for client and server side
  
*/
var configs=require("./configs");
var config_simple="simple1";
var optimize=function(json,config) {
	config=config||config_simple;
	return json;
}

var getAPI=function(config) {
	config=config||config_simple;
	var func=configs[config].func;
	func.optimize=optimize;
	if (config=="simple1") {
		//add common custom function here
	} else if (config=="tibetan1") {

	} else throw "config "+config +"not supported";

	return func;
}

module.exports={getAPI:getAPI};
});
require.register("ksana-document/configs.js", function(exports, require, module){
var tokenizers=require('./tokenizers');

var normalize1=function(token) {
	return token.replace(/[ \.,]/g,'').trim();
}
var isSkip1=function(token) {
	var t=token.trim();
	return (t=="" || t=="　" || t=="※" || t=="\n");
}
var normalize_tibetan=function(token) {
	return token.replace(/[།་ ]/g,'').trim();
}

var isSkip_tibetan=function(token) {
	var t=token.trim();
	return (t=="" || t=="　" ||  t=="\n");	
}
var simple1={
	func:{
		tokenize:tokenizers.simple
		,normalize: normalize1
		,isSkip:	isSkip1
	}
	
}
var tibetan1={
	func:{
		tokenize:tokenizers.tibetan
		,normalize:normalize_tibetan
		,isSkip:isSkip_tibetan
	}
}
module.exports={"simple1":simple1,"tibetan1":tibetan1}
});
require.register("ksana-document/projects.js", function(exports, require, module){
/*
  given a project id, find all folders and files
  projects be should under ksana_databases, like node_modules
*/
if (typeof nodeRequire=='undefined')nodeRequire=require;
function getFiles(dirs,filtercb){	
  var fs=nodeRequire('fs');
  var path=nodeRequire('path');
  var out=[];
  var shortnames={}; //shortname must be unique
  if (typeof dirs=='string')dirs=[dirs];

  for (var j=0;j<dirs.length;j++ ) {
    var dir=dirs[j];
    if (!fs.existsSync(dir))continue;
    var files = fs.readdirSync(dir);
    for(var i in files){
      if (!files.hasOwnProperty(i)) continue;
      if (files[i][0]==".") continue;//skip hidden file
      var name = dir+'/'+files[i],config=null;
      if (filtercb(name)) {
          var json=name+'/ksana.json';
          if (fs.existsSync(json)) {          
            config=JSON.parse(fs.readFileSync(name+'/ksana.json','utf8'));
            var stat=fs.statSync(json);
            config.lastModified=stat.mtime;
            config.shortname=files[i];
            config.filename=name;
          } else {
            config={name:name,filename:name,shortname:files[i]};
          }
          var pathat=config.filename.lastIndexOf('/');
          config.withfoldername=config.filename.substring(1+config.filename.lastIndexOf('/',pathat-1));

          if (!shortnames[files[i]]) out.push(config);
          shortnames[files[i]]=true;
      }
    }
  }
  return out;
}

var listFolders=function(path) {
  var fs=nodeRequire('fs');
  var folders= getFiles( path ,function(name){
      return fs.statSync(name).isDirectory();
  });
  if (!folders.length)return folders;
  if (parseInt(folders[0].shortname)) {
    folders.sort(function(a,b) {
      return parseInt(a.shortname)-parseInt(b.shortname);
    });
  } else {
    folders.sort(function(a,b) {
      if (a.shortname==b.shortname) return 0; 
      else if (a.shortname>b.shortname) return 1; else return -1;
    });
  }
  return folders;
};
var listFiles=function(path) {
  var fs=nodeRequire('fs');
  var files= getFiles( path,function(name){
      return name.indexOf(".kd")===name.length-3;
  });
  if (!files.length)return files;
  if (parseInt(files[0].shortname)) {
    files.sort(function(a,b) {
      return parseInt(a.shortname)-parseInt(b.shortname);
    });
  } else {
    files.sort(function(a,b) {
      if (a.shortname==b.shortname) return 0; 
      else if (a.shortname>b.shortname) return 1; else return -1;
    });
  }
  return files;
};

var listProject=function() {
  var fs=nodeRequire('fs');
	//search for local 
	var folders= getFiles(['./ksana_databases','../ksana_databases','../../ksana_databases'],function(name){
      if (fs.statSync(name).isDirectory()){
        return fs.existsSync(name+'/ksana.json');
      }
  });

	return folders;
}

var fullInfo=function(projname) {
  var fs=nodeRequire('fs');
  if (fs.existsSync(projname+'/ksana.json')) {//user provide a folder
    var normalized=require('path').resolve(projname);
    normalized=normalized.substring(normalized.lastIndexOf(require('path').sep)+1);
    var projectpath=projname;
    var name=normalized;
  } else { //try id
    var proj=listProject().filter(function(f){ return f.shortname==projname});
    if (!proj.length) return null;
    var projectpath=proj[0].filename;
    var name=proj[0].shortname;
  }

  var files=[];  
  var ksana=JSON.parse(fs.readFileSync(projectpath+'/ksana.json','utf8'));    

  listFolders(projectpath).map(function(f){
    var ff=listFiles(f.filename);
    files=files.concat(ff);
  })
  return {name:name,filename:projectpath,ksana:ksana,files: files.map(function(f){return f.filename})};
}

module.exports={getFiles:getFiles,names:listProject,folders:listFolders,files:listFiles,fullInfo:fullInfo};
});
require.register("ksana-document/indexer.js", function(exports, require, module){
if (typeof nodeRequire=='undefined')nodeRequire=require;

var indexing=false; //only allow one indexing task
var status={pageCount:0,progress:0,done:false}; //progress ==1 completed
var session={};
var api=null;
var xml4kdb=null;
var isSkip=null;
var normalize=null;
var tokenize=null;

var putPosting=function(tk) {
	var	postingid=session.json.tokens[tk];
	var out=session.json, posting=null;
	if (!postingid) {
		out.postingCount++;
		posting=out.postings[out.postingCount]=[];
		session.json.tokens[tk]=out.postingCount;
	} else {
		posting=out.postings[postingid];
	}
	posting.push(session.vpos);
}
var putPage=function(inscription) {
	var tokenized=tokenize(inscription);
	var tokenOffset=0, tovpos=[];
	for (var i=0;i<tokenized.tokens.length;i++) {
		var t=tokenized.tokens[i];
		tovpos[tokenOffset]=session.vpos;
		tokenOffset+=t.length;
		if (isSkip(t)) {
			 session.vpos--;
		} else {
			var normalized=normalize(t);
			if (normalized) 	putPosting(normalized);
 		}
 		session.vpos++;
	}
	tovpos[tokenOffset]=session.vpos;
	session.indexedTextLength+= inscription.length;
	return tovpos;
}
var upgradeDocument=function(d,dnew) {
	var Diff=nodeRequire("./diff");	
	dnew.map(function(pg){
		var oldpage=d.pageByName(pg.name);
		var ninscription=dnew.inscription;
		if (oldpage) {
			var diff=new Diff();
			var oinscription=oldpage.inscription;
			var df=diff.diff_main(oinscription, pg.inscription);

			var revisioncount=oldpage.addRevisionsFromDiff(df);
			if (revisioncount) d.evolvePage(oldpage);
		} else {
			d.createPage({n:pgname,t:ninscription});
		}
	});	
}
var shortFilename=function(fn) {
	var arr=fn.split('/');
	while (arr.length>2) arr.shift();
	return arr.join('/');
}

var putFileInfo=function(fileContent) {
	var shortfn=shortFilename(status.filename);
	//session.json.files.push(fileInfo);
	//empty or first line empty
	session.json.fileContents.push(fileContent);
	session.json.fileNames.push(shortfn);
	session.json.fileOffsets.push(session.vpos);
	//fileInfo.pageOffset.push(session.vpos);
}
var putPages_new=function(parsed,cb) { //25% faster than create a new document
	//var fileInfo={pageNames:[],pageOffset:[]};
	var fileContent=[];
	parsed.tovpos=[];

	putFileInfo(fileContent);
	for (var i=0;i<parsed.texts.length;i++) {
		var t=parsed.texts[i];
		fileContent.push(t.t);
		var tovpos=putPage(t.t);
		parsed.tovpos[i]=tovpos;
		session.json.pageNames.push(t.n);
		session.json.pageOffsets.push(session.vpos);
	}
	
	if (fileContent.length==0 || (fileContent.length==1&&!fileContent[0])) {
		console.log("no content in"+status.filename);
		fileContent[0]=" "; //work around to avoid empty string array throw in kdbw
	}

	cb(parsed);//finish
}

var putPages=function(doc,parsed,cb) {
	var fileInfo={parentId:[],reverts:[]};
	var fileContent=[];	
	var hasParentId=false, hasRevert=false;
	parsed.tovpos=[];

	putFileInfo(fileContent);
	if (!session.files) session.files=[];
	session.json.files.push(fileInfo);
	
	for (var i=1;i<doc.pageCount;i++) {
		var pg=doc.getPage(i);
		if (pg.isLeafPage()) {
			fileContent.push(pg.inscription);
			var tovpos=putPage(pg.inscription);
			parsed.tovpos[i-1]=tovpos;
		} else {
			fileContent.push("");
		}
		sesison.json.pageNames.push(pg.name);
		session.json.pageOffsets.push(session.vpos);

		fileInfo.parentId.push(pg.parentId);
		if (pg.parentId) hasParentId=true;
		var revertstr="";
		if (pg.parentId) revertstr=JSON.stringify(pg.compressedRevert());
		if (revertstr) hasRevert=true;
		fileInfo.reverts.push( revertstr );
	}
	if (!hasParentId) delete fileInfo["parentId"];
	if (!hasRevert) delete fileInfo["reverts"];
	cb(parsed);//finish
}
var putDocument=function(parsed,cb) {
	if (session.kdb) { //update an existing kdb
		var D=nodeRequire("./document");
		var dnew=D.createDocument(parsed.texts);
		session.kdb.getDocument(status.filename,function(d){
			if (d) {
				upgradeDocument(d,dnew);
				putPages(d,parsed,cb);
				status.pageCount+=d.pageCount-1;
			} else { //no such page in old kdb
				putPages(dnew,parsed,cb);
				status.pageCount+=dnew.pageCount-1;
			}
		});
	} else {
		putPages_new(parsed,cb);
		status.pageCount+=parsed.texts.length;//dnew.pageCount;
	}
}

var parseBody=function(body,sep,cb) {
	var res=xml4kdb.parseXML(body, {sep:sep,trim:!!session.config.trim});
	putDocument(res,cb);
}

var pat=/([a-zA-Z:]+)="([^"]+?)"/g;
var parseAttributesString=function(s) {
	var out={};
	//work-around for repeated attribute,
	//take the first one
	s.replace(pat,function(m,m1,m2){if (!out[m1]) out[m1]=m2});
	return out;
}
var storeFields=function(fields,json) {
	if (!json.fields) json.fields={};
	var root=json.fields;
	if (!(fields instanceof Array) ) fields=[fields];
	var storeField=function(field) {
		var path=field.path;
		storepoint=root;
		if (!(path instanceof Array)) path=[path];
		for (var i=0;i<path.length;i++) {
			if (!storepoint[path[i]]) {
				if (i<path.length-1) storepoint[path[i]]={};
				else storepoint[path[i]]=[];
			}
			storepoint=storepoint[path[i]];
		}
		if (typeof field.value=="undefined") {
			throw "empty field value of "+path;
		} 
		storepoint.push(field.value);
	}
	fields.map(storeField);
}
/*
	maintain a tag stack for known tag
*/
var tagStack=[];
var processTags=function(captureTags,tags,texts) {
	var getTextBetween=function(from,to,startoffset,endoffset) {
		if (from==to) return texts[from].t.substring(startoffset-1,endoffset-1);
		var first=texts[from].t.substr(startoffset-1);
		var middle="";
		for (var i=from+1;i<to;i++) {
			middle+=texts[i].t;
		}
		var last=texts[to].t.substr(0,endoffset-1);
		return first+middle+last;
	}
	for (var i=0;i<tags.length;i++) {
		for (var j=0;j<tags[i].length;j++) {
			var T=tags[i][j],tagname=T[1],tagoffset=T[0],attributes=T[2],tagvpos=T[3];	
			var nulltag=attributes[attributes.length-1]=='/';
			if (captureTags[tagname]) {
				var attr=parseAttributesString(attributes);
				if (!nulltag) {
					tagStack.push([tagname,tagoffset,attr,i]);
				}
			}
			var handler=null;
			if (tagname[0]=="/") handler=captureTags[tagname.substr(1)];
			else if (nulltag) handler=captureTags[tagname];

			if (handler) {
				var prev=tagStack[tagStack.length-1];
				var text="";
				if (!nulltag) {
					if (typeof prev=="undefined" || tagname.substr(1)!=prev[0]) {
						console.error("tag unbalance",tagname,prev,status.filename);						
						throw "tag unbalance";
					} else {
						tagStack.pop();
						text=getTextBetween(prev[3],i,prev[1],tagoffset);
					}
				}
				
				status.vpos=tagvpos; 
				status.tagStack=tagStack;
				var fields=handler(text, tagname, attr, status);
				
				if (fields) storeFields(fields,session.json);
			}
		}	
	}
}
var resolveTagsVpos=function(parsed) {
	var bsearch=require("ksana-document").bsearch;
	for (var i=0;i<parsed.tags.length;i++) {
		for (var j=0;j<parsed.tags[i].length;j++) {
			var t=parsed.tags[i][j];
			var pos=t[0];
			t[3]=parsed.tovpos[i][pos];
			while (pos && typeof t[3]=="undefined") t[3]=parsed.tovpos[i][--pos];
		}
	}
}
var putFile=function(fn,cb) {
	var fs=nodeRequire("fs");
	if (!fs.existsSync(fn)){
		console.warn("file ",fn,"doens't exist");
		cb();
		return;
	}
	var texts=fs.readFileSync(fn,session.config.inputEncoding).replace(/\r\n/g,"\n");
	var bodyend=session.config.bodyend;
	var bodystart=session.config.bodystart;
	var captureTags=session.config.captureTags;
	var callbacks=session.config.callbacks||{};
	var started=false,stopped=false;

	if (callbacks.onFile) callbacks.onFile.apply(session,[fn,status]);
	var start=bodystart ? texts.indexOf(bodystart) : 0 ;
	var end=bodyend? texts.indexOf(bodyend): texts.length;
	if (!bodyend) bodyendlen=0;
	else bodyendlen=bodyend.length;
	//assert.equal(end>start,true);

	// split source xml into 3 parts, before <body> , inside <body></body> , and after </body>
	var body=texts.substring(start,end+bodyendlen);
	status.json=session.json;
	status.storeFields=storeFields;
	
	status.bodytext=body;
	status.starttext=texts.substring(0,start);
	status.fileStartVpos=session.vpos;

	if (callbacks.beforebodystart) callbacks.beforebodystart.apply(session,[texts.substring(0,start),status]);
	parseBody(body,session.config.pageSeparator,function(parsed){
		status.parsed=parsed;
		if (callbacks.afterbodyend) {
			resolveTagsVpos(parsed);
			if (captureTags) {
				processTags(captureTags, parsed.tags, parsed.texts);
			}
			var ending="";
			if (bodyend) ending=texts.substring(end+bodyend.length);
			if (ending) callbacks.afterbodyend.apply(session,[ending,status]);
			status.parsed=null;
			status.bodytext=null;
			status.starttext=null;
			status.json=null;
		}
		cb(); //parse body finished
	});	
}
var initSession=function(config) {
	var json={
		postings:[[0]] //first one is always empty, because tokenid cannot be 0
		,postingCount:0
		,fileContents:[]
		,fileNames:[]
		,fileOffsets:[]
		,pageNames:[]
		,pageOffsets:[]
		,tokens:{}
	};
	config.inputEncoding=config.inputEncoding||"utf8";
	var session={vpos:1, json:json , kdb:null, filenow:0,done:false
		           ,indexedTextLength:0,config:config,files:config.files,pagecount:0};
	return session;
}

var initIndexer=function(mkdbconfig) {
	var Kde=nodeRequire("./kde");

	session=initSession(mkdbconfig);
	api=nodeRequire("ksana-document").customfunc.getAPI(mkdbconfig.meta.config);
	xml4kdb=nodeRequire("ksana-document").xml4kdb;

	//mkdbconfig has a chance to overwrite API

	normalize=api["normalize"];
	isSkip=api["isSkip"];
	tokenize=api["tokenize"];

	var folder=session.config.outdir||".";
	session.kdbfn=require("path").resolve(folder, session.config.name+'.kdb');

	if (!session.config.reset && nodeRequire("fs").existsSync(session.kdbfn)) {
		//if old kdb exists and not reset 
		Kde.openLocal(session.kdbfn,function(db){
			session.kdb=db;
			setTimeout(indexstep,1);
		});
	} else {
		setTimeout(indexstep,1);
	}
}

var start=function(mkdbconfig) {
	if (indexing) return null;
	indexing=true;
	if (!mkdbconfig.files.length) return null;//nothing to index

	initIndexer(mkdbconfig);
  	return status;
}

var indexstep=function() {
	if (session.filenow<session.files.length) {
		status.filename=session.files[session.filenow];
		status.progress=session.filenow/session.files.length;
		status.filenow=session.filenow;
		putFile(status.filename,function(){
			session.filenow++;
			setTimeout(indexstep,1); //rest for 1 ms to response status			
		});
	} else {
		finalize(function() {
			status.done=true;
			indexing=false;
			if (session.config.finalized) {
				session.config.finalized(session,status);
			}
		});	
	}
}

var getstatus=function() {
  return status;
}
var stop=function() {
  status.done=true;
  status.message="User Abort";
  indexing=false;
  return status;
}
var backupFilename=function(ydbfn) {
	//user has a chance to recover from previous ydb
	return ydbfn+"k"; //todo add date in the middle
}

var backup=function(ydbfn) {
	var fs=nodeRequire("fs");
	var fs=nodeRequire('fs');
	if (fs.existsSync(ydbfn)) {
		var bkfn=ydbfn+'k';
		try {
			if (fs.existsSync(bkfn)) fs.unlinkSync(bkfn);
			fs.renameSync(ydbfn,bkfn);
		} catch (e) {
			console.log(e);
		}
	}
}
var createMeta=function() {
	var meta={};
	if (session.config.meta) for (var i in session.config.meta) {
		meta[i]=session.config.meta[i];
	}
	meta.name=session.config.name;
	meta.vsize=session.vpos;
	meta.pagecount=status.pageCount;
	return meta;
}
var guessSize=function() {
	var size=session.vpos * 5;
	if (size<1024*1024) size=1024*1024;
	return  size;
}
var buildpostingslen=function(tokens,postings) {
	var out=[];
	for (var i=0;i<tokens.length;i++) {
		out[i]=postings[i].length;
	}
	return out;
}
var optimize4kdb=function(json) {
	var keys=[];
	for (var key in json.tokens) {
		keys[keys.length]=[key,json.tokens[key]];
	}
	keys.sort(function(a,b){return a[1]-b[1]});//sort by token id
	var newtokens=keys.map(function(k){return k[0]});
	json.tokens=newtokens;
	for (var i=0;i<json.postings.length;i++) json.postings[i].sorted=true; //use delta format to save space
	json.postingslen=buildpostingslen(json.tokens,json.postings);
	json.fileOffsets.sorted=true;
	json.pageOffsets.sorted=true;
	return json;
}

var finalize=function(cb) {	
	var Kde=nodeRequire("./kde");

	if (session.kdb) Kde.closeLocal(session.kdbfn);

	session.json.fileOffsets.push(session.vpos); //serve as terminator
	session.json.pageOffsets.push(session.vpos); //serve as terminator
	session.json.meta=createMeta();
	
	if (!session.config.nobackup) backup(session.kdbfn);
	status.message='writing '+session.kdbfn;
	//output=api("optimize")(session.json,session.ydbmeta.config);
	var opts={size:session.config.estimatesize};
	if (!opts.size) opts.size=guessSize();
	var kdbw =nodeRequire("ksana-document").kdbw(session.kdbfn,opts);
	//console.log(JSON.stringify(session.json,""," "));
	if (session.config.finalizeField) {
		console.log("finalizing fields");
		session.config.finalizeField(session.fields);
	}
	console.log("optimizing");
	var json=optimize4kdb(session.json);

	if (session.config.extra) {
		json.extra=session.config.extra;
	}
	
	console.log("output to",session.kdbfn);
	kdbw.save(json,null,{autodelete:true});
	
	kdbw.writeFile(session.kdbfn,function(total,written) {
		status.progress=written/total;
		status.outputfn=session.kdbfn;
		if (total==written) cb();
	});
}
module.exports={start:start,stop:stop,status:getstatus};
});
require.register("ksana-document/indexer_kd.js", function(exports, require, module){
if (typeof nodeRequire=='undefined')nodeRequire=require;

/*
  text:       [ [page_text][page_text] ]
  pagenames:  []
  tokentree:  []
  
  search engine API: 
  getToken        //return raw posting
  getText(vpos)   //return raw page text
    getPageText   
  vpos2pgoff      //virtual posting to page offset
  groupBy         //convert raw posting to group (with optional converted offset) 
  findMarkupInRange
*/


var indexing=false; //only allow one indexing task
var projinfo=null;
var status={progress:0,done:false}; //progress ==1 completed
var session={};
var api=null;
var isSkip=null;
var normalize=null;
var tokenize=null;

var putPosting=function(tk) {
	var	postingid=session.json.tokens[tk];
	var out=session.json;

	if (!postingid) {
		out.postingCount++;
		posting=out.postings[out.postingCount]=[];
		session.json.tokens[tk]=out.postingCount;
	} else {
		posting=out.postings[postingid];
	}
	posting.push(session.vpos);
}
var putExtra=function(arr_of_key_vpos_payload) {
	//which markup to be added in the index
	//is depended on application requirement...
	//convert markup start position to vpos
	// application  key-values  pairs
	//    ydb provide search for key , return array of vpos
	//        and given range of vpos, return all key in the range
  // structure
  // key , 
}

var putPage=function(docPage) {
	var tokenized=tokenize(docPage.inscription);

	for (var i=0;i<tokenized.tokens.length;i++) {
		var t=tokenized.tokens[i];

		if (isSkip(t)) {
			 session.vpos--;
		} else {
			var normalized=normalize(t);
			if (normalized) 	putPosting(normalized);
 		}
 		session.vpos++;
	}

	session.indexedTextLength+= docPage.inscription.length;
}
var shortFilename=function(fn) {
	var arr=fn.split('/');
	while (arr.length>2) arr.shift();
	return arr.join('/');
}
var putFile=function(fn) {
	var persistent=nodeRequire("ksana-document").persistent;
	var doc=persistent.createLocal(fn);
	var shortfn=shortFilename(fn);

	var fileInfo={pageNames:[],pageOffset:[]};
	var fileContent=[];
	session.json.files.push(fileInfo);
	session.json.fileContents.push(fileContent);
	session.json.fileNames.push(shortfn);
	session.json.fileOffsets.push(session.vpos);
	status.message="indexing "+fn;

	for (var i=1;i<doc.pageCount;i++) {
		var pg=doc.getPage(i);
		fileContent.push(pg.inscription);
		fileInfo.pageNames.push(pg.name);
		fileInfo.pageOffset.push(session.vpos);
		putPage(pg);
	}
	fileInfo.pageOffset.push(session.vpos); //ending terminator
}
var initSession=function() {
	var json={
		files:[]
		,fileContents:[]
		,fileNames:[]
		,fileOffsets:[]
		,postings:[[0]] //first one is always empty, because tokenid cannot be 0
		,tokens:{}
		,postingCount:0
	};
	var session={vpos:1, json:json ,
		           indexedTextLength:0,
		           options: projinfo.ksana.ydbmeta };
	return session;
}
var initIndexer=function() {
	session=initSession();
	session.filenow=0;
	session.files=projinfo.files;
	status.done=false;
	api=nodeRequire("ksana-document").customfunc.getAPI(session.options.config);
	
	normalize=api["normalize"];
	isSkip=api["isSkip"];
	tokenize=api["tokenize"];
	setTimeout(indexstep,1);
}

var getMeta=function() {
	var meta={};
	meta.config=session.options.config;
	meta.name=projinfo.name;
	meta.vsize=session.vpos;
	return meta;
}

var backupFilename=function(ydbfn) {
	//user has a chance to recover from previous ydb
	return ydbfn+"k"; //todo add date in the middle
}

var backup=function(ydbfn) {
	var fs=nodeRequire('fs');
	if (fs.existsSync(ydbfn)) {
		var bkfn=ydbfn+'k';
		if (fs.existsSync(bkfn)) fs.unlinkSync(bkfn);
		fs.renameSync(ydbfn,bkfn);
	}
}
var finalize=function(cb) {
	var opt=session.options;
	var kdbfn=projinfo.name+'.kdb';

	session.json.fileOffsets.push(session.vpos); //serve as terminator
	session.json.meta=getMeta();
	
	backup(kdbfn);
	status.message='writing '+kdbfn;
	//output=api("optimize")(session.json,session.ydbmeta.config);

	var kdbw =nodeRequire("ksana-document").kdbw(kdbfn);
	
	kdbw.save(session.json,null,{autodelete:true});
	
	kdbw.writeFile(kdbfn,function(total,written) {
		status.progress=written/total;
		status.outputfn=kdbfn;
		if (total==written) cb();
	});
}

var indexstep=function() {
	
	if (session.filenow<session.files.length) {
		status.filename=session.files[session.filenow];
		status.progress=session.filenow/session.files.length;
		putFile(status.filename);
		session.filenow++;
		setTimeout(indexstep,1); //rest for 1 ms to response status
	} else {
		finalize(function() {
			status.done=true;
			indexing=false;
		});	
	}
}

var status=function() {
  return status;
}
var start=function(projname) {
	if (indexing) return null;
	indexing=true;

	projinfo=nodeRequire("ksana-document").projects.fullInfo(projname);

	if (!projinfo.files.length) return null;//nothing to index

	initIndexer();
 	status.projectname=projname;
  	return status;
}

var stop=function() {
  status.done=true;
  status.message="User Abort";
  indexing=false;
  return status;
}
module.exports={start:start,stop:stop,status:status};
});
require.register("ksana-document/kdb.js", function(exports, require, module){
/*
	KDB version 3.0 GPL
	yapcheahshen@gmail.com
	2013/12/28
	asyncronize version of yadb

  remove dependency of Q, thanks to
  http://stackoverflow.com/questions/4234619/how-to-avoid-long-nesting-of-asynchronous-functions-in-node-js

  
*/
var Kfs=null;

if (typeof ksanagap=="undefined") {
	if (typeof process=="undefined") {
		Kfs=require('./kdbfs');			
	} else {
		Kfs=require('./kdbfs');			
	}
} else {
	if (ksanagap.platform=="ios") {
		Kfs=require("./kdbfs_ios");
	} else {
		Kfs=require("./kdbfs_android");
	}
		
}


var DT={
	uint8:'1', //unsigned 1 byte integer
	int32:'4', // signed 4 bytes integer
	utf8:'8',  
	ucs2:'2',
	bool:'^', 
	blob:'&',
	utf8arr:'*', //shift of 8
	ucs2arr:'@', //shift of 2
	uint8arr:'!', //shift of 1
	int32arr:'$', //shift of 4
	vint:'`',
	pint:'~',	

	array:'\u001b',
	object:'\u001a' 
	//ydb start with object signature,
	//type a ydb in command prompt shows nothing
}
var verbose=0, readLog=function(){};
var _readLog=function(readtype,bytes) {
	console.log(readtype,bytes,"bytes");
}
if (verbose) readLog=_readLog;
var strsep="\uffff";
var Create=function(path,opts,cb) {
	/* loadxxx functions move file pointer */
	// load variable length int
	if (typeof opts=="function") {
		cb=opts;
		opts={};
	}

	
	var loadVInt =function(opts,blocksize,count,cb) {
		//if (count==0) return [];
		var that=this;

		this.fs.readBuf_packedint(opts.cur,blocksize,count,true,function(o){
			//console.log("vint");
			opts.cur+=o.adv;
			cb.apply(that,[o.data]);
		});
	}
	var loadVInt1=function(opts,cb) {
		var that=this;
		loadVInt.apply(this,[opts,6,1,function(data){
			//console.log("vint1");
			cb.apply(that,[data[0]]);
		}])
	}
	//for postings
	var loadPInt =function(opts,blocksize,count,cb) {
		var that=this;
		this.fs.readBuf_packedint(opts.cur,blocksize,count,false,function(o){
			//console.log("pint");
			opts.cur+=o.adv;
			cb.apply(that,[o.data]);
		});
	}
	// item can be any type (variable length)
	// maximum size of array is 1TB 2^40
	// structure:
	// signature,5 bytes offset, payload, itemlengths
	var getArrayLength=function(opts,cb) {
		var that=this;
		var dataoffset=0;

		this.fs.readUI8(opts.cur,function(len){
			var lengthoffset=len*4294967296;
			opts.cur++;
			that.fs.readUI32(opts.cur,function(len){
				opts.cur+=4;
				dataoffset=opts.cur; //keep this
				lengthoffset+=len;
				opts.cur+=lengthoffset;

				loadVInt1.apply(that,[opts,function(count){
					loadVInt.apply(that,[opts,count*6,count,function(sz){						
						cb({count:count,sz:sz,offset:dataoffset});
					}]);
				}]);
				
			});
		});
	}

	var loadArray = function(opts,blocksize,cb) {
		var that=this;
		getArrayLength.apply(this,[opts,function(L){
				var o=[];
				var endcur=opts.cur;
				opts.cur=L.offset;

				if (opts.lazy) { 
						var offset=L.offset;
						L.sz.map(function(sz){
							o[o.length]=strsep+offset.toString(16)
								   +strsep+sz.toString(16);
							offset+=sz;
						})
				} else {
					var taskqueue=[];
					for (var i=0;i<L.count;i++) {
						taskqueue.push(
							(function(sz){
								return (
									function(data){
										if (typeof data=='object' && data.__empty) {
											 //not pushing the first call
										}	else o.push(data);
										opts.blocksize=sz;
										load.apply(that,[opts, taskqueue.shift()]);
									}
								);
							})(L.sz[i])
						);
					}
					//last call to child load
					taskqueue.push(function(data){
						o.push(data);
						opts.cur=endcur;
						cb.apply(that,[o]);
					});
				}

				if (opts.lazy) cb.apply(that,[o]);
				else {
					taskqueue.shift()({__empty:true});
				}
			}
		])
	}		
	// item can be any type (variable length)
	// support lazy load
	// structure:
	// signature,5 bytes offset, payload, itemlengths, 
	//                    stringarray_signature, keys
	var loadObject = function(opts,blocksize,cb) {
		var that=this;
		var start=opts.cur;
		getArrayLength.apply(this,[opts,function(L) {
			opts.blocksize=blocksize-opts.cur+start;
			load.apply(that,[opts,function(keys){ //load the keys
				if (opts.keys) { //caller ask for keys
					keys.map(function(k) { opts.keys.push(k)});
				}

				var o={};
				var endcur=opts.cur;
				opts.cur=L.offset;
				if (opts.lazy) { 
					var offset=L.offset;
					for (var i=0;i<L.sz.length;i++) {
						//prefix with a \0, impossible for normal string
						o[keys[i]]=strsep+offset.toString(16)
							   +strsep+L.sz[i].toString(16);
						offset+=L.sz[i];
					}
				} else {
					var taskqueue=[];
					for (var i=0;i<L.count;i++) {
						taskqueue.push(
							(function(sz,key){
								return (
									function(data){
										if (typeof data=='object' && data.__empty) {
											//not saving the first call;
										} else {
											o[key]=data; 
										}
										opts.blocksize=sz;
										if (verbose) readLog("key",key);
										load.apply(that,[opts, taskqueue.shift()]);
									}
								);
							})(L.sz[i],keys[i-1])

						);
					}
					//last call to child load
					taskqueue.push(function(data){
						o[keys[keys.length-1]]=data;
						opts.cur=endcur;
						cb.apply(that,[o]);
					});
				}
				if (opts.lazy) cb.apply(that,[o]);
				else {
					taskqueue.shift()({__empty:true});
				}
			}]);
		}]);
	}

	//item is same known type
	var loadStringArray=function(opts,blocksize,encoding,cb) {
		var that=this;
		this.fs.readStringArray(opts.cur,blocksize,encoding,function(o){
			opts.cur+=blocksize;
			cb.apply(that,[o]);
		});
	}
	var loadIntegerArray=function(opts,blocksize,unitsize,cb) {
		var that=this;
		loadVInt1.apply(this,[opts,function(count){
			var o=that.fs.readFixedArray(opts.cur,count,unitsize,function(o){
				opts.cur+=count*unitsize;
				cb.apply(that,[o]);
			});
		}]);
	}
	var loadBlob=function(blocksize,cb) {
		var o=this.fs.readBuf(this.cur,blocksize);
		this.cur+=blocksize;
		return o;
	}	
	var loadbysignature=function(opts,signature,cb) {
		  var blocksize=opts.blocksize||this.fs.size; 
			opts.cur+=this.fs.signature_size;
			var datasize=blocksize-this.fs.signature_size;
			//basic types
			if (signature===DT.int32) {
				opts.cur+=4;
				this.fs.readI32(opts.cur-4,cb);
			} else if (signature===DT.uint8) {
				opts.cur++;
				this.fs.readUI8(opts.cur-1,cb);
			} else if (signature===DT.utf8) {
				var c=opts.cur;opts.cur+=datasize;
				this.fs.readString(c,datasize,'utf8',cb);
			} else if (signature===DT.ucs2) {
				var c=opts.cur;opts.cur+=datasize;
				this.fs.readString(c,datasize,'ucs2',cb);	
			} else if (signature===DT.bool) {
				opts.cur++;
				this.fs.readUI8(opts.cur-1,function(data){cb(!!data)});
			} else if (signature===DT.blob) {
				loadBlob(datasize,cb);
			}
			//variable length integers
			else if (signature===DT.vint) {
				loadVInt.apply(this,[opts,datasize,datasize,cb]);
			}
			else if (signature===DT.pint) {
				loadPInt.apply(this,[opts,datasize,datasize,cb]);
			}
			//simple array
			else if (signature===DT.utf8arr) {
				loadStringArray.apply(this,[opts,datasize,'utf8',cb]);
			}
			else if (signature===DT.ucs2arr) {
				loadStringArray.apply(this,[opts,datasize,'ucs2',cb]);
			}
			else if (signature===DT.uint8arr) {
				loadIntegerArray.apply(this,[opts,datasize,1,cb]);
			}
			else if (signature===DT.int32arr) {
				loadIntegerArray.apply(this,[opts,datasize,4,cb]);
			}
			//nested structure
			else if (signature===DT.array) {
				loadArray.apply(this,[opts,datasize,cb]);
			}
			else if (signature===DT.object) {
				loadObject.apply(this,[opts,datasize,cb]);
			}
			else {
				console.error('unsupported type',signature,opts)
				cb.apply(this,[null]);//make sure it return
				//throw 'unsupported type '+signature;
			}
	}

	var load=function(opts,cb) {
		opts=opts||{}; // this will served as context for entire load procedure
		opts.cur=opts.cur||0;
		var that=this;
		this.fs.readSignature(opts.cur, function(signature){
			loadbysignature.apply(that,[opts,signature,cb])
		});
		return this;
	}
	var CACHE=null;
	var KEY={};
	var ADDRESS={};
	var reset=function(cb) {
		if (!CACHE) {
			load.apply(this,[{cur:0,lazy:true},function(data){
				CACHE=data;
				cb.call(this);
			}]);	
		} else {
			cb.call(this);
		}
	}

	var exists=function(path,cb) {
		if (path.length==0) return true;
		var key=path.pop();
		var that=this;
		get.apply(this,[path,false,function(data){
			if (!path.join(strsep)) return (!!KEY[key]);
			var keys=KEY[path.join(strsep)];
			path.push(key);//put it back
			if (keys) cb.apply(that,[keys.indexOf(key)>-1]);
			else cb.apply(that,[false]);
		}]);
	}

	var getSync=function(path) {
		if (!CACHE) return undefined;	
		var o=CACHE;
		for (var i=0;i<path.length;i++) {
			var r=o[path[i]];
			if (typeof r=="undefined") return null;
			o=r;
		}
		return o;
	}
	var get=function(path,opts,cb) {
		if (typeof path=='undefined') path=[];
		if (typeof path=="string") path=[path];
		//opts.recursive=!!opts.recursive;
		var that=this;
		if (typeof cb!='function') return getSync(path);

		reset.apply(this,[function(){
			var o=CACHE;
			if (path.length==0) {
				if (opts.address) {
					cb([0,that.fs.size]);
				} else {
					cb(Object.keys(CACHE));	
				}
				return;
			} 
			
			var pathnow="",taskqueue=[],newopts={},r=null;
			var lastkey="";

			for (var i=0;i<path.length;i++) {
				var task=(function(key,k){

					return (function(data){
						if (!(typeof data=='object' && data.__empty)) {
							if (typeof o[lastkey]=='string' && o[lastkey][0]==strsep) o[lastkey]={};
							o[lastkey]=data; 
							o=o[lastkey];
							r=data[key];
							KEY[pathnow]=opts.keys;								
						} else {
							data=o[key];
							r=data;
						}

						if (r===undefined) {
							taskqueue=null;
							cb.apply(that,[r]); //return empty value
						} else {							
							if (parseInt(k)) pathnow+=strsep;
							pathnow+=key;
							if (typeof r=='string' && r[0]==strsep) { //offset of data to be loaded
								var p=r.substring(1).split(strsep).map(function(item){return parseInt(item,16)});
								var cur=p[0],sz=p[1];
								newopts.lazy=!opts.recursive || (k<path.length-1) ;
								newopts.blocksize=sz;newopts.cur=cur,newopts.keys=[];
								lastkey=key; //load is sync in android
								if (opts.address && taskqueue.length==1) {
									ADDRESS[pathnow]=[cur,sz];
									taskqueue.shift()(null,ADDRESS[pathnow]);
								} else {
									load.apply(that,[newopts, taskqueue.shift()]);
								}
							} else {
								if (opts.address && taskqueue.length==1) {
									taskqueue.shift()(null,ADDRESS[pathnow]);
								} else {
									taskqueue.shift().apply(that,[r]);
								}
							}
						}
					})
				})
				(path[i],i);
				
				taskqueue.push(task);
			}

			if (taskqueue.length==0) {
				cb.apply(that,[o]);
			} else {
				//last call to child load
				taskqueue.push(function(data,cursz){
					if (opts.address) {
						cb.apply(that,[cursz]);
					} else{
						var key=path[path.length-1];
						o[key]=data; KEY[pathnow]=opts.keys;
						cb.apply(that,[data]);
					}
				});
				taskqueue.shift()({__empty:true});			
			}

		}]); //reset
	}
	// get all keys in given path
	var getkeys=function(path,cb) {
		if (!path) path=[]
		var that=this;
		get.apply(this,[path,false,function(){
			if (path && path.length) {
				cb.apply(that,[KEY[path.join(strsep)]]);
			} else {
				cb.apply(that,[Object.keys(CACHE)]); 
				//top level, normally it is very small
			}
		}]);
	}

	var setupapi=function() {
		this.load=load;
//		this.cur=0;
		this.cache=function() {return CACHE};
		this.key=function() {return KEY};
		this.free=function() {
			CACHE=null;
			KEY=null;
			this.fs.free();
		}
		this.setCache=function(c) {CACHE=c};
		this.keys=getkeys;
		this.get=get;   // get a field, load if needed
		this.exists=exists;
		this.DT=DT;
		
		//install the sync version for node
		if (typeof process!="undefined") require("./kdb_sync")(this);
		//if (cb) setTimeout(cb.bind(this),0);
		if (cb) cb(this);
	}
	var that=this;
	var kfs=new Kfs(path,opts,function(){
		that.size=this.size;
		setupapi.call(that);
	});
	this.fs=kfs;
	return this;
}

Create.datatypes=DT;

if (module) module.exports=Create;
//return Create;

});
require.register("ksana-document/kdbfs.js", function(exports, require, module){
/* OS dependent file operation */

if (typeof process=="undefined") {
	var fs=require('./html5fs');
	var Buffer=function(){ return ""};
	var html5fs=true; 
} else {
	if (typeof nodeRequire=="undefined") {
		if (typeof ksana!="undefined") nodeRequire=ksana.require;
		else nodeRequire=require;
	} 
	var fs=nodeRequire('fs');
	var Buffer=nodeRequire("buffer").Buffer;
}

var signature_size=1;
var verbose=0, readLog=function(){};
var _readLog=function(readtype,bytes) {
	console.log(readtype,bytes,"bytes");
}
if (verbose) readLog=_readLog;

var unpack_int = function (ar, count , reset) {
   count=count||ar.length;
   /*
	if (typeof ijs_unpack_int == 'function') {
		var R = ijs_unpack_int(ar, count, reset)
		return R
	};
	*/
  var r = [], i = 0, v = 0;
  do {
	var shift = 0;
	do {
	  v += ((ar[i] & 0x7F) << shift);
	  shift += 7;	  
	} while (ar[++i] & 0x80);
	r.push(v); if (reset) v=0;
	count--;
  } while (i<ar.length && count);
  return {data:r, adv:i };
}
var Open=function(path,opts,cb) {
	opts=opts||{};

	var readSignature=function(pos,cb) {
		var buf=new Buffer(signature_size);
		var that=this;
		fs.read(this.handle,buf,0,signature_size,pos,function(err,len,buffer){
			if (html5fs) var signature=String.fromCharCode((new Uint8Array(buffer))[0])
			else var signature=buffer.toString('utf8',0,signature_size);
			cb.apply(that,[signature]);
		});
	}

	//this is quite slow
	//wait for StringView +ArrayBuffer to solve the problem
	//https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/ylgiNY_ZSV0
	//if the string is always ucs2
	//can use Uint16 to read it.
	//http://updates.html5rocks.com/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
  var decodeutf8 = function (utftext) {
        var string = "";
        var i = 0;
        var c=0,c1 = 0, c2 = 0 , c3=0;
 				for (var i=0;i<utftext.length;i++) {
 					if (utftext.charCodeAt(i)>127) break;
 				}
 				if (i>=utftext.length) return utftext;

        while ( i < utftext.length ) {
 
            c = utftext.charCodeAt(i);
 
            if (c < 128) {
                string += utftext[i];
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
 
        }
 
        return string;
  }

	var readString= function(pos,blocksize,encoding,cb) {
		encoding=encoding||'utf8';
		var buffer=new Buffer(blocksize);
		var that=this;
		fs.read(this.handle,buffer,0,blocksize,pos,function(err,len,buffer){
			readLog("string",len);
			if (html5fs) {
				if (encoding=='utf8') {
					var str=decodeutf8(String.fromCharCode.apply(null, new Uint8Array(buffer)))
				} else { //ucs2 is 3 times faster
					var str=String.fromCharCode.apply(null, new Uint16Array(buffer))	
				}
				
				cb.apply(that,[str]);
			} 
			else cb.apply(that,[buffer.toString(encoding)]);	
		});
	}

	//work around for chrome fromCharCode cannot accept huge array
	//https://code.google.com/p/chromium/issues/detail?id=56588
	var buf2stringarr=function(buf,enc) {
		if (enc=="utf8") 	var arr=new Uint8Array(buf);
		else var arr=new Uint16Array(buf);
		var i=0,codes=[],out=[],s="";
		while (i<arr.length) {
			if (arr[i]) {
				codes[codes.length]=arr[i];
			} else {
				s=String.fromCharCode.apply(null,codes);
				if (enc=="utf8") out[out.length]=decodeutf8(s);
				else out[out.length]=s;
				codes=[];				
			}
			i++;
		}
		
		s=String.fromCharCode.apply(null,codes);
		if (enc=="utf8") out[out.length]=decodeutf8(s);
		else out[out.length]=s;

		return out;
	}
	var readStringArray = function(pos,blocksize,encoding,cb) {
		var that=this,out=null;
		if (blocksize==0) return [];
		encoding=encoding||'utf8';
		var buffer=new Buffer(blocksize);
		fs.read(this.handle,buffer,0,blocksize,pos,function(err,len,buffer){
		  
		  if (html5fs) {
	  		readLog("stringArray",buffer.byteLength);

				if (encoding=='utf8') {
					out=buf2stringarr(buffer,"utf8");
				} else { //ucs2 is 3 times faster
					out=buf2stringarr(buffer,"ucs2");
				}
		  } else {
			readLog("stringArray",buffer.length);
			out=buffer.toString(encoding).split('\0');
		  } 	
		  cb.apply(that,[out]);
		});
	}
	var readUI32=function(pos,cb) {
		var buffer=new Buffer(4);
		var that=this;
		fs.read(this.handle,buffer,0,4,pos,function(err,len,buffer){
			readLog("ui32",len);
			if (html5fs){
				//v=(new Uint32Array(buffer))[0];
				var v=new DataView(buffer).getUint32(0, false)
				cb(v);
			}
			else cb.apply(that,[buffer.readInt32BE(0)]);	
		});
		
	}

	var readI32=function(pos,cb) {
		var buffer=new Buffer(4);
		var that=this;
		fs.read(this.handle,buffer,0,4,pos,function(err,len,buffer){
			readLog("i32",len);
			if (html5fs){
				var v=new DataView(buffer).getInt32(0, false)
				cb(v);
			}
			else  	cb.apply(that,[buffer.readInt32BE(0)]);	
		});
	}
	var readUI8=function(pos,cb) {
		var buffer=new Buffer(1);
		var that=this;

		fs.read(this.handle,buffer,0,1,pos,function(err,len,buffer){
			readLog("ui8",len);
			if (html5fs)cb( (new Uint8Array(buffer))[0]) ;
			else  			cb.apply(that,[buffer.readUInt8(0)]);	
			
		});
	}
	var readBuf=function(pos,blocksize,cb) {
		var that=this;
		var buf=new Buffer(blocksize);
		fs.read(this.handle,buf,0,blocksize,pos,function(err,len,buffer){

			readLog("buf",len);
			/*
			var buff=[];
			for (var i=0;i<len;i++) {
				buff[i]=buffer.charCodeAt(i);
			}
			*/
			var buff=new Uint8Array(buffer)
			cb.apply(that,[buff]);
		});
	}
	var readBuf_packedint=function(pos,blocksize,count,reset,cb) {
		var that=this;
		readBuf.apply(this,[pos,blocksize,function(buffer){
			cb.apply(that,[unpack_int(buffer,count,reset)]);	
		}]);
		
	}
	var readFixedArray_html5fs=function(pos,count,unitsize,cb) {
		var func=null;
		/*
		var buf2UI32BE=function(buf,p) {
			return buf.charCodeAt(p)*256*256*256
					+buf.charCodeAt(p+1)*256*256
					+buf.charCodeAt(p+2)*256+buf.charCodeAt(p+3);
		}
		var buf2UI16BE=function(buf,p) {
			return buf.charCodeAt(p)*256
					+buf.charCodeAt(p+1);
		}
		var buf2UI8=function(buf,p) {
			return buf.charCodeAt(p);
		}
		*/
		if (unitsize===1) {
			func='getUint8';//Uint8Array;
		} else if (unitsize===2) {
			func='getUint16';//Uint16Array;
		} else if (unitsize===4) {
			func='getUint32';//Uint32Array;
		} else throw 'unsupported integer size';

		fs.read(this.handle,null,0,unitsize*count,pos,function(err,len,buffer){
			readLog("fix array",len);
			var out=[];
			if (unitsize==1) {
				out=new Uint8Array(buffer);
			} else {
				for (var i = 0; i < len / unitsize; i++) { //endian problem
				//	out.push( func(buffer,i*unitsize));
					out.push( v=new DataView(buffer)[func](i,false) );
				}
			}

			cb.apply(that,[out]);
		});
	}
	// signature, itemcount, payload
	var readFixedArray = function(pos ,count, unitsize,cb) {
		var func=null;
		var that=this;
		
		if (unitsize* count>this.size && this.size)  {
			console.log("array size exceed file size",this.size)
			return;
		}
		
		if (html5fs) return readFixedArray_html5fs.apply(this,[pos,count,unitsize,cb]);

		var items=new Buffer( unitsize* count);
		if (unitsize===1) {
			func=items.readUInt8;
		} else if (unitsize===2) {
			func=items.readUInt16BE;
		} else if (unitsize===4) {
			func=items.readUInt32BE;
		} else throw 'unsupported integer size';
		//console.log('itemcount',itemcount,'buffer',buffer);

		fs.read(this.handle,items,0,unitsize*count,pos,function(err,len,buffer){
			readLog("fix array",len);
			var out=[];
			for (var i = 0; i < items.length / unitsize; i++) {
				out.push( func.apply(items,[i*unitsize]));
			}
			cb.apply(that,[out]);
		});
	}

	var free=function() {
		//console.log('closing ',handle);
		fs.closeSync(this.handle);
	}
	var setupapi=function() {
		var that=this;
		this.readSignature=readSignature;
		this.readI32=readI32;
		this.readUI32=readUI32;
		this.readUI8=readUI8;
		this.readBuf=readBuf;
		this.readBuf_packedint=readBuf_packedint;
		this.readFixedArray=readFixedArray;
		this.readString=readString;
		this.readStringArray=readStringArray;
		this.signature_size=signature_size;
		this.free=free;
		if (html5fs) {
		    var fn=path;
		    if (path.indexOf("filesystem:")==0) fn=path.substr(path.lastIndexOf("/"));
		    fs.fs.root.getFile(fn,{},function(entry){
		      entry.getMetadata(function(metadata) { 
		        that.size=metadata.size;
		        if (cb) setTimeout(cb.bind(that),0);
		        });
		    });
		} else {
			var stat=fs.fstatSync(this.handle);
			this.stat=stat;
			this.size=stat.size;		
			if (cb)	setTimeout(cb.bind(this),0);	
		}
	}
	
	//handle=fs.openSync(path,'r');
	//console.log('watching '+path);
	var that=this;
	if (html5fs) {
		fs.open(path,function(h){
			that.handle=h;
			that.html5fs=true;
			setupapi.call(that);
			that.opened=true;
		})
	} else {
		this.handle=fs.openSync(path,'r');//,function(err,handle){
		this.opened=true;
		setupapi.call(this);
	}
	//console.log('file size',path,this.size);	
	return this;
}
module.exports=Open;

});
require.register("ksana-document/kdbw.js", function(exports, require, module){
/*
  convert any json into a binary buffer
  the buffer can be saved with a single line of fs.writeFile
*/

var DT={
	uint8:'1', //unsigned 1 byte integer
	int32:'4', // signed 4 bytes integer
	utf8:'8',  
	ucs2:'2',
	bool:'^', 
	blob:'&',
	utf8arr:'*', //shift of 8
	ucs2arr:'@', //shift of 2
	uint8arr:'!', //shift of 1
	int32arr:'$', //shift of 4
	vint:'`',
	pint:'~',	

	array:'\u001b',
	object:'\u001a' 
	//ydb start with object signature,
	//type a ydb in command prompt shows nothing
}
var key_writing="";//for debugging
var pack_int = function (ar, savedelta) { // pack ar into
  if (!ar || ar.length === 0) return []; // empty array
  var r = [],
  i = 0,
  j = 0,
  delta = 0,
  prev = 0;
  
  do {
	delta = ar[i];
	if (savedelta) {
		delta -= prev;
	}
	if (delta < 0) {
	  console.trace('negative',prev,ar[i])
	  throw 'negetive';
	  break;
	}
	
	r[j++] = delta & 0x7f;
	delta >>= 7;
	while (delta > 0) {
	  r[j++] = (delta & 0x7f) | 0x80;
	  delta >>= 7;
	}
	prev = ar[i];
	i++;
  } while (i < ar.length);
  return r;
}
var Kfs=function(path,opts) {
	
	var handle=null;
	opts=opts||{};
	opts.size=opts.size||65536*2048; 
	console.log('kdb estimate size:',opts.size);
	var dbuf=new Buffer(opts.size);
	var cur=0;//dbuf cursor
	
	var writeSignature=function(value,pos) {
		dbuf.write(value,pos,value.length,'utf8');
		if (pos+value.length>cur) cur=pos+value.length;
		return value.length;
	}
	var writeOffset=function(value,pos) {
		dbuf.writeUInt8(Math.floor(value / (65536*65536)),pos);
		dbuf.writeUInt32BE( value & 0xFFFFFFFF,pos+1);
		if (pos+5>cur) cur=pos+5;
		return 5;
	}
	var writeString= function(value,pos,encoding) {
		encoding=encoding||'ucs2';
		if (value=="") throw "cannot write null string";
		if (encoding==='utf8')dbuf.write(DT.utf8,pos,1,'utf8');
		else if (encoding==='ucs2')dbuf.write(DT.ucs2,pos,1,'utf8');
		else throw 'unsupported encoding '+encoding;
			
		var len=Buffer.byteLength(value, encoding);
		dbuf.write(value,pos+1,len,encoding);
		
		if (pos+len+1>cur) cur=pos+len+1;
		return len+1; // signature
	}
	var writeStringArray = function(value,pos,encoding) {
		encoding=encoding||'ucs2';
		if (encoding==='utf8') dbuf.write(DT.utf8arr,pos,1,'utf8');
		else if (encoding==='ucs2')dbuf.write(DT.ucs2arr,pos,1,'utf8');
		else throw 'unsupported encoding '+encoding;
		
		var v=value.join('\0');
		var len=Buffer.byteLength(v, encoding);
		if (0===len) {
			throw "empty string array " + key_writing;
		}
		dbuf.write(v,pos+1,len,encoding);
		if (pos+len+1>cur) cur=pos+len+1;
		return len+1;
	}
	var writeI32=function(value,pos) {
		dbuf.write(DT.int32,pos,1,'utf8');
		dbuf.writeInt32BE(value,pos+1);
		if (pos+5>cur) cur=pos+5;
		return 5;
	}
	var writeUI8=function(value,pos) {
		dbuf.write(DT.uint8,pos,1,'utf8');
		dbuf.writeUInt8(value,pos+1);
		if (pos+2>cur) cur=pos+2;
		return 2;
	}
	var writeBool=function(value,pos) {
		dbuf.write(DT.bool,pos,1,'utf8');
		dbuf.writeUInt8(Number(value),pos+1);
		if (pos+2>cur) cur=pos+2;
		return 2;
	}		
	var writeBlob=function(value,pos) {
		dbuf.write(DT.blob,pos,1,'utf8');
		value.copy(dbuf, pos+1);
		var written=value.length+1;
		if (pos+written>cur) cur=pos+written;
		return written;
	}		
	/* no signature */
	var writeFixedArray = function(value,pos,unitsize) {
		//console.log('v.len',value.length,items.length,unitsize);
		if (unitsize===1) var func=dbuf.writeUInt8;
		else if (unitsize===4)var func=dbuf.writeInt32BE;
		else throw 'unsupported integer size';
		if (!value.length) {
			throw "empty fixed array "+key_writing;
		}
		for (var i = 0; i < value.length ; i++) {
			func.apply(dbuf,[value[i],i*unitsize+pos])
		}
		var len=unitsize*value.length;
		if (pos+len>cur) cur=pos+len;
		return len;
	}

	this.writeI32=writeI32;
	this.writeBool=writeBool;
	this.writeBlob=writeBlob;
	this.writeUI8=writeUI8;
	this.writeString=writeString;
	this.writeSignature=writeSignature;
	this.writeOffset=writeOffset; //5 bytes offset
	this.writeStringArray=writeStringArray;
	this.writeFixedArray=writeFixedArray;
	Object.defineProperty(this, "buf", {get : function(){ return dbuf; }});
	
	return this;
}

var Create=function(path,opts) {
	opts=opts||{};
	var kfs=new Kfs(path,opts);
	var cur=0;

	var handle={};
	
	//no signature
	var writeVInt =function(arr) {
		var o=pack_int(arr,false);
		kfs.writeFixedArray(o,cur,1);
		cur+=o.length;
	}
	var writeVInt1=function(value) {
		writeVInt([value]);
	}
	//for postings
	var writePInt =function(arr) {
		var o=pack_int(arr,true);
		kfs.writeFixedArray(o,cur,1);
		cur+=o.length;
	}
	
	var saveVInt = function(arr,key) {
		var start=cur;
		key_writing=key;
		cur+=kfs.writeSignature(DT.vint,cur);
		writeVInt(arr);
		var written = cur-start;
		pushitem(key,written);
		return written;		
	}
	var savePInt = function(arr,key) {
		var start=cur;
		key_writing=key;
		cur+=kfs.writeSignature(DT.pint,cur);
		writePInt(arr);
		var written = cur-start;
		pushitem(key,written);
		return written;	
	}

	
	var saveUI8 = function(value,key) {
		var written=kfs.writeUI8(value,cur);
		cur+=written;
		pushitem(key,written);
		return written;
	}
	var saveBool=function(value,key) {
		var written=kfs.writeBool(value,cur);
		cur+=written;
		pushitem(key,written);
		return written;
	}
	var saveI32 = function(value,key) {
		var written=kfs.writeI32(value,cur);
		cur+=written;
		pushitem(key,written);
		return written;
	}	
	var saveString = function(value,key,encoding) {
		encoding=encoding||stringencoding;
		key_writing=key;
		var written=kfs.writeString(value,cur,encoding);
		cur+=written;
		pushitem(key,written);
		return written;
	}
	var saveStringArray = function(arr,key,encoding) {
		encoding=encoding||stringencoding;
		key_writing=key;
		try {
			var written=kfs.writeStringArray(arr,cur,encoding);
		} catch(e) {
			throw e;
		}
		cur+=written;
		pushitem(key,written);
		return written;
	}
	
	var saveBlob = function(value,key) {
		key_writing=key;
		var written=kfs.writeBlob(value,cur);
		cur+=written;
		pushitem(key,written);
		return written;
	}

	var folders=[];
	var pushitem=function(key,written) {
		var folder=folders[folders.length-1];	
		if (!folder) return ;
		folder.itemslength.push(written);
		if (key) {
			if (!folder.keys) throw 'cannot have key in array';
			folder.keys.push(key);
		}
	}	
	var open = function(opt) {
		var start=cur;
		var key=opt.key || null;
		var type=opt.type||DT.array;
		cur+=kfs.writeSignature(type,cur);
		cur+=kfs.writeOffset(0x0,cur); // pre-alloc space for offset
		var folder={
			type:type, key:key,
			start:start,datastart:cur,
			itemslength:[] };
		if (type===DT.object) folder.keys=[];
		folders.push(folder);
	}
	var openObject = function(key) {
		open({type:DT.object,key:key});
	}
	var openArray = function(key) {
		open({type:DT.array,key:key});
	}
	var saveInts=function(arr,key,func) {
		func.apply(handle,[arr,key]);
	}
	var close = function(opt) {
		if (!folders.length) throw 'empty stack';
		var folder=folders.pop();
		//jump to lengths and keys
		kfs.writeOffset( cur-folder.datastart, folder.datastart-5);
		var itemcount=folder.itemslength.length;
		//save lengths
		writeVInt1(itemcount);
		writeVInt(folder.itemslength);
		
		if (folder.type===DT.object) {
			//use utf8 for keys
			cur+=kfs.writeStringArray(folder.keys,cur,'utf8');
		}
		written=cur-folder.start;
		pushitem(folder.key,written);
		return written;
	}
	
	
	var stringencoding='ucs2';
	var stringEncoding=function(newencoding) {
		if (newencoding) stringencoding=newencoding;
		else return stringencoding;
	}
	
	var allnumber_fast=function(arr) {
		if (arr.length<5) return allnumber(arr);
		if (typeof arr[0]=='number'
		    && Math.round(arr[0])==arr[0] && arr[0]>=0)
			return true;
		return false;
	}
	var allstring_fast=function(arr) {
		if (arr.length<5) return allstring(arr);
		if (typeof arr[0]=='string') return true;
		return false;
	}	
	var allnumber=function(arr) {
		for (var i=0;i<arr.length;i++) {
			if (typeof arr[i]!=='number') return false;
		}
		return true;
	}
	var allstring=function(arr) {
		for (var i=0;i<arr.length;i++) {
			if (typeof arr[i]!=='string') return false;
		}
		return true;
	}
	var getEncoding=function(key,encs) {
		var enc=encs[key];
		if (!enc) return null;
		if (enc=='delta' || enc=='posting') {
			return savePInt;
		} else if (enc=="variable") {
			return saveVInt;
		}
		return null;
	}
	var save=function(J,key,opts) {
		opts=opts||{};
		
		if (typeof J=="null" || typeof J=="undefined") {
			throw 'cannot save null value of ['+key+'] folders'+JSON.stringify(folders);
			return;
		}
		var type=J.constructor.name;
		if (type==='Object') {
			openObject(key);
			for (var i in J) {
				save(J[i],i,opts);
				if (opts.autodelete) delete J[i];
			}
			close();
		} else if (type==='Array') {
			if (allnumber_fast(J)) {
				if (J.sorted) { //number array is sorted
					saveInts(J,key,savePInt);	//posting delta format
				} else {
					saveInts(J,key,saveVInt);	
				}
			} else if (allstring_fast(J)) {
				saveStringArray(J,key);
			} else {
				openArray(key);
				for (var i=0;i<J.length;i++) {
					save(J[i],null,opts);
					if (opts.autodelete) delete J[i];
				}
				close();
			}
		} else if (type==='String') {
			saveString(J,key);
		} else if (type==='Number') {
			if (J>=0&&J<256) saveUI8(J,key);
			else saveI32(J,key);
		} else if (type==='Boolean') {
			saveBool(J,key);
		} else if (type==='Buffer') {
			saveBlob(J,key);
		} else {
			throw 'unsupported type '+type;
		}
	}
	
	var free=function() {
		while (folders.length) close();
		kfs.free();
	}
	var currentsize=function() {
		return cur;
	}

	Object.defineProperty(handle, "size", {get : function(){ return cur; }});

	var writeFile=function(fn,opts,cb) {
		var fs=require('fs');
		var totalbyte=handle.currentsize();
		var written=0,batch=0;
		
		if (typeof cb=="undefined" || typeof opts=="function") { //do not have
			cb=opts;
		}
		opts=opts||{};
		batchsize=opts.batchsize||1024*1024*16; //16 MB

		if (fs.existsSync(fn)) fs.unlinkSync(fn);

		var writeCb=function(total,written,cb,next) {
			return function(err) {
				if (err) throw "write error"+err;
				cb(total,written);
				batch++;
				next();
			}
		}

		var next=function() {
			if (batch<batches) {
				var bufstart=batchsize*batch;
				var bufend=bufstart+batchsize;
				if (bufend>totalbyte) bufend=totalbyte;
				var sliced=kfs.buf.slice(bufstart,bufend);
				written+=sliced.length;
				fs.appendFile(fn,sliced,writeCb(totalbyte,written, cb,next));
			}
		}
		var batches=1+Math.floor(handle.size/batchsize);
		next();
	}
	handle.free=free;
	handle.saveI32=saveI32;
	handle.saveUI8=saveUI8;
	handle.saveBool=saveBool;
	handle.saveString=saveString;
	handle.saveVInt=saveVInt;
	handle.savePInt=savePInt;
	handle.saveInts=saveInts;
	handle.saveBlob=saveBlob;
	handle.save=save;
	handle.openArray=openArray;
	handle.openObject=openObject;
	handle.stringEncoding=stringEncoding;
	//this.integerEncoding=integerEncoding;
	handle.close=close;
	handle.writeFile=writeFile;
	handle.currentsize=currentsize;
	return handle;
}

module.exports=Create;
});
require.register("ksana-document/kdb_sync.js", function(exports, require, module){
/*
  syncronize version of kdb, taken from yadb
*/
var Kfs=require('./kdbfs_sync');

var Sync=function(kdb) {
	DT=kdb.DT;
	kfs=Kfs(kdb.fs);
	var cur=0;
	/* loadxxx functions move file pointer */
	// load variable length int
	var loadVInt =function(blocksize,count) {
		if (count==0) return [];
		var o=kfs.readBuf_packedintSync(cur,blocksize,count,true);
		cur+=o.adv;
		return o.data;
	}
	var loadVInt1=function() {
		return loadVInt(6,1)[0];
	}
	//for postings
	var loadPInt =function(blocksize,count) {
		var o=kfs.readBuf_packedintSync(cur,blocksize,count,false);
		cur+=o.adv;
		return o.data;
	}
	// item can be any type (variable length)
	// maximum size of array is 1TB 2^40
	// structure:
	// signature,5 bytes offset, payload, itemlengths
	var loadArray = function(blocksize,lazy) {
		var lengthoffset=kfs.readUI8Sync(cur)*4294967296;
		lengthoffset+=kfs.readUI32Sync(cur+1);
		cur+=5;
		var dataoffset=cur;
		cur+=lengthoffset;
		var count=loadVInt1();
		var sz=loadVInt(count*6,count);
		var o=[];
		var endcur=cur;
		cur=dataoffset; 
		for (var i=0;i<count;i++) {
			if (lazy) { 
				//store the offset instead of loading from disk
				var offset=dataoffset;
				for (var i=0;i<sz.length;i++) {
				//prefix with a \0, impossible for normal string
					o[o.length]="\0"+offset.toString(16)
						   +"\0"+sz[i].toString(16);
					offset+=sz[i];
				}
			} else {			
				o[o.length]=load({blocksize:sz[i]});
			}
		}
		cur=endcur;
		return o;
	}		
	// item can be any type (variable length)
	// support lazy load
	// structure:
	// signature,5 bytes offset, payload, itemlengths, 
	//                    stringarray_signature, keys
	var loadObject = function(blocksize,lazy, keys) {
		var start=cur;
		var lengthoffset=kfs.readUI8Sync(cur)*4294967296;
		lengthoffset+=kfs.readUI32Sync(cur+1);cur+=5;
		var dataoffset=cur;
		cur+=lengthoffset;
		var count=loadVInt1();
		var lengths=loadVInt(count*6,count);
		var keyssize=blocksize-cur+start;	
		var K=load({blocksize:keyssize});
		var o={};
		var endcur=cur;
		
		if (lazy) { 
			//store the offset instead of loading from disk
			var offset=dataoffset;
			for (var i=0;i<lengths.length;i++) {
				//prefix with a \0, impossible for normal string
				o[K[i]]="\0"+offset.toString(16)
					   +"\0"+lengths[i].toString(16);
				offset+=lengths[i];
			}
		} else {
			cur=dataoffset; 
			for (var i=0;i<count;i++) {
				o[K[i]]=(load({blocksize:lengths[i]}));
			}
		}
		if (keys) K.map(function(r) { keys.push(r)});
		cur=endcur;
		return o;
	}		
	//item is same known type
	var loadStringArray=function(blocksize,encoding) {
		var o=kfs.readStringArraySync(cur,blocksize,encoding);
		cur+=blocksize;
		return o;
	}
	var loadIntegerArray=function(blocksize,unitsize) {
		var count=loadVInt1();
		var o=kfs.readFixedArraySync(cur,count,unitsize);
		cur+=count*unitsize;
		return o;
	}
	var loadBlob=function(blocksize) {
		var o=kfs.readBufSync(cur,blocksize);
		cur+=blocksize;
		return o;
	}	
	
	var load=function(opts) {
		opts=opts||{};
		var blocksize=opts.blocksize||kfs.size; 
		var signature=kfs.readSignatureSync(cur);
		cur+=kfs.signature_size;
		var datasize=blocksize-kfs.signature_size;
		//basic types
		if (signature===DT.int32) {
			cur+=4;
			return kfs.readI32Sync(cur-4);
		} else if (signature===DT.uint8) {
			cur++;
			return kfs.readUI8Sync(cur-1);
		} else if (signature===DT.utf8) {
			var c=cur;cur+=datasize;
			return kfs.readStringSync(c,datasize,'utf8');	
		} else if (signature===DT.ucs2) {
			var c=cur;cur+=datasize;
			return kfs.readStringSync(c,datasize,'ucs2');	
		} else if (signature===DT.bool) {
			cur++;
			return !!(kfs.readUI8Sync(cur-1));
		} else if (signature===DT.blob) {
			return loadBlob(datasize);
		}
		//variable length integers
		else if (signature===DT.vint) return loadVInt(datasize);
		else if (signature===DT.pint) return loadPInt(datasize);
		//simple array
		else if (signature===DT.utf8arr) return loadStringArray(datasize,'utf8');
		else if (signature===DT.ucs2arr) return loadStringArray(datasize,'ucs2');
		else if (signature===DT.uint8arr) return loadIntegerArray(datasize,1);
		else if (signature===DT.int32arr) return loadIntegerArray(datasize,4);
		//nested structure
		else if (signature===DT.array) return loadArray(datasize,opts.lazy);
		else if (signature===DT.object) {
			return loadObject(datasize,opts.lazy,opts.keys);
		}
		else throw 'unsupported type '+signature;
	}
	var reset=function() {
		cur=0;
		kdb.setCache(load({lazy:true}));
	}
	var getall=function() {
		var output={};
		var keys=getkeys();
		for (var i in keys) {
			output[keys[i]]= get([keys[i]],true);
		}
		return output;
		
	}
	var exists=function(path) {
		if (path.length==0) return true;
		var key=path.pop();
		get(path);
		if (!path.join('\0')) return (!!kdb.key()[key]);
		var keys=kdb.key()[path.join('\0')];
		path.push(key);//put it back
		if (keys) return (keys.indexOf(key)>-1);
		else return false;
	}
	var get=function(path,recursive) {
		recursive=recursive||false;
		if (!kdb.cache()) reset();

		if (typeof path=="string") path=[path];
		var o=kdb.cache();
		if (path.length==0 &&recursive) return getall();
		var pathnow="";
		for (var i=0;i<path.length;i++) {
			var r=o[path[i]] ;

			if (r===undefined) return undefined;
			if (parseInt(i)) pathnow+="\0";
			pathnow+=path[i];
			if (typeof r=='string' && r[0]=="\0") { //offset of data to be loaded
				var keys=[];
				var p=r.substring(1).split("\0").map(
					function(item){return parseInt(item,16)});
				cur=p[0];
				var lazy=!recursive || (i<path.length-1) ;
				o[path[i]]=load({lazy:lazy,blocksize:p[1],keys:keys});
				kdb.key()[pathnow]=keys;
				o=o[path[i]];
			} else {
				o=r; //already in cache
			}
		}
		return o;
	}
	// get all keys in given path
	var getkeys=function(path) {
		if (!path) path=[]
		get(path); // make sure it is loaded
		if (path && path.length) {
			return kdb.key()[path.join("\0")];
		} else {
			return Object.keys(kdb.cache()); 
			//top level, normally it is very small
		}
		
	}

	kdb.loadSync=load;
	kdb.keysSync=getkeys;
	kdb.getSync=get;   // get a field, load if needed
	kdb.existsSync=exists;
	return kdb;
}

if (module) module.exports=Sync;

});
require.register("ksana-document/kdbfs_sync.js", function(exports, require, module){
/* OS dependent file operation */

var fs=require('fs');
var signature_size=1;

var unpack_int = function (ar, count , reset) {
   count=count||ar.length;
   /*
	if (typeof ijs_unpack_int == 'function') {
		var R = ijs_unpack_int(ar, count, reset)
		return R
	};
	*/
  var r = [], i = 0, v = 0;
  do {
	var shift = 0;
	do {
	  v += ((ar[i] & 0x7F) << shift);
	  shift += 7;	  
	} while (ar[++i] & 0x80);
	r.push(v); if (reset) v=0;
	count--;
  } while (i<ar.length && count);
  return {data:r, adv:i };
}
var Sync=function(kfs) {
	var handle=kfs.handle;

	var readSignature=function(pos) {
		var buf=new Buffer(signature_size);
		fs.readSync(handle,buf,0,signature_size,pos);
		var signature=buf.toString('utf8',0,signature_size);
		return signature;
	}
	var readString= function(pos,blocksize,encoding) {
		encoding=encoding||'utf8';
		var buffer=new Buffer(blocksize);
		fs.readSync(handle,buffer,0,blocksize,pos);
		return buffer.toString(encoding);
	}

	var readStringArray = function(pos,blocksize,encoding) {
		if (blocksize==0) return [];
		encoding=encoding||'utf8';
		var buffer=new Buffer(blocksize);
		fs.readSync(handle,buffer,0,blocksize,pos);
		var out=buffer.toString(encoding).split('\0');
		return out;
	}
	var readUI32=function(pos) {
		var buffer=new Buffer(4);
		fs.readSync(handle,buffer,0,4,pos);
		return buffer.readUInt32BE(0);
	}
	var readI32=function(pos) {
		var buffer=new Buffer(4);
		fs.readSync(handle,buffer,0,4,pos);
		return buffer.readInt32BE(0);
	}
	var readUI8=function(pos) {
		var buffer=new Buffer(1);
		fs.readSync(handle,buffer,0,1,pos);
		return buffer.readUInt8(0);
	}
	var readBuf=function(pos,blocksize) {
		var buf=new Buffer(blocksize);
		fs.readSync(handle,buf,0,blocksize,pos);
	
		return buf;
	}
	var readBuf_packedint=function(pos,blocksize,count,reset) {
		var buf=readBuf(pos,blocksize);
		return unpack_int(buf,count,reset);
	}
	// signature, itemcount, payload
	var readFixedArray = function(pos ,count, unitsize) {
		var func;
		
		if (unitsize* count>this.size && this.size)  {
			throw "array size exceed file size"
			return;
		}
		
		var items=new Buffer( unitsize* count);
		if (unitsize===1) {
			func=items.readUInt8;
		} else if (unitsize===2) {
			func=items.readUInt16BE;
		} else if (unitsize===4) {
			func=items.readUInt32BE;
		} else throw 'unsupported integer size';
		//console.log('itemcount',itemcount,'buffer',buffer);
		fs.readSync(handle,items,0,unitsize*count,pos);
		var out=[];
		for (var i = 0; i < items.length / unitsize; i++) {
			out.push( func.apply(items,[i*unitsize]) );
		}
		return out;
	}
	
	kfs.readSignatureSync=readSignature;
	kfs.readI32Sync=readI32;
	kfs.readUI32Sync=readUI32;
	kfs.readUI8Sync=readUI8;
	kfs.readBufSync=readBuf;
	kfs.readBuf_packedintSync=readBuf_packedint;
	kfs.readFixedArraySync=readFixedArray;
	kfs.readStringSync=readString;
	kfs.readStringArraySync=readStringArray;
	kfs.signature_sizeSync=signature_size;
	
	return kfs;
}
module.exports=Sync;

});
require.register("ksana-document/html5fs.js", function(exports, require, module){
/*
http://stackoverflow.com/questions/3146483/html5-file-api-read-as-text-and-binary

automatic open file without user interaction
http://stackoverflow.com/questions/18251432/read-a-local-file-using-javascript-html5-file-api-offline-website

extension id
 chrome.runtime.getURL("vrimul.ydb")
"chrome-extension://nfdipggoinlpfldmfibcjdobcpckfgpn/vrimul.ydb"
 tell user to switch to the directory

 getPackageDirectoryEntry
*/

var read=function(handle,buffer,offset,length,position,cb) {	 //buffer and offset is not used
  var xhr = new XMLHttpRequest();
  xhr.open('GET', handle.url , true);
  var range=[position,length+position-1];
  xhr.setRequestHeader('Range', 'bytes='+range[0]+'-'+range[1]);
  xhr.responseType = 'arraybuffer';
  xhr.send();

  xhr.onload = function(e) {
    var that=this;
    setTimeout(function(){
      cb(0,that.response.byteLength,that.response);
    },0);
  }; 
}

var close=function(handle) {
	//nop
}
var fstatSync=function(handle) {
  throw "not implement yet";
}
var fstat=function(handle,cb) {
  throw "not implement yet";
}
var _open=function(fn_url,cb) {
    var handle={};
    if (fn_url.indexOf("filesystem:")==0){
      handle.url=fn_url;
      handle.fn=fn_url.substr( fn_url.lastIndexOf("/")+1);
    } else {
      handle.fn=fn_url;
      var url=API.files.filter(function(f){ return (f[0]==fn_url)});
      if (url.length) handle.url=url[0][1];
    }
    cb(handle);//url as handle
}
var open=function(fn_url,cb) {
    if (!API.initialized) {init(1024*1024,function(){
      _open.apply(this,[fn_url,cb]);
    },this)} else _open.apply(this,[fn_url,cb]);
}
var load=function(filename,mode,cb) {
  open(filename,mode,cb,true);
}
var get_date=function(url,callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, true); // Notice "HEAD" instead of "GET", //  to get only the header
    xhr.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
          callback(xhr.getResponseHeader("Last-Modified"));
        } else {
          if (this.status!==200&&this.status!==206) {
            callback("");
          }
        }
    };
    xhr.send();
}
var  getDownloadSize=function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, true); // Notice "HEAD" instead of "GET", //  to get only the header
    xhr.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
          callback(parseInt(xhr.getResponseHeader("Content-Length")));
        } else {
          if (this.status!==200&&this.status!==206) {
            callback(0);//no such file     
          }
        }
    };
    xhr.send();
};
var checkUpdate=function(url,fn,cb) {
    if (!url) {
      cb(false);
      return;
    }
    get_date(url,function(d){
      API.fs.root.getFile(fn, {create: false, exclusive: false}, function(fileEntry) {
          fileEntry.getMetadata(function(metadata){
            var localDate=Date.parse(metadata.modificationTime);
            var urlDate=Date.parse(d);
            cb(urlDate>localDate);
          });
    },function(){//error
      cb(false); //missing local file
    });
  });
}
var download=function(url,fn,cb,statuscb,context) {
   var totalsize=0,batches=null,written=0;
   var fileEntry=0, fileWriter=0;
   var createBatches=function(size) {
      var bytes=1024*1024, out=[];
      var b=Math.floor(size / bytes);
      var last=size %bytes;
      for (var i=0;i<=b;i++) {
        out.push(i*bytes);
      }
      out.push(b*bytes+last);
      return out;
   }
   var finish=function() { //remove old file and rename temp.kdb 
         rm(fn,function(){
            fileEntry.moveTo(fileEntry.filesystem.root, fn,function(){
              setTimeout( cb.bind(context,false) , 0) ; 
            },function(e){
              console.log("faile",e)
            });
         },this); 
   }
    var tempfn="temp.kdb";
    var batch=function(b) {
       var abort=false;
       var xhr = new XMLHttpRequest();
       var requesturl=url+"?"+Math.random();
       xhr.open('get', requesturl, true);
       xhr.setRequestHeader('Range', 'bytes='+batches[b]+'-'+(batches[b+1]-1));
       xhr.responseType = 'blob';    
       xhr.addEventListener('load', function() {
         var blob=this.response;
		 fileEntry.createWriter(function(fileWriter) {
         fileWriter.seek(fileWriter.length);
         fileWriter.write(blob);
         written+=blob.size;
         fileWriter.onwriteend = function(e) {
           if (statuscb) {
              abort=statuscb.apply(context,[ fileWriter.length / totalsize,totalsize ]);
              if (abort) setTimeout( cb.bind(context,false) , 0) ;
           }
           b++;
           if (!abort) {
              if (b<batches.length-1) setTimeout(batch.bind(context,b),0);
              else                    finish();
           }
         };
        }, console.error);
       },false);
       xhr.send();
    }

     getDownloadSize(url,function(size){
       totalsize=size;
       if (!size) {
          if (cb) cb.apply(context,[false]);
       } else {//ready to download
        rm(tempfn,function(){
           batches=createBatches(size);
           if (statuscb) statuscb.apply(context,[ 0, totalsize ]);
           
       	   API.fs.root.getFile(tempfn, {create: 1, exclusive: false}, function(_fileEntry) {
       	   	   	fileEntry=_fileEntry;
           		batch(0);
       	   });
        },this);
      }
     });
}

var readFile=function(filename,cb,context) {
  API.fs.root.getFile(filename, function(fileEntry) {
      var reader = new FileReader();
      reader.onloadend = function(e) {
          if (cb) cb.apply(cb,[this.result]);
        };            
    }, console.error);
}
var writeFile=function(filename,buf,cb,context){
   API.fs.root.getFile(filename, {create: true, exclusive: true}, function(fileEntry) {
      fileEntry.createWriter(function(fileWriter) {
        fileWriter.write(buf);
        fileWriter.onwriteend = function(e) {
          if (cb) cb.apply(cb,[buf.byteLength]);
        };            
      }, console.error);
    }, console.error);
}
var readEntries=function(cb,context) {
   var dirReader = API.fs.root.createReader();
   var out=[],that=this;
    // Need to recursively read directories until there are no more results.
    dirReader.readEntries(function(entries) {
      if (entries.length) {
          for (var i = 0, entry; entry = entries[i]; ++i) {
            if (entry.isFile) {
              out.push([entry.name,entry.toURL ? entry.toURL() : entry.toURI()]);
            }
          }
      }
      API.files=out;
      if (cb) cb.apply(context,[out]);
    }, function(){
      if (cb) cb.apply(context,[null]);
    });
}
var getFileURL=function(filename) {
  if (!API.files ) return null;
  var file= API.files.filter(function(f){return f[0]==filename});
  if (file.length) return file[0][1];
}
var rm=function(filename,cb,context) {
   var url=getFileURL(filename);
   if (url) rmURL(url,cb,context);
   else if (cb) cb.apply(context,[false]);
}

var rmURL=function(filename,cb,context) {
    webkitResolveLocalFileSystemURL(filename, function(fileEntry) {
      fileEntry.remove(function() {
        if (cb) cb.apply(context,[true]);
      }, console.error);
    },  function(e){
      if (cb) cb.apply(context,[false]);//no such file
    });
}
function errorHandler(e) {
  console.error('Error: ' +e.name+ " "+e.message);
}
var initfs=function(grantedBytes,cb,context) {
  webkitRequestFileSystem(PERSISTENT, grantedBytes,  function(fs) {
      API.fs=fs;
      API.quota=grantedBytes;
      readEntries(function(){
        API.initialized=true;
        cb.apply(context,[grantedBytes,fs]);
      },context);
    }, errorHandler);
}
var init=function(quota,cb,context) {
  navigator.webkitPersistentStorage.requestQuota(quota, 
      function(grantedBytes) {

        initfs(grantedBytes,cb,context);
    }, console.error 
  );
}
var queryQuota=function(cb,context) {
    var that=this;
    navigator.webkitPersistentStorage.queryUsageAndQuota( 
     function(usage,quota){
        initfs(quota,function(){
          cb.apply(context,[usage,quota]);
        },context);
    });
}
//if (typeof navigator!="undefined" && navigator.webkitPersistentStorage) init(1024*1024);
var API={
  load:load
  ,open:open
  ,read:read
  ,fstatSync:fstatSync
  ,fstat:fstat,close:close
  ,init:init
  ,checkUpdate:checkUpdate
  ,rm:rm
  ,rmURL:rmURL
  ,getFileURL:getFileURL
  ,getDownloadSize:getDownloadSize
  ,writeFile:writeFile
  ,readFile:readFile
  ,download:download
  ,queryQuota:queryQuota}

  module.exports=API;
});
require.register("ksana-document/kdbfs_android.js", function(exports, require, module){
/*
  JAVA can only return Number and String
	array and buffer return in string format
	need JSON.parse
*/
var verbose=1;

var readSignature=function(pos,cb) {
	console.debug("read signature");
	var signature=kfs.readUTF8String(this.handle,pos,1);
	console.debug(signature,signature.charCodeAt(0));
	cb.apply(this,[signature]);
}
var readI32=function(pos,cb) {
	console.debug("read i32 at "+pos);
	var i32=kfs.readInt32(this.handle,pos);
	console.debug(i32);
	cb.apply(this,[i32]);	
}
var readUI32=function(pos,cb) {
	console.debug("read ui32 at "+pos);
	var ui32=kfs.readUInt32(this.handle,pos);
	console.debug(ui32);
	cb.apply(this,[ui32]);
}
var readUI8=function(pos,cb) {
	console.debug("read ui8 at "+pos); 
	var ui8=kfs.readUInt8(this.handle,pos);
	console.debug(ui8);
	cb.apply(this,[ui8]);
}
var readBuf=function(pos,blocksize,cb) {
	console.debug("read buffer at "+pos+ " blocksize "+blocksize);
	var buf=kfs.readBuf(this.handle,pos,blocksize);
	var buff=JSON.parse(buf);
	console.debug("buffer length"+buff.length);
	cb.apply(this,[buff]);	
}
var readBuf_packedint=function(pos,blocksize,count,reset,cb) {
	console.debug("read packed int at "+pos+" blocksize "+blocksize+" count "+count);
	var buf=kfs.readBuf_packedint(this.handle,pos,blocksize,count,reset);
	var adv=parseInt(buf);
	var buff=JSON.parse(buf.substr(buf.indexOf("[")));
	console.debug("packedInt length "+buff.length+" first item="+buff[0]);
	cb.apply(this,[{data:buff,adv:adv}]);	
}


var readString= function(pos,blocksize,encoding,cb) {
	console.debug("readstring at "+pos+" blocksize " +blocksize+" enc:"+encoding);
	if (encoding=="ucs2") {
		var str=kfs.readULE16String(this.handle,pos,blocksize);
	} else {
		var str=kfs.readUTF8String(this.handle,pos,blocksize);	
	}	 
	console.debug(str);
	cb.apply(this,[str]);	
}

var readFixedArray = function(pos ,count, unitsize,cb) {
	console.debug("read fixed array at "+pos+" count "+count+" unitsize "+unitsize); 
	var buf=kfs.readFixedArray(this.handle,pos,count,unitsize);
	var buff=JSON.parse(buf);
	console.debug("array length"+buff.length);
	cb.apply(this,[buff]);	
}
var readStringArray = function(pos,blocksize,encoding,cb) {
	console.log("read String array at "+pos+" blocksize "+blocksize +" enc "+encoding); 
	encoding = encoding||"utf8";
	var buf=kfs.readStringArray(this.handle,pos,blocksize,encoding);
	//var buff=JSON.parse(buf);
	console.debug("read string array");
	var buff=buf.split("\uffff"); //cannot return string with 0
	console.debug("array length"+buff.length);
	cb.apply(this,[buff]);	
}
var mergePostings=function(positions,cb) {
	var buf=kfs.mergePostings(this.handle,JSON.stringify(positions));
	if (!buf || buf.length==0) return [];
	else return JSON.parse(buf);
}

var free=function() {
	//console.log('closing ',handle);
	kfs.close(this.handle);
}
var Open=function(path,opts,cb) {
	opts=opts||{};
	var signature_size=1;
	var setupapi=function() { 
		this.readSignature=readSignature;
		this.readI32=readI32;
		this.readUI32=readUI32;
		this.readUI8=readUI8;
		this.readBuf=readBuf;
		this.readBuf_packedint=readBuf_packedint;
		this.readFixedArray=readFixedArray;
		this.readString=readString;
		this.readStringArray=readStringArray;
		this.signature_size=signature_size;
		this.mergePostings=mergePostings;
		this.free=free;
		this.size=kfs.getFileSize(this.handle);
		console.log("filesize  "+this.size);
		if (cb)	cb.call(this);
	}

	this.handle=kfs.open(path);
	this.opened=true;
	setupapi.call(this);
	return this;
}

module.exports=Open;
});
require.register("ksana-document/kdbfs_ios.js", function(exports, require, module){
/*
  JSContext can return all Javascript types.
*/
var verbose=1;

var readSignature=function(pos,cb) {
	if (verbose)  ksanagap.log("read signature at "+pos);
	var signature=kfs.readUTF8String(this.handle,pos,1);
	if (verbose)  ksanagap.log(signature+" "+signature.charCodeAt(0));
	cb.apply(this,[signature]);
}
var readI32=function(pos,cb) {
	if (verbose)  ksanagap.log("read i32 at "+pos);
	var i32=kfs.readInt32(this.handle,pos);
	if (verbose)  ksanagap.log(i32);
	cb.apply(this,[i32]);	
}
var readUI32=function(pos,cb) {
	if (verbose)  ksanagap.log("read ui32 at "+pos);
	var ui32=kfs.readUInt32(this.handle,pos);
	if (verbose)  ksanagap.log(ui32);
	cb.apply(this,[ui32]);
}
var readUI8=function(pos,cb) {
	if (verbose)  ksanagap.log("read ui8 at "+pos); 
	var ui8=kfs.readUInt8(this.handle,pos);
	if (verbose)  ksanagap.log(ui8);
	cb.apply(this,[ui8]);
}
var readBuf=function(pos,blocksize,cb) {
	if (verbose)  ksanagap.log("read buffer at "+pos);
	var buf=kfs.readBuf(this.handle,pos,blocksize);
	if (verbose)  ksanagap.log("buffer length"+buf.length);
	cb.apply(this,[buf]);	
}
var readBuf_packedint=function(pos,blocksize,count,reset,cb) {
	if (verbose)  ksanagap.log("read packed int fast, blocksize "+blocksize+" at "+pos);var t=new Date();
	var buf=kfs.readBuf_packedint(this.handle,pos,blocksize,count,reset);
	if (verbose)  ksanagap.log("return from packedint, time" + (new Date()-t));
	if (typeof buf.data=="string") {
		buf.data=eval("["+buf.data.substr(0,buf.data.length-1)+"]");
	}
	if (verbose)  ksanagap.log("unpacked length"+buf.data.length+" time" + (new Date()-t) );
	cb.apply(this,[buf]);
}


var readString= function(pos,blocksize,encoding,cb) {

	if (verbose)  ksanagap.log("readstring at "+pos+" blocksize "+blocksize+" "+encoding);var t=new Date();
	if (encoding=="ucs2") {
		var str=kfs.readULE16String(this.handle,pos,blocksize);
	} else {
		var str=kfs.readUTF8String(this.handle,pos,blocksize);	
	}
	if (verbose)  ksanagap.log(str+" time"+(new Date()-t));
	cb.apply(this,[str]);	
}

var readFixedArray = function(pos ,count, unitsize,cb) {
	if (verbose)  ksanagap.log("read fixed array at "+pos); var t=new Date();
	var buf=kfs.readFixedArray(this.handle,pos,count,unitsize);
	if (verbose)  ksanagap.log("array length "+buf.length+" time"+(new Date()-t));
	cb.apply(this,[buf]);	
}
var readStringArray = function(pos,blocksize,encoding,cb) {
	//if (verbose)  ksanagap.log("read String array "+blocksize +" "+encoding); 
	encoding = encoding||"utf8";
	if (verbose)  ksanagap.log("read string array at "+pos);var t=new Date();
	var buf=kfs.readStringArray(this.handle,pos,blocksize,encoding);
	if (typeof buf=="string") buf=buf.split("\0");
	//var buff=JSON.parse(buf);
	//var buff=buf.split("\uffff"); //cannot return string with 0
	if (verbose)  ksanagap.log("string array length"+buf.length+" time"+(new Date()-t));
	cb.apply(this,[buf]);
}

var mergePostings=function(positions) {
	var buf=kfs.mergePostings(this.handle,positions);
	if (typeof buf=="string") {
		buf=eval("["+buf.substr(0,buf.length-1)+"]");
	}
	return buf;
}
var free=function() {
	////if (verbose)  ksanagap.log('closing ',handle);
	kfs.close(this.handle);
}
var Open=function(path,opts,cb) {
	opts=opts||{};
	var signature_size=1;
	var setupapi=function() { 
		this.readSignature=readSignature;
		this.readI32=readI32;
		this.readUI32=readUI32;
		this.readUI8=readUI8;
		this.readBuf=readBuf;
		this.readBuf_packedint=readBuf_packedint;
		this.readFixedArray=readFixedArray;
		this.readString=readString;
		this.readStringArray=readStringArray;
		this.signature_size=signature_size;
		this.mergePostings=mergePostings;
		this.free=free;
		this.size=kfs.getFileSize(this.handle);
		if (verbose)  ksanagap.log("filesize  "+this.size);
		if (cb)	cb.call(this);
	}

	this.handle=kfs.open(path);
	this.opened=true;
	setupapi.call(this);
	return this;
}

module.exports=Open;
});
require.register("ksana-document/kse.js", function(exports, require, module){
/*
  Ksana Search Engine.

  need a KDE instance to be functional
  
*/
var bsearch=require("./bsearch");

var _search=function(engine,q,opts,cb) {
	if (typeof engine=="string") {//browser only
		//search on remote server
		var kde=Require("ksana-document").kde;
		var $kse=Require("ksanaforge-kse").$yase; 
		opts.dbid=engine;
		opts.q=q;
		$kse.search(opts,cb);
	} else {//nw or brower
		var dosearch=require("./search");
		return dosearch(engine,q,opts,cb);		
	}
}

var _highlightPage=function(engine,fileid,pageid,opts,cb){
	if (opts.q) {
		_search(engine,opts.q,opts,function(Q){
			api.excerpt.highlightPage(Q,fileid,pageid,opts,cb);
		});
	} else {
		api.excerpt.getPage(engine,fileid,pageid,cb);
	}
}
var _highlightRange=function(engine,start,end,opts,cb){
	if (opts.q) {
		_search(engine,opts.q,opts,function(Q){
			api.excerpt.highlightRange(Q,start,end,opts,cb);
		});
	} else {
		api.excerpt.getRange(engine,start,end,cb);
	}
}
var _highlightFile=function(engine,fileid,opts,cb){
	if (opts.q) {
		_search(engine,opts.q,opts,function(Q){
			api.excerpt.highlightFile(Q,fileid,opts,cb);
		});
	} else {
		api.excerpt.getFile(engine,fileid,cb);
	}
}

var vpos2filepage=function(engine,vpos) {
    var pageOffsets=engine.get("pageOffsets");
    var fileOffsets=engine.get(["fileOffsets"]);
    var pageNames=engine.get("pageNames");
    var fileid=bsearch(fileOffsets,vpos+1,true);
    fileid--;
    var pageid=bsearch(pageOffsets,vpos+1,true);
    pageid--;
    while (pageid&&pageid<pageOffsets.length-1&&
    	pageOffsets[pageid-1]==pageOffsets[pageid]) {
    	pageid++;
    }

    var fileOffset=fileOffsets[fileid];
    var pageOffset=bsearch(pageOffsets,fileOffset+1,true);
    pageOffset--;
    pageid-=pageOffset;
    return {file:fileid,page:pageid};
}
var api={
	search:_search
	,concordance:require("./concordance")
	,regex:require("./regex")
	,highlightPage:_highlightPage
	,highlightFile:_highlightFile
//	,highlightRange:_highlightRange
	,excerpt:require("./excerpt")
	,vpos2filepage:vpos2filepage
}
module.exports=api;
});
require.register("ksana-document/kde.js", function(exports, require, module){
/* Ksana Database Engine
   middleware for client and server.
   each ydb has one engine instance.
   all data from server will be cache at client side to save network roundtrip.
*/
if (typeof nodeRequire=='undefined') var nodeRequire=(typeof ksana=="undefined")?require:ksana.require;
var pool={},localPool={};
var apppath="";
var bsearch=require("./bsearch");
var strsep="\uffff";
var _getSync=function(paths,opts) {
	var out=[];
	for (var i in paths) {
		out.push(this.getSync(paths[i],opts));	
	}
	return out;
}
var _gets=function(paths,opts,cb) { //get many data with one call
	if (!paths) return ;
	if (typeof paths=='string') {
		paths=[paths];
	}
	var engine=this, output=[];

	var makecb=function(path){
		return function(data){
				if (!(data && typeof data =='object' && data.__empty)) output.push(data);
				engine.get(path,opts,taskqueue.shift());
		};
	};

	var taskqueue=[];
	for (var i=0;i<paths.length;i++) {
		if (typeof paths[i]=="null") { //this is only a place holder for key data already in client cache
			output.push(null);
		} else {
			taskqueue.push(makecb(paths[i]));
		}
	};

	taskqueue.push(function(data){
		output.push(data);
		cb.apply(engine.context||engine,[output,paths]); //return to caller
	});

	taskqueue.shift()({__empty:true}); //run the task
}

var toDoc=function(pagenames,texts,others) {
	if (typeof Require!="undefined") {
		var D=Require("ksana-document").document;
	} else {
		var D=nodeRequire("./document");	
	}
	var d=D.createDocument() ,revert=null;
	for (var i=0;i<texts.length;i++) {
		if (others.reverts && others.reverts[i].trim()) revert=JSON.parse(others.reverts[i]);
		else revert=null;
		var p=null;
		if (others.parents) p=others.parents[i];
		d.createPage({n:pagenames[i],t:texts[i],p:p,r:revert});
	}
	if (others.markups) d.addMarkups(others.markups);
	d.endCreatePages();
	return d;
}
var getFileRange=function(i) {
	var engine=this;
	var fileNames=engine.get(["fileNames"]);
	var fileOffsets=engine.get(["fileOffsets"]);
	var pageOffsets=engine.get(["pageOffsets"]);
	var pageNames=engine.get(["pageNames"]);
	var fileStart=fileOffsets[i], fileEnd=fileOffsets[i+1]-1;

	
	var start=bsearch(pageOffsets,fileStart,true);	
	//if (pageOffsets[start]==fileStart) start--;
	
	//work around for jiangkangyur
	while (pageNames[start+1]=="_") start++;

  //if (i==0) start=0; //work around for first file
	var end=bsearch(pageOffsets,fileEnd,true);


	//in case of items with same value
	//return the last one
	
	
	
	//while (pageOffsets[end+1]==pageOffsets[end]) end--;
	/*
	if (i==0) {
		var files="", offsets=""
		for (var i=0;i<33;i++) offsets+=i+"."+fileOffsets[i]+"="+fileNames[i]+"\n";
		console.log(files);
		
		for (var i=0;i<700;i++) offsets+=i+"."+pageOffsets[i]+"="+pageNames[i]+"\n";
		console.log(offsets);
	}
	*/
	return {start:start,end:end};
}

var getfp=function(absolutepage) {
	var fileOffsets=this.get(["fileOffsets"]);
	var pageOffsets=this.get(["pageOffsets"]);
	var pageoffset=pageOffsets[absolutepage];
	var file=bsearch(fileOffsets,pageoffset,true)-1;

	var fileStart=fileOffsets[file];
	var start=bsearch(pageOffsets,fileStart,true);	

	var page=absolutepage-start-1;
	return {file:file,page:page};
}
//return array of object of nfile npage given pagename
var findPage=function(pagename) {
	var pagenames=this.get("pageNames");
	var out=[];
	for (var i=0;i<pagenames.length;i++) {
		if (pagenames[i]==pagename) {
			var fp=getfp.apply(this,[i]);
			out.push({file:fp.file,page:fp.page,abspage:i});
		}
	}

	return out;
}
var getFilePageOffsets=function(i) {
	var pageOffsets=this.get("pageOffsets");
	var range=getFileRange.apply(this,[i]);
	return pageOffsets.slice(range.start,range.end+1);
}

var getFilePageNames=function(i) {
	var range=getFileRange.apply(this,[i]);
	var pageNames=this.get("pageNames");
	return pageNames.slice(range.start,range.end+1);
}
var getDocument=function(filename,markups,cb){
	var engine=this;
	var filenames=engine.get("fileNames");

	if (typeof markups=="function")  { //no markups
		cb=markups;
		markups=null;
	}

	var i=filenames.indexOf(filename);
	if (i==-1) {
		cb(null);
	} else {
		var pagenames=getFilePageNames.apply(engine,[i]);
		var files=engine.get(["files",i],true,function(file){
			var parentId=null,reverts=null;
			if (file) {
				parentId=file.parentId;
				reverts=file.reverts;
			}
			engine.get(["fileContents",i],true,function(data){
				cb(toDoc(pagenames,data,{parents:parentId,reverts:reverts,markups:markups}));
			});			
		});
	}
}
var createLocalEngine=function(kdb,cb,context) {
	var engine={kdb:kdb, queryCache:{}, postingCache:{}, cache:{}};
	if ((kdb.fs && kdb.fs.html5fs) || typeof ksanagap!="undefined") {
		var customfunc=Require("ksana-document").customfunc;
	} else {
		var customfunc=nodeRequire("ksana-document").customfunc;		
	}	

	if (typeof context=="object") engine.context=context;
	engine.get=function(path,opts,cb) {
		if (typeof opts=="function") {
			cb=opts;
			opts={recursive:false};
		}
		if (!path) {
			if (cb) cb(null);
			return null;
		}
		if (typeof cb!="function") {
			return engine.kdb.get(path,opts);
		}

		if (typeof path=="string") {
			return engine.kdb.get([path],opts,cb);
		} else if (typeof path[0] =="string") {
			return engine.kdb.get(path,opts,cb);
		} else if (typeof path[0] =="object") {
			return _gets.apply(engine,[path,opts,cb]);
		} else {
			cb(null);	
		}
	};	

	engine.fileOffset=fileOffset;
	engine.folderOffset=folderOffset;
	engine.pageOffset=pageOffset;
	engine.getDocument=getDocument;
	engine.getFilePageNames=getFilePageNames;
	engine.getFilePageOffsets=getFilePageOffsets;
	engine.findPage=findPage;
	//only local engine allow getSync
	if (kdb.fs.getSync) engine.getSync=engine.kdb.getSync;
	
	//speedy native functions
	if (kdb.fs.mergePostings) {
		engine.mergePostings=kdb.fs.mergePostings.bind(kdb.fs);
	}
	
	var preload=[["meta"],["fileNames"],["fileOffsets"],
	["tokens"],["postingslen"],["pageNames"],["pageOffsets"]];

	var setPreload=function(res) {
		engine.dbname=res[0].name;
		engine.customfunc=customfunc.getAPI(res[0].config);
		engine.ready=true;
	}
	var opts={recursive:true};
	if (typeof cb=="function") {
		_gets.apply(engine,[  preload, opts,function(res){
			setPreload(res);
			cb.apply(engine.context,[engine]);
		}]);
	} else {
		setPreload(_getSync.apply(engine,[preload,opts]));
	}
	return engine;
}

var getRemote=function(path,opts,cb) {
	var $kse=Require("ksanaforge-kse").$ksana; 
	var engine=this;
	if (!engine.ready) {
		console.error("remote connection not established yet");
		return;
	} 
	if (typeof opts=="function") {
		cb=opts;
		opts={recursive:false};
	}
	opts.recursive=opts.recursive||false;
	if (typeof path=="string") path=[path];

	if (path[0] instanceof Array) { //multiple paths
		var paths=[],output=[];
		for (var i=0;i<path.length;i++) {
			var cachepath=path[i].join(strsep);
			var data=engine.cache[cachepath];
			if (typeof data!="undefined") {
				paths.push(null);//  place holder for LINE 28
				output.push(data); //put cached data into output
			} else{
				engine.fetched++;
				paths.push(path[i]); //need to ask server
				output.push(null); //data is unknown yet
			}
		}
		//now ask server for unknown datum
		engine.traffic++;
		var newopts={recursive:!!opts.recursive, address:opts.address,
			key:paths,db:engine.kdbid};
		$kse("get",newopts).done(function(datum){
			//merge the server result with cached 
			for (var i=0;i<output.length;i++) {
				if (datum[i] && paths[i]) {
					var cachekey=paths[i].join(strsep);
					engine.cache[cachepath]=datum[i];
					output[i]=datum[i];
				}
			}
			cb.apply(engine.context,[output]);	
		});
	} else { //single path
		var cachepath=path.join(strsep);
		var data=engine.cache[cachepath];
		if (typeof data!="undefined") {
			if (cb) cb.apply(engine.context,[data]);
			return data;//in cache , return immediately
		} else {
			engine.traffic++;
			engine.fetched++;
			var opts={key:path,recursive:recursive,db:engine.kdbid};
			$kse("get",opts).done(function(data){
				engine.cache[cachepath]=data;
				if (cb) cb.apply(engine.context,[data]);	
			});
		}
	}
}
var pageOffset=function(pagename) {
	var engine=this;
	if (arguments.length>1) throw "argument : pagename ";

	var pageNames=engine.get("pageNames");
	var pageOffsets=engine.get("pageOffsets");

	var i=pageNames.indexOf(pagename);
	return (i>-1)?pageOffsets[i]:0;
}
var fileOffset=function(fn) {
	var engine=this;
	var filenames=engine.get("fileNames");
	var offsets=engine.get("fileOffsets");
	var i=filenames.indexOf(fn);
	if (i==-1) return null;
	return {start: offsets[i], end:offsets[i+1]};
}

var folderOffset=function(folder) {
	var engine=this;
	var start=0,end=0;
	var filenames=engine.get("fileNames");
	var offsets=engine.get("fileOffsets");
	for (var i=0;i<filenames.length;i++) {
		if (filenames[i].substring(0,folder.length)==folder) {
			if (!start) start=offsets[i];
			end=offsets[i];
		} else if (start) break;
	}
	return {start:start,end:end};
}

var createEngine=function(kdbid,context,cb) {
	if (typeof context=="function"){
		cb=context;
	}
	//var link=Require("./link");
	var customfunc=Require("ksana-document").customfunc;
	var $kse=Require("ksanaforge-kse").$ksana; 
	var engine={kdbid:kdbid, cache:{} , 
	postingCache:{}, queryCache:{}, traffic:0,fetched:0};
	engine.setContext=function(ctx) {this.context=ctx};
	engine.get=getRemote;
	engine.fileOffset=fileOffset;
	engine.folderOffset=folderOffset;
	engine.pageOffset=pageOffset;
	engine.getDocument=getDocument;
	engine.getFilePageNames=getFilePageNames;
	engine.getFilePageOffsets=getFilePageOffsets;
	engine.findPage=findPage;

	if (typeof context=="object") engine.context=context;

	//engine.findLinkBy=link.findLinkBy;
	$kse("get",{key:[["meta"],["fileNames"],["fileOffsets"],["tokens"],["postingslen"],,["pageNames"],["pageOffsets"]], 
		recursive:true,db:kdbid}).done(function(res){
		engine.dbname=res[0].name;

		engine.cache["fileNames"]=res[1];
		engine.cache["fileOffsets"]=res[2];
		engine.cache["tokens"]=res[3];
		engine.cache["postingslen"]=res[4];
		engine.cache["pageNames"]=res[5];
		engine.cache["pageOffsets"]=res[6];

//		engine.cache["tokenId"]=res[4];
//		engine.cache["files"]=res[2];

		engine.customfunc=customfunc.getAPI(res[0].config);
		engine.cache["meta"]=res[0]; //put into cache manually

		engine.ready=true;
		//console.log("remote kde connection ["+kdbid+"] established.");
		if (cb) cb.apply(context,[engine]);
	})


	return engine;
}
 //TODO delete directly from kdb instance
 //kdb.free();
var closeLocal=function(kdbid) {
	var engine=localPool[kdbid];
	if (engine) {
		engine.kdb.free();
		delete localPool[kdbid];
	}
}
var close=function(kdbid) {
	var engine=pool[kdbid];
	if (engine) {
		engine.kdb.free();
		delete pool[kdbid];
	}
}
var open=function(kdbid,cb,context) {
	if (typeof io=="undefined") { //for offline mode
		return openLocal(kdbid,cb,context);
	}

	var engine=pool[kdbid];
	if (engine) {
		if (cb) cb.apply(context||engine.context,[engine]);
		return engine;
	}
	engine=createEngine(kdbid,context,cb);

	pool[kdbid]=engine;
	return engine;
}
var getLocalTries=function(kdbfn) {
	return ["./"+kdbfn  //TODO , allow any depth
	           ,apppath+"/"+kdbfn,
	           ,apppath+"/ksana_databases/"+kdbfn
	           ,apppath+"/"+kdbfn,
	           ,"./ksana_databases/"+kdbfn
	           ,"../"+kdbfn
	           ,"../ksana_databases/"+kdbfn
	           ,"../../"+kdbfn
	           ,"../../ksana_databases/"+kdbfn
	           ,"../../../"+kdbfn
	           ,"../../../ksana_databases/"+kdbfn
	           ];
}
var openLocalKsanagap=function(kdbid,cb,context) {
	var engine=localPool[kdbid];
	if (engine) {
		if (cb) cb.apply(context||engine.context,[engine]);
		return engine;
	}

	var Kdb=Require('ksana-document').kdb;
	var kdbfn=kdbid;
	if (kdbfn.indexOf(".kdb")==-1) kdbfn+=".kdb";

	var tries=getLocalTries(kdbfn);

	for (var i=0;i<tries.length;i++) {
		if (fs.existsSync(tries[i])) {
			//console.log("kdb path: "+nodeRequire('path').resolve(tries[i]));
			var kdb=new Kdb(tries[i]);
			createLocalEngine(kdb,function(engine){
				localPool[kdbid]=engine;
				cb.apply(context||engine.context,[engine]);
			},context);
			return null;
		}
	}
	if (cb) cb(null);
	return null;

}
var openLocalNode=function(kdbid,cb,context) {
	var fs=nodeRequire('fs');
	var engine=localPool[kdbid];
	if (engine) {
		if (cb) cb.apply(context||engine.context,[engine]);
		return engine;
	}

	var Kdb=nodeRequire('ksana-document').kdb;
	var kdbfn=kdbid;
	if (kdbfn.indexOf(".kdb")==-1) kdbfn+=".kdb";

	var tries=getLocalTries(kdbfn);

	for (var i=0;i<tries.length;i++) {
		if (fs.existsSync(tries[i])) {
			//console.log("kdb path: "+nodeRequire('path').resolve(tries[i]));
			new Kdb(tries[i],function(kdb){
				createLocalEngine(kdb,function(engine){
						localPool[kdbid]=engine;
						cb.apply(context||engine.context,[engine]);
				},context);
			});
			return engine;
		}
	}
	if (cb) cb(null);
	return null;
}

var openLocalHtml5=function(kdbid,cb,context) {
	var Kdb=Require('ksana-document').kdb;
	
	var engine=localPool[kdbid];
	if (engine) {
		if (cb) cb.apply(context||engine.context,[engine]);
		return engine;
	}
	var Kdb=Require('ksana-document').kdb;
	var kdbfn=kdbid;
	if (kdbfn.indexOf(".kdb")==-1) kdbfn+=".kdb";
	new Kdb(kdbfn,function(handle){
		createLocalEngine(handle,function(engine){
			localPool[kdbid]=engine;
			cb.apply(context||engine.context,[engine]);
		},context);		
	});
}
//omit cb for syncronize open
var openLocal=function(kdbid,cb,context)  {
	if (typeof ksanagap=="undefined") {
		if (kdbid.indexOf("filesystem:")>-1 || typeof process=="undefined") {
			openLocalHtml5(kdbid,cb,context);
		} else {
			openLocalNode(kdbid,cb,context);
		}		
	} else {
		if (ksanagap.platform=="node-webkit") {
			openLocalNode(kdbid,cb,context);
		} else {
			openLocalKsanagap(kdbid,cb,context);	
		}
		
	}
}
var setPath=function(path) {
	apppath=path;
	console.log("set path",path)
}

var enumKdb=function(cb,context){
	Require("ksana-document").html5fs.readdir(function(out){
		cb.apply(this,[out]);
	},context||this);
}

module.exports={openLocal:openLocal, open:open, close:close, 
	setPath:setPath, closeLocal:closeLocal, enumKdb:enumKdb};
});
require.register("ksana-document/boolsearch.js", function(exports, require, module){
/*
  TODO
  and not

*/

// http://jsfiddle.net/neoswf/aXzWw/
var plist=require('./plist');
function intersect(I, J) {
  var i = j = 0;
  var result = [];

  while( i < I.length && j < J.length ){
     if      (I[i] < J[j]) i++; 
     else if (I[i] > J[j]) j++; 
     else {
       result[result.length]=l[i];
       i++;j++;
     }
  }
  return result;
}

/* return all items in I but not in J */
function subtract(I, J) {
  var i = j = 0;
  var result = [];

  while( i < I.length && j < J.length ){
    if (I[i]==J[j]) {
      i++;j++;
    } else if (I[i]<J[j]) {
      while (I[i]<J[j]) result[result.length]= I[i++];
    } else {
      while(J[j]<I[i]) j++;
    }
  }

  if (j==J.length) {
    while (i<I.length) result[result.length]=I[i++];
  }

  return result;
}

var union=function(a,b) {
	if (!a || !a.length) return b;
	if (!b || !b.length) return a;
    var result = [];
    var ai = 0;
    var bi = 0;
    while (true) {
        if ( ai < a.length && bi < b.length) {
            if (a[ai] < b[bi]) {
                result[result.length]=a[ai];
                ai++;
            } else if (a[ai] > b[bi]) {
                result[result.length]=b[bi];
                bi++;
            } else {
                result[result.length]=a[ai];
                result[result.length]=b[bi];
                ai++;
                bi++;
            }
        } else if (ai < a.length) {
            result.push.apply(result, a.slice(ai, a.length));
            break;
        } else if (bi < b.length) {
            result.push.apply(result, b.slice(bi, b.length));
            break;
        } else {
            break;
        }
    }
    return result;
}
var OPERATION={'include':intersect, 'union':union, 'exclude':subtract};

var boolSearch=function(opts) {
  opts=opts||{};
  ops=opts.op||this.opts.op;
  this.docs=[];
	if (!this.phrases.length) return;
	var r=this.phrases[0].docs;
  /* ignore operator of first phrase */
	for (var i=1;i<this.phrases.length;i++) {
		var op= ops[i] || 'union';
		r=OPERATION[op](r,this.phrases[i].docs);
	}
	this.docs=plist.unique(r);
	return this;
}
module.exports={search:boolSearch}
});
require.register("ksana-document/search.js", function(exports, require, module){
var plist=require("./plist");
var boolsearch=require("./boolsearch");
var excerpt=require("./excerpt");
var parseTerm = function(engine,raw,opts) {
	if (!raw) return;
	var res={raw:raw,variants:[],term:'',op:''};
	var term=raw, op=0;
	var firstchar=term[0];
	var termregex="";
	if (firstchar=='-') {
		term=term.substring(1);
		firstchar=term[0];
		res.exclude=true; //exclude
	}
	term=term.trim();
	var lastchar=term[term.length-1];
	term=engine.customfunc.normalize(term);
	
	if (term.indexOf("%")>-1) {
		var termregex="^"+term.replace(/%+/g,".*")+"$";
		if (firstchar=="%") 	termregex=".*"+termregex.substr(1);
		if (lastchar=="%") 	termregex=termregex.substr(0,termregex.length-1)+".*";
	}

	if (termregex) {
		res.variants=expandTerm(engine,termregex);
	}

	res.key=term;
	return res;
}
var expandTerm=function(engine,regex) {
	var r=new RegExp(regex);
	var tokens=engine.get("tokens");
	var postingslen=engine.get("postingslen");
	var out=[];
	for (var i=0;i<tokens.length;i++) {
		var m=tokens[i].match(r);
		if (m) {
			out.push([m[0],postingslen[i]]);
		}
	}
	out.sort(function(a,b){return b[1]-a[1]});
	return out;
}
var isWildcard=function(raw) {
	return !!raw.match(/[\*\?]/);
}

var isOrTerm=function(term) {
	term=term.trim();
	return (term[term.length-1]===',');
}
var orterm=function(engine,term,key) {
		var t={text:key};
		if (engine.customfunc.simplifiedToken) {
			t.simplified=engine.customfunc.simplifiedToken(key);
		}
		term.variants.push(t);
}
var orTerms=function(engine,tokens,now) {
	var raw=tokens[now];
	var term=parseTerm(engine,raw);
	if (!term) return;
	orterm(engine,term,term.key);
	while (isOrTerm(raw))  {
		raw=tokens[++now];
		var term2=parseTerm(engine,raw);
		orterm(engine,term,term2.key);
		for (var i in term2.variants){
			term.variants[i]=term2.variants[i];
		}
		term.key+=','+term2.key;
	}
	return term;
}

var getOperator=function(raw) {
	var op='';
	if (raw[0]=='+') op='include';
	if (raw[0]=='-') op='exclude';
	return op;
}
var parsePhrase=function(q) {
	var match=q.match(/(".+?"|'.+?'|\S+)/g)
	match=match.map(function(str){
		var n=str.length, h=str.charAt(0), t=str.charAt(n-1)
		if (h===t&&(h==='"'|h==="'")) str=str.substr(1,n-2)
		return str;
	})
	return match;
}
var parseWildcard=function(raw) {
	var n=parseInt(raw,10) || 1;
	var qcount=raw.split('?').length-1;
	var scount=raw.split('*').length-1;
	var type='';
	if (qcount) type='?';
	else if (scount) type='*';
	return {wildcard:type, width: n , op:'wildcard'};
}

var newPhrase=function() {
	return {termid:[],posting:[],raw:''};
} 
var parseQuery=function(q) {
	var match=q.match(/(".+?"|'.+?'|\S+)/g)
	match=match.map(function(str){
		var n=str.length, h=str.charAt(0), t=str.charAt(n-1)
		if (h===t&&(h==='"'|h==="'")) str=str.substr(1,n-2)
		return str
	})
	//console.log(input,'==>',match)
	return match;
}
var loadPhrase=function(phrase) {
	/* remove leading and ending wildcard */
	var Q=this;
	var cache=Q.engine.postingCache;
	if (cache[phrase.key]) {
		phrase.posting=cache[phrase.key];
		return Q;
	}
	if (phrase.termid.length==1) {
		cache[phrase.key]=phrase.posting=Q.terms[phrase.termid[0]].posting;
		return Q;
	}

	var i=0, r=[],dis=0;
	while(i<phrase.termid.length) {
	  var T=Q.terms[phrase.termid[i]];
		if (0 === i) {
			r = T.posting;
		} else {
		    if (T.op=='wildcard') {
		    	T=Q.terms[phrase.termid[i++]];
		    	var width=T.width;
		    	var wildcard=T.wildcard;
		    	T=Q.terms[phrase.termid[i]];
		    	var mindis=dis;
		    	if (wildcard=='?') mindis=dis+width;
		    	if (T.exclude) r = plist.plnotfollow2(r, T.posting, mindis, dis+width);
		    	else r = plist.plfollow2(r, T.posting, mindis, dis+width);		    	
		    	dis+=(width-1);
		    }else {
		    	if (T.posting) {
		    		if (T.exclude) r = plist.plnotfollow(r, T.posting, dis);
		    		else r = plist.plfollow(r, T.posting, dis);
		    	}
		    }
		}
		dis++;	i++;
		if (!r) return Q;
  }
  phrase.posting=r;
  cache[phrase.key]=r;
  return Q;
}
var trimSpace=function(engine,query) {
	var i=0;
	var isSkip=engine.customfunc.isSkip;
	while (isSkip(query[i]) && i<query.length) i++;
	return query.substring(i);
}
var getPageWithHit=function(fileid,offsets) {
	var Q=this,engine=Q.engine;
	var pagewithhit=plist.groupbyposting2(Q.byFile[fileid ], offsets);
	pagewithhit.shift(); //the first item is not used (0~Q.byFile[0] )
	var out=[];
	pagewithhit.map(function(p,idx){if (p.length) out.push(idx)});
	return out;
}
var pageWithHit=function(fileid) {
	var Q=this,engine=Q.engine;
	var offsets=engine.getFilePageOffsets(fileid);
	return getPageWithHit.apply(this,[fileid,offsets]);
}
var isSimplePhrase=function(phrase) {
	var m=phrase.match(/[\?%^]/);
	return !m;
}
/* host has fast native function */
var fastPhrase=function(engine,phrase) {
	var phrase_term=newPhrase();
	var tokens=engine.customfunc.tokenize(phrase).tokens;
	var paths=postingPathFromTokens(engine,tokens);
	phrase_term.width=tokens.length; //for excerpt.js to getPhraseWidth
	engine.get(paths,{address:true},function(postingAddress){ //this is sync
		phrase_term.key=phrase;
		engine.postingCache[phrase]=engine.mergePostings(postingAddress);
	});
	return phrase_term;
	// put posting into cache[phrase.key]
}
var slowPhrase=function(engine,terms,phrase) {
	  var j=0,tokens=engine.customfunc.tokenize(phrase).tokens;
	  var phrase_term=newPhrase();

		while (j<tokens.length) {
			var raw=tokens[j];
			if (isWildcard(raw)) {
				if (phrase_term.termid.length==0)  { //skip leading wild card
					j++
					continue;
				}
				terms.push(parseWildcard(raw));
			} else if (isOrTerm(raw)){
				var term=orTerms.apply(this,[tokens,j]);
				terms.push(term);
				j+=term.key.split(',').length-1;
			} else {
				var term=parseTerm(engine,raw);
				var termidx=terms.map(function(a){return a.key}).indexOf(term.key);
				if (termidx==-1) terms.push(term);
			}
			phrase_term.termid.push(terms.length-1);
			j++;
		}
		phrase_term.key=phrase;
		//remove ending wildcard
		var P=phrase_term , T=null;
		do {
			T=terms[P.termid[P.termid.length-1]];
			if (!T) break;
			if (T.wildcard) P.termid.pop(); else break;
		} while(T);		
		return phrase_term;
}
var newQuery =function(engine,query,opts) {
	if (!query) return;
	opts=opts||{};
	query=trimSpace(engine,query);

	var phrases=query;
	if (typeof query=='string') {
		phrases=parseQuery(query);
	}
	
	var phrase_terms=[], terms=[],variants=[],operators=[];
	var pc=0;//phrase count
	for  (var i=0;i<phrases.length;i++) {
		var op=getOperator(phrases[pc]);
		if (op) phrases[pc]=phrases[pc].substring(1);

		/* auto add + for natural order ?*/
		//if (!opts.rank && op!='exclude' &&i) op='include';
		operators.push(op);

		if (isSimplePhrase(phrases[pc]) && engine.mergePostings ) {
			var phrase_term=fastPhrase(engine,phrases[pc]);
		} else {
			var phrase_term=slowPhrase(engine,terms,phrases[pc]);
		}
		phrase_terms.push(phrase_term);

		if (!engine.mergePostings && phrase_terms[pc].termid.length==0) {
			phrase_terms.pop();
		} else pc++;
	}
	opts.op=operators;

	var Q={dbname:engine.dbname,engine:engine,opts:opts,query:query,
		phrases:phrase_terms,terms:terms
	};
	Q.tokenize=function() {return engine.customfunc.tokenize.apply(engine,arguments);}
	Q.isSkip=function() {return engine.customfunc.isSkip.apply(engine,arguments);}
	Q.normalize=function() {return engine.customfunc.normalize.apply(engine,arguments);}
	Q.pageWithHit=pageWithHit;

	//Q.getRange=function() {return that.getRange.apply(that,arguments)};
	//API.queryid='Q'+(Math.floor(Math.random()*10000000)).toString(16);
	return Q;
}
var postingPathFromTokens=function(engine,tokens) {
	var alltokens=engine.get("tokens");
	   //var tokenIds=terms.map(function(t){return tokens[t.key]});
	var tokenIds=tokens.map(function(t){ return 1+alltokens.indexOf(t)});
	var postingid=[];
	for (var i=0;i<tokenIds.length;i++) {
		postingid.push( tokenIds[i]); // tokenId==0 , empty token
	}
	return postingid.map(function(t){return ["postings",t]});
}
var loadPostings=function(engine,tokens,cb) {
	tokens=tokens.filter(function(t){
		return !engine.postingCache[t.key]; //already in cache
	});
	if (tokens.length==0) {
		cb();
		return;
	}
	var postingPaths=postingPathFromTokens(engine,tokens.map(function(t){return t.key}));

	engine.get(postingPaths,function(postings){
		postings.map(function(p,i) { tokens[i].posting=p });
		if (cb) cb();
	});
}
var groupBy=function(Q,posting) {
	phrases.forEach(function(P){
		var key=P.key;
		var docfreq=docfreqcache[key];
		if (!docfreq) docfreq=docfreqcache[key]={};
		if (!docfreq[that.groupunit]) {
			docfreq[that.groupunit]={doclist:null,freq:null};
		}		
		if (P.posting) {
			var res=matchPosting(engine,P.posting);
			P.freq=res.freq;
			P.docs=res.docs;
		} else {
			P.docs=[];
			P.freq=[];
		}
		docfreq[that.groupunit]={doclist:P.docs,freq:P.freq};
	});
	return this;
}
var groupByFolder=function(engine,filehits) {
	var files=engine.get("fileNames");
	var prevfolder="",hits=0,out=[];
	for (var i=0;i<filehits.length;i++) {
		var fn=files[i];
		var folder=fn.substring(0,fn.indexOf('/'));
		if (prevfolder && prevfolder!=folder) {
			out.push(hits);
			hits=0;
		}
		hits+=filehits[i].length;
		prevfolder=folder;
	}
	out.push(hits);
	return out;
}
var phrase_intersect=function(engine,Q) {
	var intersected=null;
	var fileOffsets=Q.engine.get("fileOffsets");
	var empty=[],emptycount=0,hashit=0;
	for (var i=0;i<Q.phrases.length;i++) {
		var byfile=plist.groupbyposting2(Q.phrases[i].posting,fileOffsets);
		byfile.shift();byfile.pop();
		if (intersected==null) {
			intersected=byfile;
		} else {
			for (var j=0;j<byfile.length;j++) {
				if (!(byfile[j].length && intersected[j].length)) {
					intersected[j]=empty; //reuse empty array
					emptycount++;
				} else hashit++;
			}
		}
	}

	Q.byFile=intersected;
	Q.byFolder=groupByFolder(engine,Q.byFile);
	var out=[];
	//calculate new rawposting
	for (var i=0;i<Q.byFile.length;i++) {
		if (Q.byFile[i].length) out=out.concat(Q.byFile[i]);
	}
	Q.rawresult=out;
	countFolderFile(Q);
	//console.log(emptycount,hashit);
}
var countFolderFile=function(Q) {
	Q.fileWithHitCount=0;
	Q.byFile.map(function(f){if (f.length) Q.fileWithHitCount++});
			
	Q.folderWithHitCount=0;
	Q.byFolder.map(function(f){if (f) Q.folderWithHitCount++});
}
var main=function(engine,q,opts,cb){
	if (typeof opts=="function") cb=opts;
	opts=opts||{};
	var Q=engine.queryCache[q];
	if (!Q) Q=newQuery(engine,q,opts);
	if (!Q) {
		if (engine.context) cb.apply(engine.context,[{rawresult:[]}]);
		else cb({rawresult:[]});
		return;
	};
	engine.queryCache[q]=Q;
	loadPostings(engine,Q.terms,function(){
		if (!Q.phrases[0].posting) {
			cb.apply(engine.context,[{rawresult:[]}]);
			return;			
		}
		
		if (!Q.phrases[0].posting.length) { //
			Q.phrases.forEach(loadPhrase.bind(Q));
		}
		if (Q.phrases.length==1) {
			Q.rawresult=Q.phrases[0].posting;
		} else {
			phrase_intersect(engine,Q);
		}
		var fileOffsets=Q.engine.get("fileOffsets");
		//console.log("search opts "+JSON.stringify(opts));

		if (!Q.byFile && Q.rawresult && !opts.nogroup) {
			Q.byFile=plist.groupbyposting2(Q.rawresult, fileOffsets);
			Q.byFile.shift();Q.byFile.pop();
			Q.byFolder=groupByFolder(engine,Q.byFile);

			countFolderFile(Q);
		}

		if (opts.range) {
			excerpt.resultlist(engine,Q,opts,function(data) { 
				//console.log("excerpt ok");
				Q.excerpt=data;
				cb.apply(engine.context,[Q]);
			});
		} else {
			cb.apply(engine.context,[Q]);
		}		
	});
}

module.exports=main;
});
require.register("ksana-document/plist.js", function(exports, require, module){

var unpack = function (ar) { // unpack variable length integer list
  var r = [],
  i = 0,
  v = 0;
  do {
	var shift = 0;
	do {
	  v += ((ar[i] & 0x7F) << shift);
	  shift += 7;
	} while (ar[++i] & 0x80);
	r[r.length]=v;
  } while (i < ar.length);
  return r;
}

/*
   arr:  [1,1,1,1,1,1,1,1,1]
   levels: [0,1,1,2,2,0,1,2]
   output: [5,1,3,1,1,3,1,1]
*/

var groupsum=function(arr,levels) {
  if (arr.length!=levels.length+1) return null;
  var stack=[];
  var output=new Array(levels.length);
  for (var i=0;i<levels.length;i++) output[i]=0;
  for (var i=1;i<arr.length;i++) { //first one out of toc scope, ignored
    if (stack.length>levels[i-1]) {
      while (stack.length>levels[i-1]) stack.pop();
    }
    stack.push(i-1);
    for (var j=0;j<stack.length;j++) {
      output[stack[j]]+=arr[i];
    }
  }
  return output;
}
/* arr= 1 , 2 , 3 ,4 ,5,6,7 //token posting
  posting= 3 , 5  //tag posting
  out = 3 , 2, 2
*/
var countbyposting = function (arr, posting) {
  if (!posting.length) return [arr.length];
  var out=[];
  for (var i=0;i<posting.length;i++) out[i]=0;
  out[posting.length]=0;
  var p=0,i=0,lasti=0;
  while (i<arr.length && p<posting.length) {
    if (arr[i]<=posting[p]) {
      while (p<posting.length && i<arr.length && arr[i]<=posting[p]) {
        out[p]++;
        i++;
      }      
    } 
    p++;
  }
  out[posting.length] = arr.length-i; //remaining
  return out;
}

var groupbyposting=function(arr,gposting) { //relative vpos
  if (!gposting.length) return [arr.length];
  var out=[];
  for (var i=0;i<=gposting.length;i++) out[i]=[];
  
  var p=0,i=0,lasti=0;
  while (i<arr.length && p<gposting.length) {
    if (arr[i]<gposting[p]) {
      while (p<gposting.length && i<arr.length && arr[i]<gposting[p]) {
        var start=0;
        if (p>0) start=gposting[p-1];
        out[p].push(arr[i++]-start);  // relative
      }      
    } 
    p++;
  }
  //remaining
  while(i<arr.length) out[out.length-1].push(arr[i++]-gposting[gposting.length-1]);
  return out;
}
var groupbyposting2=function(arr,gposting) { //absolute vpos
  if (!gposting.length) return [arr.length];
  var out=[];
  for (var i=0;i<=gposting.length;i++) out[i]=[];
  
  var p=0,i=0,lasti=0;
  while (i<arr.length && p<gposting.length) {
    if (arr[i]<gposting[p]) {
      while (p<gposting.length && i<arr.length && arr[i]<gposting[p]) {
        var start=0;
        if (p>0) start=gposting[p-1]; //absolute
        out[p].push(arr[i++]);
      }      
    } 
    p++;
  }
  //remaining
  while(i<arr.length) out[out.length-1].push(arr[i++]-gposting[gposting.length-1]);
  return out;
}
var groupbyblock2 = function(ar, ntoken,slotshift,opts) {
  if (!ar.length) return [{},{}];
  
  slotshift = slotshift || 16;
  var g = Math.pow(2,slotshift);
  var i = 0;
  var r = {}, ntokens={};
  var groupcount=0;
  do {
    var group = Math.floor(ar[i] / g) ;
    if (!r[group]) {
      r[group] = [];
      ntokens[group]=[];
      groupcount++;
    }
    r[group].push(ar[i] % g);
    ntokens[group].push(ntoken[i]);
    i++;
  } while (i < ar.length);
  if (opts) opts.groupcount=groupcount;
  return [r,ntokens];
}
var groupbyslot = function (ar, slotshift, opts) {
  if (!ar.length)
	return {};
  
  slotshift = slotshift || 16;
  var g = Math.pow(2,slotshift);
  var i = 0;
  var r = {};
  var groupcount=0;
  do {
	var group = Math.floor(ar[i] / g) ;
	if (!r[group]) {
	  r[group] = [];
	  groupcount++;
	}
	r[group].push(ar[i] % g);
	i++;
  } while (i < ar.length);
  if (opts) opts.groupcount=groupcount;
  return r;
}
/*
var identity = function (value) {
  return value;
};
var sortedIndex = function (array, obj, iterator) { //taken from underscore
  iterator || (iterator = identity);
  var low = 0,
  high = array.length;
  while (low < high) {
	var mid = (low + high) >> 1;
	iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
  }
  return low;
};*/

var indexOfSorted = function (array, obj) { 
  var low = 0,
  high = array.length-1;
  while (low < high) {
    var mid = (low + high) >> 1;
    array[mid] < obj ? low = mid + 1 : high = mid;
  }
  return low;
};
var plhead=function(pl, pltag, opts) {
  opts=opts||{};
  opts.max=opts.max||1;
  var out=[];
  if (pltag.length<pl.length) {
    for (var i=0;i<pltag.length;i++) {
       k = indexOfSorted(pl, pltag[i]);
       if (k>-1 && k<pl.length) {
        if (pl[k]==pltag[i]) {
          out[out.length]=pltag[i];
          if (out.length>=opts.max) break;
        }
      }
    }
  } else {
    for (var i=0;i<pl.length;i++) {
       k = indexOfSorted(pltag, pl[i]);
       if (k>-1 && k<pltag.length) {
        if (pltag[k]==pl[i]) {
          out[out.length]=pltag[k];
          if (out.length>=opts.max) break;
        }
      }
    }
  }
  return out;
}
/*
 pl2 occur after pl1, 
 pl2>=pl1+mindis
 pl2<=pl1+maxdis
*/
var plfollow2 = function (pl1, pl2, mindis, maxdis) {
  var r = [],i=0;
  var swap = 0;
  
  while (i<pl1.length){
    var k = indexOfSorted(pl2, pl1[i] + mindis);
    var t = (pl2[k] >= (pl1[i] +mindis) && pl2[k]<=(pl1[i]+maxdis)) ? k : -1;
    if (t > -1) {
      r[r.length]=pl1[i];
      i++;
    } else {
      if (k>=pl2.length) break;
      var k2=indexOfSorted (pl1,pl2[k]-maxdis);
      if (k2>i) {
        var t = (pl2[k] >= (pl1[i] +mindis) && pl2[k]<=(pl1[i]+maxdis)) ? k : -1;
        if (t>-1) r[r.length]=pl1[k2];
        i=k2;
      } else break;
    }
  }
  return r;
}

var plnotfollow2 = function (pl1, pl2, mindis, maxdis) {
  var r = [],i=0;
  
  while (i<pl1.length){
    var k = indexOfSorted(pl2, pl1[i] + mindis);
    var t = (pl2[k] >= (pl1[i] +mindis) && pl2[k]<=(pl1[i]+maxdis)) ? k : -1;
    if (t > -1) {
      i++;
    } else {
      if (k>=pl2.length) {
        r=r.concat(pl1.slice(i));
        break;
      } else {
        var k2=indexOfSorted (pl1,pl2[k]-maxdis);
        if (k2>i) {
          r=r.concat(pl1.slice(i,k2));
          i=k2;
        } else break;
      }
    }
  }
  return r;
}
/* this is incorrect */
var plfollow = function (pl1, pl2, distance) {
  var r = [],i=0;

  while (i<pl1.length){
    var k = indexOfSorted(pl2, pl1[i] + distance);
    var t = (pl2[k] === (pl1[i] + distance)) ? k : -1;
    if (t > -1) {
      r.push(pl1[i]);
      i++;
    } else {
      if (k>=pl2.length) break;
      var k2=indexOfSorted (pl1,pl2[k]-distance);
      if (k2>i) {
        t = (pl2[k] === (pl1[k2] + distance)) ? k : -1;
        if (t>-1) {
           r.push(pl1[k2]);
           k2++;
        }
        i=k2;
      } else break;
    }
  }
  return r;
}
var plnotfollow = function (pl1, pl2, distance) {
  var r = [];
  var r = [],i=0;
  var swap = 0;
  
  while (i<pl1.length){
    var k = indexOfSorted(pl2, pl1[i] + distance);
    var t = (pl2[k] === (pl1[i] + distance)) ? k : -1;
    if (t > -1) { 
      i++;
    } else {
      if (k>=pl2.length) {
        r=r.concat(pl1.slice(i));
        break;
      } else {
        var k2=indexOfSorted (pl1,pl2[k]-distance);
        if (k2>i) {
          r=r.concat(pl1.slice(i,k2));
          i=k2;
        } else break;
      }
    }
  }
  return r;
}
var pland = function (pl1, pl2, distance) {
  var r = [];
  var swap = 0;
  
  if (pl1.length > pl2.length) { //swap for faster compare
    var t = pl2;
    pl2 = pl1;
    pl1 = t;
    swap = distance;
    distance = -distance;
  }
  for (var i = 0; i < pl1.length; i++) {
    var k = indexOfSorted(pl2, pl1[i] + distance);
    var t = (pl2[k] === (pl1[i] + distance)) ? k : -1;
    if (t > -1) {
      r.push(pl1[i] - swap);
    }
  }
  return r;
}
var combine=function (postings) {
  var out=[];
  for (var i in postings) {
    out=out.concat(postings[i]);
  }
  out.sort(function(a,b){return a-b});
  return out;
}

var unique = function(ar){
   if (!ar || !ar.length) return [];
   var u = {}, a = [];
   for(var i = 0, l = ar.length; i < l; ++i){
    if(u.hasOwnProperty(ar[i])) continue;
    a.push(ar[i]);
    u[ar[i]] = 1;
   }
   return a;
}



var plphrase = function (postings,ops) {
  var r = [];
  for (var i=0;i<postings.length;i++) {
  	if (!postings[i])  return [];
  	if (0 === i) {
  	  r = postings[0];
  	} else {
      if (ops[i]=='andnot') {
        r = plnotfollow(r, postings[i], i);  
      }else {
        r = pland(r, postings[i], i);  
      }
  	}
  }
  
  return r;
}
//return an array of group having any of pl item
var matchPosting=function(pl,gupl,start,end) {
  start=start||0;
  end=end||-1;
  if (end==-1) end=Math.pow(2, 53); // max integer value

  var count=0, i = j= 0,  result = [] ,v=0;
  var docs=[], freq=[];
  if (!pl) return {docs:[],freq:[]};
  while( i < pl.length && j < gupl.length ){
     if (pl[i] < gupl[j] ){ 
       count++;
       v=pl[i];
       i++; 
     } else {
       if (count) {
        if (v>=start && v<end) {
          docs.push(j);
          freq.push(count);          
        }
       }
       j++;
       count=0;
     }
  }
  if (count && j<gupl.length && v>=start && v<end) {
    docs.push(j);
    freq.push(count);
    count=0;
  }
  else {
    while (j==gupl.length && i<pl.length && pl[i] >= gupl[gupl.length-1]) {
      i++;
      count++;
    }
    if (v>=start && v<end) {
      docs.push(j);
      freq.push(count);      
    }
  } 
  return {docs:docs,freq:freq};
}

var trim=function(arr,start,end) {
  var s=indexOfSorted(arr,start);
  var e=indexOfSorted(arr,end);
  return arr.slice(s,e+1);
}
var plist={};
plist.unpack=unpack;
plist.plphrase=plphrase;
plist.plhead=plhead;
plist.plfollow2=plfollow2;
plist.plnotfollow2=plnotfollow2;
plist.plfollow=plfollow;
plist.plnotfollow=plnotfollow;
plist.unique=unique;
plist.indexOfSorted=indexOfSorted;
plist.matchPosting=matchPosting;
plist.trim=trim;

plist.groupbyslot=groupbyslot;
plist.groupbyblock2=groupbyblock2;
plist.countbyposting=countbyposting;
plist.groupbyposting=groupbyposting;
plist.groupbyposting2=groupbyposting2;
plist.groupsum=groupsum;
plist.combine=combine;
module.exports=plist;
return plist;
});
require.register("ksana-document/excerpt.js", function(exports, require, module){
var plist=require("./plist");

var getPhraseWidths=function (Q,phraseid,voffs) {
	var res=[];
	for (var i in voffs) {
		res.push(getPhraseWidth(Q,phraseid,voffs[i]));
	}
	return res;
}
var getPhraseWidth=function (Q,phraseid,voff) {
	var P=Q.phrases[phraseid];
	var width=0,varwidth=false;
	if (P.width) return P.width; // no wildcard
	if (P.termid.length<2) return P.termid.length;
	var lasttermposting=Q.terms[P.termid[P.termid.length-1]].posting;

	for (var i in P.termid) {
		var T=Q.terms[P.termid[i]];
		if (T.op=='wildcard') {
			width+=T.width;
			if (T.wildcard=='*') varwidth=true;
		} else {
			width++;
		}
	}
	if (varwidth) { //width might be smaller due to * wildcard
		var at=plist.indexOfSorted(lasttermposting,voff);
		var endpos=lasttermposting[at];
		if (endpos-voff<width) width=endpos-voff+1;
	}

	return width;
}
/* return [voff, phraseid, phrasewidth, optional_tagname] by slot range*/
var hitInRange=function(Q,startvoff,endvoff) {
	var res=[];
	if (!Q || !Q.rawresult.length) return res;
	for (var i=0;i<Q.phrases.length;i++) {
		var P=Q.phrases[i];
		if (!P.posting) continue;
		var s=plist.indexOfSorted(P.posting,startvoff);
		var e=plist.indexOfSorted(P.posting,endvoff);
		var r=P.posting.slice(s,e);
		var width=getPhraseWidths(Q,i,r);

		res=res.concat(r.map(function(voff,idx){ return [voff,i,width[idx]] }));
	}
	// order by voff, if voff is the same, larger width come first.
	// so the output will be
	// <tag1><tag2>one</tag2>two</tag1>
	//TODO, might cause overlap if same voff and same width
	//need to check tag name
	res.sort(function(a,b){return a[0]==b[0]? b[2]-a[2] :a[0]-b[0]});

	return res;
}

/*
given a vpos range start, file, convert to filestart, fileend
   filestart : starting file
   start   : vpos start
   showfile: how many files to display
   showpage: how many pages to display

output:
   array of fileid with hits
*/
var getFileWithHits=function(engine,Q,range) {
	var fileOffsets=engine.get("fileOffsets");
	var out=[],filecount=100;
	if (range.start) {
		var first=range.start , start=0 , end;
		for (var i=0;i<fileOffsets.length;i++) {
			if (fileOffsets[i]>first) break;
			start=i;
		}		
	} else {
		start=range.filestart || 0;
		if (range.maxfile) {
			filecount=range.maxfile;
		} else if (range.showpage) {
			throw "not implement yet"
		}
	}

	var fileWithHits=[],totalhit=0;
	range.maxhit=range.maxhit||1000;

	for (var i=start;i<Q.byFile.length;i++) {
		if(Q.byFile[i].length>0) {
			totalhit+=Q.byFile[i].length;
			fileWithHits.push(i);
			range.nextFileStart=i;
			if (fileWithHits.length>=filecount) break;
			if (totalhit>range.maxhit) break;
		}
	}
	if (i>=Q.byFile.length) { //no more file
		Q.excerptStop=true;
	}
	return fileWithHits;
}
var resultlist=function(engine,Q,opts,cb) {
	var output=[];
	if (!Q.rawresult || !Q.rawresult.length) {
		cb(output);
		return;
	} 
	if (opts.range) {
		if (opts.range.maxhit && !opts.range.maxfile) {
			opts.range.maxfile=opts.range.maxhit;
		}
	}
	var fileWithHits=getFileWithHits(engine,Q,opts.range);
	if (!fileWithHits.length) {
		cb(output);
		return;
	}

	var output=[],files=[];//temporary holder for pagenames
	for (var i=0;i<fileWithHits.length;i++) {
		var nfile=fileWithHits[i];
		var pageOffsets=engine.getFilePageOffsets(nfile);
		var pageNames=engine.getFilePageNames(nfile);
		files[nfile]={pageOffsets:pageOffsets};
		var pagewithhit=plist.groupbyposting2(Q.byFile[ nfile ],  pageOffsets);
		//if (pageOffsets[0]==1)
		//pagewithhit.shift(); //the first item is not used (0~Q.byFile[0] )

		for (var j=0; j<pagewithhit.length;j++) {
			if (!pagewithhit[j].length) continue;
			//var offsets=pagewithhit[j].map(function(p){return p- fileOffsets[i]});
			output.push(  {file: nfile, page:j,  pagename:pageNames[j]});
		}
	}

	var pagepaths=output.map(function(p){
		return ["fileContents",p.file,p.page];
	});
	//prepare the text
	engine.get(pagepaths,function(pages){
		var seq=0;
		if (pages) for (var i=0;i<pages.length;i++) {
			var startvpos=files[output[i].file].pageOffsets[output[i].page-1];
			var endvpos=files[output[i].file].pageOffsets[output[i].page];
			var hl={};

			if (opts.range && opts.range.start && startvpos<opts.range.start ) {
				startvpos=opts.range.start;
			}
			
			if (opts.nohighlight) {
				hl.text=pages[i];
				hl.hits=hitInRange(Q,startvpos,endvpos);
			} else {
				var o={text:pages[i],startvpos:startvpos, endvpos: endvpos, Q:Q,fulltext:opts.fulltext};
				hl=highlight(Q,o);
			}
			if (hl.text) {
				output[i].text=hl.text;
				output[i].hits=hl.hits;
				output[i].seq=seq;
				seq+=hl.hits.length;

				output[i].start=startvpos;				
			} else {
				output[i]=null; //remove item vpos less than opts.range.start
			}
		} 
		output=output.filter(function(o){return o!=null});
		cb(output);
	});
}
var injectTag=function(Q,opts){
	var hits=opts.hits;
	var tag=opts.tag||'hl';
	var output='',O=[],j=0;;
	var surround=opts.surround||5;

	var tokens=Q.tokenize(opts.text).tokens;
	var voff=opts.voff;
	var i=0,previnrange=!!opts.fulltext ,inrange=!!opts.fulltext;
	while (i<tokens.length) {
		inrange=opts.fulltext || (j<hits.length && voff+surround>=hits[j][0] ||
				(j>0 && j<=hits.length &&  hits[j-1][0]+surround*2>=voff));	

		if (previnrange!=inrange) {
			output+=opts.abridge||"...";
		}
		previnrange=inrange;

		if (Q.isSkip(tokens[i])) {
			if (inrange) output+=tokens[i];
			i++;
			continue;
		}
		if (i<tokens.length && j<hits.length && voff==hits[j][0]) {
			var nphrase=hits[j][1] % 10, width=hits[j][2];
			var tag=hits[j][3] || tag;
			if (width) {
				output+= '<'+tag+' n="'+nphrase+'">';
				while (width && i<tokens.length) {
					output+=tokens[i];
					if (!Q.isSkip(tokens[i])) {voff++;width--;}
					i++;
				}
				output+='</'+tag+'>';
			} else {
				output+= '<'+tag+' n="'+nphrase+'"/>';
			}
			while (j<hits.length && voff>hits[j][0]) j++;
		} else {
			if (inrange && i<tokens.length) output+=tokens[i];
			i++;
			voff++;
		}
		
	}
	var remain=10;
	while (i<tokens.length) {
		if (inrange) output+= tokens[i];
		i++;
		remain--;
		if (remain<=0) break;
	}
	O.push(output);
	output="";

	return O.join("");
}
var highlight=function(Q,opts) {
	if (!opts.text) return {text:"",hits:[]};
	var opt={text:opts.text,
		hits:null,tag:'hl',abridge:opts.abridge,voff:opts.startvpos,
		fulltext:opts.fulltext
	};

	opt.hits=hitInRange(opts.Q,opts.startvpos,opts.endvpos);
	return {text:injectTag(Q,opt),hits:opt.hits};
}

var getPage=function(engine,fileid,pageid,cb) {
	var fileOffsets=engine.get("fileOffsets");
	var pagepaths=["fileContents",fileid,pageid];
	var pagenames=engine.getFilePageNames(fileid);

	engine.get(pagepaths,function(text){
		cb.apply(engine.context,[{text:text,file:fileid,page:pageid,pagename:pagenames[pageid]}]);
	});
}

var getRange=function(engine,start,end,cb) {
	var fileOffsets=engine.get("fileOffsets");
	//var pagepaths=["fileContents",];
	//find first page and last page
	//create get paths

}

var getFile=function(engine,fileid,cb) {
	var filename=engine.get("fileNames")[fileid];
	var pagenames=engine.getFilePageNames(fileid);
	var pc=0;
	engine.get(["fileContents",fileid],true,function(data){
		var text=data.join("<pb>").replace(/<pb>/g,function(m){
			return '\n<pb n="'+pagenames[++pc]+'"></pb>'; // skip _
		})
		cb({text:text,file:fileid,filename:filename}); //force different token
	});
}

var highlightRange=function(Q,startvpos,endvpos,opts,cb){
	//not implement yet
}

var highlightFile=function(Q,fileid,opts,cb) {
	console.log("higlight")
	if (typeof opts=="function") {
		cb=opts;
	}
	if (!Q || !Q.engine) return cb(null);
	var fileOffsets=Q.engine.get("fileOffsets");
	var startvpos=fileOffsets[fileid];
	var endvpos=fileOffsets[fileid+1];
	//console.log(startvpos,endvpos)
	this.getFile(Q.engine,fileid,function(res){
		//console.log(res.text)
		var opt={text:res.text,hits:null,tag:'hl',voff:startvpos,fulltext:true};
		opt.hits=hitInRange(Q,startvpos,endvpos);
		cb.apply(Q.engine.context,[{text:injectTag(Q,opt),file:fileid,hits:opt.hits}]);
	})
}
var highlightPage=function(Q,fileid,pageid,opts,cb) {
	if (typeof opts=="function") {
		cb=opts;
	}

	if (!Q || !Q.engine) return cb(null);
	var pageOffsets=Q.engine.getFilePageOffsets(fileid);
	var startvpos=pageOffsets[pageid];
	var endvpos=pageOffsets[pageid+1];
	var pagenames=Q.engine.getFilePageNames(fileid);

	this.getPage(Q.engine, fileid,pageid+1,function(res){
		var opt={text:res.text,hits:null,tag:'hl',voff:startvpos,fulltext:true};
		opt.hits=hitInRange(Q,startvpos,endvpos);
		var pagename=pagenames[pageid];
		cb.apply(Q.engine.context,[{text:injectTag(Q,opt),page:pageid,file:fileid,hits:opt.hits,pagename:pagename}]);
	})
}
module.exports={resultlist:resultlist, 
	hitInRange:hitInRange, 
	highlightPage:highlightPage,
	getPage:getPage,
	highlightFile:highlightFile,
	getFile:getFile
	//highlightRange:highlightRange,
  //getRange:getRange,
};
});
require.register("ksana-document/link.js", function(exports, require, module){
var findLinkBy=function(page,start,len,cb) {
	if (!page) {
		cb([]);
		return;
	}
	var markups=page.markupAt(start);
	markups=markups.filter(function(m){
		return m.payload.type=="linkby";
	})
	cb(markups);
}
module.exports={findLinkBy:findLinkBy};

});
require.register("ksana-document/tibetan/wylie.js", function(exports, require, module){
var opt = { check:false, check_strict:false, print_warnings:false, fix_spacing:false }

function setopt(arg_opt) {
	for (i in arg_opt) opt[i] = arg_opt[i]
	if (opt.check_strict && !opt.check) { 
		throw 'check_strict requires check.'
	}
}

function newHashSet() {
	var x = []
	x.add = function (K) {
		if (this.indexOf(K) < 0) this.push(K)
	}
	x.contains = function (K) {
		return this.indexOf(K) >= 0
	}
	return x
}

function newHashMap() {
	var x = {}
	x.k = [], x.v = []
	x.put = function (K, V) {
		var i = this.k.indexOf(K)
		if (i < 0) this.k.push(K), this.v.push(V); else this.v[i] = V
	}
	x.containsKey = function (K) {
		return this.k.indexOf(K) >= 0
	}
	x.get = function (K) {
		var i = this.k.indexOf(K)
		if (i >= 0) return this.v[i]
	}
	return x
}
var tmpSet;
// mappings are ported from Java code
// *** Wylie to Unicode mappings ***
// list of wylie consonant => unicode
var m_consonant = new newHashMap();
m_consonant.put("k", 	"\u0f40");
m_consonant.put("kh", 	"\u0f41");
m_consonant.put("g", 	"\u0f42");
m_consonant.put("gh", 	"\u0f42\u0fb7");
m_consonant.put("g+h", 	"\u0f42\u0fb7");
m_consonant.put("ng", 	"\u0f44");
m_consonant.put("c", 	"\u0f45");
m_consonant.put("ch", 	"\u0f46");
m_consonant.put("j", 	"\u0f47");
m_consonant.put("ny", 	"\u0f49");
m_consonant.put("T", 	"\u0f4a");
m_consonant.put("-t", 	"\u0f4a");
m_consonant.put("Th", 	"\u0f4b");
m_consonant.put("-th", 	"\u0f4b");
m_consonant.put("D", 	"\u0f4c");
m_consonant.put("-d", 	"\u0f4c");
m_consonant.put("Dh", 	"\u0f4c\u0fb7");
m_consonant.put("D+h", 	"\u0f4c\u0fb7");
m_consonant.put("-dh", 	"\u0f4c\u0fb7");
m_consonant.put("-d+h", "\u0f4c\u0fb7");
m_consonant.put("N", 	"\u0f4e");
m_consonant.put("-n", 	"\u0f4e");
m_consonant.put("t", 	"\u0f4f");
m_consonant.put("th", 	"\u0f50");
m_consonant.put("d", 	"\u0f51");
m_consonant.put("dh", 	"\u0f51\u0fb7");
m_consonant.put("d+h", 	"\u0f51\u0fb7");
m_consonant.put("n", 	"\u0f53");
m_consonant.put("p", 	"\u0f54");
m_consonant.put("ph", 	"\u0f55");
m_consonant.put("b", 	"\u0f56");
m_consonant.put("bh", 	"\u0f56\u0fb7");
m_consonant.put("b+h", 	"\u0f56\u0fb7");
m_consonant.put("m", 	"\u0f58");
m_consonant.put("ts", 	"\u0f59");
m_consonant.put("tsh", 	"\u0f5a");
m_consonant.put("dz", 	"\u0f5b");
m_consonant.put("dzh", 	"\u0f5b\u0fb7");
m_consonant.put("dz+h", "\u0f5b\u0fb7");
m_consonant.put("w", 	"\u0f5d");
m_consonant.put("zh", 	"\u0f5e");
m_consonant.put("z", 	"\u0f5f");
m_consonant.put("'", 	"\u0f60");
m_consonant.put("\u2018", 	"\u0f60");	// typographic quotes
m_consonant.put("\u2019", 	"\u0f60");
m_consonant.put("y", 	"\u0f61");
m_consonant.put("r", 	"\u0f62");
m_consonant.put("l", 	"\u0f63");
m_consonant.put("sh", 	"\u0f64");
m_consonant.put("Sh", 	"\u0f65");
m_consonant.put("-sh", 	"\u0f65");
m_consonant.put("s", 	"\u0f66");
m_consonant.put("h", 	"\u0f67");
m_consonant.put("W", 	"\u0f5d");
m_consonant.put("Y", 	"\u0f61");
m_consonant.put("R", 	"\u0f6a");
m_consonant.put("f", 	"\u0f55\u0f39");
m_consonant.put("v", 	"\u0f56\u0f39");

// subjoined letters
var m_subjoined = new newHashMap();
m_subjoined.put("k", 	"\u0f90");
m_subjoined.put("kh", 	"\u0f91");
m_subjoined.put("g", 	"\u0f92");
m_subjoined.put("gh", 	"\u0f92\u0fb7");
m_subjoined.put("g+h", 	"\u0f92\u0fb7");
m_subjoined.put("ng", 	"\u0f94");
m_subjoined.put("c", 	"\u0f95");
m_subjoined.put("ch", 	"\u0f96");
m_subjoined.put("j", 	"\u0f97");
m_subjoined.put("ny", 	"\u0f99");
m_subjoined.put("T", 	"\u0f9a");
m_subjoined.put("-t", 	"\u0f9a");
m_subjoined.put("Th", 	"\u0f9b");
m_subjoined.put("-th", 	"\u0f9b");
m_subjoined.put("D", 	"\u0f9c");
m_subjoined.put("-d", 	"\u0f9c");
m_subjoined.put("Dh", 	"\u0f9c\u0fb7");
m_subjoined.put("D+h", 	"\u0f9c\u0fb7");
m_subjoined.put("-dh", 	"\u0f9c\u0fb7");
m_subjoined.put("-d+h",	"\u0f9c\u0fb7");
m_subjoined.put("N", 	"\u0f9e");
m_subjoined.put("-n", 	"\u0f9e");
m_subjoined.put("t", 	"\u0f9f");
m_subjoined.put("th", 	"\u0fa0");
m_subjoined.put("d", 	"\u0fa1");
m_subjoined.put("dh", 	"\u0fa1\u0fb7");
m_subjoined.put("d+h", 	"\u0fa1\u0fb7");
m_subjoined.put("n", 	"\u0fa3");
m_subjoined.put("p", 	"\u0fa4");
m_subjoined.put("ph", 	"\u0fa5");
m_subjoined.put("b", 	"\u0fa6");
m_subjoined.put("bh", 	"\u0fa6\u0fb7");
m_subjoined.put("b+h", 	"\u0fa6\u0fb7");
m_subjoined.put("m", 	"\u0fa8");
m_subjoined.put("ts", 	"\u0fa9");
m_subjoined.put("tsh", 	"\u0faa");
m_subjoined.put("dz", 	"\u0fab");
m_subjoined.put("dzh", 	"\u0fab\u0fb7");
m_subjoined.put("dz+h",	"\u0fab\u0fb7");
m_subjoined.put("w", 	"\u0fad");
m_subjoined.put("zh", 	"\u0fae");
m_subjoined.put("z", 	"\u0faf");
m_subjoined.put("'", 	"\u0fb0");
m_subjoined.put("\u2018", 	"\u0fb0");	// typographic quotes
m_subjoined.put("\u2019", 	"\u0fb0");
m_subjoined.put("y", 	"\u0fb1");
m_subjoined.put("r", 	"\u0fb2");
m_subjoined.put("l", 	"\u0fb3");
m_subjoined.put("sh", 	"\u0fb4");
m_subjoined.put("Sh", 	"\u0fb5");
m_subjoined.put("-sh", 	"\u0fb5");
m_subjoined.put("s", 	"\u0fb6");
m_subjoined.put("h", 	"\u0fb7");
m_subjoined.put("a", 	"\u0fb8");
m_subjoined.put("W", 	"\u0fba");
m_subjoined.put("Y", 	"\u0fbb");
m_subjoined.put("R", 	"\u0fbc");

// vowels
var m_vowel = new newHashMap();
m_vowel.put("a", 	"\u0f68");
m_vowel.put("A", 	"\u0f71");
m_vowel.put("i", 	"\u0f72");
m_vowel.put("I", 	"\u0f71\u0f72");
m_vowel.put("u", 	"\u0f74");
m_vowel.put("U", 	"\u0f71\u0f74");
m_vowel.put("e", 	"\u0f7a");
m_vowel.put("ai", 	"\u0f7b");
m_vowel.put("o", 	"\u0f7c");
m_vowel.put("au", 	"\u0f7d");
m_vowel.put("-i", 	"\u0f80");
m_vowel.put("-I", 	"\u0f71\u0f80");

// final symbols to unicode
var m_final_uni = new newHashMap();
m_final_uni.put("M", 	"\u0f7e");
m_final_uni.put("~M`", 	"\u0f82");
m_final_uni.put("~M", 	"\u0f83");
m_final_uni.put("X", 	"\u0f37");
m_final_uni.put("~X", 	"\u0f35");
m_final_uni.put("H", 	"\u0f7f");
m_final_uni.put("?", 	"\u0f84");
m_final_uni.put("^", 	"\u0f39");

// final symbols organized by class
var m_final_class = new newHashMap();
m_final_class.put("M", 	"M");
m_final_class.put("~M`", "M");
m_final_class.put("~M",  "M");
m_final_class.put("X", 	"X");
m_final_class.put("~X", "X");
m_final_class.put("H", 	"H");
m_final_class.put("?", 	"?");
m_final_class.put("^", 	"^");

// other stand-alone symbols
var m_other = new newHashMap();
m_other.put("0", 	"\u0f20");
m_other.put("1", 	"\u0f21");
m_other.put("2", 	"\u0f22");
m_other.put("3", 	"\u0f23");
m_other.put("4", 	"\u0f24");
m_other.put("5", 	"\u0f25");
m_other.put("6", 	"\u0f26");
m_other.put("7", 	"\u0f27");
m_other.put("8", 	"\u0f28");
m_other.put("9", 	"\u0f29");
m_other.put(" ", 	"\u0f0b");
m_other.put("*", 	"\u0f0c");
m_other.put("/", 	"\u0f0d");
m_other.put("//", 	"\u0f0e");
m_other.put(";", 	"\u0f0f");
m_other.put("|", 	"\u0f11");
m_other.put("!", 	"\u0f08");
m_other.put(":", 	"\u0f14");
m_other.put("_", 	" ");
m_other.put("=", 	"\u0f34");
m_other.put("<", 	"\u0f3a");
m_other.put(">", 	"\u0f3b");
m_other.put("(", 	"\u0f3c");
m_other.put(")", 	"\u0f3d");
m_other.put("@", 	"\u0f04");
m_other.put("#", 	"\u0f05");
m_other.put("$", 	"\u0f06");
m_other.put("%", 	"\u0f07");

// special characters: flag those if they occur out of context
var m_special = new newHashSet();
m_special.add(".");
m_special.add("+");
m_special.add("-");
m_special.add("~");
m_special.add("^");
m_special.add("?");
m_special.add("`");
m_special.add("]");

// superscripts: hashmap of superscript => set of letters or stacks below
var m_superscripts = new newHashMap();
tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("j");
tmpSet.add("ny");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("n");
tmpSet.add("b");
tmpSet.add("m");
tmpSet.add("ts");
tmpSet.add("dz");
tmpSet.add("k+y");
tmpSet.add("g+y");
tmpSet.add("m+y");
tmpSet.add("b+w");
tmpSet.add("ts+w");
tmpSet.add("g+w");
m_superscripts.put("r", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("c");
tmpSet.add("j");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("p");
tmpSet.add("b");
tmpSet.add("h");
m_superscripts.put("l", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("ny");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("n");
tmpSet.add("p");
tmpSet.add("b");
tmpSet.add("m");
tmpSet.add("ts");
tmpSet.add("k+y");
tmpSet.add("g+y");
tmpSet.add("p+y");
tmpSet.add("b+y");
tmpSet.add("m+y");
tmpSet.add("k+r");
tmpSet.add("g+r");
tmpSet.add("p+r");
tmpSet.add("b+r");
tmpSet.add("m+r");
tmpSet.add("n+r");
m_superscripts.put("s", tmpSet);

// subscripts => set of letters above
var m_subscripts = new newHashMap();
tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("kh");
tmpSet.add("g");
tmpSet.add("p");
tmpSet.add("ph");
tmpSet.add("b");
tmpSet.add("m");
tmpSet.add("r+k");
tmpSet.add("r+g");
tmpSet.add("r+m");
tmpSet.add("s+k");
tmpSet.add("s+g");
tmpSet.add("s+p");
tmpSet.add("s+b");
tmpSet.add("s+m");
m_subscripts.put("y", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("kh");
tmpSet.add("g");
tmpSet.add("t");
tmpSet.add("th");
tmpSet.add("d");
tmpSet.add("n");
tmpSet.add("p");
tmpSet.add("ph");
tmpSet.add("b");
tmpSet.add("m");
tmpSet.add("sh");
tmpSet.add("s");
tmpSet.add("h");
tmpSet.add("dz");
tmpSet.add("s+k");
tmpSet.add("s+g");
tmpSet.add("s+p");
tmpSet.add("s+b");
tmpSet.add("s+m");
tmpSet.add("s+n");
m_subscripts.put("r", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("b");
tmpSet.add("r");
tmpSet.add("s");
tmpSet.add("z");
m_subscripts.put("l", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("kh");
tmpSet.add("g");
tmpSet.add("c");
tmpSet.add("ny");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("ts");
tmpSet.add("tsh");
tmpSet.add("zh");
tmpSet.add("z");
tmpSet.add("r");
tmpSet.add("l");
tmpSet.add("sh");
tmpSet.add("s");
tmpSet.add("h");
tmpSet.add("g+r");
tmpSet.add("d+r");
tmpSet.add("ph+y");
tmpSet.add("r+g");
tmpSet.add("r+ts");
m_subscripts.put("w", tmpSet);

// prefixes => set of consonants or stacks after
var m_prefixes = new newHashMap();
tmpSet = new newHashSet();
tmpSet.add("c");
tmpSet.add("ny");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("n");
tmpSet.add("ts");
tmpSet.add("zh");
tmpSet.add("z");
tmpSet.add("y");
tmpSet.add("sh");
tmpSet.add("s");
m_prefixes.put("g", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("p");
tmpSet.add("b");
tmpSet.add("m");
tmpSet.add("k+y");
tmpSet.add("g+y");
tmpSet.add("p+y");
tmpSet.add("b+y");
tmpSet.add("m+y");
tmpSet.add("k+r");
tmpSet.add("g+r");
tmpSet.add("p+r");
tmpSet.add("b+r");
m_prefixes.put("d", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("c");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("ts");
tmpSet.add("zh");
tmpSet.add("z");
tmpSet.add("sh");
tmpSet.add("s");
tmpSet.add("r");
tmpSet.add("l");
tmpSet.add("k+y");
tmpSet.add("g+y");
tmpSet.add("k+r");
tmpSet.add("g+r");
tmpSet.add("r+l");
tmpSet.add("s+l");
tmpSet.add("r+k");
tmpSet.add("r+g");
tmpSet.add("r+ng");
tmpSet.add("r+j");
tmpSet.add("r+ny");
tmpSet.add("r+t");
tmpSet.add("r+d");
tmpSet.add("r+n");
tmpSet.add("r+ts");
tmpSet.add("r+dz");
tmpSet.add("s+k");
tmpSet.add("s+g");
tmpSet.add("s+ng");
tmpSet.add("s+ny");
tmpSet.add("s+t");
tmpSet.add("s+d");
tmpSet.add("s+n");
tmpSet.add("s+ts");
tmpSet.add("r+k+y");
tmpSet.add("r+g+y");
tmpSet.add("s+k+y");
tmpSet.add("s+g+y");
tmpSet.add("s+k+r");
tmpSet.add("s+g+r");
tmpSet.add("l+d");
tmpSet.add("l+t");
tmpSet.add("k+l");
tmpSet.add("s+r");
tmpSet.add("z+l");
tmpSet.add("s+w");
m_prefixes.put("b", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("kh");
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("ch");
tmpSet.add("j");
tmpSet.add("ny");
tmpSet.add("th");
tmpSet.add("d");
tmpSet.add("n");
tmpSet.add("tsh");
tmpSet.add("dz");
tmpSet.add("kh+y");
tmpSet.add("g+y");
tmpSet.add("kh+r");
tmpSet.add("g+r");
m_prefixes.put("m", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("kh");
tmpSet.add("g");
tmpSet.add("ch");
tmpSet.add("j");
tmpSet.add("th");
tmpSet.add("d");
tmpSet.add("ph");
tmpSet.add("b");
tmpSet.add("tsh");
tmpSet.add("dz");
tmpSet.add("kh+y");
tmpSet.add("g+y");
tmpSet.add("ph+y");
tmpSet.add("b+y");
tmpSet.add("kh+r");
tmpSet.add("g+r");
tmpSet.add("d+r");
tmpSet.add("ph+r");
tmpSet.add("b+r");
m_prefixes.put("'", tmpSet);
m_prefixes.put("\u2018", tmpSet);
m_prefixes.put("\u2019", tmpSet);

// set of suffix letters
// also included are some Skt letters b/c they occur often in suffix position in Skt words
var m_suffixes = new newHashSet();
m_suffixes.add("'");
m_suffixes.add("\u2018");
m_suffixes.add("\u2019");
m_suffixes.add("g");
m_suffixes.add("ng");
m_suffixes.add("d");
m_suffixes.add("n");
m_suffixes.add("b");
m_suffixes.add("m");
m_suffixes.add("r");
m_suffixes.add("l");
m_suffixes.add("s");
m_suffixes.add("N");
m_suffixes.add("T");
m_suffixes.add("-n");
m_suffixes.add("-t");

// suffix2 => set of letters before
var m_suff2 = new newHashMap();
tmpSet = new newHashSet();
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("b");
tmpSet.add("m");
m_suff2.put("s", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("n");
tmpSet.add("r");
tmpSet.add("l");
m_suff2.put("d", tmpSet);

// root letter index for very ambiguous three-stack syllables
var m_ambiguous_key = new newHashMap();
m_ambiguous_key.put("dgs", 	1);
m_ambiguous_key.put("dms", 	1);
m_ambiguous_key.put("'gs", 	1);
m_ambiguous_key.put("mngs", 	0);
m_ambiguous_key.put("bgs", 	0);
m_ambiguous_key.put("dbs", 	1);

var m_ambiguous_wylie = new newHashMap();
m_ambiguous_wylie.put("dgs", 	"dgas");
m_ambiguous_wylie.put("dms", 	"dmas");
m_ambiguous_wylie.put("'gs", 	"'gas");
m_ambiguous_wylie.put("mngs", 	"mangs");
m_ambiguous_wylie.put("bgs", 	"bags");
m_ambiguous_wylie.put("dbs", 	"dbas");

// *** Unicode to Wylie mappings ***

// top letters
var m_tib_top = new newHashMap();
m_tib_top.put('\u0f40', 	"k");
m_tib_top.put('\u0f41', 	"kh");
m_tib_top.put('\u0f42', 	"g");
m_tib_top.put('\u0f43', 	"g+h");
m_tib_top.put('\u0f44', 	"ng");
m_tib_top.put('\u0f45', 	"c");
m_tib_top.put('\u0f46', 	"ch");
m_tib_top.put('\u0f47', 	"j");
m_tib_top.put('\u0f49', 	"ny");
m_tib_top.put('\u0f4a', 	"T");
m_tib_top.put('\u0f4b', 	"Th");
m_tib_top.put('\u0f4c', 	"D");
m_tib_top.put('\u0f4d', 	"D+h");
m_tib_top.put('\u0f4e', 	"N");
m_tib_top.put('\u0f4f', 	"t");
m_tib_top.put('\u0f50', 	"th");
m_tib_top.put('\u0f51', 	"d");
m_tib_top.put('\u0f52', 	"d+h");
m_tib_top.put('\u0f53', 	"n");
m_tib_top.put('\u0f54', 	"p");
m_tib_top.put('\u0f55', 	"ph");
m_tib_top.put('\u0f56', 	"b");
m_tib_top.put('\u0f57', 	"b+h");
m_tib_top.put('\u0f58', 	"m");
m_tib_top.put('\u0f59', 	"ts");
m_tib_top.put('\u0f5a', 	"tsh");
m_tib_top.put('\u0f5b', 	"dz");
m_tib_top.put('\u0f5c', 	"dz+h");
m_tib_top.put('\u0f5d', 	"w");
m_tib_top.put('\u0f5e', 	"zh");
m_tib_top.put('\u0f5f', 	"z");
m_tib_top.put('\u0f60', 	"'");
m_tib_top.put('\u0f61', 	"y");
m_tib_top.put('\u0f62', 	"r");
m_tib_top.put('\u0f63', 	"l");
m_tib_top.put('\u0f64', 	"sh");
m_tib_top.put('\u0f65', 	"Sh");
m_tib_top.put('\u0f66', 	"s");
m_tib_top.put('\u0f67', 	"h");
m_tib_top.put('\u0f68', 	"a");
m_tib_top.put('\u0f69', 	"k+Sh");
m_tib_top.put('\u0f6a', 	"R");

// subjoined letters
var m_tib_subjoined = new newHashMap();
m_tib_subjoined.put('\u0f90', 	"k");
m_tib_subjoined.put('\u0f91', 	"kh");
m_tib_subjoined.put('\u0f92', 	"g");
m_tib_subjoined.put('\u0f93', 	"g+h");
m_tib_subjoined.put('\u0f94', 	"ng");
m_tib_subjoined.put('\u0f95', 	"c");
m_tib_subjoined.put('\u0f96', 	"ch");
m_tib_subjoined.put('\u0f97', 	"j");
m_tib_subjoined.put('\u0f99', 	"ny");
m_tib_subjoined.put('\u0f9a', 	"T");
m_tib_subjoined.put('\u0f9b', 	"Th");
m_tib_subjoined.put('\u0f9c', 	"D");
m_tib_subjoined.put('\u0f9d', 	"D+h");
m_tib_subjoined.put('\u0f9e', 	"N");
m_tib_subjoined.put('\u0f9f', 	"t");
m_tib_subjoined.put('\u0fa0', 	"th");
m_tib_subjoined.put('\u0fa1', 	"d");
m_tib_subjoined.put('\u0fa2', 	"d+h");
m_tib_subjoined.put('\u0fa3', 	"n");
m_tib_subjoined.put('\u0fa4', 	"p");
m_tib_subjoined.put('\u0fa5', 	"ph");
m_tib_subjoined.put('\u0fa6', 	"b");
m_tib_subjoined.put('\u0fa7', 	"b+h");
m_tib_subjoined.put('\u0fa8', 	"m");
m_tib_subjoined.put('\u0fa9', 	"ts");
m_tib_subjoined.put('\u0faa', 	"tsh");
m_tib_subjoined.put('\u0fab', 	"dz");
m_tib_subjoined.put('\u0fac', 	"dz+h");
m_tib_subjoined.put('\u0fad', 	"w");
m_tib_subjoined.put('\u0fae', 	"zh");
m_tib_subjoined.put('\u0faf', 	"z");
m_tib_subjoined.put('\u0fb0', 	"'");
m_tib_subjoined.put('\u0fb1', 	"y");
m_tib_subjoined.put('\u0fb2', 	"r");
m_tib_subjoined.put('\u0fb3', 	"l");
m_tib_subjoined.put('\u0fb4', 	"sh");
m_tib_subjoined.put('\u0fb5', 	"Sh");
m_tib_subjoined.put('\u0fb6', 	"s");
m_tib_subjoined.put('\u0fb7', 	"h");
m_tib_subjoined.put('\u0fb8', 	"a");
m_tib_subjoined.put('\u0fb9', 	"k+Sh");
m_tib_subjoined.put('\u0fba', 	"W");
m_tib_subjoined.put('\u0fbb', 	"Y");
m_tib_subjoined.put('\u0fbc', 	"R");

// vowel signs:
// a-chen is not here because that's a top character, not a vowel sign.
// pre-composed "I" and "U" are dealt here; other pre-composed Skt vowels are more
// easily handled by a global replace in toWylie(), b/c they turn into subjoined "r"/"l".

var m_tib_vowel = new newHashMap();
m_tib_vowel.put('\u0f71', 	"A");
m_tib_vowel.put('\u0f72', 	"i");
m_tib_vowel.put('\u0f73', 	"I");
m_tib_vowel.put('\u0f74', 	"u");
m_tib_vowel.put('\u0f75', 	"U");
m_tib_vowel.put('\u0f7a', 	"e");
m_tib_vowel.put('\u0f7b', 	"ai");
m_tib_vowel.put('\u0f7c', 	"o");
m_tib_vowel.put('\u0f7d', 	"au");
m_tib_vowel.put('\u0f80', 	"-i");

// long (Skt) vowels
var m_tib_vowel_long = new newHashMap();
m_tib_vowel_long.put("i", 	"I");
m_tib_vowel_long.put("u", 	"U");
m_tib_vowel_long.put("-i", 	"-I");

// final symbols => wylie
var m_tib_final_wylie = new newHashMap();
m_tib_final_wylie.put('\u0f7e', 	"M");
m_tib_final_wylie.put('\u0f82', 	"~M`");
m_tib_final_wylie.put('\u0f83', 	"~M");
m_tib_final_wylie.put('\u0f37', 	"X");
m_tib_final_wylie.put('\u0f35', 	"~X");
m_tib_final_wylie.put('\u0f39', 	"^");
m_tib_final_wylie.put('\u0f7f', 	"H");
m_tib_final_wylie.put('\u0f84', 	"?");

// final symbols by class
var m_tib_final_class = new newHashMap();
m_tib_final_class.put('\u0f7e', 	"M");
m_tib_final_class.put('\u0f82', 	"M");
m_tib_final_class.put('\u0f83', 	"M");
m_tib_final_class.put('\u0f37', 	"X");
m_tib_final_class.put('\u0f35', 	"X");
m_tib_final_class.put('\u0f39', 	"^");
m_tib_final_class.put('\u0f7f', 	"H");
m_tib_final_class.put('\u0f84', 	"?");

// special characters introduced by ^
var m_tib_caret = new newHashMap();
m_tib_caret.put("ph", 	"f");
m_tib_caret.put("b", 	"v");

// other stand-alone characters
var m_tib_other = new newHashMap();
m_tib_other.put(' ', 		"_");
m_tib_other.put('\u0f04', 	"@");
m_tib_other.put('\u0f05', 	"#");
m_tib_other.put('\u0f06', 	"$");
m_tib_other.put('\u0f07', 	"%");
m_tib_other.put('\u0f08', 	"!");
m_tib_other.put('\u0f0b', 	" ");
m_tib_other.put('\u0f0c', 	"*");
m_tib_other.put('\u0f0d', 	"/");
m_tib_other.put('\u0f0e', 	"//");
m_tib_other.put('\u0f0f', 	";");
m_tib_other.put('\u0f11', 	"|");
m_tib_other.put('\u0f14', 	":");
m_tib_other.put('\u0f20', 	"0");
m_tib_other.put('\u0f21', 	"1");
m_tib_other.put('\u0f22', 	"2");
m_tib_other.put('\u0f23', 	"3");
m_tib_other.put('\u0f24', 	"4");
m_tib_other.put('\u0f25', 	"5");
m_tib_other.put('\u0f26', 	"6");
m_tib_other.put('\u0f27', 	"7");
m_tib_other.put('\u0f28', 	"8");
m_tib_other.put('\u0f29', 	"9");
m_tib_other.put('\u0f34', 	"=");
m_tib_other.put('\u0f3a', 	"<");
m_tib_other.put('\u0f3b', 	">");
m_tib_other.put('\u0f3c', 	"(");
m_tib_other.put('\u0f3d', 	")");

// all these stacked consonant combinations don't need "+"s in them
var m_tib_stacks = new newHashSet();
m_tib_stacks.add("b+l");
m_tib_stacks.add("b+r");
m_tib_stacks.add("b+y");
m_tib_stacks.add("c+w");
m_tib_stacks.add("d+r");
m_tib_stacks.add("d+r+w");
m_tib_stacks.add("d+w");
m_tib_stacks.add("dz+r");
m_tib_stacks.add("g+l");
m_tib_stacks.add("g+r");
m_tib_stacks.add("g+r+w");
m_tib_stacks.add("g+w");
m_tib_stacks.add("g+y");
m_tib_stacks.add("h+r");
m_tib_stacks.add("h+w");
m_tib_stacks.add("k+l");
m_tib_stacks.add("k+r");
m_tib_stacks.add("k+w");
m_tib_stacks.add("k+y");
m_tib_stacks.add("kh+r");
m_tib_stacks.add("kh+w");
m_tib_stacks.add("kh+y");
m_tib_stacks.add("l+b");
m_tib_stacks.add("l+c");
m_tib_stacks.add("l+d");
m_tib_stacks.add("l+g");
m_tib_stacks.add("l+h");
m_tib_stacks.add("l+j");
m_tib_stacks.add("l+k");
m_tib_stacks.add("l+ng");
m_tib_stacks.add("l+p");
m_tib_stacks.add("l+t");
m_tib_stacks.add("l+w");
m_tib_stacks.add("m+r");
m_tib_stacks.add("m+y");
m_tib_stacks.add("n+r");
m_tib_stacks.add("ny+w");
m_tib_stacks.add("p+r");
m_tib_stacks.add("p+y");
m_tib_stacks.add("ph+r");
m_tib_stacks.add("ph+y");
m_tib_stacks.add("ph+y+w");
m_tib_stacks.add("r+b");
m_tib_stacks.add("r+d");
m_tib_stacks.add("r+dz");
m_tib_stacks.add("r+g");
m_tib_stacks.add("r+g+w");
m_tib_stacks.add("r+g+y");
m_tib_stacks.add("r+j");
m_tib_stacks.add("r+k");
m_tib_stacks.add("r+k+y");
m_tib_stacks.add("r+l");
m_tib_stacks.add("r+m");
m_tib_stacks.add("r+m+y");
m_tib_stacks.add("r+n");
m_tib_stacks.add("r+ng");
m_tib_stacks.add("r+ny");
m_tib_stacks.add("r+t");
m_tib_stacks.add("r+ts");
m_tib_stacks.add("r+ts+w");
m_tib_stacks.add("r+w");
m_tib_stacks.add("s+b");
m_tib_stacks.add("s+b+r");
m_tib_stacks.add("s+b+y");
m_tib_stacks.add("s+d");
m_tib_stacks.add("s+g");
m_tib_stacks.add("s+g+r");
m_tib_stacks.add("s+g+y");
m_tib_stacks.add("s+k");
m_tib_stacks.add("s+k+r");
m_tib_stacks.add("s+k+y");
m_tib_stacks.add("s+l");
m_tib_stacks.add("s+m");
m_tib_stacks.add("s+m+r");
m_tib_stacks.add("s+m+y");
m_tib_stacks.add("s+n");
m_tib_stacks.add("s+n+r");
m_tib_stacks.add("s+ng");
m_tib_stacks.add("s+ny");
m_tib_stacks.add("s+p");
m_tib_stacks.add("s+p+r");
m_tib_stacks.add("s+p+y");
m_tib_stacks.add("s+r");
m_tib_stacks.add("s+t");
m_tib_stacks.add("s+ts");
m_tib_stacks.add("s+w");
m_tib_stacks.add("sh+r");
m_tib_stacks.add("sh+w");
m_tib_stacks.add("t+r");
m_tib_stacks.add("t+w");
m_tib_stacks.add("th+r");
m_tib_stacks.add("ts+w");
m_tib_stacks.add("tsh+w");
m_tib_stacks.add("z+l");
m_tib_stacks.add("z+w");
m_tib_stacks.add("zh+w");

// a map used to split the input string into tokens for fromWylie().
// all letters which start tokens longer than one letter are mapped to the max length of
// tokens starting with that letter.  
var m_tokens_start = new newHashMap();
m_tokens_start.put('S', 2);
m_tokens_start.put('/', 2);
m_tokens_start.put('d', 4);
m_tokens_start.put('g', 3);
m_tokens_start.put('b', 3);
m_tokens_start.put('D', 3);
m_tokens_start.put('z', 2);
m_tokens_start.put('~', 3);
m_tokens_start.put('-', 4);
m_tokens_start.put('T', 2);
m_tokens_start.put('a', 2);
m_tokens_start.put('k', 2);
m_tokens_start.put('t', 3);
m_tokens_start.put('s', 2);
m_tokens_start.put('c', 2);
m_tokens_start.put('n', 2);
m_tokens_start.put('p', 2);
m_tokens_start.put('\r', 2);

// also for tokenization - a set of tokens longer than one letter
var m_tokens = new newHashSet();
m_tokens.add("-d+h");
m_tokens.add("dz+h");
m_tokens.add("-dh");
m_tokens.add("-sh");
m_tokens.add("-th");
m_tokens.add("D+h");
m_tokens.add("b+h");
m_tokens.add("d+h");
m_tokens.add("dzh");
m_tokens.add("g+h");
m_tokens.add("tsh");
m_tokens.add("~M`");
m_tokens.add("-I");
m_tokens.add("-d");
m_tokens.add("-i");
m_tokens.add("-n");
m_tokens.add("-t");
m_tokens.add("//");
m_tokens.add("Dh");
m_tokens.add("Sh");
m_tokens.add("Th");
m_tokens.add("ai");
m_tokens.add("au");
m_tokens.add("bh");
m_tokens.add("ch");
m_tokens.add("dh");
m_tokens.add("dz");
m_tokens.add("gh");
m_tokens.add("kh");
m_tokens.add("ng");
m_tokens.add("ny");
m_tokens.add("ph");
m_tokens.add("sh");
m_tokens.add("th");
m_tokens.add("ts");
m_tokens.add("zh");
m_tokens.add("~M");
m_tokens.add("~X");
m_tokens.add("\r\n");

// A class to encapsulate the return value of fromWylieOneStack.
var WylieStack = function() {
	this.uni_string = ''
	this.tokens_used = 0
	this.single_consonant = ''
	this.single_cons_a = ''
	this.warns = []
	this.visarga = false
	return this
}

// Looking from i onwards within tokens, returns as many consonants as it finds,
// up to and not including the next vowel or punctuation.  Skips the caret "^".
// Returns: a string of consonants joined by "+" signs.
function consonantString(tokens, i) { // strings, int
	var out = [];
	var t = '';
	while (tokens[i] != null) {
		t = tokens[i++];
		if (t == '+' || t == '^') continue;
		if (consonant(t) == null) break;
		out.push(t);
	}
	return out.join("+");
}

// Looking from i backwards within tokens, at most up to orig_i, returns as 
// many consonants as it finds, up to and not including the next vowel or
// punctuation.  Skips the caret "^".
// Returns: a string of consonants (in forward order) joined by "+" signs.
function consonantStringBackwards(tokens, i, orig_i) {
	var out = [];
	var t = '';
	while (i >= orig_i && tokens[i] != null) {
		t = tokens[i--];
		if (t == '+' || t == '^') continue;
		if (consonant(t) == null) break;
		out.unshift(t);
	}
	return out.join("+");
}

// A class to encapsulate the return value of fromWylieOneTsekbar.
var WylieTsekbar = function() {
	this.uni_string = ''
	this.tokens_used = 0
	this.warns = []
	return this
}
// A class to encapsulate an analyzed tibetan stack, while converting Unicode to Wylie.
var ToWylieStack = function() {
	this.top = ''
	this.stack = []
	this.caret = false
	this.vowels = []
	this.finals = []
	this.finals_found = newHashMap()
	this.visarga = false
	this.cons_str = ''
	this.single_cons = ''
	this.prefix = false
	this.suffix = false
	this.suff2 = false
	this.dot = false
	this.tokens_used = 0
	this.warns = []
	return this
}

// A class to encapsulate the return value of toWylieOneTsekbar.
var ToWylieTsekbar = function() {
	this.wylie = ''
	this.tokens_used = 0
	this.warns = []
	return this
}

// Converts successive stacks of Wylie into unicode, starting at the given index
// within the array of tokens. 
// 
// Assumes that the first available token is valid, and is either a vowel or a consonant.
// Returns a WylieTsekbar object
// HELPER CLASSES AND STRUCTURES
var State = { PREFIX: 0, MAIN: 1, SUFF1: 2, SUFF2: 3, NONE: 4 }
	// split a string into Wylie tokens; 
	// make sure there is room for at least one null element at the end of the array
var splitIntoTokens = function(str) {
	var tokens = [] // size = str.length + 2
	var i = 0;
	var maxlen = str.length;
	TOKEN:
	while (i < maxlen) {
		var c = str.charAt(i);
		var mlo = m_tokens_start.get(c);
		// if there are multi-char tokens starting with this char, try them
		if (mlo != null) {
			for (var len = mlo; len > 1; len--) {
				if (i <= maxlen - len) {
					var tr = str.substring(i, i + len);
					if (m_tokens.contains(tr)) {
						tokens.push(tr);
						i += len;
						continue TOKEN;
					}
				}
			}
		}
		// things starting with backslash are special
		if (c == '\\' && i <= maxlen - 2) {
			if (str.charAt(i + 1) == 'u' && i <= maxlen - 6) {
				tokens.push(str.substring(i, i + 6));		// \\uxxxx
				i += 6;
			} else if (str.charAt(i + 1) == 'U' && i <= maxlen - 10) {
				tokens.push(str.substring(i, i + 10));		// \\Uxxxxxxxx
				i += 10;
			} else {
				tokens.push(str.substring(i, i + 2));		// \\x
				i += 2;
			}
			continue TOKEN;
		}
		// otherwise just take one char
		tokens.push(c.toString());
		i += 1;
	}
	return tokens;
}

// helper functions to access the various hash tables
var consonant = function(s) { return m_consonant.get(s) }
var subjoined = function(s) { return m_subjoined.get(s) }
var vowel = function(s) { return m_vowel.get(s) }
var final_uni = function(s) { return m_final_uni.get(s) }
var final_class = function(s) { return m_final_class.get(s) }
var other = function(s) { return m_other.get(s) }
var isSpecial = function(s) { return m_special.contains(s) }
var isSuperscript = function(s) { return m_superscripts.containsKey(s) }
var superscript = function(sup, below) {
	var tmpSet = m_superscripts.get(sup);
	if (tmpSet == null) return false;
	return tmpSet.contains(below);
}
var isSubscript = function(s) { return m_subscripts.containsKey(s) }
var subscript = function(sub, above) {
	var tmpSet = m_subscripts.get(sub);
	if (tmpSet == null) return false;
	return tmpSet.contains(above);
}
var isPrefix = function(s) { return m_prefixes.containsKey(s) }
var prefix = function(pref, after) {
	var tmpSet = m_prefixes.get(pref);
	if (tmpSet == null) return false;
	return tmpSet.contains(after);
}
var isSuffix = function(s) { return m_suffixes.contains(s) }
var isSuff2 = function(s) { return m_suff2.containsKey(s) }
var suff2 = function(suff, before) {
	var tmpSet = m_suff2.get(suff);
	if (tmpSet == null) return false;
	return tmpSet.contains(before);
}
var ambiguous_key = function(syll) { return m_ambiguous_key.get(syll) }
var ambiguous_wylie = function(syll) { return m_ambiguous_wylie.get(syll) }
var tib_top = function(c) { return m_tib_top.get(c) }
var tib_subjoined = function(c) { return m_tib_subjoined.get(c) }
var tib_vowel = function(c) { return m_tib_vowel.get(c) }
var tib_vowel_long = function(s) { return m_tib_vowel_long.get(s) }
var tib_final_wylie = function(c) { return m_tib_final_wylie.get(c) }
var tib_final_class = function(c) { return m_tib_final_class.get(c) }
var tib_caret = function(s) { return m_tib_caret.get(s) }
var tib_other = function(c) { return m_tib_other.get(c) }
var tib_stack = function(s) { return m_tib_stacks.contains(s) }

// does this string consist of only hexadecimal digits?
function validHex(t) {
	for (var i = 0; i < t.length; i++) {
		var c = t.charAt(i);
		if (!((c >= 'a' && c <= 'f') || (c >= '0' && c <= '9'))) return false;
	}
	return true;
}

// generate a warning if we are keeping them; prints it out if we were asked to
// handle a Wylie unicode escape, \\uxxxx or \\Uxxxxxxxx
function unicodeEscape (warns, line, t) { // [], int, str
	var hex = t.substring(2);
	if (hex == '') return null;
	if (!validHex(hex)) {
		warnl(warns, line, "\"" + t + "\": invalid hex code.");
		return "";
	}
	return String.fromCharCode(parseInt(hex, 16))
}

function warn(warns, str) {
	if (warns != null) warns.push(str);
	if (opt.print_warnings) console.log(str);
}

// warn with line number
function warnl(warns, line, str) {
	warn(warns, "line " + line + ": " + str);
}

function fromWylieOneTsekbar(tokens, i) { // (str, int)
	var orig_i = i
	var t = tokens[i]
	// variables for tracking the state within the syllable as we parse it
	var stack = null
	var prev_cons = ''
	var visarga = false
	// variables for checking the root letter, after parsing a whole tsekbar made of only single
	// consonants and one consonant with "a" vowel
	var check_root = true
	var consonants = [] // strings
	var root_idx = -1
	var out = ''
	var warns = []
	// the type of token that we are expecting next in the input stream
	//   - PREFIX : expect a prefix consonant, or a main stack
	//   - MAIN   : expect only a main stack
	//   - SUFF1  : expect a 1st suffix 
	//   - SUFF2  : expect a 2nd suffix
	//   - NONE   : expect nothing (after a 2nd suffix)
	//
	// the state machine is actually more lenient than this, in that a "main stack" is allowed
	// to come at any moment, even after suffixes.  this is because such syllables are sometimes
	// found in abbreviations or other places.  basically what we check is that prefixes and 
	// suffixes go with what they are attached to.
	//
	// valid tsek-bars end in one of these states: SUFF1, SUFF2, NONE
	var state = State.PREFIX;

	// iterate over the stacks of a tsek-bar
	STACK:
	while (t != null && (vowel(t) != null || consonant(t) != null) && !visarga) {
		// translate a stack
		if (stack != null) prev_cons = stack.single_consonant;
		stack = fromWylieOneStack(tokens, i);
		i += stack.tokens_used;
		t = tokens[i];
		out += stack.uni_string;
		warns = warns.concat(stack.warns);
		visarga = stack.visarga;
		if (!opt.check) continue;
		// check for syllable structure consistency by iterating a simple state machine
		// - prefix consonant
		if (state == State.PREFIX && stack.single_consonant != null) {
			consonants.push(stack.single_consonant);
			if (isPrefix(stack.single_consonant)) {
			var next = t;
			if (opt.check_strict) next = consonantString(tokens, i);
			if (next != null && !prefix(stack.single_consonant, next)) {
				next = next.replace(/\+/g, "");
				warns.push("Prefix \"" + stack.single_consonant + "\" does not occur before \"" + next + "\".");
			}
		} else {
			warns.push("Invalid prefix consonant: \"" + stack.single_consonant + "\".");
		}
		state = State.MAIN;
		// - main stack with vowel or multiple consonants
		} else if (stack.single_consonant == null) {
		state = State.SUFF1;
		// keep track of the root consonant if it was a single cons with an "a" vowel
		if (root_idx >= 0) {
			check_root = false;
		} else if (stack.single_cons_a != null) {
			consonants.push(stack.single_cons_a);
			root_idx = consonants.length - 1;
		}
		// - unexpected single consonant after prefix
		} else if (state == State.MAIN) {
			warns.push("Expected vowel after \"" + stack.single_consonant + "\".");
			// - 1st suffix
		} else if (state == State.SUFF1) {
			consonants.push(stack.single_consonant);
			// check this one only in strict mode b/c it trips on lots of Skt stuff
			if (opt.check_strict) {
				if (!isSuffix(stack.single_consonant)) {
					warns.push("Invalid suffix consonant: \"" + stack.single_consonant + "\".");
				}
			}
			state = State.SUFF2;
			// - 2nd suffix
		} else if (state == State.SUFF2) {
			consonants.push(stack.single_consonant);
			if (isSuff2(stack.single_consonant)) {
				if (!suff2(stack.single_consonant, prev_cons)) {
					warns.push("Second suffix \"" + stack.single_consonant 
					+ "\" does not occur after \"" + prev_cons + "\".");
				}
			} else {
				warns.push("Invalid 2nd suffix consonant: \"" + stack.single_consonant  + "\".");
			}
			state = State.NONE;
			// - more crap after a 2nd suffix
		} else if (state == State.NONE) {
			warns.push("Cannot have another consonant \"" + stack.single_consonant + "\" after 2nd suffix.");
		}
	}

	if (state == State.MAIN && stack.single_consonant != null && isPrefix(stack.single_consonant)) {
	warns.push("Vowel expected after \"" + stack.single_consonant + "\".");
	}

	// check root consonant placement only if there were no warnings so far, and the syllable 
	// looks ambiguous.  not many checks are needed here because the previous state machine 
	// already takes care of most illegal combinations.
	if (opt.check && warns.length == 0 && check_root && root_idx >= 0) {
		// 2 letters where each could be prefix/suffix: root is 1st
		if (consonants.length == 2 && root_idx != 0 
		&& prefix(consonants[0], consonants[1]) && isSuffix(consonants[1]))
		{
			warns.push("Syllable should probably be \"" + consonants[0] + "a" + consonants[1] + "\".");

			// 3 letters where 1st can be prefix, 2nd can be postfix before "s" and last is "s":
			// use a lookup table as this is completely ambiguous.
		} else if (consonants.length == 3 && isPrefix(consonants[0]) &&
			suff2("s", consonants[1]) && consonants[2] == "s")
		{
			var cc = consonants.join("");
			cc = cc.replace(/\u2018/g, '\'');
			cc = cc.replace(/\u2019/g, '\'');	// typographical quotes
			var expect_key = ambiguous_key(cc);
	//		console.log('typeof expect_key', typeof expect_key)
			if (expect_key != null && expect_key != root_idx) {
				warns.push("Syllable should probably be \"" + ambiguous_wylie(cc) + "\".");
			}
		}
	}
	// return the stuff as a WylieTsekbar struct
	var ret = new WylieTsekbar();
	ret.uni_string = out;
	ret.tokens_used = i - orig_i;
	ret.warns = warns;
	return ret;
}

    // Converts one stack's worth of Wylie into unicode, starting at the given index
    // within the array of tokens.
    // Assumes that the first available token is valid, and is either a vowel or a consonant.
    // Returns a WylieStack object.
function fromWylieOneStack(tokens, i) {
	var orig_i = i
	var t = '', t2 = '', o = ''
	var out = ''
	var warns = []
	var consonants = 0		// how many consonants found
	var vowel_found = null; // any vowels (including a-chen)
	var vowel_sign = null; // any vowel signs (that go under or above the main stack)
	var single_consonant = null; // did we find just a single consonant?
	var plus = false;		// any explicit subjoining via '+'?
	var caret = 0;			// find any '^'?
	var final_found = new newHashMap(); // keep track of finals (H, M, etc) by class

	// do we have a superscript?
	t = tokens[i]
	t2 = tokens[i + 1]
	if (t2 != null && isSuperscript(t) && superscript(t, t2)) {
		if (opt.check_strict) {
			var next = consonantString(tokens, i + 1);
			if (!superscript(t, next)) {
				next = next.replace(/\+/g, '')
				warns.push("Superscript \"" + t + "\" does not occur above combination \"" + next + "\".");
			}
		}
		out += consonant(t);
		consonants++;
		i++;
		while (tokens[i] != null && tokens[i] == ("^")) { caret++; i++; }
	}
	// main consonant + stuff underneath.
	// this is usually executed just once, but the "+" subjoining operator makes it come back here
	MAIN: 
	while (true) {
		// main consonant (or a "a" after a "+")
		t = tokens[i];
		if (consonant(t) != null || (out.length > 0 && subjoined(t) != null)) {
			if (out.length > 0) {
				out += (subjoined(t));
			} else {
				out += (consonant(t));
			}
			i++;

			if (t == "a") {
				vowel_found = "a";
			} else {
				consonants++;
				single_consonant = t;
			}

			while (tokens[i] != null && tokens[i] == "^") {
				caret++;
				i++;
			}
			// subjoined: rata, yata, lata, wazur.  there can be up two subjoined letters in a stack.
			for (var z = 0; z < 2; z++) {
				t2 = tokens[i];
				if (t2 != null && isSubscript(t2)) {
					// lata does not occur below multiple consonants 
					// (otherwise we mess up "brla" = "b.r+la")
					if (t2 == "l" && consonants > 1) break;
					// full stack checking (disabled by "+")
					if (opt.check_strict && !plus) {
						var prev = consonantStringBackwards(tokens, i-1, orig_i);
						if (!subscript(t2, prev)) {
							prev = prev.replace(/\+/g, "");
							warns.push("Subjoined \"" + t2 + "\" not expected after \"" + prev + "\".");
						}
						// simple check only
					} else if (opt.check) {
						if (!subscript(t2, t) && !(z == 1 && t2 == ("w") && t == ("y"))) {
							warns.push("Subjoined \"" + t2 + "\"not expected after \"" + t + "\".");
						}
					}
					out += subjoined(t2);
					i++;
					consonants++;
					while (tokens[i] != null && tokens[i] == ("^")) { caret++; i++; }
					t = t2;
				} else {
					break;
				}
			}
		}

		// caret (^) can come anywhere in Wylie but in Unicode we generate it at the end of 
		// the stack but before vowels if it came there (seems to be what OpenOffice expects),
		// or at the very end of the stack if that's how it was in the Wylie.
		if (caret > 0) {
			if (caret > 1) {
				warns.push("Cannot have more than one \"^\" applied to the same stack.");
			}
			final_found.put(final_class("^"), "^");
			out += (final_uni("^"));
			caret = 0;
		}
		// vowel(s)
		t = tokens[i];
		if (t != null && vowel(t) != null) {
			if (out.length == 0) out += (vowel("a"));
			if (t != "a") out += (vowel(t));
			i++;
			vowel_found = t;
			if (t != "a") vowel_sign = t;
		}
		// plus sign: forces more subjoining
		t = tokens[i];
		if (t != null && t == ("+")) {
			i++;
			plus = true;
			// sanity check: next token must be vowel or subjoinable consonant.  
			t = tokens[i];
			if (t == null || (vowel(t) == null && subjoined(t) == null)) {
				if (opt.check) warns.push("Expected vowel or consonant after \"+\".");
				break MAIN;
			}
			// consonants after vowels doesn't make much sense but process it anyway
			if (opt.check) {
				if (vowel(t) == null && vowel_sign != null) {
					warns.push("Cannot subjoin consonant (" + t + ") after vowel (" + vowel_sign + ") in same stack.");
				} else if (t == ("a") && vowel_sign != null) {
					warns.push("Cannot subjoin a-chen (a) after vowel (" + vowel_sign + ") in same stack.");
				}
			}
			continue MAIN;
		}
		break MAIN;
	}
	// final tokens
	t = tokens[i];
	while (t != null && final_class(t) != null) {
		var uni = final_uni(t);
		var klass = final_class(t);
		// check for duplicates
		if (final_found.containsKey(klass)) {
			if (final_found.get(klass) == t) {
				warns.push("Cannot have two \"" + t + "\" applied to the same stack.");
			} else {
				warns.push("Cannot have \"" + t + "\" and \"" + final_found.get(klass)
					+ "\" applied to the same stack.");
			}
		} else {
			final_found.put(klass, t);
			out += (uni);
		}
		i++;
		single_consonant = null;
		t = tokens[i];
	}
	// if next is a dot "." (stack separator), skip it.
	if (tokens[i] != null && tokens[i] == (".")) i++;
	// if we had more than a consonant and no vowel, and no explicit "+" joining, backtrack and 
	// return the 1st consonant alone
	if (consonants > 1 && vowel_found == null) {
		if (plus) {
			if (opt.check) warns.push("Stack with multiple consonants should end with vowel.");
		} else {
			i = orig_i + 1;
			consonants = 1;
			single_consonant = tokens[orig_i];
			out = '';
			out += (consonant(single_consonant));
		}
	}
	// calculate "single consonant"
	if (consonants != 1 || plus) {
		single_consonant = null;
	}
	// return the stuff as a WylieStack struct
	var ret = new WylieStack();
	ret.uni_string = out;
	ret.tokens_used = i - orig_i;
	if (vowel_found != null) {
		ret.single_consonant = null;
	} else {
		ret.single_consonant = single_consonant;
	}

	if (vowel_found != null && vowel_found == ("a")) {
		ret.single_cons_a = single_consonant;
	} else {
		ret.single_cons_a = null;
	}
	ret.warns = warns;
	ret.visarga = final_found.containsKey("H");
	return ret;
}

	// Converts a Wylie (EWTS) string to unicode.  If 'warns' is not 'null', puts warnings into it.
function fromWylie(str, warns) {
		var out = '', line = 1, units = 0, i = 0
		if (opt.fix_spacing) { str = str.replace(/^\s+/, '') }
		var tokens = splitIntoTokens(str);
		ITER:while (tokens[i] != null) {
			var t = tokens[i], o = null
			// [non-tibetan text] : pass through, nesting brackets
			if (t == "[") {
				var nesting = 1;
				i++;
					ESC:while (tokens[i] != null) {
					t = tokens[i++];
					if (t == "[") nesting++;
					if (t == "]") nesting--;
					if (nesting == 0) continue ITER;
					// handle unicode escapes and \1-char escapes within [comments]...
					if (t.charAt(0) == '\\' && (t.charAt(1) == 'u' || t.charAt(1) == 'U')) {
						o = unicodeEscape(warns, line, t);
						if (o != null) {
							out += o;
							continue ESC;
						}
					}
					if (t.charAt(0) == '\\') {
						o = t.substring(1);
					} else {
						o = t;
					}
					out += o;
				}
				warnl(warns, line, "Unfinished [non-Wylie stuff].");
				break ITER;
			}
			// punctuation, numbers, etc
			o = other(t);
			if (o != null) {
				out += o;
				i++;
				units++;
				// collapse multiple spaces?
				if (t == " " && opt.fix_spacing) {
					while (tokens[i] != null && tokens[i] == " ") i++;
				}
				continue ITER;
			}
			// vowels & consonants: process tibetan script up to a tsek, punctuation or line noise
			if (vowel(t) != null || consonant(t) != null) {
				var tb = fromWylieOneTsekbar(tokens, i);
				var word = '';
				for (var j = 0; j < tb.tokens_used; j++) {
					word += (tokens[i+j]);
				}
				out += tb.uni_string;
				i += tb.tokens_used;
				units++;
				for (var w = 0; w < tb.warns.length; w++) {
					warnl(warns, line, "\"" + word + "\": " + tb.warns[w]);
				}
				continue ITER;
			}
			// *** misc unicode and line handling stuff ***
			// ignore BOM and zero-width space
			if (t == "\ufeff" || t == "\u200b") {
				i++;
				continue ITER;
			}
			// \\u, \\U unicode characters
			if (t.charAt(0) == '\\' && (t.charAt(1) == 'u' || t.charAt(1) == 'U')) {
				o = unicodeEscape(warns, line, t);
				if (o != null) {
					i++;
					out += o;
					continue ITER;
				}
			}
			// backslashed characters
			if (t.charAt(0) == '\\') {
				out += t.substring(1);
				i++;
				continue ITER;
			}
			// count lines
			if (t == "\r\n" || t == "\n" || t == "\r") {
				line++;
				out += t;
				i++;
				// also eat spaces after newlines (optional)
				if (opt.fix_spacing) {
					while (tokens[i] != null && tokens[i] == " ") i++;
				}
				continue ITER;
			}
			// stuff that shouldn't occur out of context: special chars and remaining [a-zA-Z]
			var c = t.charAt(0);
			if (isSpecial(t) || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
				warnl(warns, line, "Unexpected character \"" + t + "\".");
			}
			// anything else: pass through
			out += t;
			i++;
		}
		if (units == 0) warn(warns, "No Tibetan characters found!");
		return out
	}
	
	// given a character, return a string like "\\uxxxx", with its code in hex
function formatHex(t) { //char
		// not compatible with GWT...
		// return String.format("\\u%04x", (int)t);
		var sb = '';
		sb += '\\u';
		var s = t.charCodeAt(0).toString(16);
		for (var i = s.length; i < 4; i++) sb += '0';
		sb += s;
		return sb;
	}

	// handles spaces (if any) in the input stream, turning them into '_'.
	// this is abstracted out because in non-escaping mode, we only want to turn spaces into _
	// when they come in the middle of Tibetan script.
function handleSpaces(str, i, out) { //return int
	var found = 0;
	var orig_i = i;
	while (i < str.length && str.charAt(i) == ' ') {
		i++;
		found++;
	}
	if (found == 0 || i == str.length) return 0;
	var t = str.charAt(i);
	if (tib_top(t) == null && tib_other(t) == null) return 0;
	// found 'found' spaces between two tibetan bits; generate the same number of '_'s
	for (i = 0; i < found; i++) out += '_';
	return found;
}

// for space-handling in escaping mode: is the next thing coming (after a number of spaces)
// some non-tibetan bit, within the same line?
function followedByNonTibetan(str, i) {
	var len = str.length;
	while (i < len && str.charAt(i) == ' ') i++;
	if (i == len) return false;
	var t = str.charAt(i);
	return tib_top(t) == null && tib_other(t) == null && t != '\r' && t != '\n';
}

// Convert Unicode to Wylie: one tsekbar
function toWylieOneTsekbar(str, len, i) {
	var orig_i = i;
	var warns = [];
	var stacks = [];// ArrayList<ToWylieStack>;
	ITER: 
	while (true) {
		var st = toWylieOneStack(str, len, i);
		stacks.push(st);
		warns = warns.concat(st.warns);
		i += st.tokens_used;
		if (st.visarga) break ITER;
		if (i >= len || tib_top(str.charAt(i)) == null) break ITER;
	}
	// figure out if some of these stacks can be prefixes or suffixes (in which case
	// they don't need their "a" vowels)
	var last = stacks.length - 1;
	if (stacks.length > 1 && stacks[0].single_cons != null) {
		// we don't count the wazur in the root stack, for prefix checking
		var cs = stacks[1].cons_str.replace(/\+w/g, "")
		if (prefix(stacks[0].single_cons, cs)) stacks[0].prefix = true;
	}
	if (stacks.length > 1 && stacks[last].single_cons != null 
	&& isSuffix(stacks[last].single_cons)) {
		stacks[last].suffix = true;
	}
	if (stacks.length > 2 && stacks[last].single_cons != null 
	&& stacks[last - 1].single_cons != null
	&& isSuffix(stacks[last - 1].single_cons)
	&& suff2(stacks[last].single_cons, stacks[last - 1].single_cons)) {
		stacks[last].suff2 = true;
		stacks[last - 1].suffix = true;
	}
	// if there are two stacks and both can be prefix-suffix, then 1st is root
	if (stacks.length == 2 && stacks[0].prefix && stacks[1].suffix) {
	    stacks[0].prefix = false;
	}
	// if there are three stacks and they can be prefix, suffix and suff2, then check w/ a table
	if (stacks.length == 3 && stacks[0].prefix && stacks[1].suffix && stacks[2].suff2) {
		var strb = []
		for (var si = 0; si < stacks.length; si++) strb.push(stacks[si].single_cons)
		var ztr = strb.join('')
		var root = ambiguous_key(ztr)
		if (root == null) {
			warns.push("Ambiguous syllable found: root consonant not known for \"" + ztr + "\".")
			// make it up...  (ex. "mgas" for ma, ga, sa)
			root = 1
		}
		stacks[root].prefix = stacks[root].suffix = false
		stacks[root + 1].suff2 = false
	}
	// if the prefix together with the main stack could be mistaken for a single stack, add a "."
	if (stacks[0].prefix && tib_stack(stacks[0].single_cons + "+" + stacks[1].cons_str)) 
		stacks[0].dot = true;
	// put it all together
	var out = ''
	for (var si = 0; si < stacks.length; si++) out += putStackTogether(stacks[si])
	var ret = new ToWylieTsekbar();
	ret.wylie = out;
	ret.tokens_used = i - orig_i;
	ret.warns = warns;
	return ret;
}
	 
// Unicode to Wylie: one stack at a time
function toWylieOneStack(str, len, i) {
	var orig_i = i;
	var ffinal = null, vowel = null, klass = null;
	// split the stack into a ToWylieStack object:
	//   - top symbol
	//   - stacked signs (first is the top symbol again, then subscribed main characters...)
	//   - caret (did we find a stray tsa-phru or not?)
	//   - vowel signs (including small subscribed a-chung, "-i" Skt signs, etc)
	//   - final stuff (including anusvara, visarga, halanta...)
	//   - and some more variables to keep track of what has been found
	var st = new ToWylieStack();
	// assume: tib_top(t) exists
	var t = str.charAt(i++);
	st.top = tib_top(t);
	st.stack.push(tib_top(t));
	// grab everything else below the top sign and classify in various categories
	while (i < len) {
		t = str.charAt(i);
		var o;
		if ((o = tib_subjoined(t)) != null) {
			i++;
			st.stack.push(o);
			// check for bad ordering
			if (st.finals.length > 0) {
				st.warns.push("Subjoined sign \"" + o + "\" found after final sign \"" + ffinal + "\".");
			} else if (st.vowels.length > 0) {
				st.warns.push("Subjoined sign \"" + o + "\" found after vowel sign \"" + vowel + "\".");
			}
		} else if ((o = tib_vowel(t)) != null) {
			i++;
			st.vowels.push(o);
			if (vowel == null) vowel = o;
			// check for bad ordering
			if (st.finals.length > 0) {
				st.warns.push("Vowel sign \"" + o + "\" found after final sign \"" + ffinal + "\".");
			}
		} else if ((o = tib_final_wylie(t)) != null) {
			i++;
			klass = tib_final_class(t);
			if (o == "^") {
				st.caret = true;
			} else {
				if (o == "H") st.visarga = true;
				st.finals.push(o);
				if (ffinal == null) ffinal = o;
				// check for invalid combinations
				if (st.finals_found.containsKey(klass)) {
					st.warns.push("Final sign \"" + o 
					+ "\" should not combine with found after final sign \"" + ffinal + "\".");
				} else {
					st.finals_found.put(klass, o);
				}
			}
		} else break;
	}
	// now analyze the stack according to various rules
	// a-chen with vowel signs: remove the "a" and keep the vowel signs
	if (st.top == "a" && st.stack.length == 1 && st.vowels.length > 0) st.stack.shift();
	// handle long vowels: A+i becomes I, etc.
	if (st.vowels.length > 1 && st.vowels[0] == "A" && tib_vowel_long(st.vowels[1]) != null) {
		var l = tib_vowel_long(st.vowels[1]);
		st.vowels.shift();
		st.vowels.shift();
		st.vowels.unshift(l);
	}
	// special cases: "ph^" becomes "f", "b^" becomes "v"
	if (st.caret && st.stack.length == 1 && tib_caret(st.top) != null) {
		var l = tib_caret(st.top);
		st.top = l;
		st.stack.shift();
		st.stack.unshift(l);
		st.caret = false;
	}
	st.cons_str = st.stack.join("+");
	// if this is a single consonant, keep track of it (useful for prefix/suffix analysis)
	if (st.stack.length == 1 && st.stack[0] != ("a") && !st.caret 
	&& st.vowels.length == 0 && st.finals.length == 0) {
		st.single_cons = st.cons_str;
	}
	// return the analyzed stack
	st.tokens_used = i - orig_i;
	return st;
}

// Puts an analyzed stack together into Wylie output, adding an implicit "a" if needed.
function putStackTogether(st) {
	var out = '';
	// put the main elements together... stacked with "+" unless it's a regular stack
	if (tib_stack(st.cons_str)) {
	    out += st.stack.join("");
	} else out += (st.cons_str);
	// caret (tsa-phru) goes here as per some (halfway broken) Unicode specs...
	if (st.caret) out += ("^");
	// vowels...
	if (st.vowels.length > 0) {
		out += st.vowels.join("+");
	} else if (!st.prefix && !st.suffix && !st.suff2
	&& (st.cons_str.length == 0 || st.cons_str.charAt(st.cons_str.length - 1) != 'a')) {
		out += "a"
	}
	// final stuff
	out += st.finals.join("");
	if (st.dot) out += ".";
	return out;
}

	// Converts from Unicode strings to Wylie (EWTS) transliteration.
	//
	// Arguments are:
	//    str   : the unicode string to be converted
	//    escape: whether to escape non-tibetan characters according to Wylie encoding.
	//            if escape == false, anything that is not tibetan will be just passed through.
	//
	// Returns: the transliterated string.
	//
	// To get the warnings, call getWarnings() afterwards.

function toWylie(str, warns, escape) {
	if (escape == undefined) escape = true
	var out = ''
	var line = 1
	var units = 0
	// globally search and replace some deprecated pre-composed Sanskrit vowels
	str = str.replace(/\u0f76/g, "\u0fb2\u0f80")
	str = str.replace(/\u0f77/g, "\u0fb2\u0f71\u0f80")
	str = str.replace(/\u0f78/g, "\u0fb3\u0f80")
	str = str.replace(/\u0f79/g, "\u0fb3\u0f71\u0f80")
	str = str.replace(/\u0f81/g, "\u0f71\u0f80")
	var i = 0
	var len = str.length
	// iterate over the string, codepoint by codepoint
	ITER:
	while (i < len) {
		var t = str.charAt(i);
		// found tibetan script - handle one tsekbar
		if (tib_top(t) != null) {
			var tb = toWylieOneTsekbar(str, len, i);
			out += tb.wylie;
			i += tb.tokens_used;
			units++;
			for (var w = 0; w < tb.warns.length; w++) warnl(warns, line, tb.warns[w]);
			if (!escape) i += handleSpaces(str, i, out);
			continue ITER;
		}
		// punctuation and special stuff. spaces are tricky:
		// - in non-escaping mode: spaces are not turned to '_' here (handled by handleSpaces)
		// - in escaping mode: don't do spaces if there is non-tibetan coming, so they become part
		//   of the [escaped block].
		var o = tib_other(t);
		if (o != null && (t != ' ' || (escape && !followedByNonTibetan(str, i)))) {
			out += o;
			i++;
			units++;
			if (!escape) i += handleSpaces(str, i, out);
			continue ITER;
		}
		// newlines, count lines.  "\r\n" together count as one newline.
		if (t == '\r' || t == '\n') {
			line++;
			i++;
			out += t;
			if (t == '\r' && i < len && str.charAt(i) == '\n') {
				i++;
				out += ('\n');
			}
			continue ITER;
		}
		// ignore BOM and zero-width space
		if (t == '\ufeff' || t == '\u200b') {
			i++;
			continue ITER;
		}
		// anything else - pass along?
		if (!escape) {
			out += (t);
			i++;
			continue ITER;
		}
		// other characters in the tibetan plane, escape with \\u0fxx
		if (t >= '\u0f00' && t <= '\u0fff') {
			var c = formatHex(t);
			out += c;
			i++;
			// warn for tibetan codepoints that should appear only after a tib_top
			if (tib_subjoined(t) != null || tib_vowel(t) != null || tib_final_wylie(t) != null) {
				warnl(warns, line, "Tibetan sign " + c + " needs a top symbol to attach to.");
			}
			continue ITER;
		}
		// ... or escape according to Wylie:
		// put it in [comments], escaping [] sequences and closing at line ends
		out += "[";
		while (tib_top(t) == null && (tib_other(t) == null || t == ' ') && t != '\r' && t != '\n') {
			// \escape [opening and closing] brackets
			if (t == '[' || t == ']') {
				out += "\\";
				out += t;
			// unicode-escape anything in the tibetan plane (i.e characters not handled by Wylie)
			} else if (t >= '\u0f00' && t <= '\u0fff') {
				out += formatHex(t);
				// and just pass through anything else!
			} else {
				out += t;
			}
			if (++i >= len) break;
			t = str.charAt(i);
		}
		 out += "]";
	}
	return out;
}
module.exports= {
		fromWylie: fromWylie,
		toWylie: toWylie,
		setopt: setopt,
		getopt: function() { return opt },
		five: function() {
			return 555;
		}
}



});
require.register("ksana-document/languages.js", function(exports, require, module){
var tibetan={
	romanize:require("./tibetan/wylie")
}
var chinese={};
var languages={
	tibetan:tibetan
	,chinese:chinese
}

module.exports=languages;
});
require.register("ksana-document/diff.js", function(exports, require, module){
/**
 * Diff Match and Patch
 *
 * Copyright 2006 Google Inc.
 * http://code.google.com/p/google-diff-match-patch/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Computes the difference between two texts to create a patch.
 * Applies the patch onto another text, allowing for errors.
 * @author fraser@google.com (Neil Fraser)
 */

/**
 * Class containing the diff, match and patch methods.
 * @constructor
 */
function diff_match_patch() {

  // Defaults.
  // Redefine these in your program to override the defaults.

  // Number of seconds to map a diff before giving up (0 for infinity).
  this.Diff_Timeout = 1.0;
  // Cost of an empty edit operation in terms of edit characters.
  this.Diff_EditCost = 4;
  // At what point is no match declared (0.0 = perfection, 1.0 = very loose).
  this.Match_Threshold = 0.5;
  // How far to search for a match (0 = exact location, 1000+ = broad match).
  // A match this many characters away from the expected location will add
  // 1.0 to the score (0.0 is a perfect match).
  this.Match_Distance = 1000;
  // When deleting a large block of text (over ~64 characters), how close do
  // the contents have to be to match the expected contents. (0.0 = perfection,
  // 1.0 = very loose).  Note that Match_Threshold controls how closely the
  // end points of a delete need to match.
  this.Patch_DeleteThreshold = 0.5;
  // Chunk size for context length.
  this.Patch_Margin = 4;

  // The number of bits in an int.
  this.Match_MaxBits = 32;
}


//  DIFF FUNCTIONS


/**
 * The data structure representing a diff is an array of tuples:
 * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
 * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
 */
var DIFF_DELETE = -1;
var DIFF_INSERT = 1;
var DIFF_EQUAL = 0;

/** @typedef {{0: number, 1: string}} */
diff_match_patch.Diff;


/**
 * Find the differences between two texts.  Simplifies the problem by stripping
 * any common prefix or suffix off the texts before diffing.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {boolean=} opt_checklines Optional speedup flag. If present and false,
 *     then don't run a line-level diff first to identify the changed areas.
 *     Defaults to true, which does a faster, slightly less optimal diff.
 * @param {number} opt_deadline Optional time when the diff should be complete
 *     by.  Used internally for recursive calls.  Users should set DiffTimeout
 *     instead.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 */
diff_match_patch.prototype.diff_main = function(text1, text2, opt_checklines,
    opt_deadline) {
  // Set a deadline by which time the diff must be complete.
  if (typeof opt_deadline == 'undefined') {
    if (this.Diff_Timeout <= 0) {
      opt_deadline = Number.MAX_VALUE;
    } else {
      opt_deadline = (new Date).getTime() + this.Diff_Timeout * 1000;
    }
  }
  var deadline = opt_deadline;

  // Check for null inputs.
  if (text1 == null || text2 == null) {
    throw new Error('Null input. (diff_main)');
  }

  // Check for equality (speedup).
  if (text1 == text2) {
    if (text1) {
      return [[DIFF_EQUAL, text1]];
    }
    return [];
  }

  if (typeof opt_checklines == 'undefined') {
    opt_checklines = true;
  }
  var checklines = opt_checklines;

  // Trim off common prefix (speedup).
  var commonlength = this.diff_commonPrefix(text1, text2);
  var commonprefix = text1.substring(0, commonlength);
  text1 = text1.substring(commonlength);
  text2 = text2.substring(commonlength);

  // Trim off common suffix (speedup).
  commonlength = this.diff_commonSuffix(text1, text2);
  var commonsuffix = text1.substring(text1.length - commonlength);
  text1 = text1.substring(0, text1.length - commonlength);
  text2 = text2.substring(0, text2.length - commonlength);

  // Compute the diff on the middle block.
  var diffs = this.diff_compute_(text1, text2, checklines, deadline);

  // Restore the prefix and suffix.
  if (commonprefix) {
    diffs.unshift([DIFF_EQUAL, commonprefix]);
  }
  if (commonsuffix) {
    diffs.push([DIFF_EQUAL, commonsuffix]);
  }
  this.diff_cleanupMerge(diffs);
  return diffs;
};


/**
 * Find the differences between two texts.  Assumes that the texts do not
 * have any common prefix or suffix.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {boolean} checklines Speedup flag.  If false, then don't run a
 *     line-level diff first to identify the changed areas.
 *     If true, then run a faster, slightly less optimal diff.
 * @param {number} deadline Time when the diff should be complete by.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_compute_ = function(text1, text2, checklines,
    deadline) {
  var diffs;

  if (!text1) {
    // Just add some text (speedup).
    return [[DIFF_INSERT, text2]];
  }

  if (!text2) {
    // Just delete some text (speedup).
    return [[DIFF_DELETE, text1]];
  }

  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  var i = longtext.indexOf(shorttext);
  if (i != -1) {
    // Shorter text is inside the longer text (speedup).
    diffs = [[DIFF_INSERT, longtext.substring(0, i)],
             [DIFF_EQUAL, shorttext],
             [DIFF_INSERT, longtext.substring(i + shorttext.length)]];
    // Swap insertions for deletions if diff is reversed.
    if (text1.length > text2.length) {
      diffs[0][0] = diffs[2][0] = DIFF_DELETE;
    }
    return diffs;
  }

  if (shorttext.length == 1) {
    // Single character string.
    // After the previous speedup, the character can't be an equality.
    return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
  }

  // Check to see if the problem can be split in two.
  var hm = this.diff_halfMatch_(text1, text2);
  if (hm) {
    // A half-match was found, sort out the return data.
    var text1_a = hm[0];
    var text1_b = hm[1];
    var text2_a = hm[2];
    var text2_b = hm[3];
    var mid_common = hm[4];
    // Send both pairs off for separate processing.
    var diffs_a = this.diff_main(text1_a, text2_a, checklines, deadline);
    var diffs_b = this.diff_main(text1_b, text2_b, checklines, deadline);
    // Merge the results.
    return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
  }

  if (checklines && text1.length > 100 && text2.length > 100) {
    return this.diff_lineMode_(text1, text2, deadline);
  }

  return this.diff_bisect_(text1, text2, deadline);
};


/**
 * Do a quick line-level diff on both strings, then rediff the parts for
 * greater accuracy.
 * This speedup can produce non-minimal diffs.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} deadline Time when the diff should be complete by.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_lineMode_ = function(text1, text2, deadline) {
  // Scan the text on a line-by-line basis first.
  var a = this.diff_linesToChars_(text1, text2);
  text1 = a.chars1;
  text2 = a.chars2;
  var linearray = a.lineArray;

  var diffs = this.diff_main(text1, text2, false, deadline);

  // Convert the diff back to original text.
  this.diff_charsToLines_(diffs, linearray);
  // Eliminate freak matches (e.g. blank lines)
  this.diff_cleanupSemantic(diffs);

  // Rediff any replacement blocks, this time character-by-character.
  // Add a dummy entry at the end.
  diffs.push([DIFF_EQUAL, '']);
  var pointer = 0;
  var count_delete = 0;
  var count_insert = 0;
  var text_delete = '';
  var text_insert = '';
  while (pointer < diffs.length) {
    switch (diffs[pointer][0]) {
      case DIFF_INSERT:
        count_insert++;
        text_insert += diffs[pointer][1];
        break;
      case DIFF_DELETE:
        count_delete++;
        text_delete += diffs[pointer][1];
        break;
      case DIFF_EQUAL:
        // Upon reaching an equality, check for prior redundancies.
        if (count_delete >= 1 && count_insert >= 1) {
          // Delete the offending records and add the merged ones.
          diffs.splice(pointer - count_delete - count_insert,
                       count_delete + count_insert);
          pointer = pointer - count_delete - count_insert;
          var a = this.diff_main(text_delete, text_insert, false, deadline);
          for (var j = a.length - 1; j >= 0; j--) {
            diffs.splice(pointer, 0, a[j]);
          }
          pointer = pointer + a.length;
        }
        count_insert = 0;
        count_delete = 0;
        text_delete = '';
        text_insert = '';
        break;
    }
    pointer++;
  }
  diffs.pop();  // Remove the dummy entry at the end.

  return diffs;
};


/**
 * Find the 'middle snake' of a diff, split the problem in two
 * and return the recursively constructed diff.
 * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} deadline Time at which to bail if not yet complete.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_bisect_ = function(text1, text2, deadline) {
  // Cache the text lengths to prevent multiple calls.
  var text1_length = text1.length;
  var text2_length = text2.length;
  var max_d = Math.ceil((text1_length + text2_length) / 2);
  var v_offset = max_d;
  var v_length = 2 * max_d;
  var v1 = new Array(v_length);
  var v2 = new Array(v_length);
  // Setting all elements to -1 is faster in Chrome & Firefox than mixing
  // integers and undefined.
  for (var x = 0; x < v_length; x++) {
    v1[x] = -1;
    v2[x] = -1;
  }
  v1[v_offset + 1] = 0;
  v2[v_offset + 1] = 0;
  var delta = text1_length - text2_length;
  // If the total number of characters is odd, then the front path will collide
  // with the reverse path.
  var front = (delta % 2 != 0);
  // Offsets for start and end of k loop.
  // Prevents mapping of space beyond the grid.
  var k1start = 0;
  var k1end = 0;
  var k2start = 0;
  var k2end = 0;
  for (var d = 0; d < max_d; d++) {
    // Bail out if deadline is reached.
    if ((new Date()).getTime() > deadline) {
      break;
    }

    // Walk the front path one step.
    for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
      var k1_offset = v_offset + k1;
      var x1;
      if (k1 == -d || (k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1])) {
        x1 = v1[k1_offset + 1];
      } else {
        x1 = v1[k1_offset - 1] + 1;
      }
      var y1 = x1 - k1;
      while (x1 < text1_length && y1 < text2_length &&
             text1.charAt(x1) == text2.charAt(y1)) {
        x1++;
        y1++;
      }
      v1[k1_offset] = x1;
      if (x1 > text1_length) {
        // Ran off the right of the graph.
        k1end += 2;
      } else if (y1 > text2_length) {
        // Ran off the bottom of the graph.
        k1start += 2;
      } else if (front) {
        var k2_offset = v_offset + delta - k1;
        if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] != -1) {
          // Mirror x2 onto top-left coordinate system.
          var x2 = text1_length - v2[k2_offset];
          if (x1 >= x2) {
            // Overlap detected.
            return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
          }
        }
      }
    }

    // Walk the reverse path one step.
    for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
      var k2_offset = v_offset + k2;
      var x2;
      if (k2 == -d || (k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1])) {
        x2 = v2[k2_offset + 1];
      } else {
        x2 = v2[k2_offset - 1] + 1;
      }
      var y2 = x2 - k2;
      while (x2 < text1_length && y2 < text2_length &&
             text1.charAt(text1_length - x2 - 1) ==
             text2.charAt(text2_length - y2 - 1)) {
        x2++;
        y2++;
      }
      v2[k2_offset] = x2;
      if (x2 > text1_length) {
        // Ran off the left of the graph.
        k2end += 2;
      } else if (y2 > text2_length) {
        // Ran off the top of the graph.
        k2start += 2;
      } else if (!front) {
        var k1_offset = v_offset + delta - k2;
        if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] != -1) {
          var x1 = v1[k1_offset];
          var y1 = v_offset + x1 - k1_offset;
          // Mirror x2 onto top-left coordinate system.
          x2 = text1_length - x2;
          if (x1 >= x2) {
            // Overlap detected.
            return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
          }
        }
      }
    }
  }
  // Diff took too long and hit the deadline or
  // number of diffs equals number of characters, no commonality at all.
  return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
};


/**
 * Given the location of the 'middle snake', split the diff in two parts
 * and recurse.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} x Index of split point in text1.
 * @param {number} y Index of split point in text2.
 * @param {number} deadline Time at which to bail if not yet complete.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_bisectSplit_ = function(text1, text2, x, y,
    deadline) {
  var text1a = text1.substring(0, x);
  var text2a = text2.substring(0, y);
  var text1b = text1.substring(x);
  var text2b = text2.substring(y);

  // Compute both diffs serially.
  var diffs = this.diff_main(text1a, text2a, false, deadline);
  var diffsb = this.diff_main(text1b, text2b, false, deadline);

  return diffs.concat(diffsb);
};


/**
 * Split two texts into an array of strings.  Reduce the texts to a string of
 * hashes where each Unicode character represents one line.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {{chars1: string, chars2: string, lineArray: !Array.<string>}}
 *     An object containing the encoded text1, the encoded text2 and
 *     the array of unique strings.
 *     The zeroth element of the array of unique strings is intentionally blank.
 * @private
 */
diff_match_patch.prototype.diff_linesToChars_ = function(text1, text2) {
  var lineArray = [];  // e.g. lineArray[4] == 'Hello\n'
  var lineHash = {};   // e.g. lineHash['Hello\n'] == 4

  // '\x00' is a valid character, but various debuggers don't like it.
  // So we'll insert a junk entry to avoid generating a null character.
  lineArray[0] = '';

  /**
   * Split a text into an array of strings.  Reduce the texts to a string of
   * hashes where each Unicode character represents one line.
   * Modifies linearray and linehash through being a closure.
   * @param {string} text String to encode.
   * @return {string} Encoded string.
   * @private
   */
  function diff_linesToCharsMunge_(text) {
    var chars = '';
    // Walk the text, pulling out a substring for each line.
    // text.split('\n') would would temporarily double our memory footprint.
    // Modifying text would create many large strings to garbage collect.
    var lineStart = 0;
    var lineEnd = -1;
    // Keeping our own length variable is faster than looking it up.
    var lineArrayLength = lineArray.length;
    while (lineEnd < text.length - 1) {
      lineEnd = text.indexOf('\n', lineStart);
      if (lineEnd == -1) {
        lineEnd = text.length - 1;
      }
      var line = text.substring(lineStart, lineEnd + 1);
      lineStart = lineEnd + 1;

      if (lineHash.hasOwnProperty ? lineHash.hasOwnProperty(line) :
          (lineHash[line] !== undefined)) {
        chars += String.fromCharCode(lineHash[line]);
      } else {
        chars += String.fromCharCode(lineArrayLength);
        lineHash[line] = lineArrayLength;
        lineArray[lineArrayLength++] = line;
      }
    }
    return chars;
  }

  var chars1 = diff_linesToCharsMunge_(text1);
  var chars2 = diff_linesToCharsMunge_(text2);
  return {chars1: chars1, chars2: chars2, lineArray: lineArray};
};


/**
 * Rehydrate the text in a diff from a string of line hashes to real lines of
 * text.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @param {!Array.<string>} lineArray Array of unique strings.
 * @private
 */
diff_match_patch.prototype.diff_charsToLines_ = function(diffs, lineArray) {
  for (var x = 0; x < diffs.length; x++) {
    var chars = diffs[x][1];
    var text = [];
    for (var y = 0; y < chars.length; y++) {
      text[y] = lineArray[chars.charCodeAt(y)];
    }
    diffs[x][1] = text.join('');
  }
};


/**
 * Determine the common prefix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the start of each
 *     string.
 */
diff_match_patch.prototype.diff_commonPrefix = function(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0)) {
    return 0;
  }
  // Binary search.
  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerstart = 0;
  while (pointermin < pointermid) {
    if (text1.substring(pointerstart, pointermid) ==
        text2.substring(pointerstart, pointermid)) {
      pointermin = pointermid;
      pointerstart = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  return pointermid;
};


/**
 * Determine the common suffix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of each string.
 */
diff_match_patch.prototype.diff_commonSuffix = function(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 ||
      text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
    return 0;
  }
  // Binary search.
  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerend = 0;
  while (pointermin < pointermid) {
    if (text1.substring(text1.length - pointermid, text1.length - pointerend) ==
        text2.substring(text2.length - pointermid, text2.length - pointerend)) {
      pointermin = pointermid;
      pointerend = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  return pointermid;
};


/**
 * Determine if the suffix of one string is the prefix of another.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of the first
 *     string and the start of the second string.
 * @private
 */
diff_match_patch.prototype.diff_commonOverlap_ = function(text1, text2) {
  // Cache the text lengths to prevent multiple calls.
  var text1_length = text1.length;
  var text2_length = text2.length;
  // Eliminate the null case.
  if (text1_length == 0 || text2_length == 0) {
    return 0;
  }
  // Truncate the longer string.
  if (text1_length > text2_length) {
    text1 = text1.substring(text1_length - text2_length);
  } else if (text1_length < text2_length) {
    text2 = text2.substring(0, text1_length);
  }
  var text_length = Math.min(text1_length, text2_length);
  // Quick check for the worst case.
  if (text1 == text2) {
    return text_length;
  }

  // Start by looking for a single character match
  // and increase length until no match is found.
  // Performance analysis: http://neil.fraser.name/news/2010/11/04/
  var best = 0;
  var length = 1;
  while (true) {
    var pattern = text1.substring(text_length - length);
    var found = text2.indexOf(pattern);
    if (found == -1) {
      return best;
    }
    length += found;
    if (found == 0 || text1.substring(text_length - length) ==
        text2.substring(0, length)) {
      best = length;
      length++;
    }
  }
};


/**
 * Do the two texts share a substring which is at least half the length of the
 * longer text?
 * This speedup can produce non-minimal diffs.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {Array.<string>} Five element Array, containing the prefix of
 *     text1, the suffix of text1, the prefix of text2, the suffix of
 *     text2 and the common middle.  Or null if there was no match.
 * @private
 */
diff_match_patch.prototype.diff_halfMatch_ = function(text1, text2) {
  if (this.Diff_Timeout <= 0) {
    // Don't risk returning a non-optimal diff if we have unlimited time.
    return null;
  }
  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
    return null;  // Pointless.
  }
  var dmp = this;  // 'this' becomes 'window' in a closure.

  /**
   * Does a substring of shorttext exist within longtext such that the substring
   * is at least half the length of longtext?
   * Closure, but does not reference any external variables.
   * @param {string} longtext Longer string.
   * @param {string} shorttext Shorter string.
   * @param {number} i Start index of quarter length substring within longtext.
   * @return {Array.<string>} Five element Array, containing the prefix of
   *     longtext, the suffix of longtext, the prefix of shorttext, the suffix
   *     of shorttext and the common middle.  Or null if there was no match.
   * @private
   */
  function diff_halfMatchI_(longtext, shorttext, i) {
    // Start with a 1/4 length substring at position i as a seed.
    var seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
    var j = -1;
    var best_common = '';
    var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
    while ((j = shorttext.indexOf(seed, j + 1)) != -1) {
      var prefixLength = dmp.diff_commonPrefix(longtext.substring(i),
                                               shorttext.substring(j));
      var suffixLength = dmp.diff_commonSuffix(longtext.substring(0, i),
                                               shorttext.substring(0, j));
      if (best_common.length < suffixLength + prefixLength) {
        best_common = shorttext.substring(j - suffixLength, j) +
            shorttext.substring(j, j + prefixLength);
        best_longtext_a = longtext.substring(0, i - suffixLength);
        best_longtext_b = longtext.substring(i + prefixLength);
        best_shorttext_a = shorttext.substring(0, j - suffixLength);
        best_shorttext_b = shorttext.substring(j + prefixLength);
      }
    }
    if (best_common.length * 2 >= longtext.length) {
      return [best_longtext_a, best_longtext_b,
              best_shorttext_a, best_shorttext_b, best_common];
    } else {
      return null;
    }
  }

  // First check if the second quarter is the seed for a half-match.
  var hm1 = diff_halfMatchI_(longtext, shorttext,
                             Math.ceil(longtext.length / 4));
  // Check again based on the third quarter.
  var hm2 = diff_halfMatchI_(longtext, shorttext,
                             Math.ceil(longtext.length / 2));
  var hm;
  if (!hm1 && !hm2) {
    return null;
  } else if (!hm2) {
    hm = hm1;
  } else if (!hm1) {
    hm = hm2;
  } else {
    // Both matched.  Select the longest.
    hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
  }

  // A half-match was found, sort out the return data.
  var text1_a, text1_b, text2_a, text2_b;
  if (text1.length > text2.length) {
    text1_a = hm[0];
    text1_b = hm[1];
    text2_a = hm[2];
    text2_b = hm[3];
  } else {
    text2_a = hm[0];
    text2_b = hm[1];
    text1_a = hm[2];
    text1_b = hm[3];
  }
  var mid_common = hm[4];
  return [text1_a, text1_b, text2_a, text2_b, mid_common];
};


/**
 * Reduce the number of edits by eliminating semantically trivial equalities.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupSemantic = function(diffs) {
  var changes = false;
  var equalities = [];  // Stack of indices where equalities are found.
  var equalitiesLength = 0;  // Keeping our own length var is faster in JS.
  /** @type {?string} */
  var lastequality = null;
  // Always equal to diffs[equalities[equalitiesLength - 1]][1]
  var pointer = 0;  // Index of current position.
  // Number of characters that changed prior to the equality.
  var length_insertions1 = 0;
  var length_deletions1 = 0;
  // Number of characters that changed after the equality.
  var length_insertions2 = 0;
  var length_deletions2 = 0;
  while (pointer < diffs.length) {
    if (diffs[pointer][0] == DIFF_EQUAL) {  // Equality found.
      equalities[equalitiesLength++] = pointer;
      length_insertions1 = length_insertions2;
      length_deletions1 = length_deletions2;
      length_insertions2 = 0;
      length_deletions2 = 0;
      lastequality = diffs[pointer][1];
    } else {  // An insertion or deletion.
      if (diffs[pointer][0] == DIFF_INSERT) {
        length_insertions2 += diffs[pointer][1].length;
      } else {
        length_deletions2 += diffs[pointer][1].length;
      }
      // Eliminate an equality that is smaller or equal to the edits on both
      // sides of it.
      if (lastequality && (lastequality.length <=
          Math.max(length_insertions1, length_deletions1)) &&
          (lastequality.length <= Math.max(length_insertions2,
                                           length_deletions2))) {
        // Duplicate record.
        diffs.splice(equalities[equalitiesLength - 1], 0,
                     [DIFF_DELETE, lastequality]);
        // Change second copy to insert.
        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
        // Throw away the equality we just deleted.
        equalitiesLength--;
        // Throw away the previous equality (it needs to be reevaluated).
        equalitiesLength--;
        pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
        length_insertions1 = 0;  // Reset the counters.
        length_deletions1 = 0;
        length_insertions2 = 0;
        length_deletions2 = 0;
        lastequality = null;
        changes = true;
      }
    }
    pointer++;
  }

  // Normalize the diff.
  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
  this.diff_cleanupSemanticLossless(diffs);

  // Find any overlaps between deletions and insertions.
  // e.g: <del>abcxxx</del><ins>xxxdef</ins>
  //   -> <del>abc</del>xxx<ins>def</ins>
  // e.g: <del>xxxabc</del><ins>defxxx</ins>
  //   -> <ins>def</ins>xxx<del>abc</del>
  // Only extract an overlap if it is as big as the edit ahead or behind it.
  pointer = 1;
  while (pointer < diffs.length) {
    if (diffs[pointer - 1][0] == DIFF_DELETE &&
        diffs[pointer][0] == DIFF_INSERT) {
      var deletion = diffs[pointer - 1][1];
      var insertion = diffs[pointer][1];
      var overlap_length1 = this.diff_commonOverlap_(deletion, insertion);
      var overlap_length2 = this.diff_commonOverlap_(insertion, deletion);
      if (overlap_length1 >= overlap_length2) {
        if (overlap_length1 >= deletion.length / 2 ||
            overlap_length1 >= insertion.length / 2) {
          // Overlap found.  Insert an equality and trim the surrounding edits.
          diffs.splice(pointer, 0,
              [DIFF_EQUAL, insertion.substring(0, overlap_length1)]);
          diffs[pointer - 1][1] =
              deletion.substring(0, deletion.length - overlap_length1);
          diffs[pointer + 1][1] = insertion.substring(overlap_length1);
          pointer++;
        }
      } else {
        if (overlap_length2 >= deletion.length / 2 ||
            overlap_length2 >= insertion.length / 2) {
          // Reverse overlap found.
          // Insert an equality and swap and trim the surrounding edits.
          diffs.splice(pointer, 0,
              [DIFF_EQUAL, deletion.substring(0, overlap_length2)]);
          diffs[pointer - 1][0] = DIFF_INSERT;
          diffs[pointer - 1][1] =
              insertion.substring(0, insertion.length - overlap_length2);
          diffs[pointer + 1][0] = DIFF_DELETE;
          diffs[pointer + 1][1] =
              deletion.substring(overlap_length2);
          pointer++;
        }
      }
      pointer++;
    }
    pointer++;
  }
};


/**
 * Look for single edits surrounded on both sides by equalities
 * which can be shifted sideways to align the edit to a word boundary.
 * e.g: The c<ins>at c</ins>ame. -> The <ins>cat </ins>came.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupSemanticLossless = function(diffs) {
  /**
   * Given two strings, compute a score representing whether the internal
   * boundary falls on logical boundaries.
   * Scores range from 6 (best) to 0 (worst).
   * Closure, but does not reference any external variables.
   * @param {string} one First string.
   * @param {string} two Second string.
   * @return {number} The score.
   * @private
   */
  function diff_cleanupSemanticScore_(one, two) {
    if (!one || !two) {
      // Edges are the best.
      return 6;
    }

    // Each port of this function behaves slightly differently due to
    // subtle differences in each language's definition of things like
    // 'whitespace'.  Since this function's purpose is largely cosmetic,
    // the choice has been made to use each language's native features
    // rather than force total conformity.
    var char1 = one.charAt(one.length - 1);
    var char2 = two.charAt(0);
    var nonAlphaNumeric1 = char1.match(diff_match_patch.nonAlphaNumericRegex_);
    var nonAlphaNumeric2 = char2.match(diff_match_patch.nonAlphaNumericRegex_);
    var whitespace1 = nonAlphaNumeric1 &&
        char1.match(diff_match_patch.whitespaceRegex_);
    var whitespace2 = nonAlphaNumeric2 &&
        char2.match(diff_match_patch.whitespaceRegex_);
    var lineBreak1 = whitespace1 &&
        char1.match(diff_match_patch.linebreakRegex_);
    var lineBreak2 = whitespace2 &&
        char2.match(diff_match_patch.linebreakRegex_);
    var blankLine1 = lineBreak1 &&
        one.match(diff_match_patch.blanklineEndRegex_);
    var blankLine2 = lineBreak2 &&
        two.match(diff_match_patch.blanklineStartRegex_);

    if (blankLine1 || blankLine2) {
      // Five points for blank lines.
      return 5;
    } else if (lineBreak1 || lineBreak2) {
      // Four points for line breaks.
      return 4;
    } else if (nonAlphaNumeric1 && !whitespace1 && whitespace2) {
      // Three points for end of sentences.
      return 3;
    } else if (whitespace1 || whitespace2) {
      // Two points for whitespace.
      return 2;
    } else if (nonAlphaNumeric1 || nonAlphaNumeric2) {
      // One point for non-alphanumeric.
      return 1;
    }
    return 0;
  }

  var pointer = 1;
  // Intentionally ignore the first and last element (don't need checking).
  while (pointer < diffs.length - 1) {
    if (diffs[pointer - 1][0] == DIFF_EQUAL &&
        diffs[pointer + 1][0] == DIFF_EQUAL) {
      // This is a single edit surrounded by equalities.
      var equality1 = diffs[pointer - 1][1];
      var edit = diffs[pointer][1];
      var equality2 = diffs[pointer + 1][1];

      // First, shift the edit as far left as possible.
      var commonOffset = this.diff_commonSuffix(equality1, edit);
      if (commonOffset) {
        var commonString = edit.substring(edit.length - commonOffset);
        equality1 = equality1.substring(0, equality1.length - commonOffset);
        edit = commonString + edit.substring(0, edit.length - commonOffset);
        equality2 = commonString + equality2;
      }

      // Second, step character by character right, looking for the best fit.
      var bestEquality1 = equality1;
      var bestEdit = edit;
      var bestEquality2 = equality2;
      var bestScore = diff_cleanupSemanticScore_(equality1, edit) +
          diff_cleanupSemanticScore_(edit, equality2);
      while (edit.charAt(0) === equality2.charAt(0)) {
        equality1 += edit.charAt(0);
        edit = edit.substring(1) + equality2.charAt(0);
        equality2 = equality2.substring(1);
        var score = diff_cleanupSemanticScore_(equality1, edit) +
            diff_cleanupSemanticScore_(edit, equality2);
        // The >= encourages trailing rather than leading whitespace on edits.
        if (score >= bestScore) {
          bestScore = score;
          bestEquality1 = equality1;
          bestEdit = edit;
          bestEquality2 = equality2;
        }
      }

      if (diffs[pointer - 1][1] != bestEquality1) {
        // We have an improvement, save it back to the diff.
        if (bestEquality1) {
          diffs[pointer - 1][1] = bestEquality1;
        } else {
          diffs.splice(pointer - 1, 1);
          pointer--;
        }
        diffs[pointer][1] = bestEdit;
        if (bestEquality2) {
          diffs[pointer + 1][1] = bestEquality2;
        } else {
          diffs.splice(pointer + 1, 1);
          pointer--;
        }
      }
    }
    pointer++;
  }
};

// Define some regex patterns for matching boundaries.
diff_match_patch.nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/;
diff_match_patch.whitespaceRegex_ = /\s/;
diff_match_patch.linebreakRegex_ = /[\r\n]/;
diff_match_patch.blanklineEndRegex_ = /\n\r?\n$/;
diff_match_patch.blanklineStartRegex_ = /^\r?\n\r?\n/;

/**
 * Reduce the number of edits by eliminating operationally trivial equalities.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupEfficiency = function(diffs) {
  var changes = false;
  var equalities = [];  // Stack of indices where equalities are found.
  var equalitiesLength = 0;  // Keeping our own length var is faster in JS.
  /** @type {?string} */
  var lastequality = null;
  // Always equal to diffs[equalities[equalitiesLength - 1]][1]
  var pointer = 0;  // Index of current position.
  // Is there an insertion operation before the last equality.
  var pre_ins = false;
  // Is there a deletion operation before the last equality.
  var pre_del = false;
  // Is there an insertion operation after the last equality.
  var post_ins = false;
  // Is there a deletion operation after the last equality.
  var post_del = false;
  while (pointer < diffs.length) {
    if (diffs[pointer][0] == DIFF_EQUAL) {  // Equality found.
      if (diffs[pointer][1].length < this.Diff_EditCost &&
          (post_ins || post_del)) {
        // Candidate found.
        equalities[equalitiesLength++] = pointer;
        pre_ins = post_ins;
        pre_del = post_del;
        lastequality = diffs[pointer][1];
      } else {
        // Not a candidate, and can never become one.
        equalitiesLength = 0;
        lastequality = null;
      }
      post_ins = post_del = false;
    } else {  // An insertion or deletion.
      if (diffs[pointer][0] == DIFF_DELETE) {
        post_del = true;
      } else {
        post_ins = true;
      }
      /*
       * Five types to be split:
       * <ins>A</ins><del>B</del>XY<ins>C</ins><del>D</del>
       * <ins>A</ins>X<ins>C</ins><del>D</del>
       * <ins>A</ins><del>B</del>X<ins>C</ins>
       * <ins>A</del>X<ins>C</ins><del>D</del>
       * <ins>A</ins><del>B</del>X<del>C</del>
       */
      if (lastequality && ((pre_ins && pre_del && post_ins && post_del) ||
                           ((lastequality.length < this.Diff_EditCost / 2) &&
                            (pre_ins + pre_del + post_ins + post_del) == 3))) {
        // Duplicate record.
        diffs.splice(equalities[equalitiesLength - 1], 0,
                     [DIFF_DELETE, lastequality]);
        // Change second copy to insert.
        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
        equalitiesLength--;  // Throw away the equality we just deleted;
        lastequality = null;
        if (pre_ins && pre_del) {
          // No changes made which could affect previous entry, keep going.
          post_ins = post_del = true;
          equalitiesLength = 0;
        } else {
          equalitiesLength--;  // Throw away the previous equality.
          pointer = equalitiesLength > 0 ?
              equalities[equalitiesLength - 1] : -1;
          post_ins = post_del = false;
        }
        changes = true;
      }
    }
    pointer++;
  }

  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
};


/**
 * Reorder and merge like edit sections.  Merge equalities.
 * Any edit section can move as long as it doesn't cross an equality.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupMerge = function(diffs) {
  diffs.push([DIFF_EQUAL, '']);  // Add a dummy entry at the end.
  var pointer = 0;
  var count_delete = 0;
  var count_insert = 0;
  var text_delete = '';
  var text_insert = '';
  var commonlength;
  while (pointer < diffs.length) {
    switch (diffs[pointer][0]) {
      case DIFF_INSERT:
        count_insert++;
        text_insert += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_DELETE:
        count_delete++;
        text_delete += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_EQUAL:
        // Upon reaching an equality, check for prior redundancies.
        if (count_delete + count_insert > 1) {
          if (count_delete !== 0 && count_insert !== 0) {
            // Factor out any common prefixies.
            commonlength = this.diff_commonPrefix(text_insert, text_delete);
            if (commonlength !== 0) {
              if ((pointer - count_delete - count_insert) > 0 &&
                  diffs[pointer - count_delete - count_insert - 1][0] ==
                  DIFF_EQUAL) {
                diffs[pointer - count_delete - count_insert - 1][1] +=
                    text_insert.substring(0, commonlength);
              } else {
                diffs.splice(0, 0, [DIFF_EQUAL,
                                    text_insert.substring(0, commonlength)]);
                pointer++;
              }
              text_insert = text_insert.substring(commonlength);
              text_delete = text_delete.substring(commonlength);
            }
            // Factor out any common suffixies.
            commonlength = this.diff_commonSuffix(text_insert, text_delete);
            if (commonlength !== 0) {
              diffs[pointer][1] = text_insert.substring(text_insert.length -
                  commonlength) + diffs[pointer][1];
              text_insert = text_insert.substring(0, text_insert.length -
                  commonlength);
              text_delete = text_delete.substring(0, text_delete.length -
                  commonlength);
            }
          }
          // Delete the offending records and add the merged ones.
          if (count_delete === 0) {
            diffs.splice(pointer - count_insert,
                count_delete + count_insert, [DIFF_INSERT, text_insert]);
          } else if (count_insert === 0) {
            diffs.splice(pointer - count_delete,
                count_delete + count_insert, [DIFF_DELETE, text_delete]);
          } else {
            diffs.splice(pointer - count_delete - count_insert,
                count_delete + count_insert, [DIFF_DELETE, text_delete],
                [DIFF_INSERT, text_insert]);
          }
          pointer = pointer - count_delete - count_insert +
                    (count_delete ? 1 : 0) + (count_insert ? 1 : 0) + 1;
        } else if (pointer !== 0 && diffs[pointer - 1][0] == DIFF_EQUAL) {
          // Merge this equality with the previous one.
          diffs[pointer - 1][1] += diffs[pointer][1];
          diffs.splice(pointer, 1);
        } else {
          pointer++;
        }
        count_insert = 0;
        count_delete = 0;
        text_delete = '';
        text_insert = '';
        break;
    }
  }
  if (diffs[diffs.length - 1][1] === '') {
    diffs.pop();  // Remove the dummy entry at the end.
  }

  // Second pass: look for single edits surrounded on both sides by equalities
  // which can be shifted sideways to eliminate an equality.
  // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
  var changes = false;
  pointer = 1;
  // Intentionally ignore the first and last element (don't need checking).
  while (pointer < diffs.length - 1) {
    if (diffs[pointer - 1][0] == DIFF_EQUAL &&
        diffs[pointer + 1][0] == DIFF_EQUAL) {
      // This is a single edit surrounded by equalities.
      if (diffs[pointer][1].substring(diffs[pointer][1].length -
          diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
        // Shift the edit over the previous equality.
        diffs[pointer][1] = diffs[pointer - 1][1] +
            diffs[pointer][1].substring(0, diffs[pointer][1].length -
                                        diffs[pointer - 1][1].length);
        diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
        diffs.splice(pointer - 1, 1);
        changes = true;
      } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) ==
          diffs[pointer + 1][1]) {
        // Shift the edit over the next equality.
        diffs[pointer - 1][1] += diffs[pointer + 1][1];
        diffs[pointer][1] =
            diffs[pointer][1].substring(diffs[pointer + 1][1].length) +
            diffs[pointer + 1][1];
        diffs.splice(pointer + 1, 1);
        changes = true;
      }
    }
    pointer++;
  }
  // If shifts were made, the diff needs reordering and another shift sweep.
  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
};


/**
 * loc is a location in text1, compute and return the equivalent location in
 * text2.
 * e.g. 'The cat' vs 'The big cat', 1->1, 5->8
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @param {number} loc Location within text1.
 * @return {number} Location within text2.
 */
diff_match_patch.prototype.diff_xIndex = function(diffs, loc) {
  var chars1 = 0;
  var chars2 = 0;
  var last_chars1 = 0;
  var last_chars2 = 0;
  var x;
  for (x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_INSERT) {  // Equality or deletion.
      chars1 += diffs[x][1].length;
    }
    if (diffs[x][0] !== DIFF_DELETE) {  // Equality or insertion.
      chars2 += diffs[x][1].length;
    }
    if (chars1 > loc) {  // Overshot the location.
      break;
    }
    last_chars1 = chars1;
    last_chars2 = chars2;
  }
  // Was the location was deleted?
  if (diffs.length != x && diffs[x][0] === DIFF_DELETE) {
    return last_chars2;
  }
  // Add the remaining character length.
  return last_chars2 + (loc - last_chars1);
};


/**
 * Convert a diff array into a pretty HTML report.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} HTML representation.
 */
diff_match_patch.prototype.diff_prettyHtml = function(diffs) {
  var html = [];
  var pattern_amp = /&/g;
  var pattern_lt = /</g;
  var pattern_gt = />/g;
  var pattern_para = /\n/g;
  for (var x = 0; x < diffs.length; x++) {
    var op = diffs[x][0];    // Operation (insert, delete, equal)
    var data = diffs[x][1];  // Text of change.
    var text = data.replace(pattern_amp, '&amp;').replace(pattern_lt, '&lt;')
        .replace(pattern_gt, '&gt;').replace(pattern_para, '&para;<br>');
    switch (op) {
      case DIFF_INSERT:
        html[x] = '<ins style="background:#e6ffe6;">' + text + '</ins>';
        break;
      case DIFF_DELETE:
        html[x] = '<del style="background:#ffe6e6;">' + text + '</del>';
        break;
      case DIFF_EQUAL:
        html[x] = '<span>' + text + '</span>';
        break;
    }
  }
  return html.join('');
};


/**
 * Compute and return the source text (all equalities and deletions).
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} Source text.
 */
diff_match_patch.prototype.diff_text1 = function(diffs) {
  var text = [];
  for (var x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_INSERT) {
      text[x] = diffs[x][1];
    }
  }
  return text.join('');
};


/**
 * Compute and return the destination text (all equalities and insertions).
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} Destination text.
 */
diff_match_patch.prototype.diff_text2 = function(diffs) {
  var text = [];
  for (var x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_DELETE) {
      text[x] = diffs[x][1];
    }
  }
  return text.join('');
};


/**
 * Compute the Levenshtein distance; the number of inserted, deleted or
 * substituted characters.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {number} Number of changes.
 */
diff_match_patch.prototype.diff_levenshtein = function(diffs) {
  var levenshtein = 0;
  var insertions = 0;
  var deletions = 0;
  for (var x = 0; x < diffs.length; x++) {
    var op = diffs[x][0];
    var data = diffs[x][1];
    switch (op) {
      case DIFF_INSERT:
        insertions += data.length;
        break;
      case DIFF_DELETE:
        deletions += data.length;
        break;
      case DIFF_EQUAL:
        // A deletion and an insertion is one substitution.
        levenshtein += Math.max(insertions, deletions);
        insertions = 0;
        deletions = 0;
        break;
    }
  }
  levenshtein += Math.max(insertions, deletions);
  return levenshtein;
};


/**
 * Crush the diff into an encoded string which describes the operations
 * required to transform text1 into text2.
 * E.g. =3\t-2\t+ing  -> Keep 3 chars, delete 2 chars, insert 'ing'.
 * Operations are tab-separated.  Inserted text is escaped using %xx notation.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} Delta text.
 */
diff_match_patch.prototype.diff_toDelta = function(diffs) {
  var text = [];
  for (var x = 0; x < diffs.length; x++) {
    switch (diffs[x][0]) {
      case DIFF_INSERT:
        text[x] = '+' + encodeURI(diffs[x][1]);
        break;
      case DIFF_DELETE:
        text[x] = '-' + diffs[x][1].length;
        break;
      case DIFF_EQUAL:
        text[x] = '=' + diffs[x][1].length;
        break;
    }
  }
  return text.join('\t').replace(/%20/g, ' ');
};


/**
 * Given the original text1, and an encoded string which describes the
 * operations required to transform text1 into text2, compute the full diff.
 * @param {string} text1 Source string for the diff.
 * @param {string} delta Delta text.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @throws {!Error} If invalid input.
 */
diff_match_patch.prototype.diff_fromDelta = function(text1, delta) {
  var diffs = [];
  var diffsLength = 0;  // Keeping our own length var is faster in JS.
  var pointer = 0;  // Cursor in text1
  var tokens = delta.split(/\t/g);
  for (var x = 0; x < tokens.length; x++) {
    // Each token begins with a one character parameter which specifies the
    // operation of this token (delete, insert, equality).
    var param = tokens[x].substring(1);
    switch (tokens[x].charAt(0)) {
      case '+':
        try {
          diffs[diffsLength++] = [DIFF_INSERT, decodeURI(param)];
        } catch (ex) {
          // Malformed URI sequence.
          throw new Error('Illegal escape in diff_fromDelta: ' + param);
        }
        break;
      case '-':
        // Fall through.
      case '=':
        var n = parseInt(param, 10);
        if (isNaN(n) || n < 0) {
          throw new Error('Invalid number in diff_fromDelta: ' + param);
        }
        var text = text1.substring(pointer, pointer += n);
        if (tokens[x].charAt(0) == '=') {
          diffs[diffsLength++] = [DIFF_EQUAL, text];
        } else {
          diffs[diffsLength++] = [DIFF_DELETE, text];
        }
        break;
      default:
        // Blank tokens are ok (from a trailing \t).
        // Anything else is an error.
        if (tokens[x]) {
          throw new Error('Invalid diff operation in diff_fromDelta: ' +
                          tokens[x]);
        }
    }
  }
  if (pointer != text1.length) {
    throw new Error('Delta length (' + pointer +
        ') does not equal source text length (' + text1.length + ').');
  }
  return diffs;
};


//  MATCH FUNCTIONS


/**
 * Locate the best instance of 'pattern' in 'text' near 'loc'.
 * @param {string} text The text to search.
 * @param {string} pattern The pattern to search for.
 * @param {number} loc The location to search around.
 * @return {number} Best match index or -1.
 */
diff_match_patch.prototype.match_main = function(text, pattern, loc) {
  // Check for null inputs.
  if (text == null || pattern == null || loc == null) {
    throw new Error('Null input. (match_main)');
  }

  loc = Math.max(0, Math.min(loc, text.length));
  if (text == pattern) {
    // Shortcut (potentially not guaranteed by the algorithm)
    return 0;
  } else if (!text.length) {
    // Nothing to match.
    return -1;
  } else if (text.substring(loc, loc + pattern.length) == pattern) {
    // Perfect match at the perfect spot!  (Includes case of null pattern)
    return loc;
  } else {
    // Do a fuzzy compare.
    return this.match_bitap_(text, pattern, loc);
  }
};


/**
 * Locate the best instance of 'pattern' in 'text' near 'loc' using the
 * Bitap algorithm.
 * @param {string} text The text to search.
 * @param {string} pattern The pattern to search for.
 * @param {number} loc The location to search around.
 * @return {number} Best match index or -1.
 * @private
 */
diff_match_patch.prototype.match_bitap_ = function(text, pattern, loc) {
  if (pattern.length > this.Match_MaxBits) {
    throw new Error('Pattern too long for this browser.');
  }

  // Initialise the alphabet.
  var s = this.match_alphabet_(pattern);

  var dmp = this;  // 'this' becomes 'window' in a closure.

  /**
   * Compute and return the score for a match with e errors and x location.
   * Accesses loc and pattern through being a closure.
   * @param {number} e Number of errors in match.
   * @param {number} x Location of match.
   * @return {number} Overall score for match (0.0 = good, 1.0 = bad).
   * @private
   */
  function match_bitapScore_(e, x) {
    var accuracy = e / pattern.length;
    var proximity = Math.abs(loc - x);
    if (!dmp.Match_Distance) {
      // Dodge divide by zero error.
      return proximity ? 1.0 : accuracy;
    }
    return accuracy + (proximity / dmp.Match_Distance);
  }

  // Highest score beyond which we give up.
  var score_threshold = this.Match_Threshold;
  // Is there a nearby exact match? (speedup)
  var best_loc = text.indexOf(pattern, loc);
  if (best_loc != -1) {
    score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold);
    // What about in the other direction? (speedup)
    best_loc = text.lastIndexOf(pattern, loc + pattern.length);
    if (best_loc != -1) {
      score_threshold =
          Math.min(match_bitapScore_(0, best_loc), score_threshold);
    }
  }

  // Initialise the bit arrays.
  var matchmask = 1 << (pattern.length - 1);
  best_loc = -1;

  var bin_min, bin_mid;
  var bin_max = pattern.length + text.length;
  var last_rd;
  for (var d = 0; d < pattern.length; d++) {
    // Scan for the best match; each iteration allows for one more error.
    // Run a binary search to determine how far from 'loc' we can stray at this
    // error level.
    bin_min = 0;
    bin_mid = bin_max;
    while (bin_min < bin_mid) {
      if (match_bitapScore_(d, loc + bin_mid) <= score_threshold) {
        bin_min = bin_mid;
      } else {
        bin_max = bin_mid;
      }
      bin_mid = Math.floor((bin_max - bin_min) / 2 + bin_min);
    }
    // Use the result from this iteration as the maximum for the next.
    bin_max = bin_mid;
    var start = Math.max(1, loc - bin_mid + 1);
    var finish = Math.min(loc + bin_mid, text.length) + pattern.length;

    var rd = Array(finish + 2);
    rd[finish + 1] = (1 << d) - 1;
    for (var j = finish; j >= start; j--) {
      // The alphabet (s) is a sparse hash, so the following line generates
      // warnings.
      var charMatch = s[text.charAt(j - 1)];
      if (d === 0) {  // First pass: exact match.
        rd[j] = ((rd[j + 1] << 1) | 1) & charMatch;
      } else {  // Subsequent passes: fuzzy match.
        rd[j] = (((rd[j + 1] << 1) | 1) & charMatch) |
                (((last_rd[j + 1] | last_rd[j]) << 1) | 1) |
                last_rd[j + 1];
      }
      if (rd[j] & matchmask) {
        var score = match_bitapScore_(d, j - 1);
        // This match will almost certainly be better than any existing match.
        // But check anyway.
        if (score <= score_threshold) {
          // Told you so.
          score_threshold = score;
          best_loc = j - 1;
          if (best_loc > loc) {
            // When passing loc, don't exceed our current distance from loc.
            start = Math.max(1, 2 * loc - best_loc);
          } else {
            // Already passed loc, downhill from here on in.
            break;
          }
        }
      }
    }
    // No hope for a (better) match at greater error levels.
    if (match_bitapScore_(d + 1, loc) > score_threshold) {
      break;
    }
    last_rd = rd;
  }
  return best_loc;
};


/**
 * Initialise the alphabet for the Bitap algorithm.
 * @param {string} pattern The text to encode.
 * @return {!Object} Hash of character locations.
 * @private
 */
diff_match_patch.prototype.match_alphabet_ = function(pattern) {
  var s = {};
  for (var i = 0; i < pattern.length; i++) {
    s[pattern.charAt(i)] = 0;
  }
  for (var i = 0; i < pattern.length; i++) {
    s[pattern.charAt(i)] |= 1 << (pattern.length - i - 1);
  }
  return s;
};


//  PATCH FUNCTIONS


/**
 * Increase the context until it is unique,
 * but don't let the pattern expand beyond Match_MaxBits.
 * @param {!diff_match_patch.patch_obj} patch The patch to grow.
 * @param {string} text Source text.
 * @private
 */
diff_match_patch.prototype.patch_addContext_ = function(patch, text) {
  if (text.length == 0) {
    return;
  }
  var pattern = text.substring(patch.start2, patch.start2 + patch.length1);
  var padding = 0;

  // Look for the first and last matches of pattern in text.  If two different
  // matches are found, increase the pattern length.
  while (text.indexOf(pattern) != text.lastIndexOf(pattern) &&
         pattern.length < this.Match_MaxBits - this.Patch_Margin -
         this.Patch_Margin) {
    padding += this.Patch_Margin;
    pattern = text.substring(patch.start2 - padding,
                             patch.start2 + patch.length1 + padding);
  }
  // Add one chunk for good luck.
  padding += this.Patch_Margin;

  // Add the prefix.
  var prefix = text.substring(patch.start2 - padding, patch.start2);
  if (prefix) {
    patch.diffs.unshift([DIFF_EQUAL, prefix]);
  }
  // Add the suffix.
  var suffix = text.substring(patch.start2 + patch.length1,
                              patch.start2 + patch.length1 + padding);
  if (suffix) {
    patch.diffs.push([DIFF_EQUAL, suffix]);
  }

  // Roll back the start points.
  patch.start1 -= prefix.length;
  patch.start2 -= prefix.length;
  // Extend the lengths.
  patch.length1 += prefix.length + suffix.length;
  patch.length2 += prefix.length + suffix.length;
};


/**
 * Compute a list of patches to turn text1 into text2.
 * Use diffs if provided, otherwise compute it ourselves.
 * There are four ways to call this function, depending on what data is
 * available to the caller:
 * Method 1:
 * a = text1, b = text2
 * Method 2:
 * a = diffs
 * Method 3 (optimal):
 * a = text1, b = diffs
 * Method 4 (deprecated, use method 3):
 * a = text1, b = text2, c = diffs
 *
 * @param {string|!Array.<!diff_match_patch.Diff>} a text1 (methods 1,3,4) or
 * Array of diff tuples for text1 to text2 (method 2).
 * @param {string|!Array.<!diff_match_patch.Diff>} opt_b text2 (methods 1,4) or
 * Array of diff tuples for text1 to text2 (method 3) or undefined (method 2).
 * @param {string|!Array.<!diff_match_patch.Diff>} opt_c Array of diff tuples
 * for text1 to text2 (method 4) or undefined (methods 1,2,3).
 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
 */
diff_match_patch.prototype.patch_make = function(a, opt_b, opt_c) {
  var text1, diffs;
  if (typeof a == 'string' && typeof opt_b == 'string' &&
      typeof opt_c == 'undefined') {
    // Method 1: text1, text2
    // Compute diffs from text1 and text2.
    text1 = /** @type {string} */(a);
    diffs = this.diff_main(text1, /** @type {string} */(opt_b), true);
    if (diffs.length > 2) {
      this.diff_cleanupSemantic(diffs);
      this.diff_cleanupEfficiency(diffs);
    }
  } else if (a && typeof a == 'object' && typeof opt_b == 'undefined' &&
      typeof opt_c == 'undefined') {
    // Method 2: diffs
    // Compute text1 from diffs.
    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */(a);
    text1 = this.diff_text1(diffs);
  } else if (typeof a == 'string' && opt_b && typeof opt_b == 'object' &&
      typeof opt_c == 'undefined') {
    // Method 3: text1, diffs
    text1 = /** @type {string} */(a);
    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */(opt_b);
  } else if (typeof a == 'string' && typeof opt_b == 'string' &&
      opt_c && typeof opt_c == 'object') {
    // Method 4: text1, text2, diffs
    // text2 is not used.
    text1 = /** @type {string} */(a);
    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */(opt_c);
  } else {
    throw new Error('Unknown call format to patch_make.');
  }

  if (diffs.length === 0) {
    return [];  // Get rid of the null case.
  }
  var patches = [];
  var patch = new diff_match_patch.patch_obj();
  var patchDiffLength = 0;  // Keeping our own length var is faster in JS.
  var char_count1 = 0;  // Number of characters into the text1 string.
  var char_count2 = 0;  // Number of characters into the text2 string.
  // Start with text1 (prepatch_text) and apply the diffs until we arrive at
  // text2 (postpatch_text).  We recreate the patches one by one to determine
  // context info.
  var prepatch_text = text1;
  var postpatch_text = text1;
  for (var x = 0; x < diffs.length; x++) {
    var diff_type = diffs[x][0];
    var diff_text = diffs[x][1];

    if (!patchDiffLength && diff_type !== DIFF_EQUAL) {
      // A new patch starts here.
      patch.start1 = char_count1;
      patch.start2 = char_count2;
    }

    switch (diff_type) {
      case DIFF_INSERT:
        patch.diffs[patchDiffLength++] = diffs[x];
        patch.length2 += diff_text.length;
        postpatch_text = postpatch_text.substring(0, char_count2) + diff_text +
                         postpatch_text.substring(char_count2);
        break;
      case DIFF_DELETE:
        patch.length1 += diff_text.length;
        patch.diffs[patchDiffLength++] = diffs[x];
        postpatch_text = postpatch_text.substring(0, char_count2) +
                         postpatch_text.substring(char_count2 +
                             diff_text.length);
        break;
      case DIFF_EQUAL:
        if (diff_text.length <= 2 * this.Patch_Margin &&
            patchDiffLength && diffs.length != x + 1) {
          // Small equality inside a patch.
          patch.diffs[patchDiffLength++] = diffs[x];
          patch.length1 += diff_text.length;
          patch.length2 += diff_text.length;
        } else if (diff_text.length >= 2 * this.Patch_Margin) {
          // Time for a new patch.
          if (patchDiffLength) {
            this.patch_addContext_(patch, prepatch_text);
            patches.push(patch);
            patch = new diff_match_patch.patch_obj();
            patchDiffLength = 0;
            // Unlike Unidiff, our patch lists have a rolling context.
            // http://code.google.com/p/google-diff-match-patch/wiki/Unidiff
            // Update prepatch text & pos to reflect the application of the
            // just completed patch.
            prepatch_text = postpatch_text;
            char_count1 = char_count2;
          }
        }
        break;
    }

    // Update the current character count.
    if (diff_type !== DIFF_INSERT) {
      char_count1 += diff_text.length;
    }
    if (diff_type !== DIFF_DELETE) {
      char_count2 += diff_text.length;
    }
  }
  // Pick up the leftover patch if not empty.
  if (patchDiffLength) {
    this.patch_addContext_(patch, prepatch_text);
    patches.push(patch);
  }

  return patches;
};


/**
 * Given an array of patches, return another array that is identical.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
 */
diff_match_patch.prototype.patch_deepCopy = function(patches) {
  // Making deep copies is hard in JavaScript.
  var patchesCopy = [];
  for (var x = 0; x < patches.length; x++) {
    var patch = patches[x];
    var patchCopy = new diff_match_patch.patch_obj();
    patchCopy.diffs = [];
    for (var y = 0; y < patch.diffs.length; y++) {
      patchCopy.diffs[y] = patch.diffs[y].slice();
    }
    patchCopy.start1 = patch.start1;
    patchCopy.start2 = patch.start2;
    patchCopy.length1 = patch.length1;
    patchCopy.length2 = patch.length2;
    patchesCopy[x] = patchCopy;
  }
  return patchesCopy;
};


/**
 * Merge a set of patches onto the text.  Return a patched text, as well
 * as a list of true/false values indicating which patches were applied.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @param {string} text Old text.
 * @return {!Array.<string|!Array.<boolean>>} Two element Array, containing the
 *      new text and an array of boolean values.
 */
diff_match_patch.prototype.patch_apply = function(patches, text) {
  if (patches.length == 0) {
    return [text, []];
  }

  // Deep copy the patches so that no changes are made to originals.
  patches = this.patch_deepCopy(patches);

  var nullPadding = this.patch_addPadding(patches);
  text = nullPadding + text + nullPadding;

  this.patch_splitMax(patches);
  // delta keeps track of the offset between the expected and actual location
  // of the previous patch.  If there are patches expected at positions 10 and
  // 20, but the first patch was found at 12, delta is 2 and the second patch
  // has an effective expected position of 22.
  var delta = 0;
  var results = [];
  for (var x = 0; x < patches.length; x++) {
    var expected_loc = patches[x].start2 + delta;
    var text1 = this.diff_text1(patches[x].diffs);
    var start_loc;
    var end_loc = -1;
    if (text1.length > this.Match_MaxBits) {
      // patch_splitMax will only provide an oversized pattern in the case of
      // a monster delete.
      start_loc = this.match_main(text, text1.substring(0, this.Match_MaxBits),
                                  expected_loc);
      if (start_loc != -1) {
        end_loc = this.match_main(text,
            text1.substring(text1.length - this.Match_MaxBits),
            expected_loc + text1.length - this.Match_MaxBits);
        if (end_loc == -1 || start_loc >= end_loc) {
          // Can't find valid trailing context.  Drop this patch.
          start_loc = -1;
        }
      }
    } else {
      start_loc = this.match_main(text, text1, expected_loc);
    }
    if (start_loc == -1) {
      // No match found.  :(
      results[x] = false;
      // Subtract the delta for this failed patch from subsequent patches.
      delta -= patches[x].length2 - patches[x].length1;
    } else {
      // Found a match.  :)
      results[x] = true;
      delta = start_loc - expected_loc;
      var text2;
      if (end_loc == -1) {
        text2 = text.substring(start_loc, start_loc + text1.length);
      } else {
        text2 = text.substring(start_loc, end_loc + this.Match_MaxBits);
      }
      if (text1 == text2) {
        // Perfect match, just shove the replacement text in.
        text = text.substring(0, start_loc) +
               this.diff_text2(patches[x].diffs) +
               text.substring(start_loc + text1.length);
      } else {
        // Imperfect match.  Run a diff to get a framework of equivalent
        // indices.
        var diffs = this.diff_main(text1, text2, false);
        if (text1.length > this.Match_MaxBits &&
            this.diff_levenshtein(diffs) / text1.length >
            this.Patch_DeleteThreshold) {
          // The end points match, but the content is unacceptably bad.
          results[x] = false;
        } else {
          this.diff_cleanupSemanticLossless(diffs);
          var index1 = 0;
          var index2;
          for (var y = 0; y < patches[x].diffs.length; y++) {
            var mod = patches[x].diffs[y];
            if (mod[0] !== DIFF_EQUAL) {
              index2 = this.diff_xIndex(diffs, index1);
            }
            if (mod[0] === DIFF_INSERT) {  // Insertion
              text = text.substring(0, start_loc + index2) + mod[1] +
                     text.substring(start_loc + index2);
            } else if (mod[0] === DIFF_DELETE) {  // Deletion
              text = text.substring(0, start_loc + index2) +
                     text.substring(start_loc + this.diff_xIndex(diffs,
                         index1 + mod[1].length));
            }
            if (mod[0] !== DIFF_DELETE) {
              index1 += mod[1].length;
            }
          }
        }
      }
    }
  }
  // Strip the padding off.
  text = text.substring(nullPadding.length, text.length - nullPadding.length);
  return [text, results];
};


/**
 * Add some padding on text start and end so that edges can match something.
 * Intended to be called only from within patch_apply.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @return {string} The padding string added to each side.
 */
diff_match_patch.prototype.patch_addPadding = function(patches) {
  var paddingLength = this.Patch_Margin;
  var nullPadding = '';
  for (var x = 1; x <= paddingLength; x++) {
    nullPadding += String.fromCharCode(x);
  }

  // Bump all the patches forward.
  for (var x = 0; x < patches.length; x++) {
    patches[x].start1 += paddingLength;
    patches[x].start2 += paddingLength;
  }

  // Add some padding on start of first diff.
  var patch = patches[0];
  var diffs = patch.diffs;
  if (diffs.length == 0 || diffs[0][0] != DIFF_EQUAL) {
    // Add nullPadding equality.
    diffs.unshift([DIFF_EQUAL, nullPadding]);
    patch.start1 -= paddingLength;  // Should be 0.
    patch.start2 -= paddingLength;  // Should be 0.
    patch.length1 += paddingLength;
    patch.length2 += paddingLength;
  } else if (paddingLength > diffs[0][1].length) {
    // Grow first equality.
    var extraLength = paddingLength - diffs[0][1].length;
    diffs[0][1] = nullPadding.substring(diffs[0][1].length) + diffs[0][1];
    patch.start1 -= extraLength;
    patch.start2 -= extraLength;
    patch.length1 += extraLength;
    patch.length2 += extraLength;
  }

  // Add some padding on end of last diff.
  patch = patches[patches.length - 1];
  diffs = patch.diffs;
  if (diffs.length == 0 || diffs[diffs.length - 1][0] != DIFF_EQUAL) {
    // Add nullPadding equality.
    diffs.push([DIFF_EQUAL, nullPadding]);
    patch.length1 += paddingLength;
    patch.length2 += paddingLength;
  } else if (paddingLength > diffs[diffs.length - 1][1].length) {
    // Grow last equality.
    var extraLength = paddingLength - diffs[diffs.length - 1][1].length;
    diffs[diffs.length - 1][1] += nullPadding.substring(0, extraLength);
    patch.length1 += extraLength;
    patch.length2 += extraLength;
  }

  return nullPadding;
};


/**
 * Look through the patches and break up any which are longer than the maximum
 * limit of the match algorithm.
 * Intended to be called only from within patch_apply.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 */
diff_match_patch.prototype.patch_splitMax = function(patches) {
  var patch_size = this.Match_MaxBits;
  for (var x = 0; x < patches.length; x++) {
    if (patches[x].length1 <= patch_size) {
      continue;
    }
    var bigpatch = patches[x];
    // Remove the big old patch.
    patches.splice(x--, 1);
    var start1 = bigpatch.start1;
    var start2 = bigpatch.start2;
    var precontext = '';
    while (bigpatch.diffs.length !== 0) {
      // Create one of several smaller patches.
      var patch = new diff_match_patch.patch_obj();
      var empty = true;
      patch.start1 = start1 - precontext.length;
      patch.start2 = start2 - precontext.length;
      if (precontext !== '') {
        patch.length1 = patch.length2 = precontext.length;
        patch.diffs.push([DIFF_EQUAL, precontext]);
      }
      while (bigpatch.diffs.length !== 0 &&
             patch.length1 < patch_size - this.Patch_Margin) {
        var diff_type = bigpatch.diffs[0][0];
        var diff_text = bigpatch.diffs[0][1];
        if (diff_type === DIFF_INSERT) {
          // Insertions are harmless.
          patch.length2 += diff_text.length;
          start2 += diff_text.length;
          patch.diffs.push(bigpatch.diffs.shift());
          empty = false;
        } else if (diff_type === DIFF_DELETE && patch.diffs.length == 1 &&
                   patch.diffs[0][0] == DIFF_EQUAL &&
                   diff_text.length > 2 * patch_size) {
          // This is a large deletion.  Let it pass in one chunk.
          patch.length1 += diff_text.length;
          start1 += diff_text.length;
          empty = false;
          patch.diffs.push([diff_type, diff_text]);
          bigpatch.diffs.shift();
        } else {
          // Deletion or equality.  Only take as much as we can stomach.
          diff_text = diff_text.substring(0,
              patch_size - patch.length1 - this.Patch_Margin);
          patch.length1 += diff_text.length;
          start1 += diff_text.length;
          if (diff_type === DIFF_EQUAL) {
            patch.length2 += diff_text.length;
            start2 += diff_text.length;
          } else {
            empty = false;
          }
          patch.diffs.push([diff_type, diff_text]);
          if (diff_text == bigpatch.diffs[0][1]) {
            bigpatch.diffs.shift();
          } else {
            bigpatch.diffs[0][1] =
                bigpatch.diffs[0][1].substring(diff_text.length);
          }
        }
      }
      // Compute the head context for the next patch.
      precontext = this.diff_text2(patch.diffs);
      precontext =
          precontext.substring(precontext.length - this.Patch_Margin);
      // Append the end context for this patch.
      var postcontext = this.diff_text1(bigpatch.diffs)
                            .substring(0, this.Patch_Margin);
      if (postcontext !== '') {
        patch.length1 += postcontext.length;
        patch.length2 += postcontext.length;
        if (patch.diffs.length !== 0 &&
            patch.diffs[patch.diffs.length - 1][0] === DIFF_EQUAL) {
          patch.diffs[patch.diffs.length - 1][1] += postcontext;
        } else {
          patch.diffs.push([DIFF_EQUAL, postcontext]);
        }
      }
      if (!empty) {
        patches.splice(++x, 0, patch);
      }
    }
  }
};


/**
 * Take a list of patches and return a textual representation.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @return {string} Text representation of patches.
 */
diff_match_patch.prototype.patch_toText = function(patches) {
  var text = [];
  for (var x = 0; x < patches.length; x++) {
    text[x] = patches[x];
  }
  return text.join('');
};


/**
 * Parse a textual representation of patches and return a list of Patch objects.
 * @param {string} textline Text representation of patches.
 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
 * @throws {!Error} If invalid input.
 */
diff_match_patch.prototype.patch_fromText = function(textline) {
  var patches = [];
  if (!textline) {
    return patches;
  }
  var text = textline.split('\n');
  var textPointer = 0;
  var patchHeader = /^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/;
  while (textPointer < text.length) {
    var m = text[textPointer].match(patchHeader);
    if (!m) {
      throw new Error('Invalid patch string: ' + text[textPointer]);
    }
    var patch = new diff_match_patch.patch_obj();
    patches.push(patch);
    patch.start1 = parseInt(m[1], 10);
    if (m[2] === '') {
      patch.start1--;
      patch.length1 = 1;
    } else if (m[2] == '0') {
      patch.length1 = 0;
    } else {
      patch.start1--;
      patch.length1 = parseInt(m[2], 10);
    }

    patch.start2 = parseInt(m[3], 10);
    if (m[4] === '') {
      patch.start2--;
      patch.length2 = 1;
    } else if (m[4] == '0') {
      patch.length2 = 0;
    } else {
      patch.start2--;
      patch.length2 = parseInt(m[4], 10);
    }
    textPointer++;

    while (textPointer < text.length) {
      var sign = text[textPointer].charAt(0);
      try {
        var line = decodeURI(text[textPointer].substring(1));
      } catch (ex) {
        // Malformed URI sequence.
        throw new Error('Illegal escape in patch_fromText: ' + line);
      }
      if (sign == '-') {
        // Deletion.
        patch.diffs.push([DIFF_DELETE, line]);
      } else if (sign == '+') {
        // Insertion.
        patch.diffs.push([DIFF_INSERT, line]);
      } else if (sign == ' ') {
        // Minor equality.
        patch.diffs.push([DIFF_EQUAL, line]);
      } else if (sign == '@') {
        // Start of next patch.
        break;
      } else if (sign === '') {
        // Blank line?  Whatever.
      } else {
        // WTF?
        throw new Error('Invalid patch mode "' + sign + '" in: ' + line);
      }
      textPointer++;
    }
  }
  return patches;
};


/**
 * Class representing one patch operation.
 * @constructor
 */
diff_match_patch.patch_obj = function() {
  /** @type {!Array.<!diff_match_patch.Diff>} */
  this.diffs = [];
  /** @type {?number} */
  this.start1 = null;
  /** @type {?number} */
  this.start2 = null;
  /** @type {number} */
  this.length1 = 0;
  /** @type {number} */
  this.length2 = 0;
};


/**
 * Emmulate GNU diff's format.
 * Header: @@ -382,8 +481,9 @@
 * Indicies are printed as 1-based, not 0-based.
 * @return {string} The GNU diff string.
 */
diff_match_patch.patch_obj.prototype.toString = function() {
  var coords1, coords2;
  if (this.length1 === 0) {
    coords1 = this.start1 + ',0';
  } else if (this.length1 == 1) {
    coords1 = this.start1 + 1;
  } else {
    coords1 = (this.start1 + 1) + ',' + this.length1;
  }
  if (this.length2 === 0) {
    coords2 = this.start2 + ',0';
  } else if (this.length2 == 1) {
    coords2 = this.start2 + 1;
  } else {
    coords2 = (this.start2 + 1) + ',' + this.length2;
  }
  var text = ['@@ -' + coords1 + ' +' + coords2 + ' @@\n'];
  var op;
  // Escape the body of the patch with %xx notation.
  for (var x = 0; x < this.diffs.length; x++) {
    switch (this.diffs[x][0]) {
      case DIFF_INSERT:
        op = '+';
        break;
      case DIFF_DELETE:
        op = '-';
        break;
      case DIFF_EQUAL:
        op = ' ';
        break;
    }
    text[x + 1] = op + encodeURI(this.diffs[x][1]) + '\n';
  }
  return text.join('').replace(/%20/g, ' ');
};


// Export these global variables so that they survive Google's JS compiler.
// In a browser, 'this' will be 'window'.
// Users of node.js should 'require' the uncompressed version since Google's
// JS compiler may break the following exports for non-browser environments.
/*
this['diff_match_patch'] = diff_match_patch;
this['DIFF_DELETE'] = DIFF_DELETE;
this['DIFF_INSERT'] = DIFF_INSERT;
this['DIFF_EQUAL'] = DIFF_EQUAL;
*/

module.exports=diff_match_patch;

});
require.register("ksana-document/xml4kdb.js", function(exports, require, module){
if (typeof nodeRequire=='undefined')nodeRequire=require;

var tags=[];
var tagstack=[];
var parseXMLTag=function(s) {
	var name="",i=0;
	if (s[0]=='/') {
		return {name:s.substring(1),type:'end'};
	}
	while (s[i] && (s.charCodeAt(i)>0x30)) {name+=s[i];i++;}
	var type="start";
	if (s[s.length-1]=='/') { type="emtpy"; }
	var attr={},count=0;
	s=s.substring(name.length+1);
	s.replace(/(.*?)="([^"]*?)"/g,function(m,m1,m2) {
		attr[m1]=m2;
		count++;
	});
	if (!count) attr=undefined;
	return {name:name,type:type,attr:attr};
};
var parseUnit=function(unittext) {
	// name,sunit, soff, eunit, eoff , attributes
	var totaltaglength=0,tags=[],tagoffset=0;
	var parsed=unittext.replace(/<(.*?)>/g,function(m,m1,off){
		var i=m1.indexOf(" "),tag=m1,attributes="";
		if (i>-1) {
			tag=m1.substr(0,i);
			attributes=m1.substr(i+1);
		}
		tagoffset=off-totaltaglength;
		tags.push([tagoffset , tag,attributes, 0 ]); //vpos to be resolved
		totaltaglength+=m.length;
		return ""; //remove the tag from inscription
	});
	return {inscription:parsed, tags:tags};
};
var splitUnit=function(buf,sep) {
	var units=[], unit="", last=0 ,name="";
	buf.replace(sep,function(m,m1,offset){
		units.push([name,buf.substring(last,offset),last]);
		name=m1;
		last=offset;//+m.length;   //keep the separator
	});
	units.push([name,buf.substring(last),last]);
	return units;
};
var defaultsep="_.id";
var emptypagename="_";
var parseXML=function(buf, opts){
	opts=opts||{};
	var sep=opts.sep||defaultsep;
	var unitsep=new RegExp('<'+sep.replace(".",".*? ")+'="([^"]*?)"' , 'g')  ;
	var units=splitUnit(buf, unitsep);
	var texts=[], tags=[];
	units.map(function(U,i){
		var out=parseUnit(U[1]);
		if (opts.trim) out.inscription=out.inscription.trim();
		texts.push({n:U[0]||emptypagename,t:out.inscription});
		tags.push(out.tags);
	});
	return {texts:texts,tags:tags,sep:sep};
};
var D=nodeRequire("ksana-document").document;

var importJson=function(json) {
	d=D.createDocument();
	for (var i=0;i<json.texts.length;i++) {
		var markups=json.tags[i];
		d.createPage(json.texts[i]);
	}
	//d.setRawXMLTags(json.tags);
	d.setSep(json.sep);
	return d;
}
/*
    doc.tags hold raw xml tags, offset will be adjusted by evolvePage.
    should not add or delete page, otherwise the export XML is not valid.
*/
/*
		var o=pg.getOrigin();
		if (o.id && this.tags[o.id-1] && this.tags[o.id-1].length) {
			this.tags[o.id-1]=pg.upgradeXMLTags(this.tags[o.id-1], pg.__revisions__());	
		}
*/
var upgradeXMLTags=function(tags,revs) {
	var migratedtags=[],i=0, delta=0;
	for (var j=0;j<tags.length;j++) {
		var t=tags[j];
		var s=t[0], l=t[1].length, deleted=false;
		while (i<revs.length && revs[i].start<=s) {
			var rev=revs[i];
			if (rev.start<=s && rev.start+rev.len>=s+l) {
				deleted=true;
			}
			delta+= (rev.payload.text.length-rev.len);
			i++;
		}
		var m2=[t[0]+delta,t[1]];
		migratedtags.push(m2);
	};
	return migratedtags;
}

var migrateRawTags=function(doc,tags) {
	var out=[];
	for (var i=0;i<tags.length;i++) {
		var T=tags[i];

		var pg=doc.getPage(i+1);
		var offsprings=pg.offsprings();
		for (var j=0;j<offsprings.length;j++) {
			var o=offsprings[j];
			var rev=pg.revertRevision(o.revert,pg.inscription);
			T=upgradeXMLTags(T,rev);
			pg=o;
		}		
		out.push(T);
	}
	return out;
}
var exportXML=function(doc,originalrawtags){
	var out=[],tags=null;
	rawtags=migrateRawTags(doc,originalrawtags);
	doc.map(function(pg,i){
		var tags=rawtags[i];  //get the xml tags
		var tagnow=0,text="";
		var t=pg.inscription;
		for (var j=0;j<t.length;j++) {
			if (tagnow<tags.length) {
				if (tags[tagnow][0]==j) {
					text+="<"+tags[tagnow][1]+">";
					tagnow++;
				}
			}
			text+=t[j];
		}
		if (tagnow<tags.length && j==tags[tagnow][0]) text+="<"+tags[tagnow][1]+">";
		out.push(text);
	})

	return out.join("");
};
module.exports={parseXML:parseXML, importJson:importJson, exportXML:exportXML}
});
require.register("ksana-document/buildfromxml.js", function(exports, require, module){
var outback = function (s) {
    while (s.length < 70) s += ' ';
    var l = s.length; 
    for (var i = 0; i < l; i++) s += String.fromCharCode(8);
    process.stdout.write(s);
}
var movefile=function(sourcefn,targetfolder) {
	var fs = require("fs");
	var source = fs.createReadStream(sourcefn);
	var path=require("path");
	var targetfn=path.resolve(process.cwd(),"..")+path.sep+path.basename(sourcefn);
	var destination = fs.createWriteStream(targetfn);
	console.log(targetfn);
	source.pipe(destination, { end: false });
	source.on("end", function(){
	    fs.unlinkSync(sourcefn);
	});
	return targetfn;
}
var mkdbjs="mkdb.js";
var starttime=0;
var startindexer=function(mkdbconfig) {
  var indexer=require("ksana-document").indexer;
  var session=indexer.start(mkdbconfig);
  if (!session) {
      console.log("No file to index");
      return;
  }
  var getstatus=function() {
    var status=indexer.status();
    outback((Math.floor(status.progress*1000)/10)+'%'+status.message);
    if (status.done) {
      var endtime=new Date();
      console.log("END",endtime, "elapse",(endtime-starttime) /1000,"seconds") ;
      //status.outputfn=movefile(status.outputfn,"..");
      clearInterval(timer);
    }
  }  
  timer=setInterval( getstatus, 1000);

}

var build=function(path){
  var fs=require("fs");

  if (!fs.existsSync(mkdbjs)) {
      throw "no "+mkdbjs  ;
  }
  starttime=new Date();
  console.log("START",starttime);
  if (!path) path=".";
  
  var glob = require("glob");
  
  var timer=null;
  var fn=require("path").resolve(path,mkdbjs);  
  var mkdbconfig=require(fn);
  
  if (typeof mkdbconfig.glob=="string") {
    glob(mkdbconfig.glob, function (err, files) {
      if (err) throw err;
      mkdbconfig.files=files.sort();
      startindexer(mkdbconfig);
    });    
  } else {
    mkdbconfig.files=mkdbconfig.glob;
    startindexer(mkdbconfig);
  }



}

module.exports=build;
});
require.register("ksana-document/tei.js", function(exports, require, module){

var anchors=[];
var parser=null,filename="";
var context=null, config={};
var tagmodules=[];

var warning=function(err) {
	if (config.warning) {
		config.warning(err,filename);
	} else {
		console.log(err,filename);	
	}	
}
var ontext=function(e) {
	//if (context.handler) 
	context.text+=e;
}
var onopentag=function(e) {
	if (context.parents.length) {
		context.paths.push(e.name);
	}
	context.parents.push(e);
	context.now=e;	
	context.path=context.paths.join("/");
	if (!context.handler) {
		var handler=context.handlers[context.path];
		if (handler) {
			context.handler=handler;
			context.rootpath=context.path;
		}
		var close_handler=context.close_handlers[context.path];
		if (close_handler) 	context.close_handler=close_handler;
	}

	if (context.handler) {
		var root=context.path==context.rootpath;
		context.handler(root);
	} 
}

var onclosetag=function(e) {
	context.now=context.parents[context.parents.length-1];
	var handler=context.close_handlers[context.path];
	if (handler) {
		var res=null;
		var root=context.path==context.rootpath;
		if (context.close_handler) res=context.close_handler(root);
		context.handler=null;//stop handling
		context.rootpath=null;
		context.close_handler=null;//stop handling
		context.text="";
		if (res && context.status.storeFields) {
			context.status.storeFields(res, context.status.json);
		}
	} else if (context.close_handler) {
		var root=context.path==context.rootpath;
		context.close_handler(root);
	}
	
	context.paths.pop();
	context.parents.pop();
	context.path=context.paths.join("/");		
}
var addHandler=function(path,_tagmodule) {
	var tagmodule=_tagmodule;
	if (typeof tagmodule=="function") {
		tagmodule={close_handler:_tagmodule};
	}
	if (tagmodule.handler) context.handlers[path]=tagmodule.handler;
	if (tagmodule.close_handler) context.close_handlers[path]=tagmodule.close_handler;
	if (tagmodule.reset) tagmodule.reset();
	tagmodule.warning=warning;
	tagmodules.push(tagmodule);
}
var closeAnchor=function(pg,T,anchors,id,texts) {
	var beg="beg"+id.substr(3);
	for (var j=anchors.length-1;j>=0;j--) {
		if (anchors[j][3]!=beg) continue;
		var anchor=anchors[j];
		
		if (pg==anchor[0]) { //same page
			anchor[2]=T[0]-anchor[1]; // length
		} else { //assume end anchor in just next page// ref. pT01p0003b2901
			var pagelen=texts[anchor[0]].t.length;
			anchors[j][2]= (pagelen-anchor[1])  + T[0];
		}
		return;
	}
	warning("cannot find beg pointer for anchor:"+id);
}
// [pg, start, len, id]
var createAnchors=function(parsed) {
	var anchors=[];
	var tags=parsed.tags;
	for (var pg=0;pg<tags.length;pg++){
		var pgtags=tags[pg];
		for (var i=0;i<pgtags.length;i++) {
				var T=pgtags[i];
				if (T[1].indexOf("anchor xml:id=")!=0) continue;
				var id=T[1].substr(15);
				id=id.substr(0,id.indexOf('"'));
				if (id.substr(0,3)=="end") {
					closeAnchor(pg,T,anchors,id,parsed.texts);
				} else {
					anchors.push([pg,T[0],0,id]);	
				}
			}
	}
	return anchors;	
}
var resolveAnchors=function(anchors,texts) {
	tagmodules.map(function(m){
		if (m.resolve) m.resolve(anchors,texts);
	})
}
var  createMarkups=function(parsed) {
	anchors=createAnchors(parsed);
	resolveAnchors(anchors,parsed.text);

	for (var i=0;i<anchors.length;i++) {
		if (anchors[i][4] && !anchors[i][4].length) {
			config.warning("unresolve anchor"+anchors[i][3]);
		}
	}
	return anchors;
}
var handlersResult=function() {
	var out={};
	tagmodules.map(function(m){
		if (m.result) out[m.name]=m.result();
	})
}

var parseP5=function(xml,parsed,fn,_config,_status) {
	parser=require("sax").parser(true);
	filename=fn;
	context={ paths:[] , parents:[], handlers:{}, close_handlers:{}, text:"" ,now:null,status:_status};
	parser.onopentag=onopentag;
	parser.onclosetag=onclosetag;
	parser.ontext=ontext;
	config=_config;
	tagmodules=[];
	context.addHandler=addHandler;
	if (_config.setupHandlers) config.setupHandlers.apply(context);
	if (config.callbacks && config.callbacks.beforeParseTag) {
		xml=config.callbacks.beforeParseTag(xml);
	}
	parser.write(xml);
	debugger;
	context=null;
	parser=null;
	if (parsed) return createMarkups(parsed);
	else return handlersResult();
}
module.exports=parseP5;
});
require.register("ksana-document/concordance.js", function(exports, require, module){
/*
  concordance without suffix array.

  法 takes 25 seconds.

  improvement:
	less page scan.        
*/
var search=require("./search");
var Kde=require("./kde");
var excerpt=excerpt=require("./excerpt");
var status={progress:0}, forcestop=false;
var texts=[],starts=[],ends=[];
var config=null,engine=null;
var nest=0;
var verbose=false;

var scanpage=function(obj,npage,pat,backward) {
	var page=texts[npage];
	page.replace(pat,function(m,m1){
			if (!obj[m1]) obj[m1]=[];
			var o=obj[m1];
			if (o[o.length-1]!=npage) o.push(npage);
	});
}
var trimunfrequent=function(out,total,config) {
	for (var i=0;i<out.length;i++) {
		var hit=out[i][1].length;
		if ( (hit / total) < config.threshold || hit < config.threshold_count) {
			out.length=i;
			break;
		}
	}
}
var findNeighbors=function(filter,q,backward) {
	var cjkbmp="([\\u4E00-\\u9FFF])";
	if (verbose) console.log("findn",q,filter.length,backward)
	var p=q+cjkbmp;
	nest++;
	if (backward) terms=starts;
	else terms=ends;

	if (backward) p=cjkbmp+q ;  //starts

	var pat=new RegExp(p,"g");
	var obj={},out=[];
	for (var i=0;i<filter.length;i++) {
		var npage=i;
		if (typeof filter[i]=="number") npage=filter[i];
		scanpage(obj,npage,pat,backward);
	}
	for (var i in obj) out.push([i,obj[i]]);
	out.sort(function(a,b){return b[1].length-a[1].length});

	var total=0;
	for (var i=0;i<out.length;i++) total+=out[i][1].length;

	trimunfrequent(out,total,config);
	var newterms=[];
	if (nest<5) for (var i=0;i<out.length;i++) {
		var term=q+out[i][0];
		var termhit=out[i][1].length;
		if (backward) term=out[i][0]+q;
		var childterms=findNeighbors(out[i][1],term,backward);

		terms.push([term,termhit,q]);

		if (childterms.length==1 && childterms[0][1]/config.mid_threshold > termhit) {
			terms[terms.length-1][3]=childterms[0][0];
		}
		newterms.push([term,termhit,q]);
	}
	nest--;
	return newterms;
}

var finalize=function() {
	if (verbose) console.timeEnd("fetchtext");
	if (verbose) console.time("neighbor");
	findNeighbors(texts,config.q,false); //forward
	findNeighbors(texts,config.q,true); //backward	
	starts.sort(function(a,b){return b[1]-a[1]});
	ends.sort(function(a,b){return b[1]-a[1]});
	status.output={
		totalpagecount:engine.get("meta").pagecount,
		pagecount:texts.length,starts:starts,ends:ends};
	if (verbose) console.timeEnd("neighbor");
	status.done=true;
}
var opts={nohighlight:true};

var worker=function() {
	var Q=this;
	var pages=Q.pageWithHit(this.now);
	status.progress=this.now/Q.byFile.length;
	for (var j=0;j<pages.length;j++) {
		texts.push( engine.getSync(["fileContents",this.now,pages[j]]));	
	}
	this.now++
	if (this.now<Q.byFile.length) {
		setImmediate( worker.bind(this)) ;
		if (forcestop || Q.excerptStop) 	finalize();
	} else finalize();
}

var start=function(_config) {
	if (verbose) console.time("search");
	config=_config;
	config.threshold=config.threshold||0.005;
	config.threshold_count=config.threshold_count||20;
	config.mid_threshold=config.mid_threshold || 0.9 ; //if child has 80% hit, remove parent
	config.termlimit=config.termlimit||500;
	config.nestlevel=config.nestlevel||5;
	var open=Kde.open;
	if (typeof Require=="undefined") open=Kde.openLocal;

	open(config.db,function(_engine){
		engine=_engine;
		search(engine,config.q,opts,function(Q){
			Q.now=0;
			if (verbose) console.timeEnd("search");
			if (verbose) console.time("fetchtext");
			worker.call(Q);
		});
	});
}
var stop=function() {
	forcestop=true;
}

var getstatus=function() {
	return status;
}

module.exports={start:start,stop:stop,status:getstatus};

//module.exports=concordance;
});
require.register("ksana-document/regex.js", function(exports, require, module){
/*
   regex search.
   scan only possible pages

   remove regular expression operator  ^ $  [  ]  {  }  (  )  . \d \t \n

   $,^  begin and end not supported 
   support [^] exclusion later

   report match term with hit
*/
var search=require("./search");
var Kde=require("./kde");
var status={progress:0}, forcestop=false;
var texts=[],terms=[];
var config=null,engine=null;

var opts={nohighlight:true, range:{filestart:0, maxfile:100}};

var worker=function() {
	search(engine,config.q_unregex,opts,function(Q){
		var excerpts=Q.excerpt.map(function(q){return q.text.replace(/\n/g,"")});
		texts=texts.concat(excerpts);
		opts.range.filestart=opts.range.nextFileStart;
		status.progress=opts.range.nextFileStart/Q.byFile.length;
		if (forcestop || Q.excerptStop) {
			finalize();
		} else setTimeout(worker,0);
	});
}

var filter=function() {
	var pat=new RegExp(config.q,"g");
	var matches={};
	
	for (var i=0;i<texts.length;i++) {
		var m=texts[i].match(pat);
		if (m) {
			for (var j=0;j<m.length;j++) {
				if (!matches[m[j]]) matches[m[j]]=0;
				matches[m[j]]++;
			}
		}
	}

	terms=[];
	for (var i in matches) {
		if (matches[i]>=config.threshold) terms.push( [i,matches[i]]);	
	} 
	terms.sort(function(a,b){return b[1]-a[1]});
	return terms;
}
var finalize=function() {
	filter();
	status.output={
		totalpagecount:engine.get("meta").pagecount,
		pagecount:texts.length,
		terms:terms
	};
	status.done=true;
}
var unregex=function(q) {
	var out=q.replace(/\.+/g," ");
	out=out.replace(/\\./g," "); //remove \d \n \t
	return out;
}
var start=function(_config){
	config=_config;
	var open=Kde.open;
	config.threshold=config.threshold||5;
	if (typeof Require=="undefined") open=Kde.openLocal;
	config.q_unregex=unregex(config.q);
	open(config.db,function(_engine){
		engine=_engine;
		setTimeout(worker,0);
	});
}
var stop=function() {
	forcestop=true;
}

var getstatus=function() {
	return status;
}
module.exports={start:start,stop:stop,status:getstatus};
});
require.register("ksana-document/bsearch.js", function(exports, require, module){
var indexOfSorted = function (array, obj, near) { 
  var low = 0,
  high = array.length;
  while (low < high) {
    var mid = (low + high) >> 1;
    if (array[mid]==obj) return mid;
    array[mid] < obj ? low = mid + 1 : high = mid;
  }
  if (near) return low;
  else if (array[low]==obj) return low;else return -1;
};
var indexOfSorted_str = function (array, obj, near) { 
  var low = 0,
  high = array.length;
  while (low < high) {
    var mid = (low + high) >> 1;
    if (array[mid]==obj) return mid;
    (array[mid].localeCompare(obj)<0) ? low = mid + 1 : high = mid;
  }
  if (near) return low;
  else if (array[low]==obj) return low;else return -1;
};


var bsearch=function(array,value,near) {
	var func=indexOfSorted;
	if (typeof array[0]=="string") func=indexOfSorted_str;
	return func(array,value,near);
}
var bsearchNear=function(array,value) {
	return bsearch(array,value,true);
}

module.exports=bsearch;//{bsearchNear:bsearchNear,bsearch:bsearch};
});
require.register("ksana-document/persistentmarkup_pouchdb.js", function(exports, require, module){
/*
markup format:
{"start":start_offset,"len":length_in_byte,"payload":{"type":"markup_type",author":"p1","text":""},"i":page_id}
*/
//saveMarkup({dbid:dbid,markups:markups,filename:filename,i:this.state.pageid } ,function(data){

var combineMarkups=function(db,markups,fn,pageid,cb) {

	var key="M!"+pageid+"!"+fn;
	db.get(key,function(err,res){
		var existing=[] ;
		if (res && res.M) existing=res.M ;
		if (!markups || !markups.length) {
			if (err.error) cb([]);
			else cb(existing);
			return;
		}

		var author=markups[0].payload.author, others=[];
		if (existing) {
			others=existing.filter(function(m){return m.i!=pageid || m.payload.author != author});		
		}
		for (var i=0;i<markups.length;i++) {
			markups[i].i=pageid;
		}
		others=others.concat(markups);
		var sortfunc=function(a,b) {
			//each page less than 64K
			return (a.i*65536 +a.start) - (b.i*65536 +b.start);
		}
		others.sort(sortfunc);
		cb(others,res._rev);
	});
}

var saveMarkup=function(opts,cb){
	combineMarkups(opts.db,opts.markups,opts.filename,opts.i,function(markups,rev){
		for (var i=0;i<markups.length;i++) {
			markups[i].i=opts.i;
		}
		var key="M!"+opts.i+"!"+opts.filename;
		if (markups.length) {
			opts.db.put({M:markups,_rev:rev,_id:key},function(err,response){
				cb();
			});
		} else {
			cb();
		}
	});
}
var __loadMarkups=function(db,fn,pagecount,cb) {
	var out=[],keys=[];
	for (var i=1;i<pagecount;i++) {
		keys.push("M!"+i+"!"+fn);
	}
	db.allDocs({include_docs:true,keys:keys},function(err,res){
			res.rows.map(function(r){
				if (r.error) return;
				out=out.concat(r.doc.M);
			})
			cb(out);
	});
}
var loadMarkup=function(db,fn,pageid,cb) {
	if (pageid<0) {
		__loadMarkups(db,fn,-pageid,cb);
		return;
	}
	var key="M!"+pageid+"!"+fn;
	db.get(key,function(err,res){
		cb(res.M);
	});
}
module.exports={
	saveMarkup:saveMarkup,
	loadMarkup:loadMarkup
}
});
require.register("ksana-document/underlines.js", function(exports, require, module){
/*
  input : markups start and len
  output:
     each token has an array of 
			[markup idx , start_middle_end , level ]

			markup idx is the nth markup in markup array
			start=1, middle=0, end=2, both=3

 for converting to css style

 base on http://codepen.io/anon/pen/fHben by exebook@gmail.com
*/
var getTextLen=function(markups) {
	var textlen=0;
	markups.map(function(m){
		if (m[0]+m[1]>textlen) textlen=m[0]+m[1];
	});
	return textlen;
}

var calculateLevels=function(M) {
	//M = M.sort(function(a, b) { return b.len - a.len } ); // sort longest first
	var textlen=getTextLen(M);
	var levels=[],out=[];
	for (var i = 0; i < textlen; i++) levels[i] = [];

	for (var i = 0; i < M.length; i++) {
		var max = -1, pos = M[i][0], count = M[i][1];
		// find how many taken levels are here
		for (var x = pos; x < pos + count; x++) {
			if (levels[x].length > max) max = levels[x].length;
		}
		// check if there is an empty level
		var level = max;
		for (var l = 0; l < max; l++) {
			var ok = true ;
			for (var m = pos; m < pos + count; m++) {
				if (levels[m][l] != undefined) { ok = false; break }
			}
			if (ok) { level = l; break }
		}
		out.push([i,level]);
		// fill the level
		for (var x = pos; x < pos + count; x++)	levels[x][level] = i;
	}
	return out;
}

var TAG_START=0, TAG_END=1;
var fixOverlaps=function(S) {
	// insert extra tags because we cannot have overlaps in html
	var out = [], stack = [] ,lstack=[];
	for (var i = S.length - 1; i >= 0; i--) {
		var id=S[i][0], pos=S[i][1],tagtype=S[i][2], level=S[i][3];
		if (tagtype == TAG_START) { 
			stack.push(id);
			lstack.push(level);
			out.unshift(S[i]);
		}	else if (tagtype == TAG_END) {
			if (id == stack[stack.length - 1]) {
				stack.pop();
				lstack.pop();
				out.unshift(S[i]);
			} else {
				var z = stack.length - 1;
				while (z > 0 && stack[z] != id) {
					out.unshift([stack[z], pos, TAG_END, lstack[z]]);
					z--;
				}
				out.unshift([stack[z], pos, TAG_END, lstack[z]]);
				stack.splice(z, 1);
				lstack.splice(z, 1);
				while (z < stack.length) {
					out.unshift([stack[z], pos, TAG_START,  lstack[z]]);
					z++;
				}
			} 
		}
	}
	return out
}
var levelMarkups=function(M) {
	var P=calculateLevels(M), S = [];
	var backward=function(a, b){ 
		if (b[1] == a[1]) {
				if (b[2] == TAG_START && a[2] == TAG_END) return 1;
				if (a[2] == TAG_START && b[2] == TAG_END) return -1;
			}
			return b[1] - a[1];
	};
	var forward=function(a, b){ 
				if (b[1] == a[1]) {
					if (b[2] == TAG_START && a[2] == TAG_END) return -1;
					if (a[2] == TAG_START && b[2] == TAG_END) return 1;
				}
				return a[1] - b[1];
	};

	for (var p = 0; p < P.length; p++) {
		S.push([p,M[p][0],TAG_START,P[p][1]]); // id, pos, tagtype, level
		S.push([p,M[p][0]+M[p][1],TAG_END,P[p][1]]);
	}
	S = S.sort(backward);
			
	/* s[0] == markup id , s[1]==pos , s[2]==tagtype  */
	S = fixOverlaps(S);
	//if (!inverse) S = S.sort(forward);		
	return S;
}
var renderXML=function(tokens, M) {
	var S=levelMarkups(M,true);

	var idx=0,out="";
	for (var i=tokens.length;i>0;i--) {
		while (idx<S.length && S[idx][1]==i) {
			var id=S[idx][0], tagtype=S[idx][2] ;
			var tag = M[id][2] , level=S[idx][3] ; //level=P[id][1];
			if (tagtype==TAG_START) out= '<'+tag+' lv="'+level+'">' +out;
			if (tagtype==TAG_END) out= '</'+tag+'>' +out;
			idx++;
		}
		out=tokens[i-1]+out;
	}
	return out;//return text
}
module.exports={calculateLevels:calculateLevels, 
	levelMarkups:levelMarkups,renderXML:renderXML,
  TAG_START:TAG_START,TAG_END:TAG_END};

/*
var indexOfSorted = function (array, obj) {  //taken from ksana-document/bsearch.js
  var low = 0,
  high = array.length;
  while (low < high) {
    var mid = (low + high) >> 1;
    if (array[mid]==obj) return mid;
    array[mid] < obj ? low = mid + 1 : high = mid;
  }
	if (array[low]==obj) return low;else return -1;
};

var getTextLen=function(markups) {
	var textlen=0;
	markups.map(function(m){
		if (m[0]+m[1]>textlen) textlen=m[0]+m[1];
	});
	return textlen;
}

var calculateLevel=function(markups,textlen) {
	textlen=textlen||getTextLen(markups);
	var startarr=markups.map(function(m,idx){return [m[0],idx]})
	              .sort(function(a,b){return a[0]-b[0]});

	var startat =startarr.map(function(m){return m[0]});
	var startidx=startarr.map(function(m){return m[1]});

	var endarr  =markups.map(function(m,idx){return [m[0]+m[1]-1,idx]})
	              .sort(function(a,b){return a[0]-b[0]});

	var endat =endarr.map(function(m){return m[0]}); // sort by token offset
	var endidx=endarr.map(function(m){return m[1]}); //markup index
	
	var levels=[],level=0;
	var out=[];
	for (var i=0;i<textlen;i++) {
		var tokenout=[]; 
		var starts=[],ends=[];
		var mstart=indexOfSorted(startat,i); //don't need , because one pass
		while (startat[mstart]==i) {  //find out all markups start at this token
			starts.push(startidx[mstart]);
			mstart++;
		}

		var mend=indexOfSorted(endat,i);
		while (endat[mend]==i) {  // find out all markups end at this token
			ends.push(endidx[mend]); //push the idx in markups
			mend++;
		}

		//insert new markup
		starts.map(function(s,idx){
			var j=0;
			while (typeof levels[j]!=="undefined") j++;
			levels[j]=[s,1];
		});
		
		//marked the ended
		ends.map(function(e,idx){
			for (var j=0;j<levels.length;j++) {
				var lv=levels[j];
				if (!lv) continue;
				if (lv[0]==e) lv[1]+=2;//mark end
			}
		});

		levels.map(function(lv,idx,L){
			if (!lv) return ;
			tokenout.push([lv[0],lv[1],idx]);
			if(lv[1]==1) lv[1]=0;
			else if (lv[1]>=2) L[idx]=undefined; //remove the ended markup
		});
		
		out[i]=tokenout;
	}
	//levels.length , max level 

	return out;
}

var renderXML=function(tokens,markups,levels) {
	var out=[];
	for (var i=0;i<tokens.length;i++) {
		var s=tokens[i];
		if (levels[i]) {
			for (var j=0;j<levels[i].length;j++) {
				var lv=levels[i][j];
				var tag=markups[lv[0]][2];
				if ((lv[1]&1)==1) {
					s="<"+tag+">"+s;
				} else if ((lv[1]&2)==2) {
					s=s+"</"+tag+">";
				}
			}
		}
		//out+=s;
	}
	return out;
}
*/
});
require.register("ksanaforge-fileinstaller/index.js", function(exports, require, module){
/** @jsx React.DOM */

/* todo , optional kdb */

var htmlfs=Require("htmlfs");    
var checkbrowser=Require("checkbrowser");  
  
var html5fs=Require("ksana-document").html5fs;
var filelist = React.createClass({displayName: 'filelist',
	getInitialState:function() {
		return {downloading:false,progress:0};
	},
	updatable:function(f) {
        	var classes="btn btn-warning";
        	if (this.state.downloading) classes+=" disabled";
		if (f.hasUpdate) return React.DOM.button({className: classes, 
			'data-filename': f.filename, 'data-url': f.url, 
	            onClick: this.download
	       }, "Update")
		else return null;
	},
	showLocal:function(f) {
        var classes="btn btn-danger";
        if (this.state.downloading) classes+=" disabled";
	  return React.DOM.tr(null, React.DOM.td(null, f.filename), 
	      React.DOM.td(null), 
	      React.DOM.td({className: "pull-right"}, 
	      this.updatable(f), React.DOM.button({className: classes, 
	               onClick: this.deleteFile, 'data-filename': f.filename}, "Delete")
	        
	      )
	  )
	},  
	showRemote:function(f) { 
	  var classes="btn btn-warning";
	  if (this.state.downloading) classes+=" disabled";
	  return (React.DOM.tr({'data-id': f.filename}, React.DOM.td(null, 
	      f.filename), 
	      React.DOM.td(null, f.desc), 
	      React.DOM.td(null, 
	      React.DOM.span({'data-filename': f.filename, 'data-url': f.url, 
	            className: classes, 
	            onClick: this.download}, "Download")
	      )
	  ));
	},
	showFile:function(f) {
	//	return <span data-id={f.filename}>{f.url}</span>
		return (f.ready)?this.showLocal(f):this.showRemote(f);
	},
	reloadDir:function() {
		this.props.action("reload");
	},
	download:function(e) {
		var url=e.target.dataset["url"];
		var filename=e.target.dataset["filename"];
		this.setState({downloading:true,progress:0,url:url});
		this.userbreak=false;
		html5fs.download(url,filename,function(){
			this.reloadDir();
			this.setState({downloading:false,progress:1});
			},function(progress,total){
				if (progress==0) {
					this.setState({message:"total "+total})
			 	}
			 	this.setState({progress:progress});
			 	//if user press abort return true
			 	return this.userbreak;
			}
		,this);
	},
	deleteFile:function( e) {
		var filename=e.target.attributes["data-filename"].value;
		this.props.action("delete",filename);
	},
	allFilesReady:function(e) {
		return this.props.files.every(function(f){ return f.ready});
	},
	dismiss:function() {
		$(this.refs.dialog1.getDOMNode()).modal('hide');
		this.props.action("dismiss");
	},
	abortdownload:function() {
		this.userbreak=true;
	},
	showProgress:function() {
	     if (this.state.downloading) {
	      var progress=Math.round(this.state.progress*100);
	      return (
	      	React.DOM.div(null, 
	      	"Downloading from ", this.state.url, 
	      React.DOM.div({key: "progress", className: "progress col-md-8"}, 
	          React.DOM.div({className: "progress-bar", role: "progressbar", 
	              'aria-valuenow': progress, 'aria-valuemin': "0", 
	              'aria-valuemax': "100", style: {width: progress+"%"}}, 
	            progress, "%"
	          )
	        ), 
	        React.DOM.button({onClick: this.abortdownload, 
	        	className: "btn btn-danger col-md-4"}, "Abort")
	        )
	        );
	      } else {
	      		if ( this.allFilesReady() ) {
	      			return React.DOM.button({onClick: this.dismiss, className: "btn btn-success"}, "Ok")
	      		} else return null;
	      		
	      }
	},
	showUsage:function() {
		var percent=this.props.remainPercent;
           return (React.DOM.div(null, React.DOM.span({className: "pull-left"}, "Usage:"), React.DOM.div({className: "progress"}, 
		  React.DOM.div({className: "progress-bar progress-bar-success progress-bar-striped", role: "progressbar", style: {width: percent+"%"}}, 
		    	percent+"%"
		  )
		)));
	},
	render:function() {
	  	return (
		React.DOM.div({ref: "dialog1", className: "modal fade", 'data-backdrop': "static"}, 
		    React.DOM.div({className: "modal-dialog"}, 
		      React.DOM.div({className: "modal-content"}, 
		        React.DOM.div({className: "modal-header"}, 
		          React.DOM.h4({className: "modal-title"}, "File Installer")
		        ), 
		        React.DOM.div({className: "modal-body"}, 
		        	React.DOM.table({className: "table"}, 
		        	React.DOM.tbody(null, 
		          	this.props.files.map(this.showFile)
		          	)
		          )
		        ), 
		        React.DOM.div({className: "modal-footer"}, 
		        	this.showUsage(), 
		           this.showProgress()
		        )
		      )
		    )
		  )
		);
	},	
	componentDidMount:function() {
		$(this.refs.dialog1.getDOMNode()).modal('show');
	}
});
/*TODO kdb check version*/
var filemanager = React.createClass({displayName: 'filemanager',
	getInitialState:function() {
		var quota=this.getQuota();
		return {browserReady:false,noupdate:true,	requestQuota:quota,remain:0};
	},
	getQuota:function() {
		var q=this.props.quota||"128M";
		var unit=q[q.length-1];
		var times=1;
		if (unit=="M") times=1024*1024;
		else if (unit="K") times=1024;
		return parseInt(q) * times;
	},
	missingKdb:function() {
		if (typeof ksanagap!="undefined") return [];
		var missing=this.props.needed.filter(function(kdb){
			for (var i in html5fs.files) {
				if (html5fs.files[i][0]==kdb.filename) return false;
			}
			return true;
		},this);
		return missing;
	},
	getRemoteUrl:function(fn) {
		var f=this.props.needed.filter(function(f){return f.filename==fn});
		if (f.length ) return f[0].url;
	},
	genFileList:function(existing,missing){
		var out=[];
		for (var i in existing) {
			var url=this.getRemoteUrl(existing[i][0]);
			out.push({filename:existing[i][0], url :url, ready:true });
		}
		for (var i in missing) {
			out.push(missing[i]);
		}
		return out;
	},
	reload:function() {
		html5fs.readdir(function(files){
  			this.setState({files:this.genFileList(files,this.missingKdb())});
  		},this);
	 },
	deleteFile:function(fn) {
	  html5fs.rm(fn,function(){
	  	this.reload();
	  },this);
	},
	onQuoteOk:function(quota,usage) {
		if (typeof ksanagap!="undefined") {
			//console.log("onquoteok");
			this.setState({noupdate:true,missing:[],files:[],autoclose:true
				,quota:quota,remain:quota-usage,usage:usage});
			return;
		}
		//console.log("quote ok");
		var files=this.genFileList(html5fs.files,this.missingKdb());
		var that=this;
		that.checkIfUpdate(files,function(hasupdate) {
			var missing=this.missingKdb();
			var autoclose=this.props.autoclose;
			if (missing.length) autoclose=false;
			that.setState({autoclose:autoclose,
				quota:quota,usage:usage,files:files,
				missing:missing,
				noupdate:!hasupdate,
				remain:quota-usage});
		});
	},  
	onBrowserOk:function() {
	  this.totalDownloadSize();
	}, 
	dismiss:function() {
		this.props.onReady(this.state.usage,this.state.quota);
		setTimeout(function(){
			$(".modal.in").modal('hide');
		},500);
	}, 
	totalDownloadSize:function() {
		var files=this.missingKdb();
		var taskqueue=[],totalsize=0;
		for (var i=0;i<files.length;i++) {
			taskqueue.push(
				(function(idx){
					return (function(data){
						if (!(typeof data=='object' && data.__empty)) totalsize+=data;
						html5fs.getDownloadSize(files[idx].url,taskqueue.shift());
					});
				})(i)
			);
		}
		var that=this;
		taskqueue.push(function(data){	
			totalsize+=data;
			setTimeout(function(){that.setState({requireSpace:totalsize,browserReady:true})},0);
		});
		taskqueue.shift()({__empty:true});
	},
	checkIfUpdate:function(files,cb) {
		var taskqueue=[];
		for (var i=0;i<files.length;i++) {
			taskqueue.push(
				(function(idx){
					return (function(data){
						if (!(typeof data=='object' && data.__empty)) files[idx-1].hasUpdate=data;
						html5fs.checkUpdate(files[idx].url,files[idx].filename,taskqueue.shift());
					});
				})(i)
			);
		}
		var that=this;
		taskqueue.push(function(data){	
			files[files.length-1].hasUpdate=data;
			var hasupdate=files.some(function(f){return f.hasUpdate});
			if (cb) cb.apply(that,[hasupdate]);
		});
		taskqueue.shift()({__empty:true});
	},
	render:function(){
    		if (!this.state.browserReady) {   
      			return checkbrowser({feature: "fs", onReady: this.onBrowserOk})
    		} if (!this.state.quota || this.state.remain<this.state.requireSpace) {  
    			var quota=this.state.requestQuota;
    			if (this.state.usage+this.state.requireSpace>quota) {
    				quota=(this.state.usage+this.state.requireSpace)*1.5;
    			}
      			return htmlfs({quota: quota, autoclose: "true", onReady: this.onQuoteOk})
      		} else {
			if (!this.state.noupdate || this.missingKdb().length || !this.state.autoclose) {
				var remain=Math.round((this.state.usage/this.state.quota)*100);				
				return filelist({action: this.action, files: this.state.files, remainPercent: remain})
			} else {
				setTimeout( this.dismiss ,0);
				return React.DOM.span(null, "Success");
			}
      		}
	},
	action:function() {
	  var args = Array.prototype.slice.call(arguments);
	  var type=args.shift();
	  var res=null, that=this;
	  if (type=="delete") {
	    this.deleteFile(args[0]);
	  }  else if (type=="reload") {
	  	this.reload();
	  } else if (type=="dismiss") {
	  	this.dismiss();
	  }
	}
});

module.exports=filemanager;
});
require.register("ksanaforge-checkbrowser/index.js", function(exports, require, module){
/** @jsx React.DOM */

var hasksanagap=(typeof ksanagap!="undefined");
if (hasksanagap && (typeof console=="undefined" || typeof console.log=="undefined")) {
		window.console={log:ksanagap.log,error:ksanagap.error,debug:ksanagap.debug,warn:ksanagap.warn};
		console.log("install console output funciton");
}

var checkfs=function() {
	return (navigator && navigator.webkitPersistentStorage) || hasksanagap;
}
var featurechecks={
	"fs":checkfs
}
var checkbrowser = React.createClass({displayName: 'checkbrowser',
	getInitialState:function() {

		var missingFeatures=this.getMissingFeatures();
		return {ready:false, missing:missingFeatures};
	},
	getMissingFeatures:function() {
		var feature=this.props.feature.split(",");
		var status=[];
		feature.map(function(f){
			var checker=featurechecks[f];
			if (checker) checker=checker();
			status.push([f,checker]);
		});
		return status.filter(function(f){return !f[1]});
	},
	downloadbrowser:function() {
		window.location="https://www.google.com/chrome/"
	},
	renderMissing:function() {
		var showMissing=function(m) {
			return React.DOM.div(null, m);
		}
		return (
		 React.DOM.div({ref: "dialog1", className: "modal fade", 'data-backdrop': "static"}, 
		    React.DOM.div({className: "modal-dialog"}, 
		      React.DOM.div({className: "modal-content"}, 
		        React.DOM.div({className: "modal-header"}, 
		          React.DOM.button({type: "button", className: "close", 'data-dismiss': "modal", 'aria-hidden': "true"}, "×"), 
		          React.DOM.h4({className: "modal-title"}, "Browser Check")
		        ), 
		        React.DOM.div({className: "modal-body"}, 
		          React.DOM.p(null, "Sorry but the following feature is missing"), 
		          this.state.missing.map(showMissing)
		        ), 
		        React.DOM.div({className: "modal-footer"}, 
		          React.DOM.button({onClick: this.downloadbrowser, type: "button", className: "btn btn-primary"}, "Download Google Chrome")
		        )
		      )
		    )
		  )
		 );
	},
	renderReady:function() {
		return React.DOM.span(null, "browser ok")
	},
	render:function(){
		return  (this.state.missing.length)?this.renderMissing():this.renderReady();
	},
	componentDidMount:function() {
		if (!this.state.missing.length) {
			this.props.onReady();
		} else {
			$(this.refs.dialog1.getDOMNode()).modal('show');
		}
	}
});

module.exports=checkbrowser;
});
require.register("ksanaforge-htmlfs/index.js", function(exports, require, module){
/** @jsx React.DOM */
var html5fs=Require("ksana-document").html5fs;
var htmlfs = React.createClass({displayName: 'htmlfs',
	getInitialState:function() { 
		return {ready:false, quota:0,usage:0,Initialized:false,autoclose:this.props.autoclose};
	},
	initFilesystem:function() {
		var quota=this.props.quota||1024*1024*128; // default 128MB
		quota=parseInt(quota);
		html5fs.init(quota,function(q){
			this.dialog=false;
			$(this.refs.dialog1.getDOMNode()).modal('hide');
			this.setState({quota:q,autoclose:true});
		},this);
	},
	welcome:function() {
		return (
		React.DOM.div({ref: "dialog1", className: "modal fade", id: "myModal", 'data-backdrop': "static"}, 
		    React.DOM.div({className: "modal-dialog"}, 
		      React.DOM.div({className: "modal-content"}, 
		        React.DOM.div({className: "modal-header"}, 
		          React.DOM.h4({className: "modal-title"}, "Welcome")
		        ), 
		        React.DOM.div({className: "modal-body"}, 
		          "Browser will ask for your confirmation."
		        ), 
		        React.DOM.div({className: "modal-footer"}, 
		          React.DOM.button({onClick: this.initFilesystem, type: "button", 
		            className: "btn btn-primary"}, "Initialize File System")
		        )
		      )
		    )
		  )
		 );
	},
	renderDefault:function(){
		var used=Math.floor(this.state.usage/this.state.quota *100);
		var more=function() {
			if (used>50) return React.DOM.button({type: "button", className: "btn btn-primary"}, "Allocate More");
			else null;
		}
		return (
		React.DOM.div({ref: "dialog1", className: "modal fade", id: "myModal", 'data-backdrop': "static"}, 
		    React.DOM.div({className: "modal-dialog"}, 
		      React.DOM.div({className: "modal-content"}, 
		        React.DOM.div({className: "modal-header"}, 
		          React.DOM.h4({className: "modal-title"}, "Sandbox File System")
		        ), 
		        React.DOM.div({className: "modal-body"}, 
		          React.DOM.div({className: "progress"}, 
		            React.DOM.div({className: "progress-bar", role: "progressbar", style: {width: used+"%"}}, 
		               used, "%"
		            )
		          ), 
		          React.DOM.span(null, this.state.quota, " total , ", this.state.usage, " in used")
		        ), 
		        React.DOM.div({className: "modal-footer"}, 
		          React.DOM.button({onClick: this.dismiss, type: "button", className: "btn btn-default", 'data-dismiss': "modal"}, "Close"), 
		          more()
		        )
		      )
		    )
		  )
		  );
	},
	dismiss:function() {
		var that=this;
		setTimeout(function(){
			that.props.onReady(that.state.quota,that.state.usage);	
		},0);
	},
	queryQuota:function() {
		if (typeof ksanagap=="undefined") {
			html5fs.queryQuota(function(usage,quota){
				this.setState({usage:usage,quota:quota,initialized:true});
			},this);			
		} else {
			this.setState({usage:333,quota:1000*1000*1024,initialized:true,autoclose:true});
		}
	},
	render:function() {
		var that=this;
		if (!this.state.quota || this.state.quota<this.props.quota) {
			if (this.state.initialized) {
				this.dialog=true;
				return this.welcome();	
			} else {
				return React.DOM.span(null, "checking quota")
			}			
		} else {
			if (!this.state.autoclose) {
				this.dialog=true;
				return this.renderDefault(); 
			}
			this.dismiss();
			this.dialog=false;
			return React.DOM.span(null)
		}
	},
	componentDidMount:function() {
		if (!this.state.quota) {
			this.queryQuota();

		};
	},
	componentDidUpdate:function() {
		if (this.dialog) $(this.refs.dialog1.getDOMNode()).modal('show');
	}
});

module.exports=htmlfs;
});
require.register("installer-main/index.js", function(exports, require, module){
/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var main = React.createClass({displayName: 'main',
  getInitialState: function() {
    
    return {dirs:[]};
  },
  componentDidMount:function() {
    this.readDir();
  },
  readDir:function() {
    if (typeof kfs!="undefined") {
      var dirs=kfs.readDir("..").split("\uffff");
      this.setState({dirs:dirs});
    }
  },
  renderDir:function(d) {
    return React.DOM.div(null, d)
  },
  render: function() {
    return (
      React.DOM.div(null, 
        "dirs ", this.state.dirs.map(this.renderDir)
      )
    );
  }
});
module.exports=main;
});
require.register("installer-comp1/index.js", function(exports, require, module){
/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var comp1 = React.createClass({displayName: 'comp1',
  getInitialState: function() {
    return {};
  },
  render: function() {
    return (
      React.DOM.div(null, 
        "Rendering comp1"
      )
    );
  }
});
module.exports=comp1;
});
require.register("installer/index.js", function(exports, require, module){
var boot=require("boot");
boot("installer","main","main");
});
















require.alias("ksanaforge-boot/index.js", "installer/deps/boot/index.js");
require.alias("ksanaforge-boot/index.js", "installer/deps/boot/index.js");
require.alias("ksanaforge-boot/index.js", "boot/index.js");
require.alias("ksanaforge-boot/index.js", "ksanaforge-boot/index.js");
require.alias("brighthas-bootstrap/dist/js/bootstrap.js", "installer/deps/bootstrap/dist/js/bootstrap.js");
require.alias("brighthas-bootstrap/dist/js/bootstrap.js", "installer/deps/bootstrap/index.js");
require.alias("brighthas-bootstrap/dist/js/bootstrap.js", "bootstrap/index.js");
require.alias("brighthas-bootstrap/dist/js/bootstrap.js", "brighthas-bootstrap/index.js");
require.alias("ksana-document/index.js", "installer/deps/ksana-document/index.js");
require.alias("ksana-document/document.js", "installer/deps/ksana-document/document.js");
require.alias("ksana-document/api.js", "installer/deps/ksana-document/api.js");
require.alias("ksana-document/xml.js", "installer/deps/ksana-document/xml.js");
require.alias("ksana-document/template_accelon.js", "installer/deps/ksana-document/template_accelon.js");
require.alias("ksana-document/persistent.js", "installer/deps/ksana-document/persistent.js");
require.alias("ksana-document/tokenizers.js", "installer/deps/ksana-document/tokenizers.js");
require.alias("ksana-document/markup.js", "installer/deps/ksana-document/markup.js");
require.alias("ksana-document/typeset.js", "installer/deps/ksana-document/typeset.js");
require.alias("ksana-document/sha1.js", "installer/deps/ksana-document/sha1.js");
require.alias("ksana-document/users.js", "installer/deps/ksana-document/users.js");
require.alias("ksana-document/customfunc.js", "installer/deps/ksana-document/customfunc.js");
require.alias("ksana-document/configs.js", "installer/deps/ksana-document/configs.js");
require.alias("ksana-document/projects.js", "installer/deps/ksana-document/projects.js");
require.alias("ksana-document/indexer.js", "installer/deps/ksana-document/indexer.js");
require.alias("ksana-document/indexer_kd.js", "installer/deps/ksana-document/indexer_kd.js");
require.alias("ksana-document/kdb.js", "installer/deps/ksana-document/kdb.js");
require.alias("ksana-document/kdbfs.js", "installer/deps/ksana-document/kdbfs.js");
require.alias("ksana-document/kdbw.js", "installer/deps/ksana-document/kdbw.js");
require.alias("ksana-document/kdb_sync.js", "installer/deps/ksana-document/kdb_sync.js");
require.alias("ksana-document/kdbfs_sync.js", "installer/deps/ksana-document/kdbfs_sync.js");
require.alias("ksana-document/html5fs.js", "installer/deps/ksana-document/html5fs.js");
require.alias("ksana-document/kdbfs_android.js", "installer/deps/ksana-document/kdbfs_android.js");
require.alias("ksana-document/kdbfs_ios.js", "installer/deps/ksana-document/kdbfs_ios.js");
require.alias("ksana-document/kse.js", "installer/deps/ksana-document/kse.js");
require.alias("ksana-document/kde.js", "installer/deps/ksana-document/kde.js");
require.alias("ksana-document/boolsearch.js", "installer/deps/ksana-document/boolsearch.js");
require.alias("ksana-document/search.js", "installer/deps/ksana-document/search.js");
require.alias("ksana-document/plist.js", "installer/deps/ksana-document/plist.js");
require.alias("ksana-document/excerpt.js", "installer/deps/ksana-document/excerpt.js");
require.alias("ksana-document/link.js", "installer/deps/ksana-document/link.js");
require.alias("ksana-document/tibetan/wylie.js", "installer/deps/ksana-document/tibetan/wylie.js");
require.alias("ksana-document/languages.js", "installer/deps/ksana-document/languages.js");
require.alias("ksana-document/diff.js", "installer/deps/ksana-document/diff.js");
require.alias("ksana-document/xml4kdb.js", "installer/deps/ksana-document/xml4kdb.js");
require.alias("ksana-document/buildfromxml.js", "installer/deps/ksana-document/buildfromxml.js");
require.alias("ksana-document/tei.js", "installer/deps/ksana-document/tei.js");
require.alias("ksana-document/concordance.js", "installer/deps/ksana-document/concordance.js");
require.alias("ksana-document/regex.js", "installer/deps/ksana-document/regex.js");
require.alias("ksana-document/bsearch.js", "installer/deps/ksana-document/bsearch.js");
require.alias("ksana-document/persistentmarkup_pouchdb.js", "installer/deps/ksana-document/persistentmarkup_pouchdb.js");
require.alias("ksana-document/underlines.js", "installer/deps/ksana-document/underlines.js");
require.alias("ksana-document/index.js", "installer/deps/ksana-document/index.js");
require.alias("ksana-document/index.js", "ksana-document/index.js");
require.alias("ksana-document/index.js", "ksana-document/index.js");
require.alias("ksanaforge-fileinstaller/index.js", "installer/deps/fileinstaller/index.js");
require.alias("ksanaforge-fileinstaller/index.js", "installer/deps/fileinstaller/index.js");
require.alias("ksanaforge-fileinstaller/index.js", "fileinstaller/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "ksanaforge-fileinstaller/deps/checkbrowser/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "ksanaforge-fileinstaller/deps/checkbrowser/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "ksanaforge-checkbrowser/index.js");
require.alias("ksanaforge-htmlfs/index.js", "ksanaforge-fileinstaller/deps/htmlfs/index.js");
require.alias("ksanaforge-htmlfs/index.js", "ksanaforge-fileinstaller/deps/htmlfs/index.js");
require.alias("ksanaforge-htmlfs/index.js", "ksanaforge-htmlfs/index.js");
require.alias("ksanaforge-fileinstaller/index.js", "ksanaforge-fileinstaller/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "installer/deps/checkbrowser/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "installer/deps/checkbrowser/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "checkbrowser/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "ksanaforge-checkbrowser/index.js");
require.alias("ksanaforge-htmlfs/index.js", "installer/deps/htmlfs/index.js");
require.alias("ksanaforge-htmlfs/index.js", "installer/deps/htmlfs/index.js");
require.alias("ksanaforge-htmlfs/index.js", "htmlfs/index.js");
require.alias("ksanaforge-htmlfs/index.js", "ksanaforge-htmlfs/index.js");
require.alias("installer-main/index.js", "installer/deps/main/index.js");
require.alias("installer-main/index.js", "installer/deps/main/index.js");
require.alias("installer-main/index.js", "main/index.js");
require.alias("installer-main/index.js", "installer-main/index.js");
require.alias("installer-comp1/index.js", "installer/deps/comp1/index.js");
require.alias("installer-comp1/index.js", "installer/deps/comp1/index.js");
require.alias("installer-comp1/index.js", "comp1/index.js");
require.alias("installer-comp1/index.js", "installer-comp1/index.js");
require.alias("installer/index.js", "installer/index.js");
if (typeof exports == 'object') {
  module.exports = require('installer');
} else if (typeof define == 'function' && define.amd) {
  define(function(){ return require('installer'); });
} else {
  window['installer'] = require('installer');
}})();