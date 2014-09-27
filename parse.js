/*
	welcome to the hacky JS parser
*/

String.prototype.has = function(x) { return (new RegExp(x, "i")).test(this); };
String.prototype.hasAny = function(a) {
	for(var i = 0; i < a.length(); i++)
	{
		if(this.has(a[i])) return true;
	}
	return false;
};

window.__exeJS__.parse = function(lines, senseLine) {

	var type = {
		CODE_SPACE:0,
		LINE:1,
		COMMENT:2,
		OBJECT:3,
		DECLARATION:4 //wait for opening curly brace
	};

	var typeStack = [0];
	function inType(t) { return typeStack.slice(-1)[0] == t; }
	function pushType(t) { typeStack.push(t); }
	function popType() { return typeStack.pop(); }

	function isCode(js)
	{
		var result = inType(type.CODE_SPACE);	
		process(preprocess(js));
		return result;
	}

	function process(js)
	{
		if(js == "") return;

		//semicolons are gold
		//find gold
		if(js.substr(js.length - 1) == ";")
		{
			if(inType(type.LINE)) //this is ending a multi-line line
				popType();
			else if(js.substr(0,1) == "}") //this the end of an object, or an inline function
				popType();
		}
		else if(js.hasAny(["function", "if", "for", "while", "do", "switch"])) //things that need open curlys before code space
		{
			//search for the opening curly
			if(js.has('{'))
				pushType(type.CODE_SPACE); //found, go directly into another code space
			else
				pushType(type.DECLARATION); //wait for curly (prob. on next line)
		}
		else if(inType(type.DECLARATION))
		{
			if(js.has('{'))
				pushType(type.CODE_SPACE);
		}
		else
		{
			if(js.has('}'))
				popType();
			else if(js.has(""))
			else

				pushType(type.LINE);
		}
	}

	//pre-formats js strings, removing things like spaces, comments, and strings
	function preprocess(js)
	{
		//remove whitespace on either end
		js = js.trim();
		//remove single-line comments
		var i = js.indexOf("//");
		if(i > -1)
			js = js.substring(0, i);
		//remove multi-line comments on a single line
		js = js.replace(/\/\*.*\*\//g, "");
		//remove string literals, in case they contain keywords
		js = js.replace(/\".*\"/g, "");
		//remove single-quote string literals, in case they contain keywords
		js = js.replace(/\'.*\'/g, "");
		//shrink all whitespace down to single char
		js = js.replace(/\s+/g, ' ');
		//trim on last time, in case the deletions left space
		js = js.trim();

		return js;
	}


	//the main line loop
	var js = '';
	lines.forEach(function(v, i) {
		if(isCode(v))
			js += senseLine(i);
		js += v + '\n';
	});

	console.log(js);
	return js;
};
