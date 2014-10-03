
window.__exeJS__.parse = function(js) {

	//creates the node structure for a sensor callback
	function buildSensor(line, argNode)
	{
		//bring these into scope
		var AST_SimpleStatement = __exeJS__.uglify.AST_SimpleStatement;
		var AST_Call            = __exeJS__.uglify.AST_Call;
		var AST_Dot             = __exeJS__.uglify.AST_Dot;
		var AST_SymbolRef       = __exeJS__.uglify.AST_SymbolRef;
		var AST_Number          = __exeJS__.uglify.AST_Number;

		var args = [];
		args.push(new AST_Number({ value:line }));
		if(argNode !== undefined)
		{
			if(argNode instanceof AST_SimpleStatement)
				argNode = argNode.body;
			args.push(argNode);
		}

		var sensor = new AST_SimpleStatement({
	        body: new AST_Call({
	            args: args,
	            expression: new AST_Dot({
	            	property:"l",
	            	expression:new AST_SymbolRef({
	            		name:"__exeJS__",
	            	}),
	            }),
	        }),
	    });

	    return sensor;
	}

	//build the initial AST
	var ast = __exeJS__.uglify.parse(js);
	console.log(ast);

	ast.body[0] = buildSensor(59, ast.body[0]);

	return ast.print_to_string({ beautify: true });
};