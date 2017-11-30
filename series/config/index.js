'use strict';

var pathUtils = require('path');

exports.get = function() {
	var env = process.env.NODE_ENV;
	var configPath;

	if (env === 'development') {
		configPath = pathUtils.join(__dirname, 'develop');
	} else {
		configPath = process.env.NODE_CONFIG_PATH;
	}

	return require(configPath).config;
};
