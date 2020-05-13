/**
    * @api {post} /api/v1/state Create State
    * @apiGroup State
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} State Post's lists
    * @apiSuccess {String} name State name
    * @apiSuccess {String} initials State initials
    * @apiSuccess {String} country_id State country_id
    * @apiExample {curl} Example usage:
    curl -X POST \
    http://localhost:3000/api/v1/state \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'x-access-token: Aqui Seu token' \
    -d 'name=Pernambuco&initials=PE&country_id=1'
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 201 OK
        {
            "id": 1,
            "name": "Pernambuco",
            "lat": "-8.8137173",
            "lng": "-36.95410700000002",
            "initials": "PE",
            "created_at": "2017-10-31T15:19:19.000Z",
            "updated_at": "2017-10-31T15:19:19.000Z",
            "country_id": 1
        }
     * @apiErrorExample {json} List error
    *    HTTP/1.1 400 Bad Request
    [
        {
            "title": "Nome",
            "message": "Nome é requerido!"
        },
        {
            "title": "Siglas",
            "message": "Siglas é requerido!"
        },
        {
            "title": "País",
            "message": "País é requerido!"
        }
    ]
    *    HTTP/1.1 500 Intern	al Server Error
 * */

/**
    * @api {get} /api/v1/state/:id Find One State
    * @apiGroup State
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} State Post's lists
    * @apiParam {id} id Country id
    * @apiExample {curl} Example usage:
    curl http://localhost:3000/api/v1/state/1 \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'x-access-token: Aqui Seu token' 
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
    {
        "id": 1,
        "name": "Pernambuco",
        "lat": "-8.8137173",
        "lng": "-36.95410700000002",
        "initials": "PE",
        "created_at": "2017-10-31T15:19:19.000Z",
        "updated_at": "2017-10-31T15:19:19.000Z",
        "country_id": 1
    },
    
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
    * @api {get} /api/v1/state/country/:id List Country in State
    * @apiGroup State
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} State Post's lists
    * @apiParam {id} country_id Country country_id
    * @apiExample {curl} Example usage:
    curl http://localhost:3000/api/v1/state/country/1 \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'x-access-token: Aqui Seu token' 
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
    [
        {
            "Country": {
                "created_at": "2017-10-31T15:18:39.000Z",
                "id": 1,
                "initials": "BR",
                "lat": "-14.235004",
                "lng": "-51.92527999999999",
                "name": "Brasil",
                "updated_at": "2017-10-31T15:18:39.000Z"
            },
            "created_at": "2017-10-31T15:19:19.000Z",
            "id": 1,
            "initials": "PE",
            "lat": "-8.8137173",
            "lng": "-36.95410700000002",
            "name": "Pernambuco",
            "updated_at": "2017-10-31T15:19:19.000Z"
        }
    ]
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
    * @api {get} /api/v1/state List All State
    * @apiGroup State
    * @apiSuccess {Object[]} State Post's lists
    * @apiExample {curl} Example usage:
    curl http://localhost:3000/api/v1/state \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
    [ 
        {
            "id": 1,
            "name": "Pernambuco",
            "lat": "-8.8137173",
            "lng": "-36.95410700000002",
            "initials": "PE",
            "created_at": "2017-10-31T15:19:19.000Z",
            "updated_at": "2017-10-31T15:19:19.000Z",
            "country_id": 1
        }
    ]
    
     * @apiErrorExample {json} List error    
    *    HTTP/1.1 500 Intern	al Server Error
 * */

 /**
    * @api {put} /api/v1/state/:id Update State
    * @apiGroup State
    * @apiSuccess {Object[]} State Post's lists
    * @apiParam {id} id State id
    * @apiSuccess {String} name State name
    * @apiSuccess {String} initials State initials
    * @apiSuccess {String} country_id State country_id
    * @apiExample {curl} Example usage:
    curl -X PUT \
    http://localhost:3000/api/v1/state/id \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
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
    * @api {delete} /api/v1/state/:id Delete State
    * @apiGroup State
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} State Post's lists
    * @apiParam {id} id State id
    * @apiExample {curl} Example usage:
    curl -X DELETE \
    http://localhost:3000/api/v1/state/1 \
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
