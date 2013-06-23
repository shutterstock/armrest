var server = require('./setup/server');
var armrest = require('../lib');

exports.configureHeaders = function(test) {
	var config = {
		host: 'localhost:59903',
		logLevel: 'OFF',
		headers: {
			'user-agent': 'beardly'
		}
	};
	var client = armrest.client(config);
	client.get({
		url: '/json',
		complete: function(err, response) {
			test.ok(response);
			test.equals(response.req._headers['user-agent'], config.headers['user-agent'], 'Sent user header');
			test.done();
		}
	});
};

exports.overrideHeaders = function(test) {
	var config = {
		host: 'localhost:59903',
		logLevel: 'OFF',
		headers: {
			'user-agent': 'beardly',
			'secret-agent': 'chet manly'
		}
	};
	var client = armrest.client(config);
	client.get({
		url: '/json',
		headers: {
			'secret-agent': 'sterling mallory archer'
		},
		complete: function(err, response) {
			test.ok(response);
			test.equals(response.req._headers['user-agent'], config.headers['user-agent'], 'Sent user agent header');
			test.equals(response.req._headers['secret-agent'], 'sterling mallory archer', 'Sent secret agent header');
			test.done();
		}
	});
};

exports.setUp = function(callback) {
	server.listen(59903, null, null, callback);
};

exports.tearDown = function(callback) {
	server.close(callback);
};
