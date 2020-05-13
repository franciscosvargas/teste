/**
    * @api {post} /api/v1/city Create City
    * @apiGroup City
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} City Post's lists
    * @apiSuccess {String} name City name
    * @apiSuccess {String} state_id State state_id
    * @apiSuccess {String} country_id Country country_id
    * @apiExample {curl} Example usage:
    curl -X POST \
    http://localhost:3000/api/v1/city \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'x-access-token: Aqui Seu token' \
      -d 'name=Recife&state_id=1&country_id=1'
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 201 OK
    {
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
     * @apiErrorExample {json} List error
    *    HTTP/1.1 400 Bad Request
    [
        {
            "title": "Name",
            "message": "Name é requerido!"
        },
        {
            "title": "Iniciais",
            "message": "Iniciais é requerido!"
        },
        {
            "title": "País",
            "message": "País é requerido!"
        }
    ]
    *    HTTP/1.1 500 Intern	al Server Error
 * */

/**
    * @api {get} /api/v1/city/:id Find One City
    * @apiGroup City
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} City Post's lists
    * @apiParam {id} id City id
    * @apiExample {curl} Example usage:
    curl http://localhost:3000/api/v1/city/1 \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'x-access-token: Aqui Seu token' 
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
    {
        "id": 1,
        "name": "Recife",
        "lat": "-8.0475622",
        "lng": "-34.8769643",
        "status": true,
        "created_at": "2017-10-31T15:21:18.000Z",
        "updated_at": "2017-10-31T15:21:18.000Z",
        "country_id": 1,
        "state_id": 1,
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
        }
    }
     * @apiErrorExample {json} List error    
     * HTTP/1.1 404 Bad Request
    [
        {
            "title": "Id",
            "message": "Id invalido!"
        }
    ]
    *    HTTP/1.1 500 Intern	al Server Error
 * */
/**
    * @api {get} /api/v1/city List All City
    * @apiGroup City
    * @apiSuccess {Object[]} City Post's lists
    * @apiExample {curl} Example usage:
    curl http://localhost:3000/api/v1/city \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
    [
        {
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
    ]
    
     * @apiErrorExample {json} List error    
    *    HTTP/1.1 500 Intern	al Server Error
 * */

/**
    * @api {delete} /api/v1/city/:id Delete City
    * @apiGroup City
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} City Post's lists
    * @apiParam {id} id City id
    * @apiExample {curl} Example usage:
    curl -X DELETE \
    http://localhost:3000/api/v1/city/1 \
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
    * @api {put} /api/v1/city/:id Update City
    * @apiGroup City
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} State Post's lists
    * @apiParam {id} id City id
    * @apiSuccess {String} name City name
    * @apiSuccess {String} state_id State state_id
    * @apiSuccess {String} country_id Country country_id
    * @apiExample {curl} Example usage:
    curl -X PUT \
    http://localhost:3000/api/v1/city/1 \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'x-access-token: Aqui Seu token' 
    -d 'name=Pernambuco&initials=PE&country_id=1'
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
    * @api {get} /api/v1/state/city/state/:id List State in City
    * @apiGroup City
    * @apiSuccess {Object[]} City Post's lists
    * @apiParam {id} state_id State state_id
    * @apiExample {curl} Example usage:
        curl  http://localhost:3000/api/v1/city/state/1 \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
    [
        {
            "id": 1,
            "name": "Recife",
            "lat": "-8.0475622",
            "lng": "-34.8769643",
            "status": true,
            "created_at": "2017-10-31T15:21:18.000Z",
            "updated_at": "2017-10-31T15:21:18.000Z",
            "state_id": 1,
            "State": {
                "id": 1,
                "name": "Pernambuco",
                "lat": "-8.8137173",
                "lng": "-36.95410700000002",
                "initials": "PE",
                "created_at": "2017-10-31T15:19:19.000Z",
                "updated_at": "2017-10-31T15:19:19.000Z",
                "country_id": 1
            }
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
    * @api {get} /api/v1/state/city/name/:name List City by Name
    * @apiGroup City
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} City Post's lists
    * @apiParam {id} name City name
    * @apiExample {curl} Example usage:
        curl  http://localhost:3000/api/v1/city/name/recife \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -H 'x-access-token: Aqui Seu token' 
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
    [
        {
            "id": 1,
            "name": "Recife",
            "lat": "-8.0475622",
            "lng": "-34.8769643",
            "status": true,
            "created_at": "2017-10-31T15:21:18.000Z",
            "updated_at": "2017-10-31T15:21:18.000Z",
            "country_id": 1,
            "state_id": 1,
            "State": {
                "id": 1,
                "name": "Pernambuco",
                "lat": "-8.8137173",
                "lng": "-36.95410700000002",
                "initials": "PE",
                "created_at": "2017-10-31T15:19:19.000Z",
                "updated_at": "2017-10-31T15:19:19.000Z",
                "country_id": 1
            }
        }
    ]
     * @apiErrorExample {json} List error
    *    HTTP/1.1 400 Bad Request
   [
        {
            "title": "Nome",
            "message": "Nome é requerido!"
        }
    ]
    *    HTTP/1.1 500 Intern	al Server Error
 * */


