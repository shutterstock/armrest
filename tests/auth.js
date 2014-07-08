var server = require('./setup/server');
var armrest = require('../lib');

exports.authPropertyString = function(test) {
	var client = armrest.client({ 
		host: 'localhost:59903', 
		auth: 'woo:hoo',
		logLevel: 'OFF'
	});
	client.get({
		url: '/json',
		success: function(data, response) {
			test.equal(response.request.href, 'http://' + client.auth + '@' + client.hostname + ':' + client.port + '/json', 'authorized');
			test.done();
		}
	});
};

exports.authPropertyObject = function(test) {
	var client = armrest.client({ 
		host: 'localhost:59903',
		auth: { 
			username: 'woo',
			password: 'hoo'
		}, 
		logLevel: 'OFF'
	});
	client.get({
		url: '/json',
		success: function(data, response) {
			test.equal(response.request.href, 'http://' + client.auth + '@' + client.hostname + ':' + client.port + '/json', 'authorized');
			test.done();
		}
	});
};

exports.authBase = function(test) {
	var client = armrest.client({ 
		base: 'who:hoo@localhost:59903', 
		logLevel: 'OFF'
	});
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
