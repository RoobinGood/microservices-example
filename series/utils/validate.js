'use strict';

var _ = require('underscore');
var errors = require('../utils/errors');
var Ajv = require('ajv');

exports.validate = function(schema, doc, options, callback) {
	if (_(options).isFunction()) {
		callback = options;
		options = {};
	}

	options = _({
		coerceTypes: true,
		useDefaults: true
	}).extend(options);

	var ajv = new Ajv(options);
	var valid = ajv.validate(schema, doc);

	if (!valid) {
		return callback(new errors.ValidationError(ajv.errors));
	} else {
		callback(null, doc);
	}
};
