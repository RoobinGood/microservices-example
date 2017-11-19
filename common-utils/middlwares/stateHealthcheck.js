'use strict';

var async = require('async');

module.exports = function(params) {
	return function(req, res, next) {
		async.waterfall([
			function(callback) {
				var server = params.getServer();
				server.getConnections(callback);
			},
			function(connectionsCount) {
				var config = params.getConfig();

				if (connectionsCount > config.connectionsCountLimits.critical) {
					res.sendStatus(400);
				} else if (connectionsCount > config.connectionsCountLimits.warn) {
					// HTTP 429 - Too Many Requests
					res.sendStatus(429);
				} else {
					res.sendStatus(200);
				}
			}
		], next);
	};
};
