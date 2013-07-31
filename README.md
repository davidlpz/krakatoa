Getting started
=========================

jslider is a jQuery slider plugin. It needs a structure similar to this to work.

	<div class="jslider">
		<div class="jslider-control"></div>
		<div class="jslider-container">
			<div class="slides">
				<img src="..." />
				<img src="..." />
				<img src="..." />
				...
			</div>
		</div>
	</div>

You can place the image inside `<a href=""></a>` and/or convert the `<div class="slides">` into a list.

	<div class="jslider">
		<div class="jslider-control"></div>
		<div class="jslider-container">
			<ul class="slides">
				<li><a href="#"><img src="..." /></a></li>
				<li><a href="#"><img src="..." /></a></li>
				<li><a href="#"><img src="..." /></a></li>
				...
			</ul>
		</div>
	</div>

Add jQuery and the jslider script.

	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
	<script src="/path/to/jquery.jslider.js"></script>

Load the script.

	<script>
		$(function(){
			$('.jslider').jslider( options );
		});
	</script>

Options are set with an object as second argument to the .jslider() method. They are all optional. Some options that you can specify:

* **width**: width of the slider. Can be set to 'auto' (it will be the container's width) or a string. The default value is 400px.
* **height**: height of the slider. Can be set to 'auto' (it will be the height of the actual image) or a string. The default value is 300px.
* **loop**: begins again after last image. Boolean. Default value is true.
* **show_arrows**: Show the arrows control. Boolean. Default value is true.
* **show_buttons**: Show the pagination buttons. Boolean. Default value is true.
* **default_image**: Default image to show. Integer. Default value is 0 and shows the first image.

The following CSS is not required but it does the work:

	span, img, a, ul, li {
		margin:0;
		padding:0;
		border:0;
	}
	.jslider{
		width:400px;
		margin:50px auto;
		position:relative;
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
	.slides{
		overflow:hidden;
		position:relative;
		height:300px;
	}
	.slides img{
		position:absolute;
		top:0;
		left:0;
		width:100%;
		height:auto;
		display:none;
	}