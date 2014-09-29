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
	var client = armrest.client({ hostname: 'localhost', port: 8675 });
	test.equal(client.hostname, 'localhost');
	test.equal(client.port, 8675);
	test.done();
};

exports.objectClientWithBase= function(test) {
	var client = armrest.client({ base: 'localhost:8675' });
	test.equal(client.hostname, 'localhost');
	test.equal(client.port, 8675);
	test.done();
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
