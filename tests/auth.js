var server = require('./setup/server');
var armrest = require('../lib');

exports.authPropertyString = function(test) {
	var client = armrest.client({ 
		host: 'localhost:59903', 
		auth: 'woo:hoo',
		logLevel: 'OFF'
	});
	client.get({
		url: '/auth',
		success: function(data, response) {
			test.equal(data.username, 'woo', 'has username');
			test.equal(data.password, 'hoo', 'has password');
			test.ok(response.request.headers.authorization, 'has auth headers');
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
		url: '/auth',
		success: function(data, response) {
			test.equal(data.username, 'woo', 'has username');
			test.equal(data.password, 'hoo', 'has password');
			test.ok(response.request.headers.authorization, 'has auth headers');
			test.done();
		}
	});
};

exports.authBase = function(test) {
	var client = armrest.client({ 
		base: 'woo:hoo@localhost:59903', 
		logLevel: 'OFF'
	});
	client.get({
		url: '/auth',
		success: function(data, response) {
			test.equal(data.username, 'woo', 'has username');
			test.equal(data.password, 'hoo', 'has password');
			test.ok(response.request.headers.authorization, 'has auth headers');
			test.done();
		}
	});
};

exports.authArgsString = function(test) {
	var client = armrest.client({ 
		base: 'localhost:59903', 
		logLevel: 'OFF'
	});
	client.get({
		url: '/auth',
		auth: 'woo:hoo', 
		success: function(data, response) {
			test.equal(data.username, 'woo', 'has username');
			test.equal(data.password, 'hoo', 'has password');
			test.ok(response.request.headers.authorization, 'has auth headers');
			test.done();
		}
	});
};

exports.authArgsObject = function(test) {
	var client = armrest.client({ 
		base: 'localhost:59903', 
		logLevel: 'OFF'
	});
	client.get({
		url: '/auth',
		auth: { 
			username: 'woo',
			password: 'hoo'
		}, 
		success: function(data, response) {
			test.equal(data.username, 'woo', 'has username');
			test.equal(data.password, 'hoo', 'has password');
			test.ok(response.request.headers.authorization, 'has auth headers');
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
