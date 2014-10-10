/*
	This object is created once, for the given code
	the only public function is:

		run(events, totals, settings)

 */

window.__exeJS__.display = function(js) {

	//code areas
	var code = document.querySelector("#code");
	var tiny = document.querySelector("#tiny code");

	var lines     = []; //the line elements themselves
	var tinyLines = []; //the line elements in the scroll bar
	
	//readouts
	var progress      = document.querySelector("#progress");
	var progressValue = document.querySelector("#progress .value");
	var totalCalls    = document.querySelector("#totalCalls .fr");
	var totalLines    = document.querySelector("#totalLines .fr");
	var totalPercent  = document.querySelector("#totalPercent .fr");

	//the timer used for animation
	var timer = -1;

	//heat map gradient (keep consistant with CSS)
	var gradient = new __exeJS__.gradient([
		{ color:{r:255, g:255, b:140}, p:0    },
		{ color:{r:255, g:255, b:76 }, p:0.25 },
		{ color:{r:255, g:145, b:35 }, p:0.5  },
		{ color:{r:245, g:0,   b:40  }, p:1    }
	]);

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
		p.innerHTML = text;
		tiny.appendChild(p);
		tinyLines[i + 1] = p
	});


	//sub-components
	var scale    = new __exeJS__.canvasGraph();
	var scroller = new __exeJS__.scroller();



	//the main function
	//render or animate a new event sequence
	//cancels previous animation
	this.run = function(events, totals, settings) {
		
		reset();

		//default settings
		if(!settings)
		{
			settings = {
				animate:false,
				autoscroll:true,
			};
		}


		var largest = findLargest(totals);
		var count = countSparse(totals);
		var percent = Math.round(count/lines.length*10000)/100;
		
		totalCalls.innerHTML = events.length;
		totalLines.innerHTML = count;
		totalPercent.innerHTML = percent + "%";

		scale.run(totals, largest); //paint the graph

		if(settings.animate && (events.length > 0))
		{
			animate(events,
					totals,
					largest,
					settings.autoscroll);
		}
		else if(!settings.animate)
		{
			render(totals, largest);
		}
	};


	/* Progress bar */
	function prog_set(p)
	{
		progressValue.style.width = Math.max(Math.round(p), 1) + "%";
	}

	function prog_open()
	{
		prog_set(0);
		progress.style.opacity = 1;
	}

	function prog_close()
	{
		progress.style.opacity = 0;
	}


	/* currently executing line */
	function lineON(l, autoscroll)
	{
		if(autoscroll)
			scrollTo(lines[l]);

		lines[l].className = "exe";
		tinyLines[l].className = "exe";
	}
	function lineOFF(l)
	{
		lines[l].className = "";
		tinyLines[l].className = "";
	}
	function setLine(l, c)
	{
		lines[l].style.backgroundColor = c;
		tinyLines[l].style.backgroundColor = c;
	}
	function resetLine(l)
	{
		lines[l].style.backgroundColor = "white";
		tinyLines[l].style.backgroundColor = "white";
	}




	//erase the heat map
	function reset()
	{
		prog_close();
		clearInterval(timer);

		for(var l = 1; l < lines.length; l++)
		{
			lineOFF(l);
			resetLine(l);
		}
	}


	function animate(events, totals, largest, autoscroll) {

		prog_open();

		var i = 0;
		var current_totals = [];
		timer = setInterval(next, 60);

		function addCount(l)
		{
			//create the array entry, if it doesn't exist
			if(current_totals[l] === undefined)
				current_totals[l] = 1;
			else
				current_totals[l]++;
		}


		function next()
		{
			if(i >= events.length)
			{
				//done
				clearInterval(timer);
				lineOFF(events[events.length - 1]);
				prog_close();
			}
			else
			{
				var l = events[i];
				var pl = (i-1) >= 0 ? events[i-1] : null;

				if(pl != null) lineOFF(pl); //disable the previous line
				
				lineON(l, autoscroll); //enable the current line
				addCount(l); //advance the heat map

				//paint the line to form the heat map
				var p = map(current_totals[l], 1, largest, 0, 1);
				var color = gradient.get(p);
				setLine(l, toCSS(color));

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
