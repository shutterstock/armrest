var server = require('./setup/server');
var armrest = require('../lib');
var client = armrest.client({ host: 'localhost:59903', logLevel: 'OFF' });

exports.getJson = function(test) {
	client.get({
		url: '/json',
		success: function(data) {
			test.deepEqual(data, { results: 42 }, 'we get back json for json');
		},
		complete: function(err, response, data) {
			test.ok(response);
			test.ok(!err);
			test.deepEqual(data, { results: 42 }, 'we get back json for json');
			test.done();
		}
	});
};

exports.getJsonUnannounced = function(test) {
	client.get({
		url: '/json-unannounced',
		success: function(data) {
			test.deepEqual(data, { results: 42 }, 'we get back json for unannounced json');
		},
		complete: function(err, response, data) {
			test.ok(response);
			test.ok(!err);
			test.deepEqual(data, { results: 42 }, 'we get back json for unannounced json');
			test.done();
		}
	});
};

exports.getEmpty = function(test) {
	client.get({
		url: '/empty',
		success: function(data) {
			test.deepEqual(data, undefined, 'we get back an empty response');
		},
		complete: function(err, response, data) {
			test.ok(response);
			test.ok(!err);
			test.deepEqual(data, undefined, 'we get back an empty response');
			test.done();
		}
	});
};

exports.getEmpty201Response = function(test) {
	client.get({
		url: '/201-empty-response',
		success: function(data) {
			test.deepEqual(data, undefined, 'we get back an empty response');
		},
		complete: function(err, response, data) {
			test.ok(response);
			test.ok(!err);
			test.deepEqual(data, undefined, 'we get back an empty response');
			test.done();
		}
	});
};

exports.getBadRequest = function(test) {
	client.get({
		url: '/400',
		error: function(err, response) {
			test.ok(response);
			test.equal(response.statusCode, 400, 'we get a bad request for a bad request');
			test.deepEqual(err, { error: 'bad request' });
		},
		complete: function(err, response, data) {
			test.ok(response);
			test.ok(data);
			test.equal(response.statusCode, 400, 'we get a bad request for a bad request');
			test.deepEqual(err, { error: 'bad request' });
			test.done();
		}
	});
};

exports.getNotFoundObject = function(test) {
	client.get({
		url: '/404-json',
		error: function(err, response) {
			test.ok(response);
			test.equal(response.statusCode, 404, 'we get not found');
			test.deepEqual(err, { error: 'srry'}, 'we get back json');
		},
		complete: function(err, response, data) {
			test.ok(response);
			test.ok(data);
			test.deepEqual(err, { error: 'srry'}, 'we get back json');
			test.done();
		}
	});
};

exports.getNotFoundEmpty = function(test) {
	client.get({
		url: '/404-empty',
		error: function(err, response) {
			test.ok(response);
			test.equal(response.statusCode, 404, 'we get not found');
			test.ok(err.message.match(/Not Found/), 'we get back an HTTP status code error');
		},
		complete: function(err, response, data) {
			test.ok(response);
			test.ok(!data);
			test.ok(err.message.match(/Not Found/), 'we get back an HTTP status code error');
			test.done();
		}
	});
};

exports.getUnknownStatusEmpty = function(test) {
	client.get({
		url: '/646',
		error: function(err, response) {
			test.ok(response);
			test.equal(response.statusCode, 646, 'we get a crazy status code');
			test.ok(err.message.match(/Unknown HTTP Status Code/), 'we get back an unknown HTTP status code error');
		},
		complete: function(err, response, data) {
			test.ok(response);
			test.ok(!data);
			test.ok(err.message.match(/Unknown HTTP Status Code/), 'we get back an unknown HTTP status code error');
			test.done();
		}
	});
};

exports.getBadResponse = function(test) {
	client.get({
		url: '/content-type-liar',
		error: function(err, response) {
			test.ok(response);
			test.ok(err.message.match(/Could not deserialize/), 'bogus JSON balks');
		},
		complete: function(err, response, data) {
			test.ok(response);
			test.ok(data);
			test.ok(err.message.match(/Could not deserialize/), 'bogus JSON balks');
			test.done();
		}
	});
};

exports.getTimeout = function(test) {
	client.get({
		url: '/timer-200ms',
		timeout: 100,
		error: function(err, response) {
			test.ok(!response);
			test.equal(err.code, 'ESOCKETTIMEDOUT', 'low timeout times out');
		},
		complete: function(err, response, data) {
			test.ok(!response);
			test.ok(!data);
			test.equal(err.code, 'ESOCKETTIMEDOUT', 'low timeout times out');
			test.done();
		}
	});
};

exports.getLoris = function(test) {
	client.get({
		url: '/reverse-slowloris',
		timeout: 100,
		error: function(err, response) {
			test.ok(!response);
			test.equal(err.code, 'ESOCKETTIMEDOUT', 'hopeless request times out');
		},
		complete: function(err, response, data) {
			test.ok(!response);
			test.ok(!data);
			test.equal(err.code, 'ESOCKETTIMEDOUT', 'hopeless request times out');
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
