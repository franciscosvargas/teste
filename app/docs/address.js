/**
    * @api {post} /api/v1/address Create address
    * @apiGroup Address
    * @apiSuccess {Object[]} address Post's lists
    * @apiSuccess {String} zipCode Address zipCode
    * @apiSuccess {String} title Address address
    * @apiSuccess {String} number Address number
    * @apiSuccess {String} district Address district
    * @apiSuccess {String} complement Address complement
    * @apiSuccess {Integer} state_id State id
    * @apiSuccess {Integer} city_id City id
    * @apiSuccess {Integer} country_id Country country_id
    * @apiSuccess {Integer} user_id User user_id
    * @apiSuccess {Boolean} searchId Address searchId
    * @apiExample {curl} Example usage:
         curl -X POST \
        http://localhost:3000/api/v1/address \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -H 'x-access-token: Aqui seu Token' \
        -H 'Postman-Token: dce3cf21-f745-0332-3f62-923811601ec0' \
        -d 'zipCode=63050222&address=Rua%20Padre%20Jos%C3%A9%20Alves&number=390&district=salesianos&state=CE&city=Juazeiro%20do%20Norte&user_id=6&city_id=1&state_id=1&country_id=1'
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 201 OK
    {
        "id": 112,
        "zipCode": "63050222",
        "address": "Rua Padre José Alves",
        "number": "390",
        "district": "Salesianos",
        "complement": "Proximo a Churracasria Palmeira",
        "state_id": 1,
        "city_id": 1,
        "user_id": "6",
        "country_id": 1,
        "updated_at": "2018-01-25T11:05:35.241Z",
        "created_at": "2018-01-25T11:05:35.241Z"
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
                "message": " País é requerido!"
            },
            {
                "title": "Usuário"
            },
            {
                "title": "searchId"
            }
        ]
    *    HTTP/1.1 500 Intern	al Server Error
 * */
/**
     * @api {get} /api/v1/address List all Address
     * @apiHeader {String} x-access-token Users unique access-key.
     * @apiGroup Address
     * @apiSuccess {String} zipCode Address zipCode
    * @apiSuccess {String} title Address address
    * @apiSuccess {String} number Address number
    * @apiSuccess {String} district Address district
    * @apiSuccess {String} complement Address complement
    * @apiSuccess {Integer} state_id State id
    * @apiSuccess {Integer} city_id City id
    * @apiSuccess {Integer} country_id Country country_id
    * @apiSuccess {Integer} user_id User user_id
    * @apiExample {curl} Example usage:
         curl -X POST \
        http://localhost:3000/api/v1/address \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -H 'x-access-token: Aqui seu Token' \
        -H 'Postman-Token: dce3cf21-f745-0332-3f62-923811601ec0' \
        -d 'zipCode=63050222&address=Rua%20Padre%20Jos%C3%A9%20Alves&number=390&district=salesianos&state=CE&city=Juazeiro%20do%20Norte&user_id=6&city_id=1&state_id=1&country_id=1'
     * @apiSuccessExample {json} Success
     *    HTTP/1.1 200 OK
     [
         {
        "id": 112,
        "zipCode": "63050-222",
        "location": {
            "type": "Point",
            "coordinates": [
                -8.0343435,
                -34.9717712
            ]
        },
            "address": "Rua Padre José Alves",
            "number": "390",
            "district": "Salesianos",
            "complement": "Proximo a Churracasria Palmeira",
            "default": null,
            "updated_at": "2018-01-25T11:05:35.241Z",
            "created_at": "2018-01-25T11:05:35.241Z"
            "user_id": 6,
            "city_id": 1,
            "state_id": 1,
            "country_id": 1
        },
     ]
     * @apiErrorExample {json} List error
     *    HTTP/1.1 500 Internal Server Error
     */

/**
        * @api {get}  /api/v1/address/:id Find One a Address
        * @apiHeader {String} x-access-token Users unique access-key.
        * @apiGroup Address
        * @apiParam {id} id Address id
        * @apiSuccessExample {json} Success
        *    HTTP/1.1 200 OK
        {
            "id": 112,
            "zipCode": "63050222",
            "location": null,
            "address": "Rua Padre José Alves",
            "number": "390",
            "district": "salesianos",
            "complement": "Proximo a Churracasria Palmeira",
            "default": null,
            "created_at": "2018-01-25T11:05:35.000Z",
            "updated_at": "2018-01-25T11:33:51.000Z",
            "user_id": 6,
            "city_id": 1,
            "state_id": 1,
            "country_id": 1
        }
        * @apiErrorExample {json} Address Error
        *    HTTP/1.1 404 Not Found
        [
            {
                "title": "Id",
                "message": "Id invalido!"
            }
        ]
        * @apiErrorExample {json} Find error
        *    HTTP/1.1 500 Internal Server Error
        */
/**
        * @api {put} /api/v1/address/:id Update a Address
        * @apiHeader {String} x-access-token Users unique access-key.
        * @apiGroup Address
        * @apiParam {id} id Address id
        * @apiSuccess {String} zipCode Address zipCode
        * @apiSuccess {String} title Address address
        * @apiSuccess {String} number Address number
        * @apiSuccess {String} district Address district
        * @apiSuccess {String} complement Address complement
        * @apiSuccess {Integer} state_id State id
        * @apiSuccess {Integer} city_id City id
        * @apiSuccess {Integer} country_id Country country_id
        * @apiSuccess {Date} updated_at Update's date
        * @apiSuccess {Date} created_at Register's date
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
                "message": " País é requerido!"
            },
            {
                "title": "Usuário"
            },
            {
                "title": "searchId"
            }
        ]
        *    HTTP/1.1 404 Bad Request
        [
            {
                "title": "Id",
                "message": "Id invalido!"
            }
        ]
        * @apiErrorExample {json} Find error
        *    HTTP/1.1 500 Internal Server Error
    */
/**
       * @api {delete} /api/v1/address/:id Delete a Address
       * @apiHeader {String} x-access-token Users unique access-key.
       * @apiGroup Address
       * @apiParam {id} id Address id
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
       *    HTTP/1.1 400 Bad Request
       [
           {
               "title": "Error",
               "message": "Não contém o registro!"
           }
       ]
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 500 Internal Server Error
       */

    
