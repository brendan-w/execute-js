/*
	welcome to the hacky JS parser
	this does not truly parse JS. It only deals with:
		-semicolons
		-keywords
		-curlybraces
		-comments
*/


//usefull string things
String.prototype.has = function(x) { return (new RegExp(x, "i")).test(this); };
String.prototype.hasAny = function(a) {
	for(var i = 0; i < a.length; i++)
	{
		if(this.has(a[i])) return true;
	}
	return false;
};


window.__exeJS__.parse = function(lines) {

	var t = {
		FREE_SPACE:0,  //normal code
		LINE:1,        //in the middle of a line, waiting for semicolon
		COMMENT:2,
		OBJECT:3,      //in object
		DECLARATION:4, //wait for opening curly brace
	};

	//stack functions
	var typeStack = [0];
	function inType(t)   { return typeStack.slice(-1)[0] == t; }
	function popType()   { return typeStack.pop(); }
	function pushType(t) { typeStack.push(t); }

	//create the callback for a given line number
	function senseLine(num) { return "__exeJS__.l(" + num + ");\n"; }

	//called for every line, returns whether or not to inject a sensor statement above this line
	function isCode(js)
	{
		//console.log(typeStack.join(" "));
		//console.log(js);

		//do these seperately to prevent short circuiting the &&
		var current = inType(t.FREE_SPACE);
		var processed = process(preprocess(js));
		return current && processed;
	}

	//adjusts the typeStack for this line of JS
	//returns a boolean that can veto this line as a candidate for a sensor
	function process(js)
	{
		if(js == "") return false;

		//handle block comments
		if(js.has("/\\*"))
			pushType(t.COMMENT);
		else if(js.has("\\*/"))
			popType();

		if(inType(t.COMMENT)) return false;

		//semicolons are gold
		//find gold
		if(js[js.length - 1] == ';')
		{
			if(inType(t.LINE)) //this is ending a multi-line line	
			{
				popType();
			}
			else if(js.has("}")) //this the end of an object, or an inline function
			{
				popType();
				return false;
			}
		}
		else if(js.hasAny(["function", "if", "else", "for", "while", "do", "switch"])) //things that need open curlys before code space
		{
			if(js.has('}')) //handles " } else { "
				popType();

			//search for the opening curly
			if(js.has('{'))
				pushType(t.FREE_SPACE); //found, go directly into another code space
			else
				pushType(t.DECLARATION); //wait for curly (probably on next line)

			//else statements are the only block statement where we DON'T want sensing
			if(js.has("else"))
				return false;
		}
		else if(js.hasAny(["case", "default"]))
		{
			return false;
		}
		else if(inType(t.DECLARATION))
		{
			if(js.has('{'))
			{
				popType(); //remove the declaration type
				pushType(t.FREE_SPACE);
			}
		}
		else
		{
			if(js.has('}') && !js.has("{"))
			{
				popType();
				return false;
			}
			else if(js.has('{') && !js.has("}"))
			{
				pushType(t.OBJECT);
			}
			else if(!inType(t.OBJECT))
			{
				pushType(t.LINE);
			}
		}

		return true;
	}

	//pre-formats JS strings, for parsing
	function preprocess(js)
	{
		//remove single-line comments
		js = js.replace(/\/\/.*/g, ""); //.*
		//remove multi-line comments on a single line
		js = js.replace(/\/\*.*\*\//g, "");
		//remove string literals, in case they contain keywords
		js = js.replace(/\".*\"/g, ""); /*.**/
		//remove single-quote string literals, in case they contain keywords
		js = js.replace(/\'.*\'/g, "");
		//remove regex patterns (yes, this will also remove " a/b/c" calcs, but we don't need those anyway)
		js = js.replace(/\/.*\//g, "");
		//shrink all whitespace down to single char
		js = js.replace(/\s+/g, " ");
		//remove whitespace on either end (do this last, in case the deletions left space)
		js = js.trim();

		return js;
	}


	//the main line loop
	var js = '';
	lines.forEach(function(v, i) {
		if(isCode(v))
			js += senseLine(i + 1);
		js += v + '\n';
	});
	return js;
};
