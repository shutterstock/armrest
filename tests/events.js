var fs = require('fs');
var path = require('path');
var server = require('./setup/server');
var armrest = require('../lib');
var client = armrest.client({ host: 'localhost:59903', logLevel: 'OFF' });
var und = require('lodash');
var expectedKeys = ['statusCode', 'duration', 'method', 'url'];

exports.responseEventSuccess = function(test) {
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
			test.ok(response);
			test.ok(!err);
			test.deepEqual(data, { results: 42 }, 'we get back json for json');
			test.equal(responses.length, 1, 'response should be emitted once per request');
			test.equal(responses[0].statusCode, 200);
			test.equal(responses[0].method, 'GET');
			test.equal(responses[0].url, '/json');
			test.deepEqual(und.keys(responses[0]), expectedKeys, 'we get back response code, request duration, method name, url');
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
			test.equal(err.code, 'ETIMEDOUT', 'low timeout times out');
		},
		complete: function(err, response, data) {
			test.ok(!response);
			test.ok(!data);
			test.equal(err.code, 'ETIMEDOUT', 'low timeout times out');
			test.equal(responses.length, 1, 'response should be emitted once per request');
			test.equal(responses[0].statusCode, 'ETIMEDOUT');
			test.equal(responses[0].method, 'GET');
			test.equal(responses[0].url, '/timer-200ms');
			test.deepEqual(und.keys(responses[0]), expectedKeys, 'we get back response code, request duration, method name, url');
			test.done();
		}
	});
};

exports.responseEventPost = function(test) {
	var responses = [];

	client.on('response', function(args) {
		responses.push(args);
	});

	var originalPath = path.resolve('./tests/data/metro-armrest.png');
	var original = fs.readFileSync(originalPath);
	var originalSample = original.toString(null, 0, 16);

	client.post({
		url: '/content-upload',
		body: original,
		success: function(data) {

			var uploadPath = path.resolve('./tests/data/metro-armrest-upload.png');
			var upload = fs.readFileSync(uploadPath);
			var uploadSample = upload.toString(null, 0, 16);

			test.equals(original.length, upload.length, 'original is the same size as uploaded');
			test.equals(originalSample, uploadSample, 'original has the same sample data as uploaded');
			test.deepEqual(data, undefined, 'we get back an empty response');
			test.equal(responses.length, 1, 'response should be emitted once per request');
			test.equal(responses[0].statusCode, 200);
			test.equal(responses[0].method, 'POST');
			test.equal(responses[0].url, '/content-upload');

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

