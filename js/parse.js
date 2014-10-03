
window.__exeJS__.parse = function(js) {

	//bring these into scope
	var TreeTransformer     = __exeJS__.uglify.TreeTransformer;

	var AST_Toplevel        = __exeJS__.uglify.AST_Toplevel;
	var AST_BlockStatement  = __exeJS__.uglify.AST_BlockStatement;
	var AST_SimpleStatement = __exeJS__.uglify.AST_SimpleStatement;
	var AST_Call            = __exeJS__.uglify.AST_Call;
	var AST_Dot             = __exeJS__.uglify.AST_Dot;
	var AST_SymbolRef       = __exeJS__.uglify.AST_SymbolRef;
	var AST_Number          = __exeJS__.uglify.AST_Number;
	var AST_If              = __exeJS__.uglify.AST_If;
	var AST_While           = __exeJS__.uglify.AST_While;
	var AST_For             = __exeJS__.uglify.AST_For;
	var AST_Do              = __exeJS__.uglify.AST_Do;
	var AST_ForIn           = __exeJS__.uglify.AST_ForIn;

	//creates the node structure for a sensor callback
	//calling with (line) returns a simpleStatement            __exeJS.l(line);
	//calling with (line, argNode) returns an inline call      __exeJS.l(line, arg)
	function buildSensor(line, argNode)
	{
		var args = [];
		args.push(new AST_Number({ value:line }));
		if(argNode !== undefined)
		{
			//unwrap semicoloned statements
			if(argNode instanceof AST_SimpleStatement) // func(x);   --->   func(x)
				argNode = argNode.body;

			args.push(argNode);
		}

		var sensor = new AST_Call({
			args: args,
			expression: new AST_Dot({
				property:"l",
				expression:new AST_SymbolRef({
					name:"__exeJS__",
				}),
			}),
		});

		//if it's a lone statement, end it with a semicolon
		if(argNode === undefined)
		{
			sensor = new AST_SimpleStatement({ body: sensor });
			sensor.sensor = true; //add a "sensor" property to quickly skip these while processing blocks
		}

		return sensor;
	}


	function instanceofAny(o, array)
	{
		for(var i = 0; i < array.length; i++)
		{
			if(o instanceof array[i]) return true;
		}
		return false;
	}

	//transformation rules
	function before(node, descend)
	{
		console.log(node);

		if(instanceofAny(node, [AST_If, AST_While, AST_For]))
		{
			var line = node.start.line;
			node.condition = buildSensor(line, node.condition);
		}
		else if(node instanceof AST_Do)
		{
			var line = node.end.line;
			node.condition = buildSensor(line, node.condition);
		}
		else if(node instanceof AST_ForIn)
		{
			var line = node.start.line;
			if(node.body instanceof AST_BlockStatement)
			{
				node.body.body.unshift(buildSensor(line));
			}
		}
		else if(instanceofAny(node, [AST_Toplevel, AST_BlockStatement]))
		{
			//rebuild the body array with sensors
			var statements = [];

			node.body.forEach(function(n) {
				//skip lines that have sensors embedded in the conditions
				if(!n.sensor && !instanceofAny(n, [AST_If, AST_While, AST_For, AST_ForIn]))
				{
					var line = n.start.line;
					statements.push(buildSensor(line));
				}
				statements.push(n);
			});

			node.body = statements;
		}

		//descend(node, this);
		//return node;
	}


	//build the initial AST
	var ast = __exeJS__.uglify.parse(js);
	console.log(ast);
	
	//traverse the tree
	var new_ast = ast.transform(new TreeTransformer(before));

	//send it back as raw JS
	return new_ast.print_to_string({ beautify: true });
};