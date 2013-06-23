var armrest;

exports.setUp = function(callback) {
	var clientPath = '../lib';
	delete require.cache[require.resolve(clientPath)];
	armrest = require(clientPath);
	callback();
};

exports.configureNameAndHostname = function(test) {
	var args = 'api.github.com';
	armrest.configure('github', args);
	test.equal(armrest.github.hostname, args, 'has a hostname');
	test.done();
};

exports.configureSimpleObject = function(test) {
	var args = {
		'github': 'api.github.com',
		'metacpan': 'api.metacpan.org'
	};
	armrest.configure(args);
	test.equal(armrest.github.hostname, args.github, 'has a hostname');
	test.equal(armrest.metacpan.hostname, args.metacpan, 'has another hostname');
	test.done();
};

exports.configureNameAndObject = function(test) {
	var args = {
		base: 'api.github.com',
		timeout: 123
	};
	armrest.configure('github', args);
	test.equal(armrest.github.hostname, args.base, 'has a hostname');
	test.equal(armrest.github.timeout, args.timeout, 'has a timeout');
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
	armrest.configure(args);
	test.equal(armrest.github.hostname, args.github.base, 'has a hostname');
	test.equal(armrest.github.timeout, args.github.timeout, 'has a timeout');
	test.equal(armrest.metacpan.hostname, args.metacpan.base, 'has another hostname');
	test.equal(armrest.metacpan.timeout, args.metacpan.timeout, 'has another timeout');
	test.done();
};
