'use strict';

var errors = require('../utils/errors');

module.exports = function(err, req, res, next) {
	if (!res.headersSent) {
		var error;
		if (err instanceof errors.BaseError) {
			error = err;
		} else {
			error = new errors.ServerError({
				message: err.message
			});
		}

		res.status(error.status);
		res.json({
			name: error.name,
			message: error.message
		});
 	}

 	next();
};
