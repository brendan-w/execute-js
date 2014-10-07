
//global settings
window.__exeJS__.settings = {
	cumulative:false,
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


window.__exeJS__.load = function(js) {

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

window.__exeJS__.exec = function(js) {

	__exeJS__.lineEvents = [];
	__exeJS__.lineTotals = [];

	eval(js);

	__exeJS__.display.run(__exeJS__.lineEvents,
						  __exeJS__.lineTotals,
						  __exeJS__.settings);
};



window.onload = function() {
	
	var set_animate    = document.querySelector("#animate");
	var set_autoscroll = document.querySelector("#autoscroll");


	function exe()
	{
		//load settings
		__exeJS__.settings.animate    = set_animate.checked;
		__exeJS__.settings.autoscroll = set_autoscroll.checked;

		//run
		var js = document.querySelector("#command").value;
		__exeJS__.exec(js);
	}


	//the start button
	document.querySelector("#start").onclick = function() {

		var js = document.querySelector("textarea").value;

		if(__exeJS__.isValid(js))
		{
			document.querySelector("#entry").style.display = "none";
			document.querySelector("#code").style.display = "block";
			document.querySelector("#tools").style.display = "block";
			document.onkeypress = function(e) { if(e.keyCode == 13) exe(); };

			__exeJS__.load(js);
		}
		else
		{
			document.querySelector("#error").style.display = "inline";
		}
	};

	//the exe button
	document.querySelector("#exe").onclick = exe;
};
