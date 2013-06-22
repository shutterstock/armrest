var Client;

exports.setUp = function(callback) {
	var clientPath = '../lib';
	delete require.cache[require.resolve(clientPath)];
	Client = require(clientPath);
	callback();
};

exports.configureNameAndHostname = function(test) {
	var args = 'api.github.com';
	Client.configure('github', args);
	test.ok(Client.github instanceof Client, 'is a client');
	test.equal(Client.github.hostname, args, 'has a hostname');
	test.done();
};

exports.configureSimpleObject = function(test) {
	var args = {
		'github': 'api.github.com',
		'metacpan': 'api.metacpan.org'
	};
	Client.configure(args);
	test.ok(Client.github instanceof Client, 'is a client');
	test.equal(Client.github.hostname, args.github, 'has a hostname');
	test.ok(Client.metacpan instanceof Client, 'is another client');
	test.equal(Client.metacpan.hostname, args.metacpan, 'has another hostname');
	test.done();
};

exports.configureNameAndObject = function(test) {
	var args = {
		base: 'api.github.com',
		timeout: 123
	};
	Client.configure('github', args);
	test.ok(Client.github instanceof Client, 'is a client');
	test.equal(Client.github.hostname, args.base, 'has a hostname');
	test.equal(Client.github.timeout, args.timeout, 'has a timeout');
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
	Client.configure(args);
	test.ok(Client.github instanceof Client, 'is a client');
	test.equal(Client.github.hostname, args.github.base, 'has a hostname');
	test.equal(Client.github.timeout, args.github.timeout, 'has a timeout');
	test.ok(Client.metacpan instanceof Client, 'is another client');
	test.equal(Client.metacpan.hostname, args.metacpan.base, 'has another hostname');
	test.equal(Client.metacpan.timeout, args.metacpan.timeout, 'has another timeout');
	test.done();
};
