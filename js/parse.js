
window.__exeJS__.parse = function(js) {

	//bring these into scope
	var TreeTransformer     = __exeJS__.uglify.TreeTransformer;

	var AST_Toplevel        = __exeJS__.uglify.AST_Toplevel;
	var AST_BlockStatement  = __exeJS__.uglify.AST_BlockStatement;
	var AST_SimpleStatement = __exeJS__.uglify.AST_SimpleStatement;
	var AST_Defun           = __exeJS__.uglify.AST_Defun;
	var AST_Function        = __exeJS__.uglify.AST_Function;
	var AST_Call            = __exeJS__.uglify.AST_Call;
	var AST_Dot             = __exeJS__.uglify.AST_Dot;
	var AST_SymbolRef       = __exeJS__.uglify.AST_SymbolRef;
	var AST_Number          = __exeJS__.uglify.AST_Number;
	var AST_If              = __exeJS__.uglify.AST_If;
	var AST_While           = __exeJS__.uglify.AST_While;
	var AST_For             = __exeJS__.uglify.AST_For;
	var AST_Do              = __exeJS__.uglify.AST_Do;
	var AST_ForIn           = __exeJS__.uglify.AST_ForIn;
	var AST_Try             = __exeJS__.uglify.AST_Try;
	var AST_Catch           = __exeJS__.uglify.AST_Catch;
	var AST_Finally         = __exeJS__.uglify.AST_Finally;
	var AST_Object          = __exeJS__.uglify.AST_Object;

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
		//console.log(node);


		//in case this is a single line statement (when it could be a block)
		if(instanceofAny(node, [AST_If, AST_While, AST_For, AST_ForIn, AST_Do]))
		{
			//if it's not a block, make it a block (in order to accomodate extra sensor statements)
			if(!(node.body instanceof AST_BlockStatement))
			{
				node.body = new AST_BlockStatement({
					body:[node.body]
				});
			}

			//if statements may have an ELSE
			if((node instanceof AST_If) && (node.alternative !== null))
			{
				if(!(node.alternative instanceof AST_BlockStatement))
				{
					node.alternative = new AST_BlockStatement({
						body:[node.alternative]
					});
				}
			}
		}


		//special handling
		if(instanceofAny(node, [AST_If, AST_While, AST_For])) //sensors in conditions
		{
			var line = node.start.line;
			node.condition = buildSensor(line, node.condition);
		}
		else if(node instanceof AST_Do) //sensors in conditions
		{
			var line = node.end.line;
			node.condition = buildSensor(line, node.condition);
		}
		else if(node instanceof AST_ForIn) //needs a sensor inside the body block
		{
			var line = node.start.line;
			node.body.body.unshift(buildSensor(line));
		}
		else if(instanceofAny(node, [AST_Try, AST_Catch, AST_Finally])) //needs a sensor inside the body block
		{
			var line = node.start.line;
			node.body.unshift(buildSensor(line));
		}
		else if(node instanceof AST_Object)
		{
			node.properties.forEach(function(key) {
				var line = key.start.line;
				key.value = buildSensor(line, key.value);
			});
		}

		//process body arrays
		var haveBodies = [
			AST_Toplevel,
			AST_BlockStatement,
			AST_Defun,
			AST_Function,
			AST_Try,
			AST_Catch,
			AST_Finally
		];

		if(instanceofAny(node, haveBodies))
		{
			//rebuild the body array with sensors
			var statements = [];

			node.body.forEach(function(n) {

				//skip lines that have sensors embedded in the conditions, or in the body block
				var skip = [
					AST_If,
					AST_While,
					AST_For,
					AST_ForIn,
					AST_Try,
					AST_Catch,
					AST_Finally
				];
				
				if(!n.sensor && !instanceofAny(n, skip))
				{
					var line = n.start.line;
					statements.push(buildSensor(line));
				}

				statements.push(n);
			});

			node.body = statements;
		}

	}


	//build the initial AST
	var ast = __exeJS__.uglify.parse(js);
	
	//traverse the tree
	var new_ast = ast.transform(new TreeTransformer(before));

	//send it back as raw JS
	return new_ast.print_to_string({ beautify: true });
};
