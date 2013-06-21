var reload = function(module) {
	delete require.cache[ require.resolve(module) ];
	return require(module);
};

exports.configure = function(test) {

	var client = require("../lib");
	test.equal(client.github, undefined, "registry starts empty");

	client.configure('github', 'api.github.com');

	test.ok(client.github instanceof client, "github client is a rest-client");
	test.equal(client.github.hostname, 'api.github.com');

	test.done();
};

exports.bulk = function(test) {

	var client = reload('../lib');
	test.equal(client.github, undefined, "registry starts empty");

	client.configure({
		"github": "api.github.com",
		"metacpan": "api.metacpan.org"
	});

	test.equal(client.github.hostname, 'api.github.com');
	test.equal(client.metacpan.hostname, 'api.metacpan.org');

	test.done();
};
