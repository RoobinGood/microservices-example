'use strict';

var _ = require('underscore');
var Consul = require('consul');
var async = require('async');
var Url = require('url');

exports.registry;

var servicesHash = {};

/*
 * @param {object} params.serviceRegistryConfig
 * @param {string} params.serviceConfig.name
 * @param {boolean} params.serviceConfig.listen.ssl
 * @param {string} params.serviceConfig.listen.host
 * @param {number} params.serviceConfig.listen.port
 * @param {string[]} params.serviceConfig.tags
 * @param {string[]} [params.services=[]]
 * @param {string} [params.check.path]
 * @param {string} [params.check.interval]
 */
exports.init = function(params, callback) {
	async.waterfall([
		function(callback) {
			exports.registry = Consul(
				params.serviceRegistryConfig
			);

			var serviceConfig = params.serviceConfig;

			var serviceInfo = {
				name: serviceConfig.name,
				address: serviceConfig.listen.host,
				port: Number(serviceConfig.listen.port),
				tags: serviceConfig.tags
			};
			serviceInfo.check = {
				name: params.check.name || 'serviceState',
				http: Url.format({
					protocol: serviceConfig.listen.ssl ? 'https:' : 'http:',
					hostname: serviceConfig.listen.host,
					port: serviceConfig.listen.port,
					pathname: params.check.path
				}),
				interval: params.check.interval
			};

			exports.registry.agent.service.register(serviceInfo, callback);
		},
		function(callback) {
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
