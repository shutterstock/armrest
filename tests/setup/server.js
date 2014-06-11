var fs = require('fs');
var path = require('path');
var http = require('http');
var url = require('url');
var querystring = require('querystring');

var server = http.createServer(function(req, res) {

	var requestURL = url.parse(req.url);
	var query = querystring.parse(requestURL.query);

	var routes = {

		'/json': function() {
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end('{ "results": 42 }');
		},

		'/json-unannounced': function() {
			res.writeHead(200, { 'Content-Type': 'text/plain' });
			res.end('{ "results": 42 }');
		},

		'/empty': function() {
			res.writeHead(200, { 'Content-Type': 'text/plain' });
			res.end();
		},

		'/201-empty-response': function() {
			res.writeHead(201, { 'Content-Type': 'text/plain' });
			res.end(' ');
		},

		'/400': function() {
			res.writeHead(400, { 'Content-Type': 'application/json' });
			res.end('{ "error": "bad request" }');
		},

		'/404-json': function() {
			res.writeHead(404, { 'Content-Type': 'application/json' });
			res.end('{ "error": "srry" }');
		},

		'/404-empty': function() {
			res.writeHead(404, { 'Content-Type': 'text/plain' });
			res.end('');
		},

		'/500': function() {
			res.writeHead(500, { 'Content-Type': 'application/json' });
			res.end('{ "error": "internal server error" }');
		},

		'/646': function() {
			res.writeHead(646, { 'Content-Type': 'application/json' });
			res.end('');
		},

		'/timer-200ms': function() {
			setTimeout(function() {
				res.writeHead(200, { 'Content-Type': 'text/plain' });
				res.end('{ "results": 42 }');
			}, 200);
		},

		'/timer-5000ms': function () {
			setTimeout(function() {
				res.writeHead(200, { 'Content-Type': 'text/plain' });
				res.end('{ "results": 42 }');
			}, 5000);
		},

		'/reverse-slowloris': function() {
			res.writeHead(200, { 'Content-Type': 'text/plain' });
			res.write('...');
			// chirp
		},

		'/content-type-liar': function() {
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end('results: 42');
		},

		'/echo-query': function() {
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify(query));
		},

		'/echo-body': function() {
			var body = '';
			if (req.headers['content-type'] !== 'application/json') {
				res.writeHead(400);
				return res.end(JSON.stringify({
					'bad content type': req.headers['Content-Type']
				}));
			}
			req.on('data', function(data) {
				body += data;
			});
			req.on('end', function() {
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify(JSON.parse(body)));
			});
		},

		'/content-upload': function() {
			var writePath = path.resolve('./tests/data/metro-armrest-upload.png');
			var writeStream = fs.createWriteStream(writePath);
			req.pipe(writeStream);
			req.on('end', function() {
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.end();
			});
		},

		'/content-download': function() {
			var readPath = path.resolve('./tests/data/metro-armrest.png');
			var readStream = fs.createReadStream(readPath);
			res.writeHead(200, { 'Content-Type': 'image/png' });
			readStream.pipe(res);
		},

		'/multi/level/structure': function() {
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ level: 'level', structure: 'structure' }));
		},

		'/multi/level/:structure': function() {
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ level: 'level' }));
		}

	};

	var route = routes[requestURL.pathname] || routes['/404'];
	route();
});

module.exports = server;

