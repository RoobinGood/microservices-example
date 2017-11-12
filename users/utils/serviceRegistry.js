'use strict';

var _ = require('underscore');
var Consul = require('consul');
var async = require('async');

exports.registry;

var servicesList = [
	'series'
];
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
			exports.getServicesInfo(callback);
		}
	], function() {
		setInterval(function() {
			exports.getServicesInfo()
		}, 3 * 60 * 1000);

		callback();
	});
};

exports.getServiceInfo = function(params, callback) {
	var serviceName = params.service;

	async.waterfall([
		function(callback) {
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
		servicesList,
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
