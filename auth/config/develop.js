'use strict';

exports.config = {
	env: 'development',
	name: 'auth',
	listen: {
		host: '127.0.0.1',
		port: 8002
	},
	db: {
		path: './data'
	},
	secret: 'my-very-secure-secret-only-for-development',
	serviceRegistry: {
		host: '127.0.0.1',
		port: '8500',
		tags: []
	}
};
