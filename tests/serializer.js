var fs = require('fs');
var path = require('path');
var server = require('./setup/server');
var armrest = require('../lib');
var client = armrest.client({ host: 'localhost:59903', logLevel: 'OFF' });

var originalPath = path.resolve('./tests/data/metro-armrest.png');
var original = fs.readFileSync(originalPath);
var originalSample = original.toString(undefined, 0, 16);

exports.postBuffer = function(test) {
	client.post({
		url: '/content-upload',
		body: original,
		success: function(data) {
			var uploadPath = path.resolve('./tests/data/metro-armrest-upload.png');
			var upload = fs.readFileSync(uploadPath);
			var uploadSample = upload.toString(undefined, 0, 16);
			test.equals(original.length, upload.length, 'original is the same size as uploaded');
			test.equals(originalSample, uploadSample, 'original has the same sample data as uploaded');
			test.deepEqual(data, undefined, 'we get back an empty response');
			test.done();
		}
	});
};

exports.getBuffer = function(test) {
	client.get({
		url: '/content-download',
		encoding: null,
		success: function(download) {
			var downloadSample = download.toString(undefined, 0, 16);
			var downloadPath = path.resolve('./tests/data/metro-armrest-download.png');
			var downloadStream = fs.createWriteStream(downloadPath);
			downloadStream.write(download);
			test.equals(original.length, download.length, 'original is the same size as downloaded');
			test.equals(originalSample, downloadSample, 'original has the same sample data as downloaded');
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

