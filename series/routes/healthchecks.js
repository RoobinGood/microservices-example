'use strict';

var configManager = require('../config');
var createStateHealthcheckMiddlware = require(
	'common-utils/middlwares/stateHealthcheck'
);

module.exports = function(app) {
	app.get(
		'/healthchecks/state',
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