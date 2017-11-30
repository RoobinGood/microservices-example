'use strict';

exports.config = {
	env: 'development',
	name: 'auth',
	listen: {
		host: '127.0.0.1',
		port: 8003
	},
	db: {
		path: './data'
	},
	secret: 'my-very-secure-secret-only-for-development',
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
