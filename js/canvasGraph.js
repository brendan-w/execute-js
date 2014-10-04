
window.__exeJS__.canvasGraph = function() {
	var canvas = document.querySelector("#tools canvas");

	canvas.width = document.querySelector("#main").clientWidth - 40;
	canvas.height = 60;

	var ctx = canvas.getContext("2d");

	//bring these into scope to clean up the code
	var map         = __exeJS__.map;
	var findLargest = __exeJS__.findLargest;
	var countSparse = __exeJS__.countSparse;

	var bins = 10; //binning is neccessary to show a clean trend line

	this.run = function(totals, largest) {

		clear();

		var frequency = compute(totals, largest);
		var maxFreq = __exeJS__.findLargest(frequency);
		console.log(totals);
		console.log(frequency);

		ctx.beginPath();
		ctx.fillStyle = __exeJS__.red;
		ctx.moveTo(0,0);

		frequency.forEach(function(f, t) {
			var x = map(t, 0, bins - 1, 0, canvas.width);
			var y = map(f, 0, maxFreq, canvas.height, 0);
			ctx.lineTo(x, y);
		});

		ctx.lineTo(canvas.width, 0);
		ctx.lineTo(0,0);
		ctx.closePath();
		ctx.fill();
	};

	function compute(totals, largest)
	{
		largest++; //hack to get the farthest edge value to fall into the last bin
		var binSize = largest / bins;
		var frequency = []; // [total] = count

		for(var i = 0; i < bins; i++)
		{
			frequency[i] = 0;
		}


		totals.forEach(function(t) {
			//compute the destination bin
			var bin = Math.floor(t / binSize);
			frequency[bin]++;
		});
		return frequency;
	}

	function clear()
	{
		ctx.clearRect(0,0,canvas.width, canvas.height);
	}
};
