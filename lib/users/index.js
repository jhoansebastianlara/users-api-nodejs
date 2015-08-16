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
		var newUser = req.body.user;

		User.create(newUser, function (err, user) {
			// se responde al cliente
			res
				.status(201)
				.json({
					user: user
				});
		});
	})

	// GET
	.get(function (req, res) {
		var userId = req.params.userId;

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
				
				if (!user) {
					return res
						.status(404)
						.send({});
				}

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
		var userId = req.params.userId;
		var updateUser = req.body.user;

		// se actualiza el usuario
		User.update({userId: userId}, updateUser, {}, function (err, results) {
			// verificamos si la respuesta fue exitosa
			if (results.ok) {
				// indicamos el id
				updateUser.userId = userId;

				return res
					.status(200)
					.json({
						user: updateUser
					});
			}

			// error !
			res
				.status(500)
				.send(err);

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

module.exports = app;