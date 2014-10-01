
window.__exeJS__.gradient = function(init_stops) {

	var stops = [];

	//accepts colors as { r:#, g:#, b:# }
	this.addStop = function(color, p) {
		stops.push({color:color, p:p});
		stops.sort(function(a, b) {
			return a.p - b.p;
		});
	};

	function interpolate(color_a, color_b, p)
	{
		var c = {};
		c.r = (color_a.r * (1 - p)) + (color_b.r * p);
		c.g = (color_a.g * (1 - p)) + (color_b.g * p);
		c.b = (color_a.b * (1 - p)) + (color_b.b * p);
		return c
	};

	this.get = function(p) {

		var lower = null;
		var upper = null;

		for(var i = 0; i < stops.length; i++)
		{
			var stop = stops[i];

			if(stop.p < p)
			{
				lower = stop;
			}
			else if(stop.p === p)
			{
				lower = stop;
				break;
			}
			else if(stop.p > p)
			{
				upper = stop;
				break;
			}
		}

		if((lower !== null) && (upper === null))
			return lower.color;
		else if((lower === null) && (upper !== null))
			return upper.color;
		else if((lower === null) && (upper === null))
			return stops[0].color;
		else //both colors exist
			return interpolate(lower.color, upper.color, window.__exeJS__.map(p, lower.p, upper.p, 0, 1));
	};

	//constructor
	var that = this;

	if(init_stops instanceof Array)
	{
		init_stops.forEach(function(v) {
			that.addStop(v.color, v.p);
		});
	}

	console.log(stops);
};