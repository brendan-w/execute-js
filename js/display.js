/*
	This object is created once, for the given code
	the only public function is:

		run(events, totals, settings)

	call run() to re-render a new event sequence
 */
window.__exeJS__.display = function(js) {

	//init
	var code     = document.querySelector("#code");
	var progress = document.querySelector("#progress .value");
	var lines    = []; //the line elements themselves
	var display_totals = []; //persisting line totals for running in cumulative mode

	var gradient = new __exeJS__.gradient([
		{ color:{r:255, g:255, b:140}, p:0    },
		{ color:{r:255, g:255, b:76},  p:0.25 },
		{ color:{r:255, g:145, b:35},  p:0.5  },
		{ color:{r:255, g:0,   b:40},  p:1    }
	]);

	//bring these into scope to clean up the code
	var map         = __exeJS__.map;
	var toCSS       = __exeJS__.toCSS;
	var findLargest = __exeJS__.findLargest;

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


	this.run = function(events, totals, settings) {
		if(!settings.cumulative)
			reset();

		if(settings.animate && (events.length > 0))
		{
			animate(events, totals, function() {
				//animation has finished
				prog_close();
			});
		}
		else if(!settings.animate)
		{
			prog_close();
			render(totals);
		}
	};


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
	function setLine(l, c) { lines[l].style.backgroundColor = c;       }
	function resetLine(l)  { lines[l].style.backgroundColor = "white"; }


	/* line counter */
	function addCount(l, c)
	{
		c = (c === undefined) ? 1 : c;

		//create the array entry, if it doesn't exist
		if(display_totals[l] === undefined)
			display_totals[l] = 0;

		display_totals[l] += c;
	}


	//erase the heat map
	function reset()
	{
		display_totals = [];
		for(var l = 1; l < lines.length; l++)
		{
			lineOFF(l);
			resetLine(l);
		}
	}


	function animate(events, totals, done) {

		prog_open();

		var largest = findLargest(totals);
		var i = 0;
		var timer = setInterval(next, 60);

		function next()
		{
			if(i >= events.length)
			{
				clearInterval(timer);
				lineOFF(events[events.length - 1]);
				done();
			}
			else
			{
				var l = events[i];
				var pl = (i-1) >= 0 ? events[i-1] : null;

				if(pl != null) lineOFF(pl); //disable the previous line
				
				lineON(l); //enable the current line
				addCount(l); //advance the heat map

				var p = map(display_totals[l], 0, largest, 0, 1);
				var color = gradient.get(p);
				setLine(l, toCSS(color));

				//update the progress bar
				prog_set(map(i, 0, events.length - 1, 0, 100));

				i++;
			}
		}
	}

	//renders the results without animating
	function render(totals)
	{
		var largest = findLargest(totals);

		for(var l = 1; l < lines.length; l++)
		{
			if(totals[l] !== undefined)
			{
				var p = map(totals[l], 0, largest, 0, 1);
				var color = gradient.get(p);
				setLine(l, toCSS(color));
			}
			else
			{
				resetLine(l);
			}
		}
	}


};
