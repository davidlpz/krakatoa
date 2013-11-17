/**
 * Krakatoa
 * https://github.com/davidlpz/krakatoa
 */

(function($) {

	var frameId = 0;

	// Plugin definition
	$.fn.krakatoa = function(options) {
		// Load global settings
		var options = $.extend( {}, $.fn.krakatoa.defaults, options );

		return this.each(function() {
			var arrows, buttons,
				slider = $(this),
				length = slider.children().length,
				container, item, i,
				width, height, item_w, max_h = 0,
				settings;

			// Load slider custom settings
			settings = ($(this).data('settings')) ? $.extend({}, options, stringToObj($(this).data('settings'))) : options;

			// Check if the plugin has not already been attached to the element
			if (slider.data('krakatoa')) return;

			// Plugin has been attached to the element
			slider.attr('data-krakatoa', true);

			// Structure the slider
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

			// Add arrows and handler
			slider.find('.krakatoa-control').append('<ul class="arrows">' +
				'<li data-move="-1" class="arrow arrow-left"><a href="#">&laquo;</a></li>' +
				'<li data-move="1" class="arrow arrow-right"><a href="#">&raquo;</a></li>' +
				'</ul>');
			slider.find('.arrows').on('click touchstart', 'li', {settings: settings}, do_the_move);

			// Hide if not activated
			if (!settings.arrows)
				slider.find('.arrows').css('display','none');

			// Add buttons and handler if activated
			if (settings.buttons) {
				buttons = '<ul class="buttons">';
				for (i = 0; i < length / settings.items; i++) {
					buttons += '<li class="pagination"><a href="#">' + i + '</a></li>';
				}
				buttons += '</ul>';
				slider.find('.krakatoa-control').append(buttons);
				slider.find('.buttons').on('click touchstart', 'li', {settings: settings}, do_the_move )
					  .find('li').eq(settings.first).addClass('active-button');
			}

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
			slider.attr('data-current', settings.first);

			// Set container height
			container.css('height', max_h);

			// Animate the slider
			if (settings.autoplay) {
				settings.playing = true;
				$.fn.krakatoa.play(settings,slider);
				slider.on('mouseleave', function() { $.fn.krakatoa.play(settings,slider); } );
				slider.on('mouseover', function() { clearTimeout(frameId); settings.playing = false; });
			} else settings.playing = false;
		});
	};

	$.fn.krakatoa.play = function(settings,slider) {
		frameId = window.setTimeout(function() {
			slider.find( '.arrow-'+settings.direction).trigger('click');
		}, settings.delay);
		if (settings.autoplay) settings.playing = true;
	}

	// Plugin defaults
	$.fn.krakatoa.defaults = {
		width			: '400px',
		height			: '300px',
		display			: 'block',
		arrows			: true,
		buttons			: true,
		items			: 1,
		first			: 0,
		gutter			: 10,
		loop			: false,
		autoplay		: false,
		direction		: 'right',
		delay			: 2000,
		duration		: 500
	};

	function do_the_move(e) {
		var self = $(this),
			slider = self.closest('.krakatoa-control').parent(),
			container = slider.find('.krakatoa-container'),
			current = parseInt(slider.attr('data-current')),
			length = container.children().length,
			i, move, next,
			width, height, item, item_w, max_h = 0,
			deferred = $.Deferred(),
			settings = e.data.settings,
			aux = 0;

		e.preventDefault(); // To prevent the # in the url

		// Check what's been clicked
		if (self.attr('data-move')) { // arrow or auto play
			move = self.data('move');
			next = current + settings.items * move;
			if (settings.loop && (next < 0 || next >= length)) {
				next = Math.ceil(length/settings.items) * settings.items - next * move;
			} else if (next < 0 || next >= length) {
				if (settings.playing) settings.playing = false;
				return;
			}
		} else if (settings.buttons) { // button
			if (self.hasClass('active-button')) return;
			move = (self.index() * settings.items > current) ? 1 : -1;
			next = self.index() * settings.items;
		}

		// Remove event and prevent mouse default event
		self.parent().off('click touchstart','li')
					 .on('click touchstart','li',function(e){ e.preventDefault(); });

		// Calculate slider inner width and actual item width
		width = slider.width();
		item_w = (width-(settings.items-1)*settings.gutter)/settings.items;

		// Set item(s) in position
		for (i = 0; i < settings.items; i++) {
			// Hide current item(s)
			item = container.children().eq(current + i);
			item.removeClass('current')
				.animate({ left: - (width + settings.gutter) * move + (item_w + settings.gutter) * i },
					settings.duration,'linear',function() {
					$(this).css({
						'left': 0,
						'display': 'none'
					});
				});

			// Display next item(s)
			if (next + i > length - 1) continue;
			aux++;
			item = container.children().eq(next + i);
			item.addClass('current').css({
					'display': 'block',
					'left': (width + settings.gutter) * move + (item_w + settings.gutter) * i
				})
				.animate({ left: (item_w + settings.gutter) * i },settings.duration,'linear', function() {
					aux--;
					if (aux === 0) deferred.resolve();
				});
			// If auto, calculate actual height
			if (settings.height === 'auto') {
				height = item.outerHeight(true);
				if (height > max_h) max_h = height;
				container.css('height', max_h);
			}
		}
		slider.attr('data-current', next);

		// Reattach event
		deferred.done(function() {
			if (settings.playing) $.fn.krakatoa.play(settings,slider);
			self.parent().off('click touchstart','li');
			self.parent().on('click touchstart','li', {settings: settings}, do_the_move );
		});

		// Update buttons
		current = Math.round(next / settings.items);
		if (settings.buttons) {
			slider.find('.active-button').removeClass('active-button')
				  .parent().children().eq(current).addClass('active-button');
		}
	}

	// Convert slider data-settings to Object
	function stringToObj(s){
		var obj = new Object(),
			array = [],
			i = 0,
			value;

		if (typeof s !== 'string') return;
		s = s.replace(/[{}\s]/g,'');
		array = s.split(',');
		for (i; i < array.length; i++) {
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

}(jQuery));