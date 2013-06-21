var reload = function(module) {
	delete require.cache[require.resolve(module)];
	return require(module);
};

exports.configureNameAndHostname = function(test) {
	var client = reload('../lib');
	var args = 'api.github.com';
	test.equal(client.github, undefined, 'registry starts empty');
	client.configure('github', args);
	test.ok(client.github instanceof client, 'is a rest-client');
	test.equal(client.github.hostname, args, 'has a hostname');
	test.done();

};

exports.configureSimpleObject = function(test) {
	var client = reload('../lib');
	var args = {
		'github': 'api.github.com',
		'metacpan': 'api.metacpan.org'
	};
	test.equal(client.github, undefined, 'registry starts empty');
	test.equal(client.metacpan, undefined, 'registry starts empty');
	client.configure(args);
	test.ok(client.github instanceof client, 'is a rest-client');
	test.equal(client.github.hostname, args.github, 'has a hostname');
	test.ok(client.metacpan instanceof client, 'is another rest-client');
	test.equal(client.metacpan.hostname, args.metacpan, 'has another hostname');
	test.done();
};

exports.configureNameAndObject = function(test) {
	var client = reload('../lib');
	var args = {
		base: 'api.github.com',
		timeout: 123
	};
	test.equal(client.github, undefined, 'registry starts empty');
	client.configure('github', args);
	test.ok(client.github instanceof client, 'is a rest-client');
	test.equal(client.github.hostname, args.base, 'has a hostname');
	test.equal(client.github.timeout, args.timeout, 'has a timeout');
	test.done();
};

exports.configureComplexObject = function(test) {
	var client = reload('../lib');
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
	test.equal(client.github, undefined, 'registry starts empty');
	test.equal(client.metacpan, undefined, 'registry starts empty');
	client.configure(args);
	test.ok(client.github instanceof client, 'is a rest-client');
	test.equal(client.github.hostname, args.github.base, 'has a hostname');
	test.equal(client.github.timeout, args.github.timeout, 'has a timeout');
	test.ok(client.metacpan instanceof client, 'is another rest-client');
	test.equal(client.metacpan.hostname, args.metacpan.base, 'has another hostname');
	test.equal(client.metacpan.timeout, args.metacpan.timeout, 'has another timeout');
	test.done();
};
