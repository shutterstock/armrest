var fs = require('fs');
var path = require('path');
var server = require('./setup/server');
var armrest = require('../lib');
var client = armrest.client({ host: 'localhost:59903', logLevel: 'OFF' });

exports.postBuffer = function(test) {

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

