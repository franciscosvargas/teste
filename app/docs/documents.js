/**
       * @api {post} /api/v1/document Create Document
       * @apiGroup Document
       * @apiParam {id} id Document id
       * @apiSuccess {String} url Document url
       * @apiSuccess {Integer} type_document_id TypeDocument type_document_id
       * @apiSuccess {Integer} user_id User user_id
       * @apiExample {curl} Example usage:
        curl -X POST http://localhost:3000/api/v1/document/8 \
            -H 'Cache-Control: no-cache' \
            -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \
            -F 'url=@/Users/higordiego/Desktop/Captura de Tela 2018-01-29 às 09.10.51.png' \
            -F type_document_id=1 \
            -F user_id=1
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
       {
            "status": true,
            "id": 141,
            "type_document_id": "1",
            "user_id": "1",
            "url": "3f978d30fa82dcd80f5acfc81fb23fba.png",
            "updated_at": "2018-01-30T09:16:34.020Z",
            "created_at": "2018-01-30T09:16:34.019Z"
        }
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 404 Bad Request
        [
            {
                "title": "Tipo de Documento",
                "message": "Tipo de Documento é requerido!"
            },
            {
                "title": "Usuário",
                "message": "Usuário é requerido"
            },
             {
                "title": "Url",
                "message": "Url é requerido"
            }
        ]
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 500 Internal Server Error
       */
/**
      * @api {put} /api/v1/document/:id Update Document
      * @apiHeader {String} x-access-token Users unique access-key.
      * @apiGroup Document
      * @apiParam {id} id Document id
      * @apiSuccess {String} url Document url
      * @apiSuccess {Integer} type_document_id TypeDocument type_document_id
     * @apiSuccess {Integer} user_id User user_id
      * @apiExample {curl} Example usage:
       curl -X PUT http://localhost:3000/api/v1/document/8 \
           -H 'Cache-Control: no-cache' \
           -H 'x-access-token: Aqui Seu token' 
           -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \
           -F 'url=@/Users/higordiego/Desktop/Captura de Tela 2018-01-29 às 09.10.51.png' \
           -F type_document_id=1 \
           -F user_id=1
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
       * @api {delete} /api/v1/document/:id Delete Document
       * @apiHeader {String} x-access-token Users unique access-key.
       * @apiGroup Document
       * @apiParam {id} id Country id
       * @apiExample {curl} Example usage:
        curl -X DELETE http://localhost:3000/api/v1/document/1 \
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

/**
       * @api {get} /api/v1/document/:id Find One Document
       * @apiHeader {String} x-access-token Users unique access-key.
       * @apiGroup Document
       * @apiParam {id} id Document id
       * @apiExample {curl} Example usage:
        curl http://localhost:3000/api/v1/document/141 \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
       {
            "status": true,
            "id": 141,
            "type_document_id": "1",
            "user_id": "1",
            "url": "3f978d30fa82dcd80f5acfc81fb23fba.png",
            "updated_at": "2018-01-30T09:16:34.020Z",
            "created_at": "2018-01-30T09:16:34.019Z"
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
       * @api {get} /api/v1/document List All Document
       * @apiHeader {String} x-access-token Users unique access-key.
       * @apiGroup Document
       * @apiExample {curl} Example usage:
        curl http://localhost:3000/api/v1/document \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
       [
           {
            "status": true,
            "id": 141,
            "type_document_id": "1",
            "user_id": "1",
            "url": "3f978d30fa82dcd80f5acfc81fb23fba.png",
            "updated_at": "2018-01-30T09:16:34.020Z",
            "created_at": "2018-01-30T09:16:34.019Z"
            }
        ]
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 500 Internal Server Error
       */