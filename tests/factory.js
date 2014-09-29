var server = require('./setup/server');
var armrest = require('../lib');

exports.simpleClient = function(test) {
	var client = armrest.client('localhost:59903');
	test.equal(client.hostname, 'localhost');
	test.equal(client.port, 59903);
	test.done();
};

exports.objectClient = function(test) {
	var client = armrest.client({ host: 'localhost:59903' });
	test.equal(client.hostname, 'localhost');
	test.equal(client.port, 59903);
	test.done();
};

exports.objectClientWithHostnamePort = function(test) {
	var client = armrest.client({ hostname: 'localhost', port: 59903 });
	test.equal(client.hostname, 'localhost');
	test.equal(client.port, 59903);
	test.done();
};

exports.objectClientWithBase = function(test) {
	var client = armrest.client({ base: 'localhost:59903/multi/level', logLevel: 'OFF' });
	test.equal(client.hostname, 'localhost');
	test.equal(client.port, 59903);
	test.equal(client.basePath, '/multi/level');
	client.get({
		url: '/structure',
		success: function(data, response) {
			test.deepEqual(data, { level: 'level', structure: 'structure' }, 'Added the base path to the request');
			test.done();
		},
	});
};

exports.constructor = function(test) {
	try {
		var client = new armrest();
	} catch (e) {
		test.equal(e.constructor, TypeError, 'Cannot new up an instance');
		test.equal(client, undefined, 'Cannot new up an instance');
		test.done();
	}
};

exports.setUp = function(callback) {
	server.listen(59903, null, null, callback);
};

/*
 * Trap the exception thrown if server.close is thrown on a server that is not
 * running
 */
exports.tearDown = function(callback) {
	try {
		server.close(callback);
	} catch (e) {
		callback();
	}
};
