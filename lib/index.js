var events = require('events');
var request = require('request');
var querystring = require('querystring');
var url = require('url');
var log4js = require('log4js');
var und = require('lodash');
var util = require('util');

/*
 * Default content serializer for HTTP requests and responses
 */
var defaultSerializer = {
	contentType: 'application/json',
	serialize: JSON.stringify,
	deserialize: JSON.parse
};

/*
 * Default parameters to use in client requests
 */
var requestDefaults = {};

/*
 * Client constructor
 */
var Client = function(args) {

	args = typeof args === 'string' ? { base: args } : args;

	this.log = args.logger;

	if (!this.log) {
		var logLevel = args.logLevel || process.env.LOG_LEVEL || 'info';
		this.log = log4js.getLogger('armrest');
		this.log.setLevel(logLevel.toUpperCase());
	}

	if (args.base) {

		// tack on a scheme if it wasn't supplied
		var base = args.base;
		if (!base.match(/^https?:\/\//)) {
			base = 'http://' + base;
		}

		var urlComponents = url.parse(base);
		this.protocol = urlComponents.protocol || 'http';
		this.auth = urlComponents.auth;
		this.hostname = urlComponents.hostname;
		this.port = urlComponents.port;

	} else {

		this.protocol = args.protocol || 'http';
		this.auth = args.auth;
		if (args.host) {
			this.hostname = args.host.split(':')[0];
			this.port = args.host.split(':')[1];
		} else {
			this.hostname = args.hostname;
			this.port = args.port;
		}

	}

	this.serializer = args.serializer || defaultSerializer;
	this.timeout = args.timeout;
	this.headers = args.headers || {};
	this.request = request.defaults();

};

util.inherits(Client, events.EventEmitter);

/*
 * Add HTTP methods to the Client prototype
 */
['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'DELETE', 'OPTIONS'].forEach(function(method) {

	var instanceMethod = method.toLowerCase();

	Client.prototype[instanceMethod] = function(args) {

		var originalArgs = und.clone(args);
		args.headers = args.headers || {};
		und.defaults(args.headers, this.headers, requestDefaults.headers);

		var query = und.cloneDeep(args.query) || {};
		var requestBody = args.body || {};

		// divvy up request parameters according to convention

		if (instanceMethod === 'get' || instanceMethod === 'head') {
			und.extend(query, args.params);
		}

		if (instanceMethod === 'post' || instanceMethod === 'put' || instanceMethod === 'patch') {
			und.extend(requestBody, args.params);
			if (Buffer.isBuffer(requestBody)) {
				args.body = requestBody;
			} else {
				args.headers['Content-Type'] = this.serializer.contentType;
				args.body = this.serializer.serialize(requestBody);
			}
		}

		// put together the URL

		var pathname = args.url.replace(/\/:(\w+)/g, function(match, name) {
			var value;
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
		args.timeout = args.timeout || this.timeout || requestDefaults.timeout;

		// set up callbacks

		var success = args.success || function() {};
		var error = args.error || function() {};
		var complete = args.complete || function() {};
		var canRespondSuccess = args.success || args.complete;
		var canRespondError = args.error || args.complete;

		var startTime = new Date();
		var log = this.log;
		log.debug(instanceMethod.toUpperCase() + ' ' + requestURL + ' (request)');

		// make the request

		this.request(args, function(err, response, body) {

			var requestDuration = new Date() - startTime;
			var requestMethod = instanceMethod.toUpperCase();
			var data = body;
			var statusCode = response && response.statusCode || err && err.code || 'unknown';
			this.emit('response', und.extend({statusCode: statusCode, duration: requestDuration, method: requestMethod}, und.pick(originalArgs, ['url'])));

			// attempt deserialization

			if (typeof(body) === 'string') {
				if (body.trim().length === 0) {
					data = undefined;
				} else {
					try {
						data = this.serializer.deserialize(body);
					}
					catch (e) {
						err = new Error('Could not deserialize data: ' + (body || '').substring(0, 40));
					}
				}
			}

			// Handle callbacks

			if (!response) {
				log.warn(requestMethod + ' ' + requestURL + ' ' + requestDuration + 'ms ' + err);
				if (!canRespondError) {
					log.warn('No error/complete handler provided');
				}
				error(err, null);
				return complete(err, response, data);
			}

			var responseClass = Math.floor(response.statusCode / 100) * 100;

			if (err || responseClass !== 200) {

				err = err || data;

				var message = [body, err].filter(function(m) { return m; }).join(' | ');
				log.warn(requestMethod + ' ' + requestURL + ' ' + response.statusCode + ' ' + requestDuration + 'ms ' + message);
				if (!canRespondError) {
					log.warn('No error/complete handler provided');
				}
				error(err, response);
				return complete(err, response, data);

			} else {

				log.info(requestMethod + ' ' + requestURL + ' ' + response.statusCode + ' ' + requestDuration + 'ms');
				if (!canRespondSuccess) {
					log.warn('No success/complete handler provided');
				}
				success(data, response);
				return complete(err, response, data);

			}

		}.bind(this));
	};

});

/*
 * Creates a single instance of the client from a configuration object
 */
function configure(name, service) {
	if (!name) {
		throw new Error('Please specify a name for the client');
	}
	if (name === 'configure' || name === 'client') {
		throw new Error('Cannot register service with reserved name: ' + name);
	}
	module.exports[name] = new Client(service);
}

/*
 * Creates multiple instances of the client from a configuration object
 */
function configureBulk(services) {
	for (var name in services) {
		configure(name, services[name]);
	}
}

/*
 * Public interface for creating instances
 */
module.exports = {
	configure: function() {
		arguments.length === 2 && configure(arguments[0], arguments[1]);
		arguments.length === 1 && configureBulk(arguments[0]);
	},
	client: function(args) {
		var client = new Client(args);
		return client;
	},
	setDefaults: function(args) {
		requestDefaults = und.pick(args, 'timeout', 'headers');
	},
	clearDefaults: function() {
		requestDefaults = {};
	}
};
