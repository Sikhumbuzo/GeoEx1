/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
"use strict";
var express = require("express");

module.exports = function() {
	var app = express.Router();

	//Hello Router
	app.get("/", function(req, res) {
		res.send("Hello World Node.js");
	});

	//Simple Database Select - In-line Callbacks
	//Example1 handler
	app.get("/example1", function(req, res) {
		var client = req.db;
		client.prepare(
			"select SESSION_USER from \"DUMMY\" ",
			function(err, statement) {
				if (err) {
					res.type("text/plain").status(500).send("ERROR: " + err.toString());
					return;
				}
				statement.exec([],
					function(err, results) {
						if (err) {
							res.type("text/plain").status(500).send("ERROR: " + err.toString());
							return;

						} else {
							var result = JSON.stringify({
								Objects: results
							});
							res.type("application/json").status(200).send(result);
						}
					});
			});
	});

	var async = require("async");
	//Simple Database Select - Async Waterfall
	app.get("/example2", function(req, res) {
		var client = req.db;
		async.waterfall([

			function prepare(callback) {
				client.prepare("select SESSION_USER from \"DUMMY\" ",
					function(err, statement) {
						callback(null, err, statement);
					});
			},

			function execute(err, statement, callback) {
				statement.exec([], function(execErr, results) {
					callback(null, execErr, results);
				});
			},
			function response(err, results, callback) {
				if (err) {
					res.type("text/plain").status(500).send("ERROR: " + err.toString());
					return;
				} else {
					var result = JSON.stringify({
						Objects: results
					});
					res.type("application/json").status(200).send(result);
				}
				callback();
			}
		]);
	});
	
	//Async Waterfall
	app.route("/getPoints").get(function(req, res) {
		var client = req.db;

		async.waterfall([
			function prepare(callback) {
				var query =
					"SELECT \"Latitude\" AS \"Lat\", \"Longitude\" AS \"Lon\", \"City\" AS \"City\", \"ProvinceName\" AS \"Province\" FROM \"GeoEx1.db::SACities.CityData\" ";

				client.prepare(query, function(err, statement) {
					callback(null, err, statement);
				});
			},
			function execute(err, statement, callback) {
				statement.exec([], function(execErr, results) {
					callback(null, execErr, results);
				});
			},
			function response(err, results, callback) {
				if (err) {
					res.type("text/plain").status(500).send("ERROR: " + err);
				} else {

					var data = {};

					data.items = [];

					for (var row = 0; row < results.length; row++) {
						data.items.push({
							lng: results[row].Lon.toString(),
							lat: results[row].Lat.toString()
						});
					}

					var result = JSON.stringify(results);
					res.type("application/json").status(200).send(result);
				}
				callback();
			}
		]);
	});

	return app;
};