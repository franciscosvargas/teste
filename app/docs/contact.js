
/**
    * @api {post} /api/v1/contact Create Contact
    * @apiGroup Contact
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} Contact Post's Create
    * @apiSuccess {String} email Contact email
    * @apiSuccess {String} name Contact name
    * @apiSuccess {String} description Contact description
    * @apiExample {curl} Example usage:
        curl -X POST http://localhost:3000/api/v1/contact \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -H 'x-access-token: Aqui Seu token' 
        -d 'name=Higor%20Diego&email=higordiegoti%40gmail.com&description=descri%C3%A7%C3%A3o'
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
    {
        "id": 9,
        "name": "Higor Diego",
        "email": "higordiegoti@gmail.com",
        "description": "descrição",
        "updated_at": "2018-01-29T12:18:18.804Z",
        "created_at": "2018-01-29T12:18:18.801Z"
    }
     * @apiErrorExample {json} List error
    *    HTTP/1.1 400 Bad Request
   [
        {
            "title": "Email",
            "message": "Email é requerido!"
        },
        {
            "title": "Nome",
            "message": "Nome é requerido!"
        },
        {
            "title": "Descrição",
            "message": "Descrição é requerido!"
        }
    ]
    *    HTTP/1.1 500 Intern	al Server Error
 * */

/**
    * @api {get} /api/v1/contact List All Contact
    * @apiGroup Contact
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} Contact Post's List
    * @apiExample {curl} Example usage:
        curl http://localhost:3000/api/v1/contact \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -H 'x-access-token: Aqui Seu token' 
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
    [ 
        {
            "id": 9,
            "name": "Higor Diego",
            "email": "higordiegoti@gmail.com",
            "description": "descrição",
            "updated_at": "2018-01-29T12:18:18.804Z",
            "created_at": "2018-01-29T12:18:18.801Z"
        }
    ]
     * @apiErrorExample {json} List error
    *    HTTP/1.1 500 Intern	al Server Error
 * */

/**
    * @api {get} /api/v1/contact/:id Find One Contact
    * @apiGroup Contact
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} Contact Post's List
    * @apiExample {curl} Example usage:
        curl http://localhost:3000/api/v1/contact/9 \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -H 'x-access-token: Aqui Seu token' 
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
    {
        "id": 9,
        "name": "Higor Diego",
        "email": "higordiegoti@gmail.com",
        "description": "descrição",
        "updated_at": "2018-01-29T12:18:18.804Z",
        "created_at": "2018-01-29T12:18:18.801Z"
    }
     * @apiErrorExample {json} List error
     *  HTTP/1.1 400 Bad Request
    [
        {
            "title": "Id",
            "message": "Id invalido!"
        }
    ]
    *    HTTP/1.1 500 Intern	al Server Error
 * */

 /**
    * @api {put} /api/v1/contact/:id Update Contact
    * @apiGroup Contact
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} Contact Post's Update
    * @apiSuccess {String} email Contact email
    * @apiSuccess {String} name Contact name
    * @apiSuccess {String} description Contact description
    * @apiExample {curl} Example usage:
        curl -X PUT http://localhost:3000/api/v1/contact/9 \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -H 'x-access-token: Aqui Seu token' 
        -d 'name=Higor%20Diego&email=higordiegoti%40gmail.com&description=descri%C3%A7%C3%A3o'
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
    * @api {delete} /api/v1/contact/:id Delete Contact
    * @apiGroup Contact
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} Contact Post's Delete
    * @apiExample {curl} Example usage:
        curl -X DELETE http://localhost:3000/api/v1/contact/9 \
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
