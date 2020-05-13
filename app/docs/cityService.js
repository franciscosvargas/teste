/**
       * @api {get} /api/v1/cityservice/:id Find One City Service
       * @apiHeader {String} x-access-token Users unique access-key.
       * @apiParam {id} id CityServoce id
       * @apiGroup CityService
       * @apiExample {curl} Example usage:
         curl  http://localhost:3000/api/v1/cityservice/1 \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' 
        -H 'x-access-token: Aqui Seu token' 
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
       {
            "id": 1,
            "created_at": "2017-10-31T19:45:36.000Z",
            "updated_at": "2017-10-31T19:45:36.000Z",
            "city_id": 1,
            "country_id": 1,
            "state_id": 1,
            "service_id": 1,
            "City": {
                "id": 1,
                "name": "Recife",
                "lat": "-8.0475622",
                "lng": "-34.8769643",
                "status": true,
                "created_at": "2017-10-31T15:21:18.000Z",
                "updated_at": "2017-10-31T15:21:18.000Z",
                "country_id": 1,
                "state_id": 1
            },
            "Country": {
                "id": 1,
                "name": "Brasil",
                "lat": "-14.235004",
                "lng": "-51.92527999999999",
                "initials": "BR",
                "created_at": "2017-10-31T15:18:39.000Z",
                "updated_at": "2017-10-31T15:18:39.000Z"
            },
            "State": {
                "id": 1,
                "name": "Pernambuco",
                "lat": "-8.8137173",
                "lng": "-36.95410700000002",
                "initials": "PE",
                "created_at": "2017-10-31T15:19:19.000Z",
                "updated_at": "2017-10-31T15:19:19.000Z",
                "country_id": 1
            },
            "Service": {
                "id": 1,
                "name": "Motoboy",
                "status": true,
                "created_at": "2017-10-31T15:32:08.000Z",
                "updated_at": "2017-10-31T15:32:08.000Z",
                "city_id": null
            }
        }
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 404 Bad Request
       [
            {
                "title": "Id",
                "message": "Id invalido!"
            }
        ]
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 500 Internal Server Error
       */
/**
       * @api {get} /api/v1/cityservice List All City Service
       * @apiHeader {String} x-access-token Users unique access-key.
       * @apiGroup CityService
       * @apiExample {curl} Example usage:
         curl  http://localhost:3000/api/v1/cityservice \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' 
        -H 'x-access-token: Aqui Seu token' 
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
       [
            {
                "id": 1,
                "created_at": "2017-10-31T19:45:36.000Z",
                "updated_at": "2017-10-31T19:45:36.000Z",
                "city_id": 1,
                "country_id": 1,
                "state_id": 1,
                "service_id": 1,
                "City": {
                    "id": 1,
                    "name": "Recife",
                    "lat": "-8.0475622",
                    "lng": "-34.8769643",
                    "status": true,
                    "created_at": "2017-10-31T15:21:18.000Z",
                    "updated_at": "2017-10-31T15:21:18.000Z",
                    "country_id": 1,
                    "state_id": 1
                },
                "Country": {
                    "id": 1,
                    "name": "Brasil",
                    "lat": "-14.235004",
                    "lng": "-51.92527999999999",
                    "initials": "BR",
                    "created_at": "2017-10-31T15:18:39.000Z",
                    "updated_at": "2017-10-31T15:18:39.000Z"
                },
                "State": {
                    "id": 1,
                    "name": "Pernambuco",
                    "lat": "-8.8137173",
                    "lng": "-36.95410700000002",
                    "initials": "PE",
                    "created_at": "2017-10-31T15:19:19.000Z",
                    "updated_at": "2017-10-31T15:19:19.000Z",
                    "country_id": 1
                },
                "Service": {
                    "id": 1,
                    "name": "Motoboy",
                    "status": true,
                    "created_at": "2017-10-31T15:32:08.000Z",
                    "updated_at": "2017-10-31T15:32:08.000Z",
                    "city_id": null
                }
            }
        ]
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 500 Internal Server Error
       */

/**
       * @api {get} /api/v1/cityservice/city/:id List One City in CityService
       * @apiHeader {String} x-access-token Users unique access-key.
       * @apiGroup CityService
       * * @apiParam {city_id} city_id CityServoce city_id
       * @apiExample {curl} Example usage:
         curl  http://localhost:3000/api/v1/cityservice/city/1 \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' 
        -H 'x-access-token: Aqui Seu token' 
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
       [
            {
                "id": 1,
                "created_at": "2017-10-31T19:45:36.000Z",
                "updated_at": "2017-10-31T19:45:36.000Z",
                "city_id": 1,
                "country_id": 1,
                "state_id": 1,
                "service_id": 1,
                "City": {
                    "id": 1,
                    "name": "Recife",
                    "lat": "-8.0475622",
                    "lng": "-34.8769643",
                    "status": true,
                    "created_at": "2017-10-31T15:21:18.000Z",
                    "updated_at": "2017-10-31T15:21:18.000Z",
                    "country_id": 1,
                    "state_id": 1
                },
                "Country": {
                    "id": 1,
                    "name": "Brasil",
                    "lat": "-14.235004",
                    "lng": "-51.92527999999999",
                    "initials": "BR",
                    "created_at": "2017-10-31T15:18:39.000Z",
                    "updated_at": "2017-10-31T15:18:39.000Z"
                },
                "State": {
                    "id": 1,
                    "name": "Pernambuco",
                    "lat": "-8.8137173",
                    "lng": "-36.95410700000002",
                    "initials": "PE",
                    "created_at": "2017-10-31T15:19:19.000Z",
                    "updated_at": "2017-10-31T15:19:19.000Z",
                    "country_id": 1
                },
                "Service": {
                    "id": 1,
                    "name": "Motoboy",
                    "status": true,
                    "created_at": "2017-10-31T15:32:08.000Z",
                    "updated_at": "2017-10-31T15:32:08.000Z",
                    "city_id": null
                }
            }
        ]
       
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 404 Bad Request
       [
            {
                "title": "Cidade Id",
                "message": "Cidade Id invalido!"
            }
        ]
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 500 Internal Server Error
       */


/**
       * @api {get} /api/v1/cityservice/:id List One CityService
       * @apiHeader {String} x-access-token Users unique access-key.
       * @apiGroup CityService
       * * @apiParam {id} id CityServoce id
       * @apiExample {curl} Example usage:
         curl  http://localhost:3000/api/v1/cityservice/1 \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' 
        -H 'x-access-token: Aqui Seu token' 
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
       
        {
            "id": 1,
            "created_at": "2017-10-31T19:45:36.000Z",
            "updated_at": "2017-10-31T19:45:36.000Z",
            "city_id": 1,
            "country_id": 1,
            "state_id": 1,
            "service_id": 1,
            "City": {
                "id": 1,
                "name": "Recife",
                "lat": "-8.0475622",
                "lng": "-34.8769643",
                "status": true,
                "created_at": "2017-10-31T15:21:18.000Z",
                "updated_at": "2017-10-31T15:21:18.000Z",
                "country_id": 1,
                "state_id": 1
            },
            "Country": {
                "id": 1,
                "name": "Brasil",
                "lat": "-14.235004",
                "lng": "-51.92527999999999",
                "initials": "BR",
                "created_at": "2017-10-31T15:18:39.000Z",
                "updated_at": "2017-10-31T15:18:39.000Z"
            },
            "State": {
                "id": 1,
                "name": "Pernambuco",
                "lat": "-8.8137173",
                "lng": "-36.95410700000002",
                "initials": "PE",
                "created_at": "2017-10-31T15:19:19.000Z",
                "updated_at": "2017-10-31T15:19:19.000Z",
                "country_id": 1
            },
            "Service": {
                "id": 1,
                "name": "Motoboy",
                "status": true,
                "created_at": "2017-10-31T15:32:08.000Z",
                "updated_at": "2017-10-31T15:32:08.000Z",
                "city_id": null
            }
        }
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 404 Bad Request
       [
            {
                "title": "Id",
                "message": "Id invalido!"
            }
        ]
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 500 Internal Server Error
       */

/**
    * @api {delete} /api/v1/cityservice/:id Delete CityService
    * @apiGroup CityService
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} CityService Post's Delete
    * @apiParam {id} id CityService id
    * @apiExample {curl} Example usage:
        curl -X DELETE \
        http://localhost:3000/api/v1/cityservice/1 \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -H 'x-access-token: Aqui Seu token' 
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
        [
           {
               "title": "Deletado",
               "message": "Deletado com Sucesso!"
           }
       ]
     * @apiErrorExample {json} List error
    *    HTTP/1.1 400 Bad Request
   [
        {
            "title": "Id",
            "message": "Id invalido!"
        }
    ]
    *    HTTP/1.1 500 Intern	al Server Error
 * */

 /**
    * @api {put} /api/v1/cityservice/:id Update CityService
    * @apiGroup CityService
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} AccountType Post's lists
    * @apiParam {id} id CityService id
    * @apiSuccess {Integer} city_id City city_id
    * @apiSuccess {Integer} state_id State state_id
    * @apiSuccess {Integer} service_id Service service_id
    * @apiSuccess {Integer} country_id Country country_id
    * @apiExample {curl} Example usage:
        curl -X PUT \
        http://localhost:3000/api/v1/cityservice/1 \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -H 'x-access-token: Aqui Seu token' 
        -d 'city_id=1&state_id=1&service_id=1&country_id=1'
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
   [
            {
                "title": "Alterado com sucesso!",
                "message": "Conseguimos alterar o seu registro com sucesso!"
            }
    ]
     * @apiErrorExample {json} List error
    *    HTTP/1.1 400 Bad Request
   [
        {
            "title": "Id",
            "message": "Id invalido!"
        }
    ]
    *    HTTP/1.1 500 Intern	al Server Error
 * */


 /**
    * @api {post} /api/v1/cityservice Create CityService
    * @apiGroup CityService
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} AccountType Post's lists
    * @apiParam {id} id CityService id
    * @apiSuccess {Integer} city_id City city_id
    * @apiSuccess {Integer} state_id State state_id
    * @apiSuccess {Integer} service_id Service service_id
    * @apiSuccess {Integer} country_id Country country_id
    * @apiExample {curl} Example usage:
        curl -X POST \
        http://localhost:3000/api/v1/cityservice \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -H 'x-access-token: Aqui Seu token' 
        -d 'city_id=1&state_id=1&service_id=1&country_id=1'
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 201 OK
        {
            "id": 1,
            "created_at": "2017-10-31T19:45:36.000Z",
            "updated_at": "2017-10-31T19:45:36.000Z",
            "city_id": 1,
            "country_id": 1,
            "state_id": 1,
            "service_id": 1,
        }
     * @apiErrorExample {json} List error
    *    HTTP/1.1 400 Bad Request
    [
        {
            "title": "País",
            "message": "País é requerido!"
        },
        {
            "title": "Cidade",
            "message": "Cidade é querido!"
        },
        {
            "title": "Estado",
            "message": "Estado é querido!"
        },
        {
            "title": "Serviço",
            "message": "Serviço é requerido!"
        }
    ]
    *    HTTP/1.1 500 Intern	al Server Error
 * */