'use strict';

var Consul = require('consul');

exports.registry;

exports.init = function(config) {
	exports.registry = Consul(config);
};
