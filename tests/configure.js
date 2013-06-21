var client;

exports.setUp = function(callback) {
	var clientPath = '../lib';
	delete require.cache[require.resolve(clientPath)];
	client = require(clientPath);
	callback();
};

exports.configureNameAndHostname = function(test) {
	var args = 'api.github.com';
	client.configure('github', args);
	test.ok(client.github instanceof client, 'is a rest-client');
	test.equal(client.github.hostname, args, 'has a hostname');
	test.done();

};

exports.configureSimpleObject = function(test) {
	var args = {
		'github': 'api.github.com',
		'metacpan': 'api.metacpan.org'
	};
	client.configure(args);
	test.ok(client.github instanceof client, 'is a rest-client');
	test.equal(client.github.hostname, args.github, 'has a hostname');
	test.ok(client.metacpan instanceof client, 'is another rest-client');
	test.equal(client.metacpan.hostname, args.metacpan, 'has another hostname');
	test.done();
};

exports.configureNameAndObject = function(test) {
	var args = {
		base: 'api.github.com',
		timeout: 123
	};
	client.configure('github', args);
	test.ok(client.github instanceof client, 'is a rest-client');
	test.equal(client.github.hostname, args.base, 'has a hostname');
	test.equal(client.github.timeout, args.timeout, 'has a timeout');
	test.done();
};

exports.configureComplexObject = function(test) {
	var args = {
		'github': {
			base: 'api.github.com',
			timeout: 123
		},
		'metacpan': {
			base: 'api.metacpan.org',
			timeout: 456
		}
	};
	client.configure(args);
	test.ok(client.github instanceof client, 'is a rest-client');
	test.equal(client.github.hostname, args.github.base, 'has a hostname');
	test.equal(client.github.timeout, args.github.timeout, 'has a timeout');
	test.ok(client.metacpan instanceof client, 'is another rest-client');
	test.equal(client.metacpan.hostname, args.metacpan.base, 'has another hostname');
	test.equal(client.metacpan.timeout, args.metacpan.timeout, 'has another timeout');
	test.done();
};
