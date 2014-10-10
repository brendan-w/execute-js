
window.__exeJS__.scroller = function() {

	var map = __exeJS__.map;

	var tiny        = document.querySelector("#tiny");
	var tiny_scroll = document.querySelector("#tiny #scroll");
	var frame       = document.querySelector("#tiny #frame");

	var h_window;      //height of the window
	var h_body;        //length of the full-sized code in pixels
	var h_tiny;        //length of the tiny code in pixels
	var h_frame;       //computed height for the window frame (over the tiny code)

	var zoom;          //code / tinycode
	var body_overflow; //pixels that full-sized code overflows off the screen
	var tiny_overflow; //pixels that tiny code overflows off the screen
	var tiny_top;
	var tiny_bottom;

	var mdown = false; //chrome doesn't persist button states during move events...

	function setup()
	{
		h_window = window.innerHeight;

		h_body   = document.querySelector("body").clientHeight;
		h_tiny   = document.querySelector("#tiny code").offsetHeight;

		var h_line      = document.querySelector("#code pre").clientHeight;
		var h_tiny_line = document.querySelector("#tiny pre").clientHeight;

		//hack for chrome (dimensions haven't been computed yet)
		if(!h_tiny) h_tiny = document.querySelector("#tiny code").childElementCount * h_tiny_line;

		//compute the zoom ratio
		zoom = h_line / h_tiny_line;

		//compute overflows
		tiny_overflow = h_tiny - h_window;
		body_overflow = h_body - h_window;
		
		h_frame = Math.floor(h_window / zoom);
		frame.style.height = h_frame + "px";

		//compute the top and bottom of the tiny code
		tiny_top    = h_frame / 2;
		tiny_bottom = Math.min(h_window, h_tiny) - tiny_top;
	}


	//scale computers
	function scrollTiny(e)
	{
		//console.log(e.target);
		var clickY = e.clientY;

		//clamp the click value to the code length constraints
		clickY = Math.min(Math.max(clickY, tiny_top), tiny_bottom);

		//map the click range to the body scroll range
		var body_px = map(clickY, tiny_top, tiny_bottom, 0, body_overflow);
		body_px = Math.round(body_px);

		//update display (fires scrollBar() )
		window.scrollTo(0, body_px);
	}

	//update display
	function scrollBar(e)
	{
		var tiny_px = map(window.pageYOffset, 0, body_overflow, tiny_top, tiny_bottom);
		
		frame.style.top = (tiny_px - tiny_top) + "px";

		if(tiny_overflow > 0)
		{
			var tiny_scroll_px = map(e.pageY, 0, body_overflow, 0, tiny_overflow);
			tiny_scroll.scrollTop = Math.round(tiny_scroll_px);
		}
	}
	
	frame.style.display = "block";
	window.scrollTo(0, 0);

	//event handlers
	window.onscroll = scrollBar;
	window.onmouseup = function(e) {
		mdown = false; //chrome fix
	}
	tiny.onmousedown = function(e) {
		mdown = true; //chrome fix
		scrollTiny(e);
	};
	tiny.onmousemove = function(e) {
		if(mdown) //if left mouse down
			scrollTiny(e);
	};


	setup();
	window.onresize = setup;
};
