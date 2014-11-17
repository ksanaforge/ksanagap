// nodemain.js // this java script must be load by inject-script-start in package.json*/

if (typeof process !="undefined") {			// checking if node.js is running
	nodeRequire=require;			// browser side package will overwrite require
	if (process.versions["node-webkit"]) {	// checking if nw is running
		var fs=require("fs");
		var watchfn="../node_scripts/watch.js";
		if (fs.existsSync(watchfn))	require(watchfn)	// setup developing environment
	}
}