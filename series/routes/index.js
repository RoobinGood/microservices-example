'uise strict';

var _ = require('underscore');
var pathUtils = require('path');

module.exports = function(app) {
	_([
		'series', 'healthchecks'
	]).each(function(resourceName) {
		require(
			pathUtils.join(__dirname, resourceName)
		)(app);
	});
};
