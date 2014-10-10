
/*
	Written by Brendan Whitfield
	https://github.com/brendanwhitfield

	Using UglifyJS2
	https://github.com/mishoo/UglifyJS2
*/


//global settings
window.__exeJS__.settings = {
	animate:false,
	autoscroll:true,
};

//line numbers, in sequence, as they happen
window.__exeJS__.lineEvents = [];
window.__exeJS__.lineTotals = [];

//the callback used for measuring line position
window.__exeJS__.l = function(num, arg) {
	__exeJS__.lineEvents.push(num);
	if(__exeJS__.lineTotals[num] == undefined)
		__exeJS__.lineTotals[num] = 1;
	else
		__exeJS__.lineTotals[num]++;
	return arg;
};


//first time run
window.__exeJS__.load = function(js) {

	__exeJS__.disableAjax();

	var parsedJS = __exeJS__.parse(js); //it's so simple when look at it like this...

	if(window.location.hash == "#debug")
	{
		//print debug lines
		__exeJS__.display = new __exeJS__.display(parsedJS);
	}
	else //normal execution
	{
		__exeJS__.display = new __exeJS__.display(js);
		__exeJS__.exec(parsedJS);
	}
};

//eval a snippet of JS, and display the results
window.__exeJS__.exec = function(js) {

	__exeJS__.lineEvents = [];
	__exeJS__.lineTotals = [];

	eval(js);

	__exeJS__.display.run(__exeJS__.lineEvents,
						  __exeJS__.lineTotals,
						  __exeJS__.settings);
};

//cancel an animation
window.__exeJS__.skip = function() {
	if(typeof __exeJS__.display === "object")
	{
		__exeJS__.display.run(__exeJS__.lineEvents,
							  __exeJS__.lineTotals);
	}
};







window.onload = function() {
	
	var textarea = document.querySelector("textarea");

	var set_animate    = document.querySelector("#animate");
	var set_autoscroll = document.querySelector("#autoscroll");




	function loadSettings()
	{
		__exeJS__.settings.animate    = set_animate.checked;
		__exeJS__.settings.autoscroll = set_autoscroll.checked;
	}

	set_animate.onchange    = loadSettings;
	set_autoscroll.onchange = loadSettings;




	function exe()
	{
		loadSettings();
		var js = document.querySelector("#command").value;
		__exeJS__.exec(js);
	}




	document.querySelector("#libs").onclick = function(e) {
		if(e.target.nodeName === "BUTTON")
		{
			var url = "http://people.rit.edu/bcw7044/tools/exejs/samples/" + e.target.textContent;

			var xhr = new XMLHttpRequest();
			xhr.open("GET", url);
			xhr.onreadystatechange = function() {
			    if((xhr.readyState == 4) && (xhr.status == 200))
			    {
			        textarea.value = xhr.responseText;
			    }
			}
			xhr.send();
		}
	};

	//the start button
	document.querySelector("#start").onclick = function() {

		var js = textarea.value;

		if(__exeJS__.isValid(js))
		{
			document.querySelector("#entry").style.display = "none";
			document.querySelector("#code").style.display = "block";
			document.querySelector("#tools").style.display = "block";
			
			//the two ways to execute code
			document.onkeypress = function(e) { if(e.keyCode == 13) exe(); };
			document.querySelector("#exe").onclick = exe;
			document.querySelector("#skip").onclick = __exeJS__.skip;

			loadSettings();
			__exeJS__.load(js);
		}
		else
		{
			document.querySelector("#error").style.display = "inline";
		}
	};
};
