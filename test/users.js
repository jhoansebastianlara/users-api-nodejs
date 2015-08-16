/**
*	Dependencies
*/
var request = require('supertest');
var api = require('../server.js');
var host = process.env.API_TEST_HOST || api;
var async = require('async');
var _ = require('lodash');
var User = require('../lib/users/model');

/**
*	Locals
*/
request = request(host);


describe('resourse /users', function () {
	beforeEach(function() {
		// Eliminarmos los usuarios antes de cada test
		User.remove()
	});

	describe('POST', function () {
		it('Debería crear un usuario', function (done) {
			// datos de nuevo usuario
			var data = {
				"user": {
					"name": "Steve",
					"lastname": "Jobs",
					"phoneNumber": "+573127748821"
				}
			};

			// solicitud http
			request
				.post('/users')
				.set('Accept', 'application/json')
				.send(data)
				.expect(201)
				.expect('Content-type', /application\/json/)
				.end(function(err, res) {
					var body = res.body;

					// esperamos que la respuesta tenga la propiedad 'user'
					expect(body).to.have.property('user');

					// propiedades
					var user = body.user;

					expect(user).to.have.property('name', 'Steve');
					expect(user).to.have.property('lastname', 'Jobs');
					expect(user).to.have.property('phoneNumber', '+573127748821');
					expect(user).to.have.property('userId');

					done();
				});
		});
	});

	describe('GET', function () {

		it('Debería obtener un usuario', function (done) {
			// datos de nuevo usuario
			var data = {
				"user": {
					"name": "Steve",
					"lastname": "Jobs",
					"phoneNumber": "+573127748821"
				}
			};

			var userId;
			var user;

			async.waterfall([

				function createUser(cb) {
					// Creamos un nuevo usuario
					request
						.post('/users')
						.set('Accept', 'application/json')
						.send(data)
						.expect(201)
						.expect('Content-type', /application\/json/)
						.end(cb);
				},

				function getUser(res, cb) {
					userId = res.body.user.userId;

					request
						.get('/users/' + userId)
						.expect(200)
						.expect('Content-type', /application\/json/)
						.end(cb);
				},

				function assertions (res, cb) {
					user = res.body.user;

					expect(user).to.have.property('name', 'Steve');
					expect(user).to.have.property('lastname', 'Jobs');
					expect(user).to.have.property('phoneNumber', '+573127748821');
					expect(user).to.have.property('userId', userId);

					done();
				}
			
			], done);
		});

		it('Debería obtener el listado de usuarios', function (done) {
			// datos de nuevo usuario
			var dataA = {
				"user": {
					"name": "Steve",
					"lastname": "Jobs",
					"phoneNumber": "+573127748821"
				}
			};

			var dataB = {
				"user": {
					"name": "Bill",
					"lastname": "Gates",
					"phoneNumber": "+570367481872"
				}
			};

			var userAId;
			var userA;

			var userBId;
			var userB;

			async.waterfall([

				function createUserA(cb) {
					// Creamos un nuevo usuario
					request
						.post('/users')
						.set('Accept', 'application/json')
						.send(dataA)
						.expect(201)
						.expect('Content-type', /application\/json/)
						.end(cb);
				},

				function createUserB(res, cb) {
					userAId = res.body.user.userId;

					// Creamos un nuevo usuario
					request
						.post('/users')
						.set('Accept', 'application/json')
						.send(dataB)
						.expect(201)
						.expect('Content-type', /application\/json/)
						.end(cb);
				},

				function getUsers(res, cb) {
					userBId = res.body.user.userId;

					request
						.get('/users/')
						.expect(200)
						.expect('Content-type', /application\/json/)
						.end(cb);
				},

				function assertions (res, cb) {
					var body = res.body;
					var users = body.users;

					// esperamos que la respuesta contenta la propiedad "users"
					expect(body).to.have.property('users');
					// esperamos que la respuesta contenga un array de 2 posiciones
			        expect(body.users).to.be.an('array')
			          .and.to.have.length.least(2);

			        // obtenemos los usuarios creados uno por uno
			        var userA = _.find(users, {userId: userAId});
        			var userB = _.find(users, {userId: userBId});

        			expect(userA).to.have.property('name', 'Steve');
					expect(userA).to.have.property('lastname', 'Jobs');
					expect(userA).to.have.property('phoneNumber', '+573127748821');
					expect(userA).to.have.property('userId', userAId);

					expect(userB).to.have.property('name', 'Bill');
					expect(userB).to.have.property('lastname', 'Gates');
					expect(userB).to.have.property('phoneNumber', '+570367481872');
					expect(userB).to.have.property('userId', userBId);

					// fin de la prueba
					done();
				}
			
			], done);
		});
	});

	describe('PUT', function () {
		it('Debería actualizar un usuario', function (done) {
			// datos de nuevo usuario
			var data = {
				"user": {
					"name": "Steve",
					"lastname": "Jobs",
					"phoneNumber": "+573127748821"
				}
			};

			var userId;
			var user;

			async.waterfall([
				function createUser(cb) {
					// Creamos un nuevo usuario
					request
						.post('/users')
						.set('Accept', 'application/json')
						.send(data)
						.expect(201)
						.expect('Content-type', /application\/json/)
						.end(cb);
				},

				function getUser(res, cb) {
					userId = res.body.user.userId;

					request
						.get('/users/' + userId)
						.expect(200)
						.expect('Content-type', /application\/json/)
						.end(cb);
				},

				function updateUser(res, cb) {
					var newData = {
						"user": {
							"name": "Sebastián",
							"lastname": "Jobs",
							"phoneNumber": "+573128706611"
						}
					};
					
					// Actualizamos el usuario
					request
						.put('/users/' + userId)
						.set('Accept', 'application/json')
						.send(newData)
						.expect(200)
						.expect('Content-type', /application\/json/)
						.end(cb);
				},

				function assertions (res, cb) {
					var user = res.body.user;

					expect(user).to.have.property('name', 'Sebastián');
					expect(user).to.have.property('lastname', 'Jobs');
					expect(user).to.have.property('phoneNumber', '+573128706611');
					expect(user).to.have.property('userId', userId);

					done();
				}
			
			], done);

		});
	});

	describe('DELETE', function () {
		it('Debería eliminar un usuario', function (done) {
			// datos de nuevo usuario
			var data = {
				"user": {
					"name": "Steve",
					"lastname": "Jobs",
					"phoneNumber": "+573127748821"
				}
			};

			var userId;
			var user;

			async.waterfall([

				// creamos un nuevo usuario
				function createUser(cb) {
					// Creamos un nuevo usuario
					request
						.post('/users')
						.set('Accept', 'application/json')
						.send(data)
						.expect(201)
						.expect('Content-type', /application\/json/)
						.end(cb);
				},

				// obtenemos el usuario creado
				function getUser(res, cb) {
					user = res.body.user;
					userId = user.userId;

					request
						.get('/users/' + userId)
						.expect(200)
						.expect('Content-type', /application\/json/)
						.end(cb);
				},

				// eliminamos el usuario
				function deleteUser(res, cb) {
					// Se envía el request para eliminar el usuario
					request
						.delete('/users/' + userId)
						.set('Accept', 'application/json')
						.expect(204)
						.end(cb);
				},

				// Verificamos las afirmaciones
				function assertions (res, cb) {
					// se espera que el servicio de eliminar no retorne respuesta alguna
					expect(res.body).to.be.empty;

					// probamos que el usuario haya sido eliminado
					request
						.get('/users/' + userId)
						.expect(404)
						.expect('Content-type', /application\/json/)
						.end(cb);
				},

				// Confirmamos las afirmaciones
				function assertionsConfirm (res, cb) {
					// se espera que el servicio para obtener usuario no retorne información
					expect(res.body).to.be.empty;

					// fin de la prueba
					done();
				},
			
			], done);

		});
	});

});