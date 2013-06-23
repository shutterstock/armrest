var armrest = require('../lib');

exports.simple = function(test) {
	var client = armrest.client('localhost:59903');
	test.equal(client.hostname, 'localhost');
	test.equal(client.port, 59903);
	test.done();
};

exports.object = function(test) {
	var client = armrest.client({ host: 'localhost:59903' });
	test.equal(client.hostname, 'localhost');
	test.equal(client.port, 59903);
	test.done();
};
