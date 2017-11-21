'use strict';

var configManager = require('../config');
var createStateHealthcheckMiddlware = require(
	'common-utils/middlwares/stateHealthcheck'
);

module.exports = function(app) {
	var config = configManager.get();

	app.get(
		config.serviceRegistry.healthcheck.path,
		createStateHealthcheckMiddlware({
			getServer: function() {
				return app.server;
			},
			getConfig: function() {
				return configManager.get();
			}
		})
	);
};