Getting started
=========================

Krakatoa is a jQuery slider plugin. All you need is to wrap your content inside a container element. The .krakatoa name class is not mandatory for the plugin to work.

	<div class="krakatoa">
		<div> Your content </div>
		<div> Your content </div>
	</div>

Add jQuery and the Krakatoa script.

	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
	<script src="/path/to/jquery.krakatoa.js"></script>

Load the script.

	<script>
		$(window).on('load',function(){
			$('.krakatoa').krakatoa( options );
		});
	</script>

Options are set with an object as second argument to the .krakatoa() method.

* **width**: Width of the slider. String. Works with px and %. The default value is '400px'.
* **height**: Height of the slider. Can be set to 'auto' (it will be the height of the actual item), 'max' (the max height of all the items) or a string with units. The default value is '300px'.
* **display**: Display mode of the slider, the same as the CSS property. String. Default value is 'block'.
* **arrows**: Show the arrows control. Boolean. Default value is true.
* **buttons**: Show the pagination buttons. Boolean. Default value is true.
* **items**: Numbers of items to show at the same time. Integer. Default value is 1.
* **gutter**: Margin between items. Integer. Default value is 10.
* **first**: Default item to show. Integer. Default value is 0 and shows the first item.
* **loop**: Start again after last item. Boolean. Default value is true.
* **autoplay**: Move automatically the slider (except when the mouse is over). Boolean. Default value is true.
* **direction**: Movement of the slider. Integer. 1 to go forward, -1 to go backwards.
* **delay**: Delay of the next movement in milliseconds. Integer. Default value is 2500.
* **duration**: Duration of the movement in milliseconds. Integer. Default value is 500.
* **easing**: Animation easing type. String. Default value is 'swing'.
* **callback**: Callback function.

More than one slider can co-exists in the same page. If different options are needed for each one, add a data- attribute to the container element.

	<div class="krakatoa" data-settings="options">
		<div> Your content </div>
		<div> Your content </div>
	</div>

The following CSS is required to prevent anything to show while the script is loading:

	.krakatoa{
		display:none;
	}