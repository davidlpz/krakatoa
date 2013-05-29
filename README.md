Getting started
=========================

A jQuery slider plugin. The slider needs a structure similar to this to work.

	<div class="slider">
		<div class="slider-control"></div>
		<div class="slider-container">
			<div class="slides">
				<img src="..." />
				<img src="..." />
				<img src="..." />
				...
			</div>
		</div>
	</div>

You can place the image inside `<a href=""></a>` and/or convert the `<div class="slides">` into a list.

	<div class="slider">
		<div class="slider-control"></div>
		<div class="slider-container">
			<ul class="slides">
				<li><a href="#"><img src="..." /></a></li>
				<li><a href="#"><img src="..." /></a></li>
				<li><a href="#"><img src="..." /></a></li>
				...
			</ul>
		</div>
	</div>

Add jQuery and the slider script. Masonry requires jQuery v1.7 or greater.

	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	<script src="/path/to/jquery.slider.js"></script>

Load the script.

	<script>
		$(function(){
			$('.slider').slider( options );
		});
	</script>

Options are set with an object as second argument to the .slider() method. They are all optional. Some options that you can specify:

* **width**: width of the slider. Can be set to 'auto' (it will be the container's width) or a string. The default value is 400px.
* **height**: height of the slider. Can be set to 'auto' (it will be the height of the actual image) or a string. The default value is 300px.
* **loop**: begins again after last image. Boolean. Default value is true.
* **show_arrows**: Show the arrows control. Boolean. Default value is true.
* **show_buttons**: Show the pagination buttons. Boolean. Default value is true.
* **default_image**: Default image to show. Integer. Default value is 0 and shows the first image.