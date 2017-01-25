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

/*! device.js 0.1.61 */
(function(){var a,b,c,d,e,f,g,h,i,j;a=window.device,window.device={},c=window.document.documentElement,j=window.navigator.userAgent.toLowerCase(),device.ios=function(){return device.iphone()||device.ipod()||device.ipad()},device.iphone=function(){return d("iphone")},device.ipod=function(){return d("ipod")},device.ipad=function(){return d("ipad")},device.android=function(){return d("android")},device.androidPhone=function(){return device.android()&&d("mobile")},device.androidTablet=function(){return device.android()&&!d("mobile")},device.blackberry=function(){return d("blackberry")||d("bb10")||d("rim")},device.blackberryPhone=function(){return device.blackberry()&&!d("tablet")},device.blackberryTablet=function(){return device.blackberry()&&d("tablet")},device.windows=function(){return d("windows")},device.windowsPhone=function(){return device.windows()&&d("phone")},device.windowsTablet=function(){return device.windows()&&d("touch")&&!device.windowsPhone()},device.fxos=function(){return(d("(mobile;")||d("(tablet;"))&&d("; rv:")},device.fxosPhone=function(){return device.fxos()&&d("mobile")},device.fxosTablet=function(){return device.fxos()&&d("tablet")},device.meego=function(){return d("meego")},device.cordova=function(){return window.cordova&&"file:"===location.protocol},device.nodeWebkit=function(){return"object"==typeof window.process},device.mobile=function(){return device.androidPhone()||device.iphone()||device.ipod()||device.windowsPhone()||device.blackberryPhone()||device.fxosPhone()||device.meego()},device.tablet=function(){return device.ipad()||device.androidTablet()||device.blackberryTablet()||device.windowsTablet()||device.fxosTablet()},device.desktop=function(){return!device.tablet()&&!device.mobile()},device.portrait=function(){return window.innerHeight/window.innerWidth>1},device.landscape=function(){return window.innerHeight/window.innerWidth<1},device.noConflict=function(){return window.device=a,this},d=function(a){return-1!==j.indexOf(a)},f=function(a){var b;return b=new RegExp(a,"i"),c.className.match(b)},b=function(a){return f(a)?void 0:c.className+=" "+a},h=function(a){return f(a)?c.className=c.className.replace(a,""):void 0},device.ios()?device.ipad()?b("ios ipad tablet"):device.iphone()?b("ios iphone mobile"):device.ipod()&&b("ios ipod mobile"):b(device.android()?device.androidTablet()?"android tablet":"android mobile":device.blackberry()?device.blackberryTablet()?"blackberry tablet":"blackberry mobile":device.windows()?device.windowsTablet()?"windows tablet":device.windowsPhone()?"windows mobile":"desktop":device.fxos()?device.fxosTablet()?"fxos tablet":"fxos mobile":device.meego()?"meego mobile":device.nodeWebkit()?"node-webkit":"desktop"),device.cordova()&&b("cordova"),e=function(){return device.landscape()?(h("portrait"),b("landscape")):(h("landscape"),b("portrait"))},i="onorientationchange"in window,g=i?"orientationchange":"resize",window.addEventListener?window.addEventListener(g,e,!1):window.attachEvent?window.attachEvent(g,e):window[g]=e,e()}).call(this);
(function($){$.fn.UItoTop=function(options){var defaults={text:'',min:500,scrollSpeed:800,containerID:'toTop',containerClass:'toTop fa fa-chevron-up',easingType:'linear'};var settings=$.extend(defaults,options);var containerIDhash='#'+ settings.containerID;var containerHoverIDHash='#'+settings.containerHoverID;$('body').append('<a href="#" id="'+settings.containerID+'" class="'+settings.containerClass+'" >'+settings.text+'</a>');$(containerIDhash).hide().click(function(){$('html, body').stop().animate({scrollTop:0},settings.scrollSpeed,settings.easingType);$('#'+settings.containerHoverID,this).stop().animate({'opacity':0},settings.inDelay,settings.easingType);return false;})
$(window).scroll(function(){var sd=$(window).scrollTop();if(typeof document.body.style.maxHeight==="undefined"){$(containerIDhash).css({'position':'absolute','top':$(window).scrollTop()+ $(window).height()- 50});}
if(sd>settings.min)
$(containerIDhash).stop(true,true).fadeIn(600);else
$(containerIDhash).fadeOut(800);});};})(jQuery);
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
jQuery.easing['jswing']=jQuery.easing['swing'];jQuery.extend(jQuery.easing,{def:'easeOutQuad',swing:function(x,t,b,c,d){return jQuery.easing[jQuery.easing.def](x,t,b,c,d);},easeInQuad:function(x,t,b,c,d){return c*(t/=d)*t+ b;},easeOutQuad:function(x,t,b,c,d){return-c*(t/=d)*(t-2)+ b;},easeInOutQuad:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t+ b;return-c/2*((--t)*(t-2)- 1)+ b;},easeInCubic:function(x,t,b,c,d){return c*(t/=d)*t*t+ b;},easeOutCubic:function(x,t,b,c,d){return c*((t=t/d-1)*t*t+ 1)+ b;},easeInOutCubic:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t+ b;return c/2*((t-=2)*t*t+ 2)+ b;},easeInQuart:function(x,t,b,c,d){return c*(t/=d)*t*t*t+ b;},easeOutQuart:function(x,t,b,c,d){return-c*((t=t/d-1)*t*t*t- 1)+ b;},easeInOutQuart:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t+ b;return-c/2*((t-=2)*t*t*t- 2)+ b;},easeInQuint:function(x,t,b,c,d){return c*(t/=d)*t*t*t*t+ b;},easeOutQuint:function(x,t,b,c,d){return c*((t=t/d-1)*t*t*t*t+ 1)+ b;},easeInOutQuint:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t*t+ b;return c/2*((t-=2)*t*t*t*t+ 2)+ b;},easeInSine:function(x,t,b,c,d){return-c*Math.cos(t/d*(Math.PI/2))+ c+ b;},easeOutSine:function(x,t,b,c,d){return c*Math.sin(t/d*(Math.PI/2))+ b;},easeInOutSine:function(x,t,b,c,d){return-c/2*(Math.cos(Math.PI*t/d)- 1)+ b;},easeInExpo:function(x,t,b,c,d){return(t==0)?b:c*Math.pow(2,10*(t/d- 1))+ b;},easeOutExpo:function(x,t,b,c,d){return(t==d)?b+c:c*(-Math.pow(2,-10*t/d)+ 1)+ b;},easeInOutExpo:function(x,t,b,c,d){if(t==0)return b;if(t==d)return b+c;if((t/=d/2)<1)return c/2*Math.pow(2,10*(t- 1))+ b;return c/2*(-Math.pow(2,-10*--t)+ 2)+ b;},easeInCirc:function(x,t,b,c,d){return-c*(Math.sqrt(1-(t/=d)*t)- 1)+ b;},easeOutCirc:function(x,t,b,c,d){return c*Math.sqrt(1-(t=t/d-1)*t)+ b;},easeInOutCirc:function(x,t,b,c,d){if((t/=d/2)<1)return-c/2*(Math.sqrt(1- t*t)- 1)+ b;return c/2*(Math.sqrt(1-(t-=2)*t)+ 1)+ b;},easeInElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4;}
else var s=p/(2*Math.PI)*Math.asin(c/a);return-(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p )) + b;
},easeOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4;}
else var s=p/(2*Math.PI)*Math.asin(c/a);return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p ) + c + b;
},easeInOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d/2)==2)return b+c;if(!p)p=d*(.3*1.5);if(a<Math.abs(c)){a=c;var s=p/4;}
else var s=p/(2*Math.PI)*Math.asin(c/a);if(t<1)return-.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p )) + b;
return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p )*.5 + c + b;
},easeInBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*(t/=d)*t*((s+1)*t- s)+ b;},easeOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*((t=t/d-1)*t*((s+1)*t+ s)+ 1)+ b;},easeInOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t- s))+ b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+ s)+ 2)+ b;},easeInBounce:function(x,t,b,c,d){return c- jQuery.easing.easeOutBounce(x,d-t,0,c,d)+ b;},easeOutBounce:function(x,t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+ b;}else if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+.75)+ b;}else if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+ b;}else{return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+ b;}},easeInOutBounce:function(x,t,b,c,d){if(t<d/2)return jQuery.easing.easeInBounce(x,t*2,0,c,d)*.5+ b;return jQuery.easing.easeOutBounce(x,t*2-d,0,c,d)*.5+ c*.5+ b;}});
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
;(function($){$.TMSearch=function(o){var defaults={form:'.search-form',input:'.search-form_input',toggle:'.search-form_toggle',liveout:'.search-form_liveout',out:'#search-results',scope:1,handler:'bat/SearchHandler.php'}
var options=$.extend({},defaults,o);var $form=$(options.form),$input=$(options.input,$form),$liveout=$(options.liveout,$form),$toggle=$(options.toggle),$out=$(options.out);if($toggle.length>0){$toggle.click(function(){$form.toggleClass('on');if(!$toggle.hasClass('active')){$(this).parents().eq(options.scope).find(options.form).find('input').val('').focus();}
$toggle.toggleClass('active');return false;});$(document).click(function(e){if($toggle.hasClass('active')&&e.target.className.indexOf(options.form.substr(1,options.form.length- 1))){$toggle.removeClass('active');$form.removeClass('on');}});}
if($('html').hasClass('desktop')){$input.on("keyup",function(){$.get(options.handler,{s:$(this).val(),liveSearch:"true",dataType:"html"},onSuccess);function onSuccess(data){$liveout.html(data);}});$input.on('focusout',function(){setTimeout(function(){$liveout.html('');},300);})}
if($out.length>0){$out.height(0);var s=location.search.replace(/^\?.*s=([^&]+)/,'$1'),ifr=$('<iframe width="100%" height="100%" frameborder="0" marginheight="0" marginwidth="0" allowTransparency="true"></iframe>')
if($out.length){ifr.attr({src:options.handler+'?s='+ s}).appendTo($out),$input.val(decodeURI(s));}
window._resize=function(h){$out.height(h)}}}})(jQuery);$(document).ready(function(){$.TMSearch();});
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
/*
* jQuery easyShare plugin
* Update on 28 december 2011
* Version 1.0
*
* Licensed under GPL <http://en.wikipedia.org/wiki/GNU_General_Public_License>
* Copyright (c) 2008, Stéphane Litou <contact@mushtitude.com>
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
