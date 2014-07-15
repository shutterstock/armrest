var server = require('./setup/server');
var armrest = require('../lib');
var client = armrest.client({ host: 'localhost:59903', logLevel: 'OFF' });

exports.getParams = function(test) {
	client.get({
		url: '/echo-query',
		params: { one: 1, two: 2 },
		success: function(data) {
			test.deepEqual(data, { one: 1, two: 2 }, 'got back what we sent as params');
			test.done();
		}
	});
};

exports.getQuery = function(test) {
	client.get({
		url: '/echo-query',
		query: { one: 1, two: 2 },
		success: function(data) {
			test.deepEqual(data, { one: 1, two: 2 }, 'got back what we sent as query');
			test.done();
		}
	});
};

exports.postParams = function(test) {
	client.post({
		url: '/echo-body',
		params: { one: 1, two: 2 },
		success: function(data) {
			test.deepEqual(data, { one: 1, two: 2 }, 'got back what we posted as params');
			test.done();
		}
	});
};

exports.postBody = function(test) {
	client.post({
		url: '/echo-body',
		body: { one: 1, two: 2 },
		success: function(data) {
			test.deepEqual(data, { one: 1, two: 2 }, 'got back what we posted as body');
			test.done();
		}
	});
};

exports.patchParams = function(test) {
	client.patch({
		url: '/echo-body',
		params: { one: 1, two: 2 },
		success: function(data) {
			test.deepEqual(data, { one: 1, two: 2 }, 'got back what we patched as params');
			test.done();
		}
	});
};

exports.patchBody = function(test) {
	client.patch({
		url: '/echo-body',
		body: { one: 1, two: 2 },
		success: function(data) {
			test.deepEqual(data, { one: 1, two: 2 }, 'got back what we patched as body');
			test.done();
		}
	});
};

exports.deleteParams = function(test) {
	client.delete({
		url: '/echo-query',
		params: { one: 1, two: 2 },
		success: function(data) {
			test.deepEqual(data, { one: 1, two: 2 }, 'got back what delete sent as params');
			test.done();
		}
	});
};

exports.deleteQuery = function(test) {
	client.delete({
		url: '/echo-query',
		query: { one: 1, two: 2 },
		success: function(data) {
			test.deepEqual(data, { one: 1, two: 2 }, 'got back what delete sent as query');
			test.done();
		}
	});
};

exports.interpolateParamsPost = function(test) {
	var params = { level: 'level', structure: 'structure' };
	client.post({
		url: '/multi/:level/:structure',
		params: params,
		success: function(data) {
			test.deepEqual(params, { level: 'level', structure: 'structure' }, 'params object is not modified');
			test.deepEqual(data, { level: 'level', structure: 'structure' }, 'got back interpolated values');
			test.done();
		}
	});
};

exports.interpolateParamsGet = function(test) {
	var params = { level: 'level', structure: 'structure' };
	client.get({
		url: '/multi/:level/:structure',
		params: params,
		success: function(data) {
			test.deepEqual(params, { level: 'level', structure: 'structure' }, 'params object is not modified');
			test.deepEqual(data, { level: 'level', structure: 'structure' }, 'got back interpolated values');
			test.done();
		}
	});
};

exports.interpolateParamsPartial = function(test) {
	client.get({
		url: '/multi/:level/:structure',
		params: { level: 'level' },
		success: function(data) {
			test.deepEqual(data, { level: 'level' }, 'uninterpolated values left alone');
			test.done();
		}
	});
};

exports.colons = function(test) {
	client.get({
		url: '/echo-query',
		params: { 'colon:param': 'unadulterated' },
		success: function(data) {
			test.deepEqual(data, { 'colon:param': 'unadulterated' }, 'got back interpolated values');
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
