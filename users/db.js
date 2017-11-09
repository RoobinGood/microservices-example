'use strict';

var Datastore = require('nedb');
var pathUtils = require('path');

exports.db;

var absolutePathRegexp = /^\//;
exports.init = function(params, callback) {
	var dbPath = params.path;
	if (!absolutePathRegexp.test(dbPath)) {
		dbPath = pathUtils.join(__dirname, dbPath);
	}

	var db = new Datastore({filename: dbPath});
	db.loadDatabase(function(err) {
		if (err) {
			return callback(err);
		}

		exports.db = db;
		callback();
	});
};
