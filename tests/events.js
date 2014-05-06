var fs = require('fs');
var path = require('path');
var server = require('./setup/server');
var armrest = require('../lib');
var client = armrest.client({ host: 'localhost:59903', logLevel: 'OFF' });
var und = require('lodash');

exports.responseEventSuccess= function(test) {
	var timesResponseEmitted = 0;
	var timesNetworkErrorEmitted = 0;
	var responseArgs;
	var networkErrorArgs;

	client.on('HttpResponse', function(args) {
		timesResponseEmitted++;
		responseArgs = args;
	});

	client.on('NetworkError', function(args) {
		timesNetworkErrorEmitted++;
		networkErrorArgs = args;
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
			test.equal(timesResponseEmitted, 1, 'response should be emitted once per request');
			test.equal(timesNetworkErrorEmitted, 0, 'No network error');
			test.deepEqual(und.keys(responseArgs), [ 'statusCode', 'duration', 'method', 'url' ], 'we get back response code, request duration, method name, url');
			test.equal(responseArgs['statusCode'], 200);
			test.equal(responseArgs['method'], 'GET');
			test.equal(responseArgs['url'], '/json');
	  	test.done();
		}
	});
};

exports.responseEventTimeout= function(test) {
	var timesResponseEmitted = 0;
	var timesNetworkErrorEmitted = 0;
	var responseArgs;
	var networkErrorArgs;

	client.on('HttpResponse', function(args) {
		timesResponseEmitted++;
		responseArgs = args;
	});

	client.on('NetworkError', function(args) {
		timesNetworkErrorEmitted++;
		networkErrorArgs = args;
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
			test.equal(timesResponseEmitted, 0, 'should not emit response event when there is a newtwork error');
			test.equal(timesNetworkErrorEmitted, 1, 'Should emit network-error event once');
			test.deepEqual(und.keys(networkErrorArgs), [ 'statusCode', 'duration', 'method', 'url' ], 'we get back response code, request duration, method name, url');
			test.equal(networkErrorArgs['statusCode'], 'ETIMEDOUT');
			test.equal(networkErrorArgs['method'], 'GET');
			test.equal(networkErrorArgs['url'], '/timer-200ms');
			test.done();
		}
	});
};

exports.responseEventPost = function(test) {
	var timesResponseEmitted = 0;
	var timesNetworkErrorEmitted = 0;
	var responseArgs;
	var networkErrorArgs;

	client.on('HttpResponse', function(args) {
		timesResponseEmitted++;
		responseArgs = args;
	});

	client.on('NetworkError', function(args) {
		timesNetworkErrorEmitted++;
		networkErrorArgs = args;
	});

	var originalPath = path.resolve('./tests/data/metro-armrest.png');
	var original = fs.readFileSync(originalPath);
	var originalSample = original.toString(null, 0, 16);

	client.post({
		url: '/content-upload',
		body: original,
		success: function(data, response) {

			var uploadPath = path.resolve('./tests/data/metro-armrest-upload.png');
			var upload = fs.readFileSync(uploadPath);
			var uploadSample = upload.toString(null, 0, 16);

			test.equals(original.length, upload.length, 'original is the same size as uploaded');
			test.equals(originalSample, uploadSample, 'original has the same sample data as uploaded');
			test.deepEqual(data, undefined, 'we get back an empty response');
			test.equal(timesResponseEmitted, 1, 'response should be emitted once per request');
			test.equal(timesNetworkErrorEmitted, 0, 'No network error');
			test.deepEqual(und.keys(responseArgs), [ 'statusCode', 'duration', 'method', 'url' ], 'we get back response code, request duration, method name, url');
			test.equal(responseArgs['statusCode'], 200);
			test.equal(responseArgs['method'], 'POST');
			test.equal(responseArgs['url'], '/content-upload');

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

