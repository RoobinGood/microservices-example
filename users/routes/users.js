'use strict';

var async = require('async');
var db = require('../db').db;
var errors = require('../utils/errors');
var validate = require('../utils/validate').validate;
var serviceRegistry = require('../utils/serviceRegistry');


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

var userScheme = {
	type: 'object',
	properties: {
		login: {
			type: 'string',
			minLenght: 1
		},
		series: {
			type: 'array',
			items: idScheme
		}
	},
	required: [
		'login', 'sources'
	],
	additionalProperties: false
};

module.exports = function(app) {
	app.get('/api/users/:_id', function(req, res, next) {
		var params = req.params;

		async.waterfall([
			function(callback) {
				validate(idScheme, params, callback);
			},
			function(validatedParams, callback) {
				params = validatedParams;
				db.findOne({_id: params._id}, callback);
			},
			function(user, callback) {
				if (!user) {
					return callback(new errors.NotFoundError(
						'User not found: _id = ' + params._id
					));
				}

				serviceRegistry.registry.catalog.service.nodes({
					service: 'series'
				}, function(err, result) {
					callback(err, result, user)
				});
			},
			function(seriesService, user) {
				console.log(seriesService);

				res.json({
					data: user
				});
			}
		], next);
	});

	app.get('/api/users', function(req, res, next) {
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

				var cursor = db.find(condition)
					.skip(query.offset)
					.limit(query.limit);

				cursor.exec(callback);
			},
			function(users, callback) {
				res.json({
					data: users
				});
			}
		], next);
	});

	app.post('/api/users', function(req, res, next) {
		async.waterfall([
			function(callback) {
				var data = req.body;
				validate(userScheme, data, callback);
			},
			function(data, callback) {
				db.insert(data, callback);
			},
			function(users, callback) {
				res.json({
					data: users
				});
			}
		], next);
	});

	app.put('/api/users/:_id', function(req, res, next) {
		var params = req.params;
		var data = req.body;
		console.log(params, data)

		async.waterfall([
			function(callback) {
				validate(idScheme, params, callback);
			},
			function(validatedParams, callback) {
				params = validatedParams;
				validate(userScheme, data, callback);
			},
			function(validatedData, callback) {
				data = validatedData;
				db.findOne({_id: params._id}, callback);
			},
			function(user, callback) {
				if (!user) {
					return callback(new errors.NotFoundError(
						'User not found: _id = ' + params._id
					));
				}

				db.update(
					{_id: params._id},
					data,
					{returnUpdatedDocs: true},
					callback
				);
			},
			function(user, callback) {
				res.json({
					data: user
				});
			}
		], next);
	});

	app['delete']('/api/users/:_id', function(req, res, next) {
		var params = req.params;

		async.waterfall([
			function(callback) {
				validate(idScheme, params, callback);
			},
			function(validatedParams, callback) {
				params = validatedParams;
				db.findOne({_id: params._id}, callback);
			},
			function(user, callback) {
				if (!user) {
					return callback(new errors.NotFoundError(
						'User not found: _id = ' + params._id
					));
				}

				db.remove({_id: params.id}, {}, callback);
			},
			function(user) {
				res.json({
					data: user
				});
			}
		], next);
	});
};
