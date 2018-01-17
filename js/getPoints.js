"use strict";

var express = require("express");
var xssec = require("@sap/xssec");
var passport = require("passport");
var xsHDBConn = require("@sap/hdbext");
var xsenv = require("@sap/xsenv");
var asyncw = require("async");

module.exports = function(options) {
	var app = express();

	passport.use("JWT", new xssec.JWTStrategy(xsenv.getServices({
		uaa: {
			tag: "xsuaa"
		}
	}).uaa));
	app.use(passport.initialize());

	app.use(
		passport.authenticate("JWT", {
			session: false
		}),
		xsHDBConn.middleware(options)
	);
	//Async Waterfall
	app.route("/getPoints").get(function(req, res) {
		var client = req.db;

		asyncw.waterfall([
			function prepare(callback) {
				var query =
					"SELECT \"Latitude\" AS \"Lat\", \"Longitude\" AS \"Lon\", \"City\" AS \"City\", \"ProvinceName\" AS \"Province\" FROM \"GEOEX1_HDI_CONTAINER_1\".\"GeoEx1.db::SACities.CityData\" ";

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