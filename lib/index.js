var request = require('request');
var util = require('util');
var querystring = require('querystring');
var url = require('url');
var log4js = require('log4js');

var jsonSerializer = {
	contentType: 'application/json',
	serialize: JSON.stringify,
	deserialize: JSON.parse
};

var extend = function(destination, source) {
	for (var property in source) {
		destination[property] = source[property];
	}
	return destination;
};

var Client = function(args) {

	args = typeof args === 'string' ? { base: args } : args;

	this.log = args.logger;

	if (!this.log) {
		var logLevel = args.logLevel || process.env.LOG_LEVEL || 'info';
		this.log = log4js.getLogger('rest-client');
		this.log.setLevel(logLevel.toUpperCase());
	}

	if (args.base) {

		// tack on a scheme if it wasn't supplied

		if (! args.base.match(/^https?:\/\//)) {
			args.base = 'http://' + args.base;
		}

		var urlComponents = url.parse(args.base);
		this.protocol = urlComponents.protocol || 'http';
		this.auth = urlComponents.auth;
		this.hostname = urlComponents.hostname;
		this.port = urlComponents.port;

	} else {

		this.protocol = args.protocol || 'http';
		this.auth = args.auth;
		this.hostname = args.host.split(':')[0];
		this.port = args.host.split(':')[1];

	}

	this.serializer = args.serializer || jsonSerializer;
	this.timeout = args.timeout;
	this.request = request.defaults();

};

var methods = ['GET', 'POST', 'PUT', 'HEAD', 'DELETE', 'OPTIONS'];

methods.forEach( function(method) {

	var instanceMethod = method.toLowerCase();

	Client.prototype[instanceMethod] = function(args, callback) {

		var log = this.log;
		var query = args.query || {};
		var requestBody = args.body || {};

		// divvy up request parameters according to convention

		if (instanceMethod === 'get' || instanceMethod === 'head') {
			extend(query, args.params);
		}

		if (instanceMethod === 'post' || instanceMethod === 'put') {
			extend(requestBody, args.params);
			args.headers = args.headers || {};
			args.headers['Content-Type'] = this.serializer.contentType;
			args.body = this.serializer.serialize(requestBody);
		}

		// put together the URL

		var pathname = args.url.replace(/\/:(\w+)/g, function(match, name) {

			if (query[name]) {
				value = query[name];
				delete query[name];
			} else {
				value = ':' + name;
			}
			return '/' + value;
		});

		var requestURL = url.format({
			protocol: this.protocol,
			auth: this.auth,
			hostname: this.hostname,
			port: this.port,
			pathname: pathname,
			search: querystring.stringify(query)
		});

		// set request options

		args.method = method;
		args.url = requestURL;
		args.timeout = args.timeout || this.timeout;

		// set up callbacks

		var success = args.success || function() {};
		var error = args.error || function() {};
		var complete = args.complete || function() {};
		var canRespondSuccess = args.success || args.complete;
		var canRespondError = args.error || args.complete;

		var startTime = new Date();
		log.debug(instanceMethod.toUpperCase() + " " + requestURL + " (request)");

		// make the request

		this.request(args, function(err, response, body) {

			var requestDuration = new Date() - startTime;
			var requestMethod = instanceMethod.toUpperCase();
			var data = body;

			if (typeof body === 'string') {
				try {
					data = this.serializer.deserialize(body);
				}
				catch (e) {
					err = "couldn't parse data: " + (body || "").substring(0, 40);
				}
			}

			if (!response) {
				log.warn(requestMethod + " " + requestURL + " " + requestDuration + "ms " + err);
				if (!canRespondError) {
					log.warn('No error/complete handler provided');
				}
				error({ error: err });
				return complete(data, response, err);
			}

			var responseClass = (response.statusCode / 100 | 0) * 100;

			if (err || responseClass !== 200) {

				var message = [body, err].filter(function(m) { return m; }).join(' | ');
				log.warn(requestMethod + " " + requestURL + " " + response.statusCode + " " + requestDuration + "ms " + message);
				if (!canRespondError) {
					log.warn('No error/complete handler provided');
				}
				error(data, response, err);
				return complete(data, response, err);

			} else {

				log.info(requestMethod + " " + requestURL + " " + response.statusCode + " " + requestDuration + "ms");
				if (!canRespondSuccess) {
					log.warn('No success/complete handler provided');
				}
				success(data, response);
				return complete(err, response, data);

			}

		}.bind(this) );
	};
});

Client._configure = function(name, service) {
	if (!name) {
		throw new Error("please specify a name for the REST client");
	}
	if (name === 'configure') {
		throw new Error("can't register service with reserved name: " + name);
	}
	Client[name] = new Client(service);
};

Client._configure_bulk = function(services) {
	for (var name in services) {
		Client._configure(name, services[name]);
	}
};

Client.configure = function() {
	arguments.length === 2 && Client._configure.apply(this, arguments);
	arguments.length === 1 && Client._configure_bulk.apply(this, arguments);
};

Client.client = function(args) {
	var client = new Client(args);
	return client;
};

module.exports = Client;
