'use strict';

var async = require('async');
var _ = require('underscore');
var db = require('../db').db;
var errors = require('common-utils/utils/errors');
var validate = require('common-utils/utils/validate').validate;
var serviceRequest = require('common-utils/utils/serviceRequest').serviceRequest;
var accumulateCallback = require('common-utils/utils/async').accumulateCallback;


var tokenScheme = {
	type: 'object',
	properties: {
		_id: {
			type: 'string'
		}
	},
	required: ['_id'],
	additionalProperties: false
};

module.exports = function(app) {
	app.get('/api/tokens/:_id', function(req, res, next) {
		var params = req.params;

		async.waterfall([
			function(callback) {
				validate(tokenScheme, params, callback);
			},
			function(validatedParams, callback) {
				params = validatedParams;
				db.tokens.findOne({_id: params._id}, callback);
			},
			function(token, series) {
				res.json({
					data: token
				});
			}
		], next);
	});
};
