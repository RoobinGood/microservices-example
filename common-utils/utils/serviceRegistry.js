'use strict';

var _ = require('underscore');
var Consul = require('consul');
var async = require('async');

exports.registry;

var servicesHash = {};

exports.init = function(params, callback) {
	async.waterfall([
		function(callback) {
			exports.registry = Consul(
				params.serviceRegistryConfig
			);

			exports.registry.agent.service.register(
				params.serviceInfo, callback
			);
		},
		function() {
			_(params.services).each(function(serviceName) {
				servicesHash[serviceName] = null;
			});

			exports.getServicesInfo(callback);
		}
	], function(err) {
		setInterval(function() {
			exports.getServicesInfo()
		}, 3 * 60 * 1000);

		callback(err);
	});
};

exports.getServiceInfo = function(params, callback) {
	var serviceName = params.service;

	async.waterfall([
		function(callback) {
			if (!_(servicesHash).has(serviceName)) {
				return callback(new Error(
					'Service "' + serviceName + '" is not available for current service'
				));
			}

			var serviceInfo = servicesHash[serviceName];

			if (serviceInfo) {
				callback(null, serviceInfo)
			} else {
				exports.registry.catalog.service.nodes({
					service: serviceName
				}, callback);
			}
		}
	], function(err, serviceInfo) {
		if (err) return callback(err);

		servicesHash[serviceName] = serviceInfo;
		callback(null, serviceInfo);
	});
};

exports.getServicesInfo = function(callback) {
	callback = callback || _.noop;
	async.each(
		_(servicesHash).keys(),
		function(serviceName, callback) {
			exports.getServiceInfo({
				service: serviceName
			}, function(err, serviceInfo) {
				servicesHash[serviceName] = serviceInfo;
				callback();
			});
		},
		callback
	);
};
