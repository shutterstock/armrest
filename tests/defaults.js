var server = require('./setup/server');
var armrest = require('../lib');
var und = require('underscore');

und.extend(armrest.clientDefaults, {
	timeout: 1000,
	headers: {
		'user-agent': 'armrest-test'
	}
});

var client = armrest.client({
	host: 'localhost:59903',
	logLevel: 'OFF'
});

exports.setUp = function(callback) {
	server.listen(59903, null, null, callback);
};

exports.tearDown = function(callback) {
	server.close(callback);
};

// Confirm request gets sent with the default headers
exports.testDefaults = function(test) {
	client.get({
		url: '/json',
		complete: function(err, response) {
			test.ok(response);
			test.equals(response.req._headers['user-agent'], 'armrest-test', 'Sent default user agent');
			test.done();
		}
	});
};

// Conform we can override the default headers
exports.testOverrideDefaults = function(test) {
	client.get({
		url: '/json',
		headers: {
			'user-agent': 'test-driver'
		},
		complete: function(err, response) {
			test.ok(response);
			test.equals(response.req._headers['user-agent'], 'test-driver', 'Overrided default user agent');
			test.done();
		}
	});
};

// Confirm that response time is close to timeout
exports.testTimeoutDefault = function(test) {
	var start = new Date().getTime();
	client.get({
		url: '/timer-5000ms',
		complete: function(err, response) {
			test.ok(new Date().getTime() - start <= 1500);
			test.done();
		}
	});
};
