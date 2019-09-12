var server = require('./setup/server');
var armrest = require('../lib');
var client = armrest.client({ host: 'localhost:59903', logLevel: 'OFF' });

exports.getConnectionRefused = function(test) {
	server.close(function () {
		client.get({
			url: '/json',
			error: function(err, response) {
				test.ok(!response);
				test.equal(err.code, 'ECONNREFUSED', 'connection refused for no server running');
			},
			complete: function(err, response, data) {
				test.ok(!response);
				test.ok(!data);
				test.equal(err.code, 'ECONNREFUSED', 'connection refused for no server running');
				test.done();
			}
		});
	});
};

exports.setUp = function(callback) {
	server.listen(59903, null, null, callback);
};
