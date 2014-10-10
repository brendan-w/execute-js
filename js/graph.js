
window.__exeJS__.canvasGraph = function() {
	var canvas = document.querySelector("#scale canvas");
	var max = document.querySelector("#scale .axis .fr");

	canvas.width = document.querySelector("#main").clientWidth - 40;
	canvas.height = 80;

	var ctx = canvas.getContext("2d");

	//bring these into scope to clean up the code
	var map         = __exeJS__.map;
	var findLargest = __exeJS__.findLargest;
	var countSparse = __exeJS__.countSparse;


	var bins = 36; //binning is neccessary to show a clean trend line
	var base = 5;


	this.run = function(totals, largest) {

		clear();

		max.innerHTML = largest;

		var frequency = compute(totals, largest);
		var maxFreq = __exeJS__.findLargest(frequency);
		
		//console.log(totals);
		//console.log(frequency);

		var points = [];
		frequency.forEach(function(f, t) {
			var x = map(t, 0, frequency.length - 1, 0, canvas.width);
			var y = map(f, 0, maxFreq, canvas.height - base, 0);
			points.push({ x:x, y:y });
		});

		draw(points);
	};

	function compute(totals, largest)
	{
		var frequency = []; // [total] = count

		for(var i = 0; i < bins; i++)
		{
			frequency[i] = 0;
		}

		totals.forEach(function(t) {
			if(t > 0)
			{
				//compute the destination bin
				var bin = map(t, 1, largest, 0, bins - 1);
				bin = Math.floor(bin);
				frequency[bin]++;
			}
		});

		return frequency;
	}

	function draw(points)
	{
		ctx.beginPath();
		ctx.fillStyle = __exeJS__.red;
		ctx.moveTo(0,0);

		for(var i = 1; i < points.length; i++)
		{
			var a = points[i - 1];
			var b = points[i];

			/*
					 midXA   midX   midXB
				A-------------|--------------
				|      |      |      |      |
			midY--------------+--------------
				|      |      |      |      |
				--------------|-------------B
			*/

			var midX = (a.x + b.x) / 2;
			var midY = (a.y + b.y) / 2;
			var midXA = (midX + a.x) / 2;
			var midXB = (midX + b.x) / 2;

			ctx.lineTo(a.x, a.y);
			ctx.quadraticCurveTo(midXA, a.y, midX, midY);
			ctx.quadraticCurveTo(midXB, b.y, b.x, b.y);
		}

		ctx.lineTo(canvas.width, 0);
		ctx.lineTo(0,0);
		ctx.closePath();
		ctx.fill();
	}

	function clear()
	{
		ctx.clearRect(0,0,canvas.width, canvas.height);
	}
};
