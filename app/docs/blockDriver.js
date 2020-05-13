/**
    * @api {post} /api/v1/blockdriver Create BlockDriver
    * @apiGroup BlockDriver
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} BlockDriver Post's lists
    * @apiSuccess {String} name BlockDriver name
    * @apiSuccess {String} description BlockDriver description
    * @apiSuccess {Integer} driver_id Driver driver_id
    * @apiSuccess {Integer} company_id Company company_id
    * @apiExample {curl} Example usage:
         curl -X POST \
        http://localhost:3000/api/v1/blockdriver \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -H 'x-access-token: Aqui Seu token' \
        -d 'description=Descri%C3%A7%C3%A3o&company_id=1&driver_id=6'
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 201 OK
   {
        "status": true,
        "id": 8,
        "description": "Descrição",
        "company_id": "1",
        "driver_id": "6",
        "updated_at": "2018-01-25T18:20:46.354Z",
        "created_at": "2018-01-25T18:20:46.353Z"
    }
     * @apiErrorExample {json} List error
    *    HTTP/1.1 400 Bad Request
    [
        {
            "title": "Descrição",
            "message": "Descrição é requerido!"
        },
        {
            "title": "Empresa",
            "message": "Empresa é requerido!"
        },
        {
            "title": "Mostorista",
            "message": "Motorista é requerido!"
        }
    ]
    *    HTTP/1.1 500 Intern	al Server Error
 * */

 /**
    * @api {get} /api/v1/blockdriver/:id Find One BlockDriver
    * @apiGroup BlockDriver
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} BlockDriver Post's lists
    * @apiParam {id} id BlockDriver id
    * @apiExample {curl} Example usage:
        curl http://localhost:3000/api/v1/blockdriver/8 \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -H 'x-access-token: Aqui Seu token' \
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
   {
        "status": true,
        "id": 8,
        "description": "Descrição",
        "company_id": "1",
        "driver_id": "6",
        "updated_at": "2018-01-25T18:20:46.354Z",
        "created_at": "2018-01-25T18:20:46.353Z"
    }
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
    * @api {get} /api/v1/blockdriver Find All BlockDriver
    * @apiGroup BlockDriver
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} BlockDriver Post's lists
    * @apiExample {curl} Example usage:
        curl http://localhost:3000/api/v1/blockdriver \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -H 'x-access-token: Aqui Seu token' \
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
   [ 
       {
            "status": true,
            "id": 8,
            "description": "Descrição",
            "company_id": "1",
            "driver_id": "6",
            "updated_at": "2018-01-25T18:20:46.354Z",
            "created_at": "2018-01-25T18:20:46.353Z"
        }
    ]
     * @apiErrorExample {json} List error
    *    HTTP/1.1 500 Intern	al Server Error
 * */
