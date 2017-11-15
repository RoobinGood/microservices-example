'use strict';

var _ = require('underscore');

exports.accumulateCallback = function(volume, callback) {
	var originalCallback = _(callback).once();

	var results = [null];
	callback = _(volume).after(function() {
		console.log('done')
		originalCallback.apply(null, results);
	});

	var index = 0;
	return function() {
		index++;

		return (function(currentIndex) {
			return function(err, result) {
				console.log(currentIndex, arguments)
				if (err) return originalCallback(err);

				if (results) results[currentIndex] = result;
				console.log(results)
				callback();
			};
		})(index);
	};
};
