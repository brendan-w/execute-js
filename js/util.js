
window.__exeJS__.util = {

	htmlEntities:[
		['&', '&amp;'],
		['<', '&lt;'],
		['>', '&gt;']
	],

	escape:function(str) {
		__exeJS__.util.htmlEntities.forEach(function(v) {
			str = str.replace(v[0], v[1]);
		});
		return str;
	}, 
	
	map:function(x, in_min, in_max, out_min, out_max) {
		return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
	},

	getColor:function(p) {
		var c = {};

		var color_a = { r:255, g:255, b:255 };
		var color_b = { r:200, g:0,   b:40  };

		c.r = (color_a.r * (1 - p)) + (color_b.r * p);
		c.g = (color_a.g * (1 - p)) + (color_b.g * p);
		c.b = (color_a.b * (1 - p)) + (color_b.b * p);
		return "rgb(" + c.r + "," + c.g + "," + c.b + ")";
	}

};