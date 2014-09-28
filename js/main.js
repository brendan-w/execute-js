

window.__exeJS__ = {

	//line numbers, in sequence, as they happen
	lineEvents:[],
	lineTotals:[],
	lineElements:[],

	//the callback used for measuring line position
	l:function(num) {
		__exeJS__.lineEvents.push(num);
		if(__exeJS__.lineTotals[num] == undefined)
			__exeJS__.lineTotals[num] = 1;
		else
			__exeJS__.lineTotals[num]++;
	},



	//checks for name collisions with __exeJS__ (apparently, case insensitive regex is the fastest)
	isValid:function(js) { return !(/__exeJS__/i.test(js)); },



	init:function(js) {
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
			var lines = js.split('\n');
			__exeJS__.display(lines);
			js = __exeJS__.parse(lines); //parsing mechanism found in parse.js
			__exeJS__.exec(js);
		}
	},

	display:function(lines) {
		var code = document.querySelector("#code");

		lines.forEach(function(v, i) {
			var s = document.createElement('span');
			var c = document.createElement('code');
			var p = document.createElement('pre');
			p.appendChild(s);
			p.appendChild(c);
			s.innerHTML = (i+1);
			c.innerHTML = __exeJS__.util.escape(v);
			p.id = "l" + (i + 1);
			code.appendChild(p);
			__exeJS__.lineElements[i] = (p);
		});
	},


	exec:function(js) {
		console.log("execute");
		__exeJS__.lineEvents = [];
		__exeJS__.lineTotals = [];
		eval(js);
		__exeJS__.animate();
	},



	animate:function() {

		var events = __exeJS__.lineEvents;
		var elements = __exeJS__.lineElements;

		var largest = 0;
		__exeJS__.lineTotals.forEach(function(v) {
			if(v > largest) largest = v;
		});

		var i = 0;
		var timer = setInterval(next, 60);


		function next()
		{
			if(i >= __exeJS__.lineEvents.length)
			{
				clearInterval(timer);
				elements[events[events.length - 1]].className = "";
				return;
			}

			var prevLine = (i > 0) ? elements[events[i - 1]] : null;
			var line = elements[events[i]];

			//disable the previous line
			if(prevLine != null)
				prevLine.className = "";
			
			//handle the current line
			line.className = "bk-red";


			i++;
		}



	}
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
