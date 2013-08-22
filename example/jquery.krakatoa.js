(function($) {

	var settings,
		playing = false,
		frameId = 0;

	// Plugin definition
	$.fn.krakatoa = function(options) {
		settings = $.extend( {}, $.fn.krakatoa.defaults, options );

		return this.each(function() {
			var arrows, buttons,
				width, height,
				self = $(this),
				first_slide,
				length = self.children().length,
				i = 0;

			// Check if the plugin has not already been attached to the element
			if (self.data('krakatoa')) return;

			// Structure the slider
			self.html('<div class="krakatoa-control"></div>' +
					  '<div class="krakatoa-container">' + self.html() + '</div>');

			// Add styles
			self.css({
				'position': 'relative',
				'width': settings.width
			});
			self.find('.krakatoa-container').css({
				'overflow': 'hidden',
				'position': 'relative',
				'height': settings.height
			});
			self.find('.krakatoa-container').children().css({
				'position': 'absolute',
				'top': 0,
				'left': 0,
				'width': settings.width,
				'height': settings.height,
				'display': 'none'
			});
			self.find('.krakatoa-container img').css({
				'width': '100%',
			});

			// Add arrows and handler
			self.find('.krakatoa-control').append('<ul class="arrows clearfix">' +
												 '<li data-move="-1" class="arrow arrow-left"><a href="#">&laquo;</a></li>' +
												 '<li data-move="1" class="arrow arrow-right"><a href="#">&raquo;</a></li>' +
												 '</ul>');
			self.find('.arrows').on('click touchstart', 'li', do_the_move);
			// Hide if not activated
			if (!settings.arrows	)
				self.find('.arrows').css('display','none');

			// Add buttons and handler if activated
			if (settings.buttons		) {
				buttons = '<ul class="buttons">';
				for ( i; i< length; i++ ) {
					buttons += '<li class="pagination"><a href="#">' + i + '</a></li>';
				}
				buttons += '</ul>';
				self.find('.krakatoa-control').append(buttons);
				self.find('.buttons').on('click touchstart', 'li', do_the_move)
									 .find('li').eq(settings.first).addClass('active-button');
			}

			// Plugin has been attached to the element
			self.attr('data-krakatoa', true)
				.css({
					'width': settings.width,
					'display': settings.display
				});
			// Set the krakatoa height
			first_slide = self.find('.krakatoa-container').children().eq(settings.first);
			height = settings.height === 'auto' ? first_slide.outerHeight(true) + 'px' : settings.height;
			self.find('.krakatoa-container').css('height', height);
			// Display the active slide
			first_slide.addClass('current').css('display', 'block');
			self.attr('data-current',settings.first);

			// Animate the slider
			if (settings.autoplay) {
				$.fn.krakatoa.play();
				self.on('mouseleave', $.fn.krakatoa.play );
				self.on('mouseover', function() { clearTimeout(frameId); playing = false; });
			}
		});
	};

	$.fn.krakatoa.play = function() {
		frameId = window.setTimeout(function() {
			$( '.arrow-'+settings.direction).trigger('click');
		}, settings.speed);
		playing = true;
	}

	// Plugin defaults
	$.fn.krakatoa.defaults = {
		width			: '400px',
		height			: '300px',
		display			: 'block',
		autoplay		: true,
		direction		: 'right',
		speed			: 2500,
		loop			: true,
		arrows			: true,
		buttons			: true,
		first 			: 0,
	};

	function do_the_move(e) {
		var self = $(this),
			slider = self.closest('.krakatoa-control').parent(),
			current_slide = slider.find('.current'),
			active_button = slider.find('.active-button'),
			length = slider.find('.krakatoa-container').children().length,
			i, move, next_slide, height;

		e.preventDefault(); // To prevent the # in the url
		// Check if it's an arrow or a button that's been clicked
		if (self.attr('data-move')) {
			i = (parseInt(slider.attr('data-current')) + self.data('move'));
			if (!settings.loop) {
				if (i < 0 || i >= length) {
					if (playing) playing = false;
					return;
				}
			}
			i = i % length;
			move = self.data('move');
		} else if (settings.buttons		) {
			if (self.hasClass('active-button')) return;
			i = self.index();
			move = i > parseInt(slider.attr('data-current')) ? 1 : -1;
		}

		// Remove event and prevent mouse default event
		self.parent().off('click touchstart','li')
					 .on('click touchstart','li',function(e){ e.preventDefault(); });

		// Move
		slider.attr('data-current', i);
		next_slide = current_slide.closest('.krakatoa-container').children().eq(i);
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
		slider.find('.krakatoa-container').animate({
			height: height
		});
		// Display new slide
		next_slide.addClass('current')
				.css('left', 100 * move + '%')
				.animate({ left: 0 },'linear',function() { // Reattach event
					if (playing) $.fn.krakatoa.play();
					self.parent().off('click touchstart','li');
					self.parent().on('click touchstart','li', do_the_move );
				});

		// Update buttons
		active_button.removeClass('active-button')
					 .parent().children().eq(i).addClass('active-button');
	}

}(jQuery));