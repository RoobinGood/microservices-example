'use strict';

var DB = require('nosql');
var pathUtils = require('path');

exports.db;

exports.init = function(params, callback) {
	var dbPath = pathUtils.join(__dirname, params.path);
	console.log(dbPath)
	exports.db = DB.load(params.path);

	callback();
};
