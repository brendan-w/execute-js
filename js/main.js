
	//line numbers, in sequence, as they happen
	window.__exeJS__.lineEvents = [],
	window.__exeJS__.lineTotals = [],
	window.__exeJS__.lineElements = [],

	//the callback used for measuring line position
	window.__exeJS__.l = function(num) {
		__exeJS__.lineEvents.push(num);
		if(__exeJS__.lineTotals[num] == undefined)
			__exeJS__.lineTotals[num] = 1;
		else
			__exeJS__.lineTotals[num]++;
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
			var lines = js.split('\n');
			__exeJS__.display(lines);
			

			var tree = __exeJS__.parse.parse(js);
			console.log(tree);
			js = __exeJS__.process.gen_code(tree);
			console.log(js);

			//js = __exeJS__.parse(lines); //parsing mechanism found in parse.js
			__exeJS__.exec(js);
		}
	};

	window.__exeJS__.display = function(lines) {
		var code = document.querySelector("#code");

		lines.forEach(function(v, i) {
			var s = document.createElement('span');
			var c = document.createElement('code');
			var p = document.createElement('pre');
			p.appendChild(s);
			p.appendChild(c);
			s.innerHTML = (i+1);
			c.innerHTML = __exeJS__.escape(v);
			p.id = "l" + (i + 1);
			code.appendChild(p);
			__exeJS__.lineElements[i + 1] = (p);
		});
	};


	window.__exeJS__.exec = function(js) {
		console.log("execute");
		__exeJS__.lineEvents = [];
		__exeJS__.lineTotals = [];
		eval(js);
		__exeJS__.animate();
	};


	window.__exeJS__.displayGradient = new window.__exeJS__.gradient([
		{ color:{r:245, g:245, b:245}, p:0    },
		{ color:{r:255, g:255, b:76},  p:0.20 },
		{ color:{r:255, g:145, b:35},  p:0.5  },
		{ color:{r:255, g:0,   b:40},  p:1    }
	]);


	window.__exeJS__.animate = function() {

		var events   = __exeJS__.lineEvents;
		var elements = __exeJS__.lineElements;
		var totals   = __exeJS__.lineTotals;
		var largest  = __exeJS__.findLargest(totals);

		var i = 0;
		var counts = [];
		var timer = setInterval(next, 60);

		function increment(line)
		{
			if(counts[line] == undefined)
				counts[line] = 1;
			else
				counts[line]++;
		}

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
			
			//enable the current line
			line.className = "exe";
			increment(events[i]);
			var p = __exeJS__.map(counts[events[i]], 0, largest, 0, 1);
			var color = window.__exeJS__.displayGradient.get(p);
			line.style.backgroundColor = __exeJS__.toCSS(color);

			i++;
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
