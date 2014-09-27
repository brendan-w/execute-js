

window.__exeJS__ = {

	//line numbers, in sequence, as they happen
	events:[],

	htmlEntities:[
		['&', '&amp;'],
		['<', '&lt;'],
		['>', '&gt;']
	],

	//the callback used for measuring line position
	l:function(num) { events.push(num); },
	callForLine:function(num) { return "__exeJS__.l(" + num + ");\n"; },

	//checks for name collisions with __exeJS__ (apparently, case insensitive regex is the fastest)
	isValid:function(js) { return !(/__exeJS__/i.test(js)); },



	init:function(js) {
		var lines = js.split('\n');
		__exeJS__.display(lines);
		js = __exeJS__.parse(lines);
		__exeJS__.exec(js);
	},

	display:function(lines) {
		var code = document.querySelector("#code");

		lines.forEach(function(v, i) {
			var s = document.createElement('span');
			var c = document.createElement('code');
			var p = document.createElement('pre');
			p.appendChild(s);
			p.appendChild(c);
			s.innerHTML = (i+1);
			c.innerHTML = __exeJS__.escape(v);
			code.appendChild(p);
		});
	},

	escape:function(str) {
		__exeJS__.htmlEntities.forEach(function(v) {
			str = str.replace(v[0], v[1]);
		});
		return str;
	},

	//preprocessor
	parse:function(lines) {
		var js = '';
		lines.forEach(function(v, i) {
			js += v + "\n";
		});
		return js;
	},

	exec:function(js) {
		console.log("execute");
		//__exeJS__.events = [];
		//eval(js);
		//__exeJS__.animate();
	},

	animate:function() {

	}
};


window.onload = function() {

	//the start button
	document.querySelector("#start").onclick = function() {
		var js = document.querySelector("textarea").value;
		if(__exeJS__.isValid(js))
		{
			document.querySelector("#entry").style.display = "none";
			document.querySelector("#code").style.display = "block";
			document.querySelector("#run").style.display = "block";
			__exeJS__.init(js);
		}
		else
		{
			document.querySelector("#error").style.display = "inline";
		}
	};

	//the exe button
	document.querySelector("#exe").onclick = function() {
		var js = document.querySelector("#command").value;
		__exeJS__.exec(js);
	};
};
