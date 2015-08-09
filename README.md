# users-api-nodejs
Users es una aplicación que me sirve como base para crear un módulo de usuarios en un proyecto NodeJS.

## Métodos HTTP permitidos

|   Método  |                Descripción                  |
| --------- | ------------------------------------------- |
| 'GET'     | Obtiene un recurso o un listado de recursos |
| 'POST'    | Crear un nuevo recurso                      |
| 'PUT'     | Actualizar un recurso                       |
| 'DELETE'  | Eliminar un recurso                         |

## Códigos de respuesta

| Código |                   Descripción                           |
| ------ | ------------------------------------------------------- |
| '200'  | Success                                                 |
| '201'  | Success - Nuevo recurso creado                          |
| '204'  | Success - No hay información para responder             |
| '400'  | Bad Request. i.e su solicitud no se pudo evaluar        |
| '401'  | Unauthorized - Usuario no autorizado para este recurso  |
| '404'  | Not found - recurso inexistente                         |
| '422'  | Unprocessable Entity - i.e errores de validación        |
| '429'  | Límite de uso excedido, intente más tarde               |
| '500'  | Error del servidor                                      |
| '503'  | Servicio no disponible                                  |

## Crear nuevo usuario [POST]

Request [POST] /users
	{
		"name": "Steve",
		"lastname": "Jobs",
		"phoneNumber": "+573127748821"
	}

Response

{
	"user": {
		"userId": 325,
		"name": "Steve",
		"lastname": "Jobs",
		"phoneNumber": "+573127748821"
	}
}

## Obtener un usuario
Request de GET /users/325

Response

{
	"user": {
		"userId": 325,
		"name": "Steve",
		"lastname": "Jobs",
		"phoneNumber": "+573127748821"
	}
}

## Actualizar un usuario
Request [PUT] /users/325
    {
        "name": "Steven",
        "lastname": "Lara",
        "phoneNumber": "+5731277488212"
    }

## Eliminar un usuario
Request [DELETE] /users/325
    {
        "name": "Steven",
        "lastname": "Lara",
        "phoneNumber": "+5731277488212"
    }

## Obtener un listado de usuarios
Request de GET /users

Response

{
    "users": [{
        "userId": 325,
        "name": "Steve",
        "lastname": "Jobs",
        "phoneNumber": "+573127748821"
    }]
}

