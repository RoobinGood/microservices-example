'use strict';

exports.config = {
	env: 'development',
	name: 'users',
	listen: {
		host: '127.0.0.1',
		port: '8002'
	},
	db: {
		path: './data/users.nedb'
	}
};
