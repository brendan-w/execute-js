Execute-JS
==========

Visualizer for watching Javascript execute in a browser.

This tool uses UglifyJS2 to parse javascript and insert callbacks with corresponding line numbers. When the script is executed in an eval() statement, line numbers are reported, and stacked in an array. This execution sequence can then be rendered over top of the code to show the user the execution of their script.