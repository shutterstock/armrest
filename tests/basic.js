var server = require('./lib/server');
var Client = require('../lib');
var client = new Client({ host: 'localhost:59903', logLevel: 'OFF' });

exports.json = function(test) {
	client.get({
		url: '/json',
		success: function(data) {
			test.deepEqual(data, { results: 42 }, "we get back json for json");
		},
		complete: function(err, response, data) {
			test.ok(response);
			test.ok(!err);
			test.deepEqual(data, { results: 42 }, "we get back json for json");
			test.done();
		}
	});
};

exports.jsonUnannounced = function(test) {
	client.get({
		url: '/json-unannounced',
		success: function(data) {
			test.deepEqual(data, { results: 42 }, "we get back json for unannounced json");
		},
		complete: function(err, response, data) {
			test.ok(response);
			test.ok(!err);
			test.deepEqual(data, { results: 42 }, "we get back json for unannounced json");
			test.done();
		}
	});
};

exports.empty = function(test) {
	client.get({
		url: '/empty',
		success: function(data) {
			test.deepEqual(data, undefined, "we get back an empty response");
		},
		complete: function(err, response, data) {
			test.ok(response);
			test.ok(!err);
			test.deepEqual(data, undefined, "we get back an empty response");
			test.done();
		}
	});
};

exports.badRequest = function(test) {
	client.get({
		url: '/400',
		error: function(err, response) {
			test.ok(response);
			test.equal(response.statusCode, 400, "we get a bad request for a bad request");
			test.deepEqual(err, { error: "bad request" });
		},
		complete: function(err, response, data) {
			test.ok(response);
			test.ok(data);
			test.equal(response.statusCode, 400, "we get a bad request for a bad request");
			test.deepEqual(err, { error: "bad request" });
			test.done();
		}
	});
};

exports.badResponse = function(test) {
	client.get({
		url: '/content-type-liar',
		error: function(err, response) {
			test.ok(response);
			test.ok(err.message.match(/couldn't parse/), "bogus JSON balks");
		},
		complete: function(err, response, data) {
			test.ok(response);
			test.ok(data);
			test.ok(err.message.match(/couldn't parse/), "bogus JSON balks");
			test.done();
		}
	});
};

exports.timeout = function(test) {
	client.get({
		url: '/timer-200ms',
		timeout: 100,
		error: function(err, response) {
			test.ok(!response);
			test.equal(err.code, 'ETIMEDOUT', "low timeout times out");
		},
		complete: function(err, response, data) {
			test.ok(!response);
			test.ok(!data);
			test.equal(err.code, 'ETIMEDOUT', "low timeout times out");
			test.done();
		}
	});
};

exports.loris = function(test) {
	client.get({
		url: '/reverse-slowloris',
		timeout: 100,
		error: function(err, response) {
			test.ok(!response);
			test.equal(err.code, 'ESOCKETTIMEDOUT', "hopeless request times out");
		},
		complete: function(err, response, data) {
			test.ok(!response);
			test.ok(!data);
			test.equal(err.code, 'ESOCKETTIMEDOUT', "hopeless request times out");
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
