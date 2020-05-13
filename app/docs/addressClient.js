/**
    * @api {post} /api/v1/addressclient Create Address Client
    * @apiGroup AddressClient
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} address Post's lists
    * @apiSuccess {String} zipCode Address zipCode
    * @apiSuccess {String} title Address address
    * @apiSuccess {String} number Address number
    * @apiSuccess {String} district Address district
    * @apiSuccess {String} complement Address complement
    * @apiSuccess {Integer} state_id State id
    * @apiSuccess {Integer} city_id City id
    * @apiSuccess {Boolean} searchId Address searchId
    * @apiSuccess {Integer} country_id Country country_id
    * @apiSuccess {Integer} client_company_id ClientCompany client_company_id
    * @apiExample {curl} Example usage:
    curl -X POST \
        http://localhost:3000/api/v1/addressclient \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -H 'x-access-token: Aqui seu Token' \
        -d 'zipCode=50781290&address=Rua%20Barros%20Sobrinho&number=178&district=Areias%20&state_id=1&city_id=1&country_id=1&client_company_id=1&searchId=true'
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 201 OK
    {
        "id": 132,
        "zipCode": "50781290",
        "address": "Rua Barros Sobrinho",
        "number": "178",
        "district": "Areias ",
        "state_id": 1,
        "city_id": 1,
        "country_id": 1,
        "client_company_id": "1",
        "location": {
            "type": "Point",
            "coordinates": [
                -8.0874063,
                -34.9335804
            ]
        },
        "updated_at": "2018-01-25T17:04:17.873Z",
        "created_at": "2018-01-25T17:04:17.872Z"
    }
    * @apiErrorExample {json} List error
    *    HTTP/1.1 400 Bad Request
        [
    {
        "title": "Cep",
        "message": "Cep é requerido!"
    },
    {
        "title": "Endereço",
        "message": "Endereço é requerido!"
    },
    {
        "title": "Numero",
        "message": "Numero é requerido!"
    },
    {
        "title": "Bairro",
        "message": "Bairro é requerido!"
    },
    {
        "title": "Estado",
        "message": "Estado é requerido!"
    },
    {
        "title": "Cidade",
        "message": "Cidade é requerido!"
    },
    {
        "title": "País",
        "message": "País é requerido!"
    },
    {
        "title": " Cliente",
        "message": "Cliente é requerido!"
    },         
    {
        "title": "searchId"
    }
]
 
    *    HTTP/1.1 500 Intern	al Server Error
 * */

/**
    * @api {get} /api/v1/addressclient/:id Find One AddressClient
    * @apiGroup AddressClient
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} AddressClient Post's lists
    * @apiParam {id} id AddressClient id
    * @apiExample {curl} Example usage:
    curl http://localhost:3000/api/v1/addressclient/1 \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'x-access-token: Aqui Seu token' 
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
    {
        "id": 1,
        "zipCode": "50050540",
        "location": {
            "type": "Point",
            "coordinates": [
                -8.0544993,
                -34.8832516
            ]
        },
        "address": "Avenida Visconde de Suassuna",
        "number": "128",
        "district": "Santo Amaro",
        "complement": null,
        "default": null,
        "created_at": "2017-11-19T17:47:55.000Z",
        "updated_at": "2017-11-19T17:47:55.000Z",
        "client_company_id": 1,
        "city_id": 1,
        "state_id": 1,
        "country_id": 1
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
    * @api {get} /api/v1/addressclient List All AddressClient
    * @apiGroup AddressClient
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} AddressClient Post's lists
    * @apiExample {curl} Example usage:
    curl http://localhost:3000/api/v1/addressclient \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'x-access-token: Aqui Seu token' 
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
    [
            {
                "title": "Alterado com sucesso!",
                "message": "Conseguimos alterar o seu registro com sucesso!"
            }
    ]
    
     * @apiErrorExample {json} List error    
    *    HTTP/1.1 500 Intern	al Server Error
 * */


/**
    * @api {delete} /api/v1/addressclient/:id Delete AddressClient
    * @apiGroup AddressClient
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} AddressClient Post's lists
    * @apiParam {id} id AddressClient id
    * @apiExample {curl} Example usage:
    curl -X DELETE \
    http://localhost:3000/api/v1/addressclient/1 \
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
    * @api {put} /api/v1/addressclient/:id Update Address Client
    * @apiGroup AddressClient
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiParam {id} id AddressClient id
    * @apiSuccess {Object[]} address Post's lists
    * @apiSuccess {String} zipCode Address zipCode
    * @apiSuccess {String} title Address address
    * @apiSuccess {String} number Address number
    * @apiSuccess {String} district Address district
    * @apiSuccess {String} complement Address complement
    * @apiSuccess {Integer} state_id State id
    * @apiSuccess {Integer} city_id City id
    * @apiSuccess {Boolean} searchId Address searchId
    * @apiSuccess {Integer} country_id Country country_id
    * @apiSuccess {Integer} client_company_id ClientCompany client_company_id
    * @apiExample {curl} Example usage:
    curl -X POST \
        http://localhost:3000/api/v1/addressclient/1 \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -H 'x-access-token: Aqui seu Token' \
        -d 'zipCode=50781290&address=Rua%20Barros%20Sobrinho&number=178&district=Areias%20&state_id=1&city_id=1&country_id=1&client_company_id=1&searchId=true'
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
    {
        "id": 132,
        "zipCode": "50781290",
        "address": "Rua Barros Sobrinho",
        "number": "178",
        "district": "Areias ",
        "state_id": 1,
        "city_id": 1,
        "country_id": 1,
        "client_company_id": "1",
        "location": {
            "type": "Point",
            "coordinates": [
                -8.0874063,
                -34.9335804
            ]
        },
        "updated_at": "2018-01-25T17:04:17.873Z",
        "created_at": "2018-01-25T17:04:17.872Z"
    }
    * @apiErrorExample {json} List error
    *    HTTP/1.1 400 Bad Request
        [
    {
        "title": "Cep",
        "message": "Cep é requerido!"
    },
    {
        "title": "Endereço",
        "message": "Endereço é requerido!"
    },
    {
        "title": "Numero",
        "message": "Numero é requerido!"
    },
    {
        "title": "Bairro",
        "message": "Bairro é requerido!"
    },
    {
        "title": "Estado",
        "message": "Estado é requerido!"
    },
    {
        "title": "Cidade",
        "message": "Cidade é requerido!"
    },
    {
        "title": "País",
        "message": "País é requerido!"
    },
    {
        "title": " Cliente",
        "message": "Cliente é requerido!"
    },         
    {
        "title": "searchId"
    }
]
 
    *    HTTP/1.1 500 Intern	al Server Error
 * */