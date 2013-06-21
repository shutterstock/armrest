var server = require('./lib/server');
var Client = require('../lib');
var client = new Client({ host: 'localhost:59903', auth: 'woo:hoo', logLevel: 'OFF' });

exports.auth = function(test) {
	client.get({
		url: '/json',
		success: function(data, response) {
			test.equal(response.request.href, 'http://' + client.auth + '@' + client.hostname + ':' + client.port + '/json', 'authorized');
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
