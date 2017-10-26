'use strict';

var async = require('async');
var db = require('../db').db;
var errors = require('../utils/errors');

module.exports = function(app) {
	app.get('/api/series/:_id', function(req, res, next) {
		var params = req.params;

		async.waterfall([
			function(callback) {
				db.findOne({_id: params._id}, callback);
			},
			function(series, callback) {
				if (!series) {
					return callback(new errors.NotFoundError(
						'Series not found: _id = ' + params._id
					));
				}

				res.json({
					data: series
				});
			}
		], next);
	});

	app.get('/api/series', function(req, res, next) {
		async.waterfall([
			function(callback) {
				var params = req.params;

				var cursor = db.find({_id: params._id})
					.skip(params.offset)
					.limit(params.offset);

				cursor.exec(callback);
			},
			function(series, callback) {
				res.json({
					data: series
				});
			}
		], next);
	});

	app.post('/api/series', function(req, res, next) {
		async.waterfall([
			function(callback) {
				var data = req.body;

				db.insert(data, callback);
			},
			function(series, callback) {
				res.json({
					data: series
				});
			}
		], next);
	});

	app.put('/api/series/:id', function(req, res, next) {
		async.waterfall([
			function(callback) {
				var params = req.params;
				var data = req.body;

				db.update(
					{_id: params.id},
					data,
					{returnUpdatedDocs: true},
					callback
				);
			},
			function(series, callback) {
				res.json({
					data: series
				});
			}
		], next);
	});
};
