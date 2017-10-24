'use strict';

exports.config = {
	env: 'development',
	listen: {
		host: '127.0.0.1',
		port: '8001'
	},
	db: {
		path: './data/series.nedb'
	}
};
