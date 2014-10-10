
window.__exeJS__.red = "rgb(200,0,40)";

window.__exeJS__.htmlEntities = [
	['&', '&amp;'],
	['<', '&lt;'],
	['>', '&gt;']
];

window.__exeJS__.escape = function(str) {
	__exeJS__.htmlEntities.forEach(function(v) {
		str = str.replace(v[0], v[1]);
	});
	return str;
};

window.__exeJS__.toCSS = function(c) {
	return "rgb(" + Math.floor(c.r) + "," + Math.floor(c.g) + "," + Math.floor(c.b) + ")";
};

window.__exeJS__.map = function(x, in_min, in_max, out_min, out_max) {
	return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

window.__exeJS__.findLargest = function(array) {
	var largest = 0;
	array.forEach(function(v) {
		if(v > largest) largest = v;
	});
	return largest;
};

//determines the length of a sparse array
window.__exeJS__.countSparse = function(array) {
	var total = 0;
	array.forEach(function(v) {
		total++;
	});
	return total;
};

//checks for name collisions with __exeJS__ (apparently, case insensitive regex is the fastest)
window.__exeJS__.isValid = function(js) {
	return !(/__exeJS__/i.test(js));
};

window.__exeJS__.scrollTo = function(el) {
	if(!__exeJS__.elementInViewport(el))
		el.scrollIntoView(true);
};

window.__exeJS__.elementInViewport = function(el) {
	var element = el.offsetTop;
	var current = window.pageYOffset;
	var h_win = window.innerHeight;
	return (element > current) && (element < (current + h_win));
};

window.__exeJS__.disableAjax = function() {
	
	function warn() { console.log("AJAX has been disabled"); }

	function ajaxBuster()
	{
		this.open = warn;
		this.send = warn;
		this.abort = warn;
		this.getAllResponseHeaders = warn;
		this.getResponseHeader = warn;
		this.setRequestHeader = warn;
	}

	window.XMLHttpRequest = ajaxBuster;
	window.XDomainRequest = ajaxBuster;

	var activeX = window.ActiveXObject;
	window.ActiveXObject = function(str) {
		if(str === "Microsoft.XMLHTTP")
			warn();
		else
			return activeX.apply(this, arguments);
	};
};
