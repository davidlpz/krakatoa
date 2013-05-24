(function($) {

	// Default settings
	var settings = {
		width			: '400',
		height			: '300',
		loop			: true,
		show_arrows		: true,
		show_buttons	: true,
		default_image	: 0
	};

	$.fn.slider = function(options) {
		// Override default settings
		if (options) { $.extend(settings, options); }

		return this.each(function() {
			var arrows, buttons,
				height, length,
				self = $(this),
				i = 0;

			// Check if the plugin has not already been attached to the element
            if (self.data('slider')) return;

			// Add arrows and handler
			if (settings.show_arrows) {
				var arrows = '<ul class="arrows clearfix">' +
								'<li data-move="-1" class="arrow arrow-left"><a href="#">-1</a></li>' +
								'<li data-move="1" class="arrow arrow-right"><a href="#">1</a></li>' +
							'</ul>';
				self.find('.slider-control').append(arrows);
				self.find('.arrow').on('click', $.fn.slider.move_slider);
			}

			// Add buttons and handler
			if (settings.show_buttons) {
				length = self.find('.slides').find('img').length;
				var buttons = '<ul class="buttons">'; 
				for ( i; i< length; i++ ) {
					buttons += '<li class="pagination"><a href="#">' + i + '</a></li>';
				}
				buttons += '</ul>';
				self.find('.slider-control').append(buttons);
				self.find('.pagination').on('click', $.fn.slider.move_slider);
			}
					
			// Display first image at the beginning
			self.find('.buttons').find('li').eq(settings.default_image).addClass('active-button');
			self.find('.slides').find('img').eq(settings.default_image).addClass('active-slide');

			// Set the slider width
			width = settings.width === 'auto' ? $('.slider').width() : settings.width;
			$('.slider').css('width', width + 'px');

			// Set the slider height
			height = settings.height === 'auto' ? $('.active-slide').height() : settings.height;
			$('.slides').css('height', height + 'px');
			
			// Plugin has been attached to the element
			self.data('slider', true);
		});
	}

	$.fn.slider.move_slider = function(e){
		e.preventDefault();
		var self = $(this),
			parent = self.closest('.slider'),
			active_slide = parent.find('.active-slide'),
			active_button = parent.find('.active-button'),
			length = active_button.parent().children().length,
			i, move, height;

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
		self.off('click')
				.on('click',function(e){ e.preventDefault(); });

		// Hide old image
		active_slide.removeClass('active-slide')
					.addClass('moved-slide')
					.animate({ left: - (100 * move) + '%' },'linear',function(){
						active_slide.removeClass('moved-slide')
									.css('left', 0);
					});

		// Display new image
		active_slide.closest('.slides').find('img').eq(i)
					.addClass('active-slide')
					.css('left', 100 * move + '%')
					.animate({ left: 0 },'linear',function() { // Reattach event
						self.off('click')
							.on('click', $.fn.slider.move_slider );
					});

		// Check new image height
		height = settings.height === 'auto' ? $('.active-slide').height() : settings.height;
		parent.find('.slides').animate({
			height: height + 'px'
		});

		// Update buttons
		active_button.removeClass('active-button')
					.parent().children().eq(i).addClass('active-button');
	}

}(jQuery));