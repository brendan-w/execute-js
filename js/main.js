
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


//checks for name collisions with __exeJS__ (apparently, case insensitive regex is the fastest)
window.__exeJS__.isValid = function(js) { return !(/__exeJS__/i.test(js)); };


window.__exeJS__.init = function(js) {
	if(window.location.hash == "#debug")
	{
		//print debug lines
		var lines = js.split('\n');
		js = __exeJS__.parse(lines);
		lines = js.split('\n');
		__exeJS__.display(lines);
	}
	else //normal execution
	{
		__exeJS__.display(js);
		js = __exeJS__.parse(js); //parsing mechanism found in parse.js
		console.log(js);
		__exeJS__.exec(js);
	}
};

window.__exeJS__.exec = function(js) {
	console.log("execute");
	__exeJS__.lineEvents = [];
	__exeJS__.lineTotals = [];
	eval(js);
	if(__exeJS__.lineEvents.length > 0)
		__exeJS__.animate();
};



window.onload = function() {

	//the start button
	document.querySelector("#start").onclick = function() {
		var js = document.querySelector("textarea").value;
		if(__exeJS__.isValid(js))
		{
			document.querySelector("#entry").style.display = "none";
			document.querySelector("#code").style.display = "block";
			document.querySelector("#tools").style.display = "block";
			document.onkeypress = function(e) { if(e.keyCode == 13) exe(); };

			__exeJS__.init(js);
		}
		else
		{
			document.querySelector("#error").style.display = "inline";
		}
	};

	//the exe button
	document.querySelector("#exe").onclick = exe;

	function exe()
	{
		var js = document.querySelector("#command").value;
		__exeJS__.exec(js);
	}
};
