/**
       * @api {post} /api/v1/clientcompany Create Client Company
       * @apiHeader {String} x-access-token Users unique access-key.
       * @apiGroup ClienteCompany
       *  @apiSuccess {String} name ClienteCompany name
        * @apiSuccess {Integer} company_id Company company_id
        * @apiSuccess {String} phone ClienteCompany phone
       * @apiExample {curl} Example usage:
        curl  -F POST http://localhost:3000/api/v1/clientcompany \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
            -d 'name=Higor&phone=88988297190&company_id=10'
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
        {
            "status": true,
            "id": 157,
            "name": "Higor",
            "phone": "88988297190",
            "company_id": "10",
            "updated_at": "2018-01-26T17:55:42.472Z",
            "created_at": "2018-01-26T17:55:42.471Z"
        }
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 404 Bad Request
        [
            {
                "title": "Nome",
                "message": "Nome é requerido!"
            },
            {
                "title": "Telefone",
                "message": "Telefone é requerido!"
            },
            {
                "title": "Empresa",
                "message": "Empresa é requerido! "
            }
        ]   
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 500 Internal Server Error
       */

/**
       * @api {get} /api/v1/clientcompany List All Client Company
       * @apiHeader {String} x-access-token Users unique access-key.
       * @apiGroup ClienteCompany
       * @apiExample {curl} Example usage:
        curl http://localhost:3000/api/v1/clientcompany \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
        [
            {
                "status": true,
                "id": 157,
                "name": "Higor",
                "phone": "88988297190",
                "company_id": "10",
                "updated_at": "2018-01-26T17:55:42.472Z",
                "created_at": "2018-01-26T17:55:42.471Z"
            }
        ]
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 500 Internal Server Error
       */

/**
       * @api {get} /api/v1/clientcompany/:id Find One Client Company
       * @apiHeader {String} x-access-token Users unique access-key.
       * @apiGroup ClienteCompany
       * @apiParam {id} id ClienteCompany id
       * @apiExample {curl} Example usage:
        curl http://localhost:3000/api/v1/clientcompany/157 \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
        {
            "status": true,
            "id": 157,
            "name": "Higor",
            "phone": "88988297190",
            "company_id": "10",
            "updated_at": "2018-01-26T17:55:42.472Z",
            "created_at": "2018-01-26T17:55:42.471Z"
        }
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 500 Internal Server Error
       */


/**
       * @api {get} /api/v1/clientcompany/phone/:phone/company/:id Find One Client to Company 
       * @apiHeader {String} x-access-token Users unique access-key.
       * @apiGroup ClienteCompany
       * @apiParam {id} id Company id
       * @apiParam {phone} phone ClienteCompany phone
       * @apiExample {curl} Example usage:
        curl http://localhost:3000/api/v1/clientcompany/phone/88988297190/company/157 \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
        {
            "status": true,
            "id": 157,
            "name": "Higor",
            "phone": "88988297190",
            "company_id": "10",
            "updated_at": "2018-01-26T17:55:42.472Z",
            "created_at": "2018-01-26T17:55:42.471Z"
        }
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 500 Internal Server Error
       */

 /**
    * @api {put} /api/v1/clientcompany/:id Update ClienteCompany
    * @apiGroup ClienteCompany
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} AccountType Post's lists
    * @apiParam {id} id ClienteCompany id
    * @apiSuccess {String} name ClienteCompany name
    * @apiSuccess {Integer} company_id Company company_id
    * @apiSuccess {String} phone ClienteCompany phone
    * @apiExample {curl} Example usage:
        curl -X PUT \
        http://localhost:3000/api/v1/clientcompany/157 \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -H 'x-access-token: Aqui Seu token' 
        -d 'name=Higor&phone=88988297190&company_id=10'
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
    * @api {delete} /api/v1/clientcompany/:id Delete ClienteCompany
    * @apiGroup ClienteCompany
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} AccountType Post's lists
    * @apiParam {id} id ClienteCompany id
    * @apiExample {curl} Example usage:
        curl -X DELETE \
        http://localhost:3000/api/v1/clientcompany/157 \
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