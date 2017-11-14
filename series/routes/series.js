'use strict';

var async = require('async');
var db = require('../db').db;
var errors = require('../utils/errors');
var validate = require('../utils/validate').validate;


var idScheme = {
	type: 'object',
	properties: {
		_id: {
			type: 'string'
		}
	},
	required: ['_id'],
	additionalProperties: false
};

var seriesScheme = {
	type: 'object',
	properties: {
		title: {type: 'string'},
		originalTitle: {type: 'string'},
		sources: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					source: {type: 'string'},
					sourceUrl: {type: 'string'},
					releases: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								title: {type: 'string'},
								season: {type: 'integer'},
								series: {type: 'integer'}
							},
							required: [
								'title', 'season', 'series'
							],
							additionalProperties: false
						}
					}
				},
				required: [
					'source', 'sourceUrl', 'releases'
				],
				additionalProperties: false
			}
		}
	},
	required: [
		'title', 'sources'
	],
	additionalProperties: false
};

module.exports = function(app) {
	app.get('/api/series/:_id', function(req, res, next) {
		var params = req.params;

		async.waterfall([
			function(callback) {
				validate(idScheme, params, callback);
			},
			function(validatedParams, callback) {
				params = validatedParams;
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
				var query = req.query || {};

				validate({
					type: 'object',
					properties: {
						offset: {
							type: 'integer',
							minimum: 0
						},
						limit: {
							type: 'integer',
							minimum: 0,
							maximum: 100,
							default: 20
						},
						title: {
							type: 'string'
						},
						_ids: {
							type: 'array',
							items: {
								type: 'string'
							}
						}
					},
					additionalProperties: false
				}, query, callback);
			},
			function(query, callback) {
				var condition = {};
				if (query.title) {
					condition.title = {
						$regex: new RegExp(query.title)
					};
				}

				if (query._ids) {
					condition._id = {
						$in: query._ids
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
				validate(seriesScheme, data, callback);
			},
			function(data, callback) {
				db.insert(data, callback);
			},
			function(series, callback) {
				res.json({
					data: series
				});
			}
		], next);
	});

	app.put('/api/series/:_id', function(req, res, next) {
		var params = req.params;
		var data = req.body;

		async.waterfall([
			function(callback) {
				validate(idScheme, params, callback);
			},
			function(validatedParams, callback) {
				params = validatedParams;
				validate(seriesScheme, data, callback);
			},
			function(validatedData, callback) {
				data = validatedData;
				db.findOne({_id: params._id}, callback);
			},
			function(series, callback) {
				if (!series) {
					return callback(new errors.NotFoundError(
						'Series not found: _id = ' + params._id
					));
				}

				db.update(
					{_id: params._id},
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

	app['delete']('/api/series/:_id', function(req, res, next) {
		var params = req.params;

		async.waterfall([
			function(callback) {
				validate(idScheme, params, callback);
			},
			function(validatedParams, callback) {
				params = validatedParams;
				db.findOne({_id: params._id}, callback);
			},
			function(series, callback) {
				if (!series) {
					return callback(new errors.NotFoundError(
						'Series not found: _id = ' + params._id
					));
				}

				db.remove({_id: params.id}, {}, callback);
			},
			function(series) {
				res.json({
					data: series
				});
			}
		], next);
	});
};
