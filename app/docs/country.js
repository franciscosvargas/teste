/**
    * @api {post} /api/v1/country Create Country
    * @apiGroup Country
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} country Post's lists
    * @apiSuccess {String} name Country zipCode
    * @apiSuccess {String} initials Country initials
    * @apiExample {curl} Example usage:
    curl -X POST \
    http://localhost:3000/api/v1/country \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'x-access-token: Aqui Seu token' \
    -d 'name=Brasil&initials=Br'
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 201 OK
        {
            "id": 1,
            "name": "Brasil",
            "lat": "-14.235004",
            "lng": "-51.92527999999999",
            "initials": "BR",
            "created_at": "2017-10-31T15:18:39.000Z",
            "updated_at": "2017-10-31T15:18:39.000Z"
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
        }
    ]
    *    HTTP/1.1 500 Intern	al Server Error
 * */

/**
    * @api {get} /api/v1/country List All Country
    * @apiGroup Country
    * @apiSuccess {Object[]} Country Post's lists
    * @apiExample {curl} Example usage:
    curl http://localhost:3000/api/v1/country \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'x-access-token: Aqui Seu token' 
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
       [
            {
                "id": 1,
                "name": "Brasil",
                "lat": "-14.235004",
                "lng": "-51.92527999999999",
                "initials": "BR",
                "created_at": "2017-10-31T15:18:39.000Z",
                "updated_at": "2017-10-31T15:18:39.000Z"
            }
        ]
     * @apiErrorExample {json} List error    
    *    HTTP/1.1 500 Intern	al Server Error
 * */

 /**
    * @api {get} /api/v1/country/:id Find One Country
    * @apiGroup Country
    * @apiSuccess {Object[]} Country Post's lists
    * @apiExample {curl} Example usage:
    curl http://localhost:3000/api/v1/country/1 \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'x-access-token: Aqui Seu token' 
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
        {
            "id": 1,
            "name": "Brasil",
            "lat": "-14.235004",
            "lng": "-51.92527999999999",
            "initials": "BR",
            "created_at": "2017-10-31T15:18:39.000Z",
            "updated_at": "2017-10-31T15:18:39.000Z"
        }
    
     * @apiErrorExample {json} List error    
    *    HTTP/1.1 500 Intern	al Server Error
 * */

/**
        * @api {put} /api/v1/country/:id Update a Country
        * @apiHeader {String} x-access-token Users unique access-key.
        * @apiGroup Country
        * @apiParam {id} id Country id
        * @apiSuccess {String} name Country zipCode
        * @apiSuccess {String} initials Country initials
        * @apiExample {curl} Example usage:
        curl -X PUT \
        http://localhost:3000/api/v1/country/1 \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -H 'x-access-token: Aqui Seu token' 
        
        -d 'name=Brasil&initials=Br'
        * @apiSuccessExample {json} Success
        *    HTTP/1.1 200 OK
        [
            {
                "title": "Alterado com sucesso!",
                "message": "Conseguimos alterar o seu registro com sucesso!"
            }
        ]
        * @apiErrorExample {json} Address Bad Request
        *    HTTP/1.1 404 Bad Request
            [
                {
                    "title": "Id",
                    "message": "Id invalido!"
                }
            ]
        *    HTTP/1.1 500 Intern	al Server Error
**/
/**
        * @api {delete} /api/v1/country/:id Delete a Country
        * @apiHeader {String} x-access-token Users unique access-key.
        * @apiGroup Country
        * @apiParam {id} id Country id
        * @apiExample {curl} Example usage:
        curl -X DELETE \
        http://localhost:3000/api/v1/country/1 \
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
       
        * @apiErrorExample {json} Address Bad Request
        *    HTTP/1.1 404 Bad Request
        [
            {
                "title": "Id",
                "message": "Id invalido!"
            }
        ]
        *    HTTP/1.1 500 Intern	al Server Error
**/
