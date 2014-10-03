
window.__exeJS__.parse = function(js) {

	//bring these into scope
	var TreeTransformer     = __exeJS__.uglify.TreeTransformer;

	var AST_SimpleStatement = __exeJS__.uglify.AST_SimpleStatement;
	var AST_Call            = __exeJS__.uglify.AST_Call;
	var AST_Dot             = __exeJS__.uglify.AST_Dot;
	var AST_SymbolRef       = __exeJS__.uglify.AST_SymbolRef;
	var AST_Number          = __exeJS__.uglify.AST_Number;
	var AST_If              = __exeJS__.uglify.AST_If;
	var AST_BlockStatement  = __exeJS__.uglify.AST_BlockStatement;

	//creates the node structure for a sensor callback
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
			sensor = new AST_SimpleStatement({ body: sensor });

		return sensor;
	}


	//transformation rules
	function before(node, descend)
	{
		console.log(node);

		if(node instanceof AST_If)
		{
			var line = node.start.line;
			node.condition = buildSensor(line, node.condition);
		}
		else if(node instanceof AST_BlockStatement)

		return node;
	}


	//build the initial AST
	var ast = __exeJS__.uglify.parse(js);
	console.log(ast);
	
	//traverse the tree
	var new_ast = ast.transform(new TreeTransformer(before));

	//send it back as raw JS
	return new_ast.print_to_string({ beautify: true });
};