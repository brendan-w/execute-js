

window.__exeJS__ = {

	//line numbers, in sequence, as they happen
	lineEvents:[],
	lineTotals:[],

	htmlEntities:[
		['&', '&amp;'],
		['<', '&lt;'],
		['>', '&gt;']
	],


	//the callback used for measuring line position
	l:function(num) {
		__exeJS__.lineEvents.push(num);
		if(__exeJS__.lineTotals[num] == undefined)
			__exeJS__.lineTotals[num] = 1;
		else
			__exeJS__.lineTotals[num]++;
	},



	//checks for name collisions with __exeJS__ (apparently, case insensitive regex is the fastest)
	isValid:function(js) { return !(/__exeJS__/i.test(js)); },



	init:function(js) {
		if(window.location.hash == "#debug")
		{
			//print debug lines
			var lines = js.split('\n');
			js = __exeJS__.parse(lines);
			lines = js.split('\n');
			__exeJS__.display(lines);
		}
		else //normal execution
		{
			var lines = js.split('\n');
			__exeJS__.display(lines);
			js = __exeJS__.parse(lines); //parsing mechanism found in parse.js
			__exeJS__.exec(js);
		}
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
			p.id = "l" + (i + 1);
			code.appendChild(p);
		});
	},

	escape:function(str) {
		__exeJS__.htmlEntities.forEach(function(v) {
			str = str.replace(v[0], v[1]);
		});
		return str;
	}, 

	exec:function(js) {
		console.log("execute");
		__exeJS__.lineEvents = [];
		__exeJS__.lineTotals = [];
		eval(js);
		__exeJS__.animate();
		console.log(__exeJS__.lineEvents.join(" "));
	},

	animate:function() {
		var prev = null;
		var i = 0;
		var timer = setInterval(next, 100);

		function getLineElem(l) { return document.querySelector("pre#l"+l); }

		function next()
		{
			if(i < __exeJS__.lineEvents.length)
			{
				var current = getLineElem(__exeJS__.lineEvents[i]);
				current.className = "bk-red";

				if(prev != null)
					prev.className = "";

				prev = current;
			}
			else
			{
				clearInterval(timer);

				if(prev != null)
					prev.className = "";
			}
			i++;
		}

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
