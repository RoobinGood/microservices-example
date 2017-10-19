'use strict';

module.exports = function(req, res, next) {
	console.log('%s %s %s', req.method, req.url, req.path);

	next();
};
