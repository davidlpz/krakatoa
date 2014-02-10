/**
 * Krakatoa
 * https://github.com/davidlpz/krakatoa
 */

;(function ($, window, document, undefined) {

	// Defaults settings
	var defaults = {
		width: '400px',
		height: '300px',
		display: 'block',
		arrows: true,
		buttons: true,
		items: 1,
		first: 0,
		gutter: 10,
		loop: false,
		autoplay: true,
		direction: 1,
		delay: 2500,
		duration: 500,
		easing: 'swing',
		callback: undefined
	};

	// Plugin constructor
	function Krakatoa(element, options) {
		this.deferred = null;
		this.frameId = 0;
		this.playing = false;
		this.slider = $(element);
		this.settings = $.extend( {}, defaults, options, stringToObj(this.slider.data('settings')));
		this.init();
	}

	Krakatoa.prototype = {
		init: function() {
			var self = this,
				slider = self.slider,
				settings = self.settings,
				length = slider.children().length,
				i, item, item_w, width, height,
				container, arrows, buttons, fn,
				max_h = 0;

			// Add the slider structure
			slider.html('<div class="krakatoa-control"></div>' +
				'<div class="krakatoa-container">' + slider.html() + '</div>');
			container = slider.find('.krakatoa-container');

			// Add styles
			slider.css({
				'position': 'relative',
				'width': settings.width,
				'display': settings.display
			});
			container.css({
				'overflow': 'hidden',
				'position': 'relative'
			});
			container.children().css({
				'position': 'absolute',
				'top': 0,
				'left': 0,
				'display': 'none'
			});

			// Calculate slider inner width and actual item width
			width = slider.width();
			item_w = (width-(settings.items-1)*settings.gutter)/settings.items;

			// Set width and calculate height of all items if necesary
			for (i = 0; i < length; i++) {
				item = container.children().eq(i);
				item.css('width',item_w);
				if (settings.height === 'max') {
					height = item.outerHeight(true);
					if (height > max_h) max_h = height;
				}
			}

			// Set item(s) in position
			for (i = 0; i < settings.items && settings.first + i < length; i++) {
				item = container.children().eq(settings.first + i);
				item.addClass('current').css({
					'display': 'block',
					'left': (item_w + settings.gutter) * i
				});
				// If height not set to max, calculate item actual height
				if (settings.height !== 'max') {
					max_h = settings.height === 'auto' ? item.outerHeight(true) : settings.height;
				}
			}

			// Set container height
			container.css('height', max_h);

			// Set current item
			slider.data('current', settings.first);

			// Show control only when there's enough items to scroll
			if (settings.items < length) {
				// Add arrows and handler if activated
				if (settings.arrows) {
					slider.find('.krakatoa-control').append('<div class="arrows">' +
						'<a class="arrow arrow-left" data-direction="-1" href="#">&laquo;</a>' +
						'<a class="arrow arrow-right" data-direction="1" href="#">&raquo;</a>' +
						'</div>');
					slider.find('.arrow').on('click touchstart', { krakatoa: self }, click_handler);
				}

				// Add buttons and handler if activated
				if (settings.buttons) {
					buttons = '<ul class="buttons">';
					for (i = 0; i < length / settings.items; i++) {
						buttons += '<li class="pagination"><a href="#">' + i + '</a></li>';
					}
					buttons += '</ul>';
					slider.find('.krakatoa-control').append(buttons);
					slider.find('.buttons a').on('click touchstart', { krakatoa: self }, click_handler);
					slider.find('.buttons').find('li').eq(settings.first).addClass('active-button');
				}
			}

			// Callback funcion
			fn = window[settings.callback];
			if(typeof fn === 'function') {
			    fn();
			}

			// Animate the slider
			if (settings.autoplay) {
				self.play();
				slider.on('mouseleave', function() { self.play(); });
				slider.on('mouseover', function() { clearTimeout(self.frameId); self.playing = false; });
			}
		},

		play: function() {
			var self = this;

			self.playing = true;
			self.frameId = window.setTimeout(function() {
				if (self.slider.find(':animated').length === 0)
					self.do_the_move(self.settings.direction);
				self.deferred.done(function() {
					if (self.playing) self.play();
				});
			}, self.settings.delay);
		},

		do_the_move: function(direction) {
			var self = this,
				slider = this.slider,
				settings = this.settings,
				container = slider.find('.krakatoa-container'),
				length = container.children().length,
				current = parseInt(slider.data('current')),
				next = current + settings.items*direction,
				move = direction / Math.abs(direction),
				i, item, item_w, width, height,
				max_h = 0, moved = 0;

			self.deferred = $.Deferred();

			// If loop enabled, check for beggining or end
			if (settings.loop && (next < 0 || next >= length)) {
				next = Math.ceil(length/settings.items) * settings.items - next * move;
			} else if (next < 0 || next >= length) {
				self.deferred.resolve();
				return;
			}

			// Calculate slider inner width and actual item width
			width = slider.width();
			item_w = (width-(settings.items-1)*settings.gutter)/settings.items;

			// Set item(s) in position
			for (i = 0; i < settings.items; i++) {
				// Hide current item(s)
				item = container.children().eq(current + i);
				item.removeClass('current')
					.animate({ left: -(width + settings.gutter) * move + (item_w + settings.gutter) * i },
						settings.duration,settings.easing,function() {
						$(this).css({
							'left': 0,
							'display': 'none'
						});
					});
				// Display next item(s)
				if (next + i > length - 1) continue;
				moved++;
				item = container.children().eq(next + i);
				item.addClass('current')
					.css({
						'display': 'block',
						'left': (width + settings.gutter) * move + (item_w + settings.gutter) * i
					})
					.animate({ left: (item_w + settings.gutter) * i },settings.duration,settings.easing,function() {
						if (--moved === 0) self.deferred.resolve();
					});
				// If auto, calculate actual height
				if (settings.height === 'auto') {
					height = item.outerHeight(true);
					if (height > max_h) max_h = height;
					container.css('height', max_h);
				}
			}

			// Set new current item
			slider.data('current', next);

			// Update buttons
			current = Math.round(next / settings.items);
			if (settings.buttons) {
				slider.find('.active-button').removeClass('active-button')
					  .parent().children().eq(current).addClass('active-button');
			}
		}
	};

	// Click/touch event handler
	function click_handler(e) {
		var self = $(this),
			krakatoa = e.data.krakatoa,
			current = Math.round(krakatoa.slider.data('current')/krakatoa.settings.items),
			direction;

		e.preventDefault(); // To prevent the # in the url

		if (krakatoa.slider.find(':animated').length > 0) return;

		if (self.data('direction')) { // arrow or auto play
			direction = self.data('direction');
		} else if (krakatoa.settings.buttons) { // button
			if (self.parent().hasClass('active-button')) return;
			direction = self.parent().index() - current;
		}

		// Remove event and prevent mouse default event
		self.off('click touchstart')
			.on('click touchstart', function(e){ e.preventDefault(); });

		// Move the slider
		krakatoa.do_the_move(direction);

		// Reattach event
		krakatoa.deferred.done(function() {
			self.off('click touchstart');
			self.on('click touchstart', { krakatoa: krakatoa }, click_handler);
		});
	}

	// Convert slider data-settings to JavaScript object
	function stringToObj(s){
		var obj = new Object(),
			array = [],
			i, value;

		if (typeof s !== 'string') return obj;
		s = s.replace(/[{}\s]/g,'');
		array = s.split(',');
		for (i = 0; i < array.length; i++) {
			value = array[i].split(':');
			if (!isNaN(value[1]-0)) {
				if (value[1] % 1 === 0)
					value[1] = parseInt(value[1]);
				else value[1] = parseFloat(value[1]);
			} else if (value[1].toLowerCase() == 'true' || value[1].toLowerCase() == 'false') {
				value[1] = (value[1] == 'true');
			}
			obj[value[0]] = value[1];
		}
		return obj;
	}

	// Plugin wrapper
	$.fn.krakatoa = function(options) {
		return this.each(function() {
			if (!$(this).data('krakatoa')) {
				$.data(this, 'krakatoa', new Krakatoa(this, options));
			}
		});
	};

})(jQuery, window, document);