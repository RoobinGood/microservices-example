'use strict';

var async = require('async');

var initDb = require('./db').init;
var configManager = require('./config');
var serviceRegistry = require('common-utils/utils/serviceRegistry');

var express = require('express');
var bodyParser = require('body-parser');

var app;
var config;

async.waterfall([
	function(callback) {
		config = configManager.get();

		initDb(config.db, callback);
	},
	function(callback) {
		app = express();

		app.use(require('common-utils/middlwares/logger'));
		app.use(bodyParser.urlencoded({
			extended: true
		}));
		app.use(bodyParser.json());

		require('./routes')(app);

		app.use(require('common-utils/middlwares/errorHandler'));

		var host = config.listen.host;
		var port = config.listen.port;
		console.info('Starting server on %s:%s', host, port);
		var server = app.listen(port, host, callback);
		app.server = server;
	},
	function(callback) {
		serviceRegistry.init({
			serviceRegistryConfig: config.serviceRegistry,
			serviceConfig: {
				name: config.name,
				listen: config.listen,
				tags: config.serviceRegistry.tags
			},
			services: [],
			check: config.serviceRegistry.healthcheck
		}, callback);
	},
	function() {
		console.info('Server started');
	}
], function(error) {
	console.error('Process failed: %s', error && error.stac);
});
