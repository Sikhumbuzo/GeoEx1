/*eslint no-console: 0, no-unused-vars: 0*/
"use strict";

var xsjs  = require("@sap/xsjs");
var xsenv = require("@sap/xsenv");
var port  = process.env.PORT || 3000;
var server = require("http").createServer();
var express = require("express");
var node = require("./getPoints");

var app = express();
var options = {
	redirectUrl : "/index.xsjs"
};

// configure HANA
try {
	options = Object.assign(options, xsenv.getServices({ hana: {tag: "hana"} }));
} catch (err) {
	console.log("[WARN]", err.message);
}

// configure UAA
try {
	options = Object.assign(options, xsenv.getServices({ uaa: {tag: "xsuaa"} }));
} catch (err) {
	console.log("[WARN]", err.message);
}

app.use("/node", node(options.hana));
// start server
var xsjsApp = xsjs(options);
app.use(xsjsApp);

server.on("request", app);
server.listen(port, function(){
	console.log("HTTP Server: " + server.address().port );
});