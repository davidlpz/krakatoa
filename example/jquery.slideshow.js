(function($) {

	$.fn.slideshow = function(options) {

		return this.each(function() {
			// Display first image at the beginning
			$(this).find('.slides').children().first().addClass('active-slide');
			$(this).find('.buttons').children().first().addClass('active-button');
			// Add handlers
			$(this).find('.arrow').on('click', move_slideshow);
			$(this).find('.pagination').on('click', move_slideshow);
		});

	}

	function move_slideshow(e){
		e.preventDefault();
		var self = $(this),
			parent = self.closest('.slideshow'),
			active_slide = parent.find('.active-slide'),
			active_button = parent.find('.active-button'),
			length = active_button.parent().children().length,
			i, move;

		// Remove event
		$(this).off('click');
		// Prevent mouse default event
		$(this).on('click',function(e){	e.preventDefault();	});
		
		// Check if it's an arrow or a button that's been clicked
		if ($(this).attr('data-move')) {
			i = (active_button.index() + self.data('move')) % length;
			move = self.data('move');
		} else {
			if (self.hasClass('active-button')) return;
			i = self.index();
			move = i > active_button.index() ? 1 : -1;
		}

		// Hide old image
		active_slide.removeClass('active-slide').addClass('moved-slide');
		active_slide.animate({ left: - (100 * move) + '%' },'linear',function(){
			active_slide.removeClass('moved-slide');
			active_slide.css('left', 0);
		});

		// Display new image
		active_slide = active_slide.parent().children().eq(i)
									.addClass('active-slide');
		active_slide.css('left', 100 * move + '%');
		active_slide.animate({ left: 0 },'linear',function() {
			// Reattach event
			self.off('click');
			self.on('click', move_slideshow );
		});
		parent.find('.slides').animate({
			height: active_slide.height() + 'px'
		});

		// Update buttons
		active_button.removeClass('active-button')
		active_button.parent().children().eq(i).addClass('active-button');
	}

}(jQuery));