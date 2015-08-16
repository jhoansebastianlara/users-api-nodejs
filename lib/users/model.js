/**
*	Dependencias
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
*	nos conectamos a la db
*/
mongoose.connect('mongodb://localhost/usersdb');

/**
*	Estructura de los datos
*/
var UserSchema = new mongoose.Schema({
	name: 'string',
	lastname: 'string',
	phoneNumber: 'string'
});

/**
*	Transformación para retornar el id del usuario con la
*	llave "userId" en vez de "_id" (por defecto en mongodb)
*/
UserSchema.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.userId = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});

module.exports = mongoose.model('User', UserSchema);