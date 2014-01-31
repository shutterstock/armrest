# Armrest

A high-level HTTP / REST services client for Node.

## Example

Set up a client and issue a GET request:

```javascript
var armrest = require('armrest');
var github = armrest.client('http://api.github.com');

github.get({
	url: '/orgs/:organization',
	params: { organization: 'shutterstock' },
	success: function(organization) {
		// do something
	}
});
```

## Installation

Install with npm:
```
$ npm install armrest
```

## Instantiating a REST Client

The `armrest.client()` factory takes two forms: send the base URL as a string if that will get you going, or send an object with parameters below for more flexibility.

##### base

Base URL, including any or all of the scheme, host, port, and path.  This option overrides `host`, `scheme`, and `port`.

##### host

The host part of the base URL if `base` is not specified.

##### protocol

The scheme part of the base URL if `base` is not specified, either `http` or `https`.  Defaults to `http`.  Aliased as `scheme` as well for compatibility.

##### port

The port part of the base URL if `base` is not specified.

##### timeout

Number of milliseconds to wait first for establishing the socket connection and sending the request, and then again for receiving the response.

##### serializer

Optional parameter, an object specifying a `contentType`, and functions to `serialize` and `deserialize` request and response bodies.

##### logger

Instance of some logger that implements `debug()`, `info()`, `warn()`, and `error()`.

##### logLevel

String indicating criticality of messages to log; one of `debug`, `info`, `warn`, or `error`.

## Methods

### get(), post(), put(), patch(), delete(), head()

Make an HTTP request to the service, given the parameters below.

##### url

The path component of the URL.  URLs may have sinatra-style interpolation tokens to be filled in by values from params.

##### params

Paramaters to be sent with the request.  For HEAD and GET requests these will be sent as query string parameters.  For other HTTP methods, parameters will be serialized according to the serialization scheme associated with the client, and sent in the body of the request.

##### success

Callback to be executed upon success, with the deserialized response as the first parameter, followed by the full response object.

##### error

Callback to be executed upon failure, with the error as the first parameter, followed by the full response object.

##### complete

Callback to be executed upon completion, whether the request failed or succeeded, with the error as the first parameter, followed by the full response object, and finally the deserialized response.

###### Additional parameters are passed through to [request](https://github.com/mikeal/request#requestoptions-callback).

## Working with Many Backend Services

When you're working with a number of services at once, use the following alternate interface to configure clients and get easy access for later use.

### configure(name, options)

A class method to register backend services.  Send a name for the service, and options expected by the constructor, as detailed above.

```javascript
var armrest = require('armrest');

armrest.configure('github', {
	base: 'http://api.github.com',
	timeout: 5000
});

armrest.configure('metacpan', {
	base: 'http://api.metacpan.org',
	timeout: 5000
});

```

Later from elsewhere, load in the module and interact with services by name.

```javascript
var armrest = require('armrest');

armrest.github.get(...);
armrest.metacpan.get(...);
```

## Working with Many Client Instances

When you're working with a number of client instances and you want them to have the same default behavior, use the following method.

### setDefaults(options)

```javascript
var armrest = require('armrest');

armrest.setDefaults({
	timeout: 10000
});
```

This will set the default timeout for any request to 10000 milliseconds.  To clear the default behaviors, use:

```javascript
armrest.clearDefaults();
```

## Authors

This library was developed by David Chester and Zubin Tiku at [Shutterstock](http://www.shutterstock.com)


## License

Copyright (C) 2012-2013 by Shutterstock Images, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

