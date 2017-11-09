'use strict';

var async = require('async');

var initDb = require('./db').init;
var configManager = require('./config');

var express = require('express');
var bodyParser = require('body-parser');
var serviceRegistry = require('./utils/serviceRegistry');

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
	function() {
		serviceRegistry.init(config.serviceRegistry);

		console.info('Server started');
	}
], function(error) {
	console.error('Process failed: %s', error && error.stac);
});
