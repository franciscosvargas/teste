/**
       * @api {post} /api/v1/discount Create Discount
       * @apiHeader {String} x-access-token Users unique access-key.
       * @apiGroup Discount
       *  @apiSuccess {String} percent Discount percent
       * @apiExample {curl} Example usage:
        curl -X POST http://localhost:3000/api/v1/discount \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
            -d percent=0.20
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
        {
            "status": true,
            "id": 8,
            "percent": "0.20",
            "updated_at": "2018-01-29T17:26:19.270Z",
            "created_at": "2018-01-29T17:26:19.269Z"
        }
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 404 Bad Request
        [
            {
                "title": "Porcentagem",
                "message": "Porcentagem é requerido!"
            }
        ]
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 500 Internal Server Error
       */

       /**
       * @api {get} /api/v1/discount List All Discount
       * @apiHeader {String} x-access-token Users unique access-key.
       * @apiGroup Discount
       * @apiExample {curl} Example usage:
        curl http://localhost:3000/api/v1/discount \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
        [
            {
                "status": true,
                "id": 8,
                "percent": "0.20",
                "updated_at": "2018-01-29T17:26:19.270Z",
                "created_at": "2018-01-29T17:26:19.269Z"
            }
        ]
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 500 Internal Server Error
       */

/**
       * @api {get} /api/v1/discount/:id Find One Discount
       * @apiHeader {String} x-access-token Users unique access-key.
       * @apiGroup Discount
       * @apiParam {id} id Country id
       * @apiExample {curl} Example usage:
        curl http://localhost:3000/api/v1/discount/8 \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
        {
            "status": true,
            "id": 8,
            "percent": "0.20",
            "updated_at": "2018-01-29T17:26:19.270Z",
            "created_at": "2018-01-29T17:26:19.269Z"
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
       * @api {put} /api/v1/discount/:id Update Discount
       * @apiHeader {String} x-access-token Users unique access-key.
       * @apiGroup Discount
       * @apiParam {id} id Country id
       *  @apiSuccess {String} percent Discount percent
       * @apiExample {curl} Example usage:
        curl -X PUT http://localhost:3000/api/v1/discount/8 \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
            -d percent=0.20
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
       [
            {
                "title": "Alterado com sucesso!",
                "message": "Conseguimos alterar o seu registro com sucesso!"
            }
        ]
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
       * @api {delete} /api/v1/discount/:id Delete Discount
       * @apiHeader {String} x-access-token Users unique access-key.
       * @apiGroup Discount
       * @apiParam {id} id Country id
       * @apiExample {curl} Example usage:
        curl -X DELETE http://localhost:3000/api/v1/discount/8 \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
       [
            {
                "title": "Deletado",
                "message": "Deletado com Sucesso!"
            }
        ]
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

