/**
*	Dependencies
*/
var app = require('express')();
var _ = require('lodash');
var User = require('./model');

/**
*	Routes
*/
app.route('/users/:userId?')
	
	// logging
	.all(function (req, res, next) {
		// console.log(req.method, req.path, req.body);

		res.set('Content-Type', 'application/json')

		// como este middleware no envia una respuesta al server: next()
		next();
	})

	// POST
	.post(function (req, res) {
		// se obtienen los datos del usuario
		var newUser = req.body.user;

		// se crea el usuario
		User.create(newUser, function (err, user) {
			// validamos si existe un error
			if (_.isNull(err)) {
				// respuesta exitosa, se responde al cliente
				res
					.status(201)
					.json({
						user: user
					});
			} else {
				// existe un error
				return res
					.status(500)
					.send(err);
			}

		});
	})

	// GET
	.get(function (req, res) {
		// id del usuario a consultar, es null cuando se require un listado
		var userId = req.params.userId;

		// se valida si existe un id 
		if (_.isUndefined(userId)) {
			// se esta solicitando el listado
			User.find({}).exec()
			.then(function (users) {
				// se envía la respuesta al cliente
				res
					.status(200)
					.set('Content-Type','application/json')
					.json({
						users: users || []
					});
			});
		} else {
			// se esta solicitando un usuario en específico
			User.findById(userId, function(err, user) {
				// se valida si se encontro el usuario
				if (!user) {
					return res
						.status(404)
						.send({});
				}

				// se envía la respuesta al cliente
				res
					.status(200)
					.json({
						user: user
					});
		    });
		}


	})

	// PUT
	.put(function (req, res) {
		// id del usuario a actualizar
		var userId = req.params.userId;
		// información con la que debe actualizarse el usuario
		var updateUser = req.body.user;

		// se actualiza el usuario
		User.update({userId: userId}, updateUser, {}, function (err, results) {
			// se verifica si la respuesta fue exitosa
			if (results.ok) {
				// indicamos el id
				updateUser.userId = userId;

				// se responde al usuario
				res
					.status(200)
					.json({
						user: updateUser
					});
			} else {
				// error !
				res
					.status(500)
					.send(err);
			}
		});
	})

	// DELETE
	.delete(function (req, res) {
		// obtenermos el id de usuario a borrar
		var userId = req.params.userId;

		// se elimina el usuario
		User.remove({ _id: { $eq: userId } }, function (err, results) {
			// verificamos la respuesta
			if (err) {
				// error
				res
					.status(500)
					.send(err);
			} else {
				// ok!
			    res
				    .status(204)
				    .send({});
			}
		});

	});

// se exporta el módulo
module.exports = app;