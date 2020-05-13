/**
    * @api {post} /api/v1/accounttype Create AccountType
    * @apiGroup AccountType
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} AccountType Post's lists
    * @apiSuccess {String} name AccountType name
    * @apiExample {curl} Example usage:
         curl -X POST \
        http://localhost:3000/api/v1/accounttype \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -H 'x-access-token: Aqui Seu token' \
        -d name=User
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 201 OK
   {
        "status": true,
        "id": 1,
        "name": "User",
        "updated_at": "2018-01-25T17:28:17.580Z",
        "created_at": "2018-01-25T17:28:17.579Z"
    }
     * @apiErrorExample {json} List error
    *    HTTP/1.1 400 Bad Request
    [
        {
            "title": "Name",
            "message": "Name é requerido!"
        }
    ]
    *    HTTP/1.1 500 Intern	al Server Error
 * */

/**
    * @api {get} /api/v1/accounttype/:id Find One AccountType
    * @apiGroup AccountType
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} AccountType Post's lists
    * @apiParam {id} id AccountType id
    * @apiExample {curl} Example usage:
    curl http://localhost:3000/api/v1/accounttype/1 \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'x-access-token: Aqui Seu token' 
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
    {
        "status": true,
        "id": 1,
        "name": "User",
        "updated_at": "2018-01-25T17:28:17.580Z",
        "created_at": "2018-01-25T17:28:17.579Z"
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
    * @api {get} /api/v1/accounttype List all AccountType
    * @apiGroup AccountType
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} AccountType Post's lists
    * @apiParam {id} id AccountType id
    * @apiExample {curl} Example usage:
    curl http://localhost:3000/api/v1/accounttype \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'x-access-token: Aqui Seu token' 
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
    [ 
        {
            "status": true,
            "id": 1,
            "name": "User",
            "updated_at": "2018-01-25T17:28:17.580Z",
            "created_at": "2018-01-25T17:28:17.579Z"
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
    * @api {put} /api/v1/accounttype/:id Update AccountType
    * @apiGroup AccountType
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} AccountType Post's lists
    * @apiParam {id} id AccountType id
    * @apiSuccess {String} name AccountType name
    * @apiExample {curl} Example usage:
    curl -X PUT http://localhost:3000/api/v1/accounttype/1 \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'x-access-token: Aqui Seu token' 
    -d name=User
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
    [
            {
                "title": "Alterado com sucesso!",
                "message": "Conseguimos alterar o seu registro com sucesso!"
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
    * @api {delete} /api/v1/accounttype/:id Delete AccountType
    * @apiGroup AccountType
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} AccountType Post's Delete
    * @apiParam {id} id AccountType id
    * @apiExample {curl} Example usage:
        curl -X DELETE \
        http://localhost:3000/api/v1/accounttype/1 \
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
