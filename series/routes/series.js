'use strict';

var async = require('async');
var db = require('../db').db;

module.exports = function(app) {
	app.get('/api/series/:id', function(req, res, next) {
		async.waterfall([
			function(callback) {
				db.find({_id: 1}, callback)
			},
			function(series, callback) {
				if (series) {
					res.status(200);
					res.json({
						data: series
					});
				} else {
					res.status(404);
					res.json({
						message: 'sereis not found'
					});
				}
			}
		], next);
	});


};
