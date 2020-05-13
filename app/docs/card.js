/**
    * @api {post} /api/v1/card/company Create Card Company
    * @apiGroup Card
    * @apiSuccess {Object[]} Card Post's Create
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {String} cardNumber Card cardNumber
    * @apiSuccess {String} cardExpirationDate Card cardExpirationDate
    * @apiSuccess {String} cardCvv Card cardCvv
    * @apiSuccess {String} cardHolderName Card cardHolderName
    * @apiSuccess {Integer} company_id Card company_id
    * @apiExample {curl} Example usage:
    curl -X POST \
    http://localhost:3000/api/v1/card/company \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
      -d 'cardNumber=4716895145083754&cardExpirationDate=1118&cardCvv=196&cardHolderName=Higor%20Diego%20Alves%20Ferreira%20Pinheiro&company_id=4'
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 201 OK
    {
        "id": 18,
        "object": "card",
        "cardId": "card_cjcwaui23007imi5yitxhchjx",
        "dateCreated": "2018-01-26T19:07:22.731Z",
        "dateUpdated": "2018-01-26T19:07:24.097Z",
        "brand": "visa",
        "holderName": "Higor Diego Alves Ferreira Pinheiro",
        "firstDigits": "471689",
        "lastDigits": "3754",
        "country": "UNITED STATES",
        "fingerprint": "cjcwauhhsc8zl0o66peyw4db6",
        "valid": false,
        "cardCvv": "196",
        "company_id": "4",
        "updated_at": "2018-01-26T16:07:24.180Z",
        "created_at": "2018-01-26T16:07:24.178Z"
    }
     * @apiErrorExample {json} List error
    *    HTTP/1.1 400 Bad Request
    [
        {
            "title": "Numero do Cartão",
            "message": "Numero do Cartão é requerido!"
        },
        {
            "title": "Data de Vencimento",
            "message": "Data de Vencimento é requerido!"
        },
        {
            "title": "Cvv",
            "message": "Cvv é requerido!"
        },
        {
            "title": "Nome",
            "message": "Nome é requerido!"
        },
        {
            "title": "Empresa",
            "message": "Empresa é requerido!"
        }
    ]
    *    HTTP/1.1 500 Intern	al Server Error
 * */

 /**
    * @api {post} /api/v1/card Create Card
    * @apiGroup Card
    * @apiSuccess {Object[]} Card Post's Create
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {String} cardNumber Card cardNumber
    * @apiSuccess {String} cardExpirationDate Card cardExpirationDate
    * @apiSuccess {String} cardCvv Card cardCvv
    * @apiSuccess {String} cardHolderName Card cardHolderName
    * @apiSuccess {Integer} user_id Card user_id
    * @apiExample {curl} Example usage:
    curl -X POST \
    http://localhost:3000/api/v1/card \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
      -d 'cardNumber=4716895145083754&cardExpirationDate=1118&cardCvv=196&cardHolderName=Higor%20Diego%20Alves%20Ferreira%20Pinheiro&user_id=84'
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
    {
            "id": 1,
            "object": "card",
            "cardId": "card_cjbi4z3te08wfoe5yz500zdtg",
            "dateCreated": "2017-12-22T16:34:31.058Z",
            "dateUpdated": "2017-12-22T16:34:32.701Z",
            "brand": "visa",
            "holderName": "Fulano de tal",
            "firstDigits": "491693",
            "lastDigits": "1915",
            "country": "ITALY",
            "fingerprint": "cjbi4z3003zdz0h754e4kab4c",
            "customer": null,
            "valid": "0",
            "expirationDate": null,
            "cardCvv": "450",
            "payment": null,
            "status": null,
            "created_at": "2017-12-22T13:34:32.000Z",
            "updated_at": "2017-12-22T13:34:32.000Z",
            "user_id": 84,
            "company_id": null,
    }
    
     * @apiErrorExample {json} List error
    *    HTTP/1.1 400 Bad Request
    [
        {
            "title": "Numero do Cartão",
            "message": "Numero do Cartão é requerido!"
        },
        {
            "title": "Data de Vencimento",
            "message": "Data de Vencimento é requerido!"
        },
        {
            "title": "Cvv",
            "message": "Cvv é requerido!"
        },
        {
            "title": "Nome",
            "message": "Nome é requerido!"
        },
        {
            "title": "Usuário",
            "message": "Usuário é requerido!"
        }
    ]
    *    HTTP/1.1 500 Intern	al Server Error
 * */

/**
    * @api {get} /api/v1/card/:id Find One Card
    * @apiGroup Card
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} Card Post's lists
    * @apiParam {id} id Card id
    * @apiExample {curl} Example usage:
    curl http://localhost:3000/api/v1/card/10 \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'x-access-token: Aqui Seu token' 
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
     {
        "id": 18,
        "object": "card",
        "cardId": "card_cjcwaui23007imi5yitxhchjx",
        "dateCreated": "2018-01-26T19:07:22.731Z",
        "dateUpdated": "2018-01-26T19:07:24.097Z",
        "brand": "visa",
        "holderName": "Higor Diego Alves Ferreira Pinheiro",
        "firstDigits": "471689",
        "lastDigits": "3754",
        "country": "UNITED STATES",
        "fingerprint": "cjcwauhhsc8zl0o66peyw4db6",
        "valid": false,
        "cardCvv": "196",
        "company_id": "4",
        "updated_at": "2018-01-26T16:07:24.180Z",
        "created_at": "2018-01-26T16:07:24.178Z"
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
    * @api {get} /api/v1/card List All Card
    * @apiGroup Card
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} Card Post's lists
    * @apiParam {id} id Card id
    * @apiExample {curl} Example usage:
    curl http://localhost:3000/api/v1/card \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'x-access-token: Aqui Seu token' 
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
     [
         {
            "id": 18,
            "object": "card",
            "cardId": "card_cjcwaui23007imi5yitxhchjx",
            "dateCreated": "2018-01-26T19:07:22.731Z",
            "dateUpdated": "2018-01-26T19:07:24.097Z",
            "brand": "visa",
            "holderName": "Higor Diego Alves Ferreira Pinheiro",
            "firstDigits": "471689",
            "lastDigits": "3754",
            "country": "UNITED STATES",
            "fingerprint": "cjcwauhhsc8zl0o66peyw4db6",
            "valid": false,
            "cardCvv": "196",
            "company_id": "4",
            "updated_at": "2018-01-26T16:07:24.180Z",
            "created_at": "2018-01-26T16:07:24.178Z"
        }
    ]
     * @apiErrorExample {json} List error    
    *    HTTP/1.1 500 Intern	al Server Error
 * */

/**
    * @api {get} /api/v1/card/company/:id List One Card Company
    * @apiGroup Card
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} Card Post's lists
    * @apiParam {id} company_id Company company_id
    * @apiExample {curl} Example usage:
    curl http://localhost:3000/api/v1/card/company/4 \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'x-access-token: Aqui Seu token' 
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
     [
         {
            "id": 18,
            "object": "card",
            "cardId": "card_cjcwaui23007imi5yitxhchjx",
            "dateCreated": "2018-01-26T19:07:22.731Z",
            "dateUpdated": "2018-01-26T19:07:24.097Z",
            "brand": "visa",
            "holderName": "Higor Diego Alves Ferreira Pinheiro",
            "firstDigits": "471689",
            "lastDigits": "3754",
            "country": "UNITED STATES",
            "fingerprint": "cjcwauhhsc8zl0o66peyw4db6",
            "valid": false,
            "cardCvv": "196",
            "company_id": "4",
            "updated_at": "2018-01-26T16:07:24.180Z",
            "created_at": "2018-01-26T16:07:24.178Z"
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
    * @api {get} /api/v1/card/user/:id List All Card User
    * @apiGroup Card
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} Card Post's lists
    * @apiParam {id} user_id User user_id
    * @apiExample {curl} Example usage:
    curl http://localhost:3000/api/v1/card/user/84 \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'x-access-token: Aqui Seu token' 
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
     [
        {
            "id": 1,
            "object": "card",
            "cardId": "card_cjbi4z3te08wfoe5yz500zdtg",
            "dateCreated": "2017-12-22T16:34:31.058Z",
            "dateUpdated": "2017-12-22T16:34:32.701Z",
            "brand": "visa",
            "holderName": "Fulano de tal",
            "firstDigits": "491693",
            "lastDigits": "1915",
            "country": "ITALY",
            "fingerprint": "cjbi4z3003zdz0h754e4kab4c",
            "customer": null,
            "valid": "0",
            "expirationDate": null,
            "cardCvv": "450",
            "payment": null,
            "status": null,
            "created_at": "2017-12-22T13:34:32.000Z",
            "updated_at": "2017-12-22T13:34:32.000Z",
            "user_id": 84,
            "company_id": null,
            "User": {
                "id": 84,
                "name": "MICAELA LAÍS",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODQsIm5hbWUiOiJNSUNBRUxBIExBw41TIiwiaWF0IjoxNTE1Njk0MDc3fQ.whISVXRY-RdjDnAwx0wlIRvwGPsF6zeEmEp53NPzRmE",
                "forgot": "SytGYi8JwXQa7wXWaw74Mm55g6Y4Fb",
                "active": "",
                "number": 981661414,
                "ddd": 81,
                "ddi": "55",
                "email": "micaelalais@hotmail.com",
                "master": false,
                "alias": "Miquinha",
                "password": "c8411f767ee33049e361b6251a757c6f",
                "birthday": null,
                "cpf": null,
                "first": false,
                "stage": 7,
                "status": true,
                "created_at": "2017-11-22T10:45:27.000Z",
                "updated_at": "2018-01-11T15:07:57.000Z",
                "types_user_id": 2
            },
            "Company": null
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
    * @api {get} /api/v1/card List All Card
    * @apiGroup Card
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} Card Post's lists
    * @apiExample {curl} Example usage:
    curl http://localhost:3000/api/v1/card \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'x-access-token: Aqui Seu token' 
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
     [
        {
            "id": 1,
            "object": "card",
            "cardId": "card_cjbi4z3te08wfoe5yz500zdtg",
            "dateCreated": "2017-12-22T16:34:31.058Z",
            "dateUpdated": "2017-12-22T16:34:32.701Z",
            "brand": "visa",
            "holderName": "Fulano de tal",
            "firstDigits": "491693",
            "lastDigits": "1915",
            "country": "ITALY",
            "fingerprint": "cjbi4z3003zdz0h754e4kab4c",
            "customer": null,
            "valid": "0",
            "expirationDate": null,
            "cardCvv": "450",
            "payment": null,
            "status": null,
            "created_at": "2017-12-22T13:34:32.000Z",
            "updated_at": "2017-12-22T13:34:32.000Z",
            "user_id": 84,
            "company_id": null,
            "User": {
                "id": 84,
                "name": "MICAELA LAÍS",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODQsIm5hbWUiOiJNSUNBRUxBIExBw41TIiwiaWF0IjoxNTE1Njk0MDc3fQ.whISVXRY-RdjDnAwx0wlIRvwGPsF6zeEmEp53NPzRmE",
                "forgot": "SytGYi8JwXQa7wXWaw74Mm55g6Y4Fb",
                "active": "",
                "number": 981661414,
                "ddd": 81,
                "ddi": "55",
                "email": "micaelalais@hotmail.com",
                "master": false,
                "alias": "Miquinha",
                "password": "c8411f767ee33049e361b6251a757c6f",
                "birthday": null,
                "cpf": null,
                "first": false,
                "stage": 7,
                "status": true,
                "created_at": "2017-11-22T10:45:27.000Z",
                "updated_at": "2018-01-11T15:07:57.000Z",
                "types_user_id": 2
            },
            "Company": null
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
       * @api {delete} /api/v1/card/:id Delete a Card
       * @apiHeader {String} x-access-token Users unique access-key.
       * @apiGroup Card
       * @apiParam {id} id Card id
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

