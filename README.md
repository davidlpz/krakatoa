Getting started
=========================

jslider is a jQuery slider plugin. All you need is to wrap your content inside the jslider-container element. The classes are mandatory for the plugin to work.

	<div class="jslider">
		<div class="jslider-control"></div>
		<div class="jslider-container">
			<div> Your content </div>
			<div> Your content </div>
			<div> Your content </div>
			...
		</div>
	</div>

Add jQuery and the jslider script.

	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
	<script src="/path/to/jquery.jslider.js"></script>

Load the script.

	<script>
		$(window).on('load',function(){
			$('.jslider').jslider( options );
		});
	</script>

Options are set with an object as second argument to the .jslider() method. They are all optional (obviosly):

* **width**: Width of the slider. Can be set to 'auto' (it will be the container's width) or a string. The default value is 400px.
* **height**: Height of the slider. Can be set to 'auto' (it will be the height of the actual slide) or a string. The default value is 300px.
* **display**: Display mode of the slider, it works as the CSS property. Default value is 'block'.
* **default_slide**: Default slide to show. Integer. Default value is 0 and shows the first slide.
* **loop**: Begins again after last slide. Boolean. Default value is true.
* **show_arrows**: Show the arrows control. Boolean. Default value is true.
* **show_buttons**: Show the pagination buttons. Boolean. Default value is true.

The following CSS is required to prevent anything to show while the script is loading:

	.jslider{
		display:none;
	}

The following CSS is not required but it does the work:

	span, img, a, ul, li {
		margin:0;
		padding:0;
		border:0;
	}
	.jslider-control{
		padding-bottom:20px;
	}
	.arrows{
		position:absolute;
		top:1px;
		left:0;
		z-index:100;
	}
	.arrow{
		float:left;
		margin-right:7px;
	}
	.arrow a{
		display:block;
		width:13px;
		height:0;
		padding-top:16px;
		overflow:hidden;
		background:transparent url('img/arrows.png') no-repeat;
		cursor:pointer;
	}
	.arrow-left a{
		background-position:0 0;
	}
	.arrow-right a{
		background-position:-20px 0;
		left:20px;
	}
	.arrow-left a:hover{
		background-position:0 -16px;
	}
	.arrow-right a:hover{
		background-position:-20px -16px;
		left:20px;
	}
	.buttons{
		position:absolute;
		top:5px;
		right:0px;
		z-index:100;
	}
	.pagination{
		float:left;
		margin:0 2px;
	}
	.pagination a{
		display:block;
		width:10px;
		height:0;
		padding-top:10px;
		background-image:url('img/pagination.png');
		background-position:0 0;
		overflow:hidden;
	}
	.active-button a,
	.active-button a:hover{
		background-position:0 -30px;
	}
	.pagination a:hover{
		background-position:0 -30px;
	}