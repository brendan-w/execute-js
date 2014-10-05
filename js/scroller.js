
window.__exeJS__.scroller = function() {

	var scroll      = document.querySelector("#scroll");
	var frame       = document.querySelector("#scroll #frame");
	var scroll_code = document.querySelector("#scroll code");

	var h_line   = document.querySelector("#code pre").clientHeight;
	var h_code   = document.querySelector("body").clientHeight;
	var h_scroll = scroll_code.clientHeight;
	
	var h_window;
	var h_frame;
	var linesPerWindow;


	function setup()
	{
		h_window = window.innerHeight;
		linesPerWindow = Math.floor(h_window / h_line);
		h_frame = linesPerWindow * 1;

		frame.style.height = h_frame + "px";

	}

	//var scrollRatio = document.querySelector("body").clientHeight / document.querySelector("#scroll").clientHeight;
	//console.log(scrollRatio);


	window.onscroll = function(e) {
		var page_pos = e.pageY;
	};

	scroll.onclick = function(e) {
		var scroll_pos = e.clientY;

		var top    = h_frame / 2;
		var bottom = h_window - top;
		scroll_pos = Math.min(Math.max(scroll_pos, top), bottom);



	}

	setup();
	window.onresize = setup;
};