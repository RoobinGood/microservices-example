'use strict';

exports.config = {
	env: 'development',
	name: 'series',
	listen: {
		host: '127.0.0.1',
		port: 8001
	},
	db: {
		path: './data/series.nedb'
	},
	serviceRegistry: {
		host: '127.0.0.1',
		port: '8500',
		tags: [],
		healthcheck: {
			path: '/healthchecks/state',
			interval: '30s',
			deregistercriticalserviceafter: '120s'
		}
	},
	connectionsCountLimits: {
		critical: 1000,
		warn: 800
	}
};
