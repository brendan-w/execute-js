/*
	This object is created once, for the given code
	the only public function is:

		run(events, totals, settings)

	call run() to re-render a new event sequence
 */
window.__exeJS__.display = function(js) {

	//code areas
	var code     = document.querySelector("#code");
	var scroll   = document.querySelector("#scroll code");

	var lines       = []; //the line elements themselves
	var scrollLines = []; //the line elements in the scroll bar
	
	//readouts
	var progress   = document.querySelector("#progress .value");
	var totalCalls = document.querySelector("#totalCalls .fr");
	var totalLines = document.querySelector("#totalLines .fr");

	var gradient = new __exeJS__.gradient([
		{ color:{r:255, g:255, b:140}, p:0    },
		{ color:{r:255, g:255, b:76},  p:0.25 },
		{ color:{r:255, g:145, b:35},  p:0.5  },
		{ color:{r:255, g:0,   b:40},  p:1    }
	]);
	
	//data
	var display_totals = []; //persisting line totals for running in cumulative mode

	//bring these into scope to clean up the code
	var map         = __exeJS__.map;
	var toCSS       = __exeJS__.toCSS;
	var findLargest = __exeJS__.findLargest;
	var countSparse = __exeJS__.countSparse;
	var scrollTo    = __exeJS__.scrollTo;

	//generate line elements
	js.split('\n').forEach(function(v, i) {

		var text = __exeJS__.escape(v);

		//the main code viewer
		var p = document.createElement('pre');
		var s = document.createElement('span');
		var c = document.createElement('code');
		p.appendChild(s);
		p.appendChild(c);
		s.innerHTML = (i+1);
		c.innerHTML = text;
		code.appendChild(p);
		lines[i + 1] = p;

		//the scroll bar
		p = document.createElement('pre');
		c = document.createElement('code');
		p.appendChild(c);
		c.innerHTML = text;
		scroll.appendChild(p);
		scrollLines[i + 1] = p
	});


	var scale    = new __exeJS__.canvasGraph();
	var scroller = new __exeJS__.scroller();


	//the main function
	this.run = function(events, totals, settings) {
		
		//determine the highest frequency (for scaling)
		var largest = findLargest(totals);
		
		scale.run(totals, largest);

		totalCalls.innerHTML = events.length;
		totalLines.innerHTML = countSparse(totals);

		if(!settings.cumulative)
			reset();

		if(settings.animate && (events.length > 0))
		{
			animate(events, totals, largest, function() {
				//animation has finished
				prog_close();
			});
		}
		else if(!settings.animate)
		{
			prog_close();
			render(totals, largest);
		}
	};


	/* Progress bar */
	function prog_set(p)
	{
		progress.style.width = Math.max(Math.round(p), 1) + "%";
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
	function lineON(l)
	{
		scrollTo(lines[l]);
		lines[l].className = "exe";
		scrollLines[l].className = "exe";
	}
	function lineOFF(l)
	{
		lines[l].className = "";
		scrollLines[l].className = "";
	}
	function setLine(l, c)
	{
		lines[l].style.backgroundColor = c;
		scrollLines[l].style.backgroundColor = c;
	}
	function resetLine(l)
	{
		lines[l].style.backgroundColor = "white";
		scrollLines[l].style.backgroundColor = "white";
	}


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


	function animate(events, totals, largest, done) {

		prog_open();

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

				if(display_totals[l] > 0)
				{
					var p = map(display_totals[l], 1, largest, 0, 1);
					var color = gradient.get(p);
					setLine(l, toCSS(color));
				}

				//update the progress bar
				prog_set(map(i, 0, events.length - 1, 0, 100));

				i++;
			}
		}
	}

	//renders the results without animating
	function render(totals, largest)
	{
		for(var l = 1; l < lines.length; l++)
		{
			if((totals[l] !== undefined) && (totals[l] > 0) )
			{
				var p = map(totals[l], 1, largest, 0, 1);
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
