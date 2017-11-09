'use strict';

exports.config = {
	env: 'development',
	name: 'series',
	listen: {
		host: '127.0.0.1',
		port: '8001'
	},
	db: {
		path: './data/series.nedb'
	},
	serviceRegistry: {
		host: '127.0.0.1',
		port: '8500'
	}
};
