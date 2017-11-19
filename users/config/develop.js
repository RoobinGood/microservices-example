'use strict';

exports.config = {
	env: 'development',
	name: 'users',
	listen: {
		host: '127.0.0.1',
		port: 8002
	},
	db: {
		path: './data/users.nedb'
	},
	serviceRegistry: {
		host: '127.0.0.1',
		port: '8500',
		tags: []
	},
	connectionsCountLimits: {
		critical: 1000,
		warn: 800
	}
};
