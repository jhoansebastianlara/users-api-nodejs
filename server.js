/**
*	Dependencies
*/
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

/**
*	Locals
*/
var server = express();


/**
*	Middlewares
*/
server.use(bodyParser.json('application/json'));
server.use(cors());

/**
*	Routes
*/
var users = require('./lib/users');

server.use(users);

// module.parent es true cuando se esta usando como module
/**
*	Expose / Start server
*/
if (module.parent) {
	// se esta usando como módulo, entonces se exporta (para pruebas)
	module.exports = server;
} else {
	// no se esta usando como módulo
	server.listen(3000, function () {
		console.log('Listening on http://localhost:3000');
	});
}