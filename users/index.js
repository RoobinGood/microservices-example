'use strict';

var async = require('async');

var initDb = require('./db').init;
var configManager = require('./config');
var serviceRegistry = require('./utils/serviceRegistry');

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

		app.use(require('./middlwares/logger'));
		app.use(bodyParser.urlencoded({
			extended: true
		}));
		app.use(bodyParser.json());

		require('./routes')(app);

		app.use(require('./middlwares/errorHandler'));

		var host = config.listen.host;
		var port = config.listen.port;
		console.info('Starting server on %s:%s', host, port);
		app.listen(port, host, callback);
	},
	function(callback) {
		serviceRegistry.init(config.serviceRegistry);

		serviceRegistry.registry.agent.service.register({
			name: config.name,
			address: config.listen.host,
			port: config.listen.port,
			tags: config.serviceRegistry.tags
		}, callback);
	},
	function() {
		console.info('Server started');
	}
], function(error) {
		console.log(arguments)
	console.error('Process failed: %s', error && error.stac);
});
