'use strict';

var Datastore = require('nedb');
var pathUtils = require('path');
var async = require('async');

exports.db;

var collectionName = [
	'tokens', 'accounts'
];

var absolutePathRegexp = /^\//;
exports.init = function(params, callback) {
	var dbPath = params.path;
	if (!absolutePathRegexp.test(dbPath)) {
		dbPath = pathUtils.join(__dirname, dbPath);
	}

	db = {};

	async.each(
		collectionName,
		function(collectionName, callback) {
			var collection = new Datastore({
				filename: pathUtils.join(dbPath, collectionName + '.nedb');
			});

			collection.loadDatabase(function(err) {
				if (err) {
					return callback(err);
				}

				exports.db[collectionName] = collection;
				callback();
			});
		},
		callback
	);
};
