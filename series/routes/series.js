'use strict';

var async = require('async');
var db = require('../db').db;
var errors = require('../utils/errors');
var Ajv = require('ajv');

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
		var query = req.query || {};
		var ajv = new Ajv({coerceTypes: true});

		async.waterfall([
			function(callback) {
				var valid = ajv.validate({
					type: 'object',
					properties: {
						offset: {
							type: 'integer',
							minimum: 0
						},
						limit: {
							type: 'integer',
							minimum: 0
						},
						title: {
							type: 'string'
						}
					},
					additionalProperties: false
				}, query);

				if (!valid) {
					console.log(ajv.errors)
					return callback(
						new errors.BadRequestError()
					);
				}

				var condition = {};
				if (query.title) {
					condition.title = {
						$regex: new RegExp(query.title)
					};
				}

				var cursor = db.find(condition)
					.skip(query.offset)
					.limit(query.limit);

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
		var params = req.params;
		var data = req.body;

		async.waterfall([
			function(callback) {
				db.findOne({_id: params.id}, callback);
			},
			function(series, callback) {
				if (!series) {
					return callback(new errors.NotFoundError(
						'Series not found: _id = ' + params._id
					));
				}

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
