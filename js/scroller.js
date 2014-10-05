
window.__exeJS__.scroller = function() {

	var map = __exeJS__.map;

	var scroll      = document.querySelector("#scroll");
	var frame       = document.querySelector("#scroll #frame");
	var scroll_code = document.querySelector("#scroll code");

	var h_window;
	var h_line;
	var h_body;
	var h_scroll;
	var h_frame;
	var linesPerWindow;


	function setup()
	{
		h_window = window.innerHeight;
		h_line   = document.querySelector("#code pre").clientHeight;
		h_body   = document.querySelector("body").clientHeight;
		h_scroll = scroll_code.clientHeight;

		linesPerWindow = Math.floor(h_window / h_line);
		h_frame = linesPerWindow * 1;

		frame.style.height = h_frame + "px";

	}

	//var scrollRatio = document.querySelector("body").clientHeight / document.querySelector("#scroll").clientHeight;
	//console.log(scrollRatio);

	//event handlers

	window.onscroll = scrollBar;

	scroll.onmousedown = scrollText;
	scroll.onmousemove = function(e) {
		if(e.buttons === 1)
			scrollText(e);
	};

	//scale computers

	function scrollText(e)
	{
		var scroll_pos = e.clientY;

		var top    = h_frame / 2;
		var bottom = h_window - top;

		scroll_pos = Math.min(Math.max(scroll_pos, top), bottom);
		var px = Math.round(map(scroll_pos, top, bottom, 0, (h_body - h_window)));

		setPos(px, (scroll_pos - top));
	}

	function scrollBar(e)
	{
		var page_pos = e.pageY;
	}

	//the universal function for updating scroll position
	function setPos(px, scroll_px)
	{
		//don't calculate this unless needed
		if(scroll_px === undefined)
			scroll_px = 0;

		frame.style.top = scroll_px + "px";
		window.scrollTo(0, px);
	}

	setup();
	window.onresize = setup;
};