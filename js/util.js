
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