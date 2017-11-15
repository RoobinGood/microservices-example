'use strict';

var async = require('async');
var _ = require('underscore');
var got = require('got');
var querystring = require('querystring');
var serviceRegistry = require('./serviceRegistry');

/*
 * @param {string} params.service
 * @param {string} params.path
 * @param {object} params.data
 * @param {object} [params.method] - request method, default "get"
 * @param {number} [params.retryCount]
 * @param {number} [params.retryTimeout] - time between retries in ms
 * @param {function} callback
 */
exports.serviceRequest = function(params, callback) {
	params = _({
		method: 'get',
		retryCount: 1,
		retryTimeout: 0
	}).extend(params);
	params.method = params.method.toLowerCase();

	async.waterfall([
		function(callback) {
			serviceRegistry.getServiceInfo({
				service: params.service
			}, callback);
		},
		function(serviceInfo, callback) {
			var masterNode = _(serviceInfo).findWhere({Node: 'master'});

			var url = {
				host: masterNode.ServiceAddress,
				port: masterNode.ServicePort,
				path: params.path
			};
			var options = {
				json: true,
				retries: params.retryCount
			};

			var data = params.data;
			if (params.method === 'get') {
				url.query = data;
			} else {
				options.body = data;
			}

			got[params.method](url, options, callback);
		}
	], function(err, result) {
		if (err) return callback(err);

		callback(null, result.data);
	});
};
