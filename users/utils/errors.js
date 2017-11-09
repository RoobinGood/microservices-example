'use strict';

var _ = require('underscore');
var utilHelpers = require('util');

function BaseError(params) {
	params = params || {};
	if (_.isString(params)) params = {message: params};

	if (params.message) {
		this.message = params.message;
	}
}

utilHelpers.inherits(BaseError, Error);

BaseError.prototype.name = 'BaseError';
BaseError.prototype.message = 'An error occured';


function ServerError(params) {
	BaseError.apply(this, arguments);
}

utilHelpers.inherits(ServerError, BaseError);

ServerError.prototype.status = 500;
ServerError.prototype.name = 'ServerError';
ServerError.prototype.message = 'Unexpected server error';


function NotFoundError(params) {
	BaseError.apply(this, arguments);
}

utilHelpers.inherits(NotFoundError, BaseError);

NotFoundError.prototype.status = 404;
NotFoundError.prototype.name = 'NotFoundError';
NotFoundError.prototype.message = 'Not found error';


function BadRequestError(params) {
	BaseError.apply(this, arguments);
}

utilHelpers.inherits(BadRequestError, BaseError);

BadRequestError.prototype.status = 400;
BadRequestError.prototype.name = 'BadRequestError';
BadRequestError.prototype.message = 'Bad request error';


function ValidationError(params) {
	BadRequestError.apply(this, arguments);

	this.message = _(params).reduce(function(message, error) {
		if (message.length) {
			message += '\n';
		}

		message += [error.dataPath, error.message].join(' ');

		return message;
	}, '');
}

utilHelpers.inherits(ValidationError, BadRequestError);

ValidationError.prototype.name = 'ValidationError';


exports.BaseError = BaseError;
exports.ServerError = ServerError;
exports.NotFoundError = NotFoundError;
exports.BadRequestError = BadRequestError;
exports.ValidationError = ValidationError;
