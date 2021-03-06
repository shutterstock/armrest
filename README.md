# Armrest

[![Build Status](https://travis-ci.org/shutterstock/armrest.svg?branch=master)](https://travis-ci.org/shutterstock/armrest)

> A high-level HTTP / REST services client for Node.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
	- [Example](#example)
	- [Instantiating a REST Client](#instantiating-a-rest-client)
	- [Methods](#methods)
	- [Working with Many Backend Services](#working-with-many-backend-services)
	- [Working with Many Client Instances](#working-with-many-client-instances)
- [Authors](#authors)
- [Contribute](#contribute)
- [License](#license)

## Install

Install with npm:

```sh
$ npm install armrest
```

## Usage

### Example

Set up a client and issue a GET request:

```javascript
var armrest = require('armrest');
var github = armrest.client('https://api.github.com');

github.get({
	url: '/orgs/:organization',
	params: { organization: 'shutterstock' },
	success: function(organization) {
		// do something
	}
});
```

### Instantiating a REST Client

The `armrest.client()` factory takes two forms: send the base URL as a string if that will get you going, or send an object with parameters below for more flexibility.

##### base

The base URL, including any or all of the scheme, hostname, port, and path.  This option overrides `scheme`, `hostname` and `port`.

##### protocol

The scheme part of the base URL if `base` is not specified, either `http` or `https`.  Defaults to `http`.  Aliased as `scheme` as well for compatibility.

##### host

The host part of the base URL (`hostname`:`port`) if `base` is not specified.

##### hostname

The hostname part of the base URL if `base` is not specified.

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

### Methods

#### get(), post(), put(), patch(), delete(), head()

Make an HTTP request to the service, given the parameters below.

##### url

The path component of the URL.  URLs may have sinatra-style interpolation tokens to be filled in by values from params.

##### params

Paramaters to be sent with the request.  For HEAD, GET and DELETE requests these will be sent as query string parameters.  For other HTTP methods, parameters will be serialized according to the serialization scheme associated with the client, and sent in the body of the request.

##### success

Callback to be executed upon success, with the deserialized response as the first parameter, followed by the full response object.

##### error

Callback to be executed upon failure, with the error as the first parameter, followed by the full response object.

##### complete

Callback to be executed upon completion, whether the request failed or succeeded, with the error as the first parameter, followed by the full response object, and finally the deserialized response.

###### Additional parameters are passed through to [request](https://github.com/mikeal/request#requestoptions-callback).

### Working with Many Backend Services

When you're working with a number of services at once, use the following alternate interface to configure clients and get easy access for later use.

#### configure(name, options)

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

### Working with Many Client Instances

When you're working with a number of client instances and you want them to have the same default behavior, use the following method.

#### setDefaults(options)

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

## Contribute

Please do! Check out our [contributing guide](CONTRIBUTING.md).

## License

[MIT](LICENSE) © 2012-2017 Shutterstock Images, LLC
