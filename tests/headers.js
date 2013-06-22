var server = require('./setup/server');
var Client = require('../lib');

exports.configureHeaders = function(test) {
	var config = {
		host: 'localhost:59903',
		logLevel: 'OFF',
		headers: {
			'user-agent': 'beardly'
		}
	};
	var client = new Client(config);
	client.get({
		url: '/json',
		complete: function(err, response) {
			test.ok(response);
			test.ok(response.req._headers);
			test.equals(response.req._headers['User-Agent'], config.headers['User-Agent'], 'Sent header');
			test.done();
		}
	});
};

exports.overrideHeaders = function(test) {
	test.fail(true);
	test.done();
};

exports.callPostWithHeaders = function(test) {
	test.fail(true);
	test.done();
};

exports.callGetWithHeaders = function(test) {
	test.fail(true);
	test.done();
};

exports.setUp = function(callback) {
	server.listen(59903, null, null, callback);
};

exports.tearDown = function(callback) {
	server.close(callback);
};

