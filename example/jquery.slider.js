(function($) {

	// Default settings
	var settings = {
		width			: '400px',
		height			: '300px',
		loop			: true,
		show_arrows		: true,
		show_buttons	: true,
		default_image	: 0
	};

	$.fn.slider = function(options) {
		// Override default settings
		if (options) { $.extend(settings, options); }

		return this.each(function() {
			var arrows, buttons, length,
				width, height, ratio,
				self = $(this),
				i = 0,
				active_slide = self.find('.slides').find('img').eq(settings.default_image);

			// Check if the plugin has not already been attached to the element
			if (self.data('slider')) return;

			// Add arrows and handler
			if (settings.show_arrows) {
				var arrows = '<ul class="arrows clearfix">' +
								'<li data-move="-1" class="arrow arrow-left"><a href="#">-1</a></li>' +
								'<li data-move="1" class="arrow arrow-right"><a href="#">1</a></li>' +
							'</ul>';
				self.find('.slider-control').append(arrows);
				self.find('.arrows').on('click', 'li', $.fn.slider.move_slider);
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
				self.find('.buttons').on('click', 'li', $.fn.slider.move_slider);
			}

			active_slide.one('load',function() {
				// Set the slider width
				width = settings.width === 'auto' ? self.find('.slider').width() : settings.width;
				self.find('.slider').css('width', width);

				// Set the slider height
				height = settings.height === 'auto' ? $(this).height() + 'px' : settings.height;
				self.find('.slides').css('height', height);

				// Display first image at the beginning
				self.find('.buttons').find('li').eq(settings.default_image).addClass('active-button');
				$(this).addClass('active-slide');
				
				// Plugin has been attached to the element
				self.data('slider', true);

			}).each(function() {
				if (this.complete ||
					this.readyState == "complete" ||
					this.readyState == 4)
				$(this).trigger('load');
			});
		});
	}

	$.fn.slider.move_slider = function(e){
		e.preventDefault();
		var self = $(this),
			parent = self.closest('.slider'),
			active_slide = parent.find('.active-slide'),
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
		self.parent().off('click','li');
		self.parent().on('click','li',function(e){ e.preventDefault(); });

		next_slide = active_slide.closest('.slides').find('img').eq(i);
		next_slide.one('load',function() {
			// Hide old image
			active_slide.removeClass('active-slide')
						.addClass('moved-slide')
						.animate({ left: - (100 * move) + '%' },'linear',function(){
							active_slide.removeClass('moved-slide')
										.css('left', 0);
						});

			// Check new image height
			height = settings.height === 'auto' ? next_slide.height() : settings.height;
			parent.find('.slides').animate({
				height: height + 'px'
			});	

			// Display new image
			next_slide.addClass('active-slide')
					.css('left', 100 * move + '%')
					.animate({ left: 0 },'linear',function() { // Reattach event
						self.parent().off('click','li');
						self.parent().on('click','li', $.fn.slider.move_slider );
					});
		}).each(function() {
			if (this.complete ||
				this.readyState == "complete" ||
				this.readyState == 4)
			$(this).trigger('load');
		});

		// Update buttons
		active_button.removeClass('active-button')
					.parent().children().eq(i).addClass('active-button');
	}

}(jQuery));