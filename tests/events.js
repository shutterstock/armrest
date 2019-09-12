var server = require('./setup/server');
var armrest = require('../lib');
var client = armrest.client({ host: 'localhost:59903', logLevel: 'OFF' });
var und = require('lodash');
var baseKeys = ['statusCode', 'duration', 'method', 'url'];
var extendedKeys = baseKeys.concat(['params']);

exports.responseEventGet = function(test) {
	var responses = [];

	client.on('response', function(args) {
		responses.push(args);
	});

	client.get({
		url: '/json',
		success: function(data) {
			test.deepEqual(data, { results: 42 }, 'we get back json for json');
		},
		complete: function(err, response, data) {
			test.equal(err, null);
			test.equal(response.body, '{ "results": 42 }');
			test.deepEqual(data, { results: 42 });
			test.equal(responses.length, 1, 'response should be emitted once per request');
			test.equal(responses[0].statusCode, 200);
			test.equal(responses[0].method, 'GET');
			test.equal(responses[0].url, '/json');
			test.ok(responses[0].duration > 1);
			test.deepEqual(und.keys(responses[0]), baseKeys, 'we get back expected keys');
			test.done();
		}
	});
};

exports.responseEventTimeout = function(test) {
	var responses = [];

	client.on('response', function(args) {
		responses.push(args);
	});

	client.get({
		url: '/timer-200ms',
		timeout: 100,
		error: function(err, response) {
			test.ok(!response);
			test.equal(err.code, 'ESOCKETTIMEDOUT', 'low timeout times out');
		},
		complete: function(err, response, data) {
			test.equal(err.message, 'ESOCKETTIMEDOUT');
			test.equal(response, undefined);
			test.equal(data, undefined);
			test.equal(responses.length, 1, 'response should be emitted once per request');
			test.equal(responses[0].statusCode, 'ESOCKETTIMEDOUT');
			test.equal(responses[0].method, 'GET');
			test.equal(responses[0].url, '/timer-200ms');
			test.ok(responses[0].duration > 1);
			test.deepEqual(und.keys(responses[0]), baseKeys, 'we get back expected keys');
			test.done();
		}
	});
};

exports.responseEventPost = function(test) {
	var responses = [];
	var params = { level: 'level', structure: 'structure' };

	client.on('response', function(args) {
		responses.push(args);
	});

	client.post({
		url: '/multi/:level/:structure',
		params: params,
		success: function(data) {
			test.deepEqual(data, { level: 'level', structure: 'structure' });
			test.equal(responses.length, 1, 'response should be emitted once per request');
			test.equal(responses[0].statusCode, 200);
			test.equal(responses[0].method, 'POST');
			test.equal(responses[0].url, '/multi/:level/:structure');
			test.ok(responses[0].duration > 1);
			test.deepEqual(responses[0].params, params);
			test.deepEqual(und.keys(responses[0]), extendedKeys, 'we get back expected keys');
			test.done();
		}
	});
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
