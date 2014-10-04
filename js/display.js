/*
	this object is created once, for the given code
	
 */
window.__exeJS__.display = function(js) {

	//init
	var code     = document.querySelector("#code");
	var progress = document.querySelector("#progress .value");
	var lines    = [];

	var gradient = new __exeJS__.gradient([
		{ color:{r:255, g:255, b:140}, p:0    },
		{ color:{r:255, g:255, b:76},  p:0.25 },
		{ color:{r:255, g:145, b:35},  p:0.5  },
		{ color:{r:255, g:0,   b:40},  p:1    }
	]);

	//bring these into scope to clean up the code
	var map   = __exeJS__.map;
	var toCSS = __exeJS__.toCSS;

	//generate line elements
	js.split('\n').forEach(function(v, i) {
		var s = document.createElement('span');
		var c = document.createElement('code');
		var p = document.createElement('pre');
		p.appendChild(s);
		p.appendChild(c);
		s.innerHTML = (i+1);
		c.innerHTML = __exeJS__.escape(v);
		p.id = "l" + (i + 1);
		code.appendChild(p);
		lines[i + 1] = p;
	});


	/* Progress bar */
	function prog_set(p)
	{
		progress.style.width = Math.round(p) + "%";
	}

	function prog_open()
	{
		prog_set(0);
		progress.parentNode.style.opacity = 1;
	}

	function prog_close()
	{
		progress.parentNode.style.opacity = 0;
	}


	/* currently executing line */
	function lineON(l)  { lines[l].className = "exe"; }
	function lineOFF(l) { lines[l].className = "";    }
	function setLine(l, c) { lines[l].style.backgroundColor = c; }



	//erase the heat map
	this.reset = function() {
		lines.forEach(function(v) {

		});
	};






	this.animate = function(events, totals) {

		prog_open();

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
			if(i >= events.length)
			{
				clearInterval(timer);
				lines[events[events.length - 1]].className = "";
				prog_open(close);
				return;
			}

			//disable the previous line
			if((i - 1) >= 0)
				lineOFF((i - 1));
			
			//enable the current line
			lineON(i);

			increment(events[i]);

			var p = map(counts[events[i]], 0, largest, 0, 1);
			var color = gradient.get(p);
			setLine(i, toCSS(color));

			//update the progress bar
			prog_set(map(i, 0, events.length - 1, 0, 100));

			i++;
		}
	};
};
