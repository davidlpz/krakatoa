(function($) {

	// Default settings
	var settings = {
		width			: '400px',
		height			: '300px',
		display			: 'block',
		default_slide	: 0,
		loop			: true,
		show_arrows		: true,
		show_buttons	: true
	};

	$.fn.jslider = function(options) {
		// Override default settings
		if (options) { $.extend(settings, options); }

		return this.each(function() {
			var arrows, buttons, length,
				width, height,
				self = $(this),
				i = 0,
				default_slide = self.find('.jslider-container').children().eq(settings.default_slide);

			// Check if the plugin has not already been attached to the element
			if (self.data('jslider')) return;

			// Add styles
			self.css({
				'position': 'relative',
				'width': settings.width
			});

			self.find('.jslider-container').css({
				'overflow': 'hidden',
				'position': 'relative',
				'height': settings.height
			});

			self.find('.jslider-container').children().css({
				'position': 'absolute',
				'top': 0,
				'left': 0,
				'width': '100%',
				'height': 'auto',
				'display': 'none',
			});

			// Add arrows and handler if activated
			if (settings.show_arrows) {
				self.find('.jslider-control').append('<ul class="arrows clearfix">' +
													 '<li data-move="-1" class="arrow arrow-left"><a href="#">-1</a></li>' +
													 '<li data-move="1" class="arrow arrow-right"><a href="#">1</a></li>' +
													 '</ul>');
				self.find('.arrows').on('click', 'li', $.fn.jslider.move);
			}

			// Add buttons and handler if activated
			if (settings.show_buttons) {
				length = self.find('.jslider-container').children().length;
				buttons = '<ul class="buttons">';
				for ( i; i< length; i++ ) {
					buttons += '<li class="pagination"><a href="#">' + i + '</a></li>';
				}
				buttons += '</ul>';
				self.find('.jslider-control').append(buttons);
				self.find('.buttons').on('click', 'li', $.fn.jslider.move)
									 .find('li').eq(settings.default_slide).addClass('active-button');
			}

			// Set the jslider width
			width = settings.width === 'auto' ? self.parent().outerWidth(true) + 'px' : settings.width;
			// Plugin has been attached to the element
			self.data('jslider', true)
				.css({
					'width': width,
					'display': settings.display
				});
			// Set the jslider height
			height = settings.height === 'auto' ? default_slide.outerHeight(true) + 'px' : settings.height;
			self.find('.jslider-container').css('height', height);
			// Display the active slide
			default_slide.addClass('current').css('display', 'block');
		});
	}

	$.fn.jslider.move = function(e){
		e.preventDefault(); // To prevent the # in the url
		var self = $(this),
			parent = self.closest('.jslider'),
			current_slide = parent.find('.current'),
			active_button = parent.find('.active-button'),
			length = active_button.parent().children().length,
			i, move, next_slide, height;

		// Check if it's an arrow or a button that's been clicked
		if (self.attr('data-move') && settings.show_arrows) {
			i = (active_button.index() + self.data('move'));
			if (!settings.loop) {
				if (i < 0 || i >= length) return;
			}
			i = i % length;
			move = self.data('move');
		} else if (settings.show_buttons) {
			if (self.hasClass('active-button')) return;
			i = self.index();
			move = i > active_button.index() ? 1 : -1;
		}

		// Remove event and prevent mouse default event
		self.parent().off('click','li')
					 .on('click','li',function(e){ e.preventDefault(); });

		// Move
		next_slide = current_slide.closest('.jslider-container').children().eq(i);
		next_slide.css('display', 'block');
		// Hide old slide
		current_slide.removeClass('current')
					.animate({ left: - (100 * move) + '%' },'linear',function(){
						current_slide.css({ 'left': 0,
											'display': 'none'
										});
					});
		// Check new slide height
		height = settings.height === 'auto' ? next_slide.outerHeight(true) + 'px' : settings.height;
		parent.find('.jslider-container').animate({
			height: height
		});
		// Display new slide
		next_slide.addClass('current')
				.css('left', 100 * move + '%')
				.animate({ left: 0 },'linear',function() { // Reattach event
					self.parent().off('click','li');
					self.parent().on('click','li', $.fn.jslider.move );
				});

		// Update buttons
		active_button.removeClass('active-button')
					 .parent().children().eq(i).addClass('active-button');
	}

}(jQuery));