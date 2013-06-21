var Client = require('../lib');
var client = new Client({ host: 'localhost:59903', logLevel: 'OFF' });

exports.connectionRefused = function(test) {
	client.get({
		url: '/json',
		error: function(error) {
			test.deepEqual(error.code, 'ECONNREFUSED', 'connection refused for no server running');
			test.done();
		}
	});
};



