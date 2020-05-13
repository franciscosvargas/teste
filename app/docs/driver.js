/**
       *  @api {put} /api/v1/drivers/:id Update Driver
       *  @apiHeader {String} x-access-token Users unique access-key.
       *  @apiGroup Driver
       *  @apiSuccess {Boolean} status Driver status
       *  @apiSuccess {String} cardDiscount Driver cardDiscount
       *  @apiSuccess {String} moneyDiscount Driver moneyDiscount
       *  @apiSuccess {Integer} service_id Service service_id
       *  @apiSuccess {Integer} vehicle_id Vehicle vehicle_id
       * @apiExample {curl} Example usage:
        curl -X PUT http://localhost:3000/api/v1/drivers/3 \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
            -d 'status=true&cardDiscount=0.0&moneyDiscount=0.50&service_id=1&vehicle_id=4'
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
                "title": "Online",
                "message": "Online é requerido!"
            },
            {
                "title": "Cartão Desconto",
                "message": "Cartão Desconto é requerido!"
            },
            {
                "title": "Dinheiro Desconto",
                "message": "Dinheiro Desconto é requerido!"
            },
            {
                "title": "Serviço",
                "message": "Serviço é requerido!"
            },
            {
                "title": "Veículo",
                "message": "Veículo é requerido!"
            }
        ]
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 500 Internal Server Error
       */

/**
       *  @api {get} /api/v1/drivers/:id Find One Driver
       *  @apiHeader {String} x-access-token Users unique access-key.
       *  @apiGroup Driver
       * @apiParam {id} id Driver id
       * @apiExample {curl} Example usage:
        curl http://localhost:3000/api/v1/drivers/3 \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
       {
            "id": 1,
            "ocuped": false,
            "active": false,
            "status": true,
            "cardMarchine": false,
            "cardDiscount": "0.0",
            "moneyDiscount": "0.50",
            "block": null,
            "block_date": null,
            "created_at": "2017-11-19T15:47:19.000Z",
            "updated_at": "2018-01-30T10:14:51.000Z",
            "user_id": null,
            "service_id": 1,
            "vehicle_id": 4
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
       *  @api {get} /api/v1/drivers/user/:id Find One User with Driver
       *  @apiHeader {String} x-access-token Users unique access-key.
       *  @apiGroup Driver
       * @apiParam {id} id User id
       * @apiExample {curl} Example usage:
        curl http://localhost:3000/api/v1/drivers/user/3 \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
       {
            "id": 6,
            "ocuped": false,
            "active": true,
            "status": false,
            "cardMarchine": false,
            "cardDiscount": "10",
            "moneyDiscount": "10",
            "block": null,
            "block_date": null,
            "created_at": "2017-11-19T21:33:10.000Z",
            "updated_at": "2018-01-19T06:48:15.000Z",
            "user_id": 10,
            "service_id": 1,
            "vehicle_id": 4,
            "User": {
                "id": 10,
                "name": "TIBÉRIUS LINS MACEDO",
                "number": 7867,
                "ddd": 81,
                "ddi": "55",
                "email": "tib6433ns@gmail.com",
                "avatar": null,
                "alias": "Tibeius",
                "birthday": null,
                "cpf": "00000000191",
                "first": false,
                "stage": null,
                "status": true,
                "types_user_id": null
            },
            "Vehicle": {
                "id": 4,
                "year": null,
                "plate": "PDP3749",
                "situation": "Sem restrição",
                "model": "TOYOTA/COROLLA GLI18 CVT",
                "brand": "TOYOTA/COROLLA GLI18 CVT",
                "brandYear": "2016",
                "color": "BRANCA",
                "uf": "PE",
                "city": "PE",
                "chassi": "************41712",
                "capacity": 4,
                "inUse": true,
                "status": true,
                "created_at": "2017-11-19T21:35:03.000Z",
                "updated_at": "2017-11-19T21:35:03.000Z",
                "type_vehicle_id": 1,
                "user_id": 10
            },
            "Scores": []
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
       *  @api {get} /api/v1/drivers/online/city/:city_id List Driver Online by City
       *  @apiHeader {String} x-access-token Users unique access-key.
       *  @apiGroup Driver
       * @apiParam {id} city_id City city_id
       * @apiExample {curl} Example usage:
            curl http://localhost:3000/api/v1/drivers/online/city/1 \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
      {
            "mongo": [
                {
                    "_id": "5a706b474a97bc73576c9eaf",
                    "driver_id": 123,
                    "__v": 0,
                    "locate": [
                        -34.8717175,
                        -8.0617165
                    ],
                    "ocuped": false,
                    "lat_timestamp": "2018-01-30T10:53:11.622Z",
                    "block_date": null,
                    "accept": false,
                    "block": false,
                    "service_id": 1,
                    "moneyDiscount": 0,
                    "cardDiscount": 0,
                    "cardMarchine": false,
                    "status": true,
                    "active": true
                }
            ],
            "mysql": [
                {
                    "id": 37,
                    "User": {
                        "name": "MARCONE SANTANA DA SILVA",
                        "Addresses": [
                            {
                                "id": 25,
                                "zipCode": "50.770-600",
                                "location": {
                                    "type": "Point",
                                    "coordinates": [
                                        -8.0839851,
                                        -34.9137773
                                    ]
                                },
                                "address": "Rua Santa Helena",
                                "number": "238",
                                "district": "Afogados",
                                "complement": "Rua Santa Helena",
                                "default": null,
                                "created_at": "2017-11-20T20:38:13.000Z",
                                "updated_at": "2017-11-20T20:38:13.000Z",
                                "user_id": 43,
                                "city_id": 1,
                                "state_id": 1,
                                "country_id": 1
                            }
                        ]
                    }
                }
            ]
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
       *  @api {put} /api/v1/drivers/update Update Driver Register (I do not know why)
       *  @apiGroup Driver
       *  @apiSuccess {Integer} driver_id Driver driver_id
       *  @apiSuccess {Integer} service_id Service service_id
       * @apiExample {curl} Example usage:
            curl -X PUT http://localhost:3000/api/v1/drivers/update \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
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
                "title": "Motorista",
                "message": "Motorista é requerido!"
            },
            {
                "title": "Serviço",
                "message": "Serviço é requerido!"
            }
        ]
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 500 Internal Server Error
       */

/**
       *  @api {get} /api/v1/drivers?paginate=false List All Driver
       *  @apiGroup Driver
       *  @apiHeader {String} x-access-token Users unique access-key.
       *  @apiExample {curl} Example usage:
        curl http://localhost:3000/api/v1/drivers?paginate=false \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
        [
            {
                "id": 7,
                "ocuped": true,
                "active": false,
                "status": false,
                "cardMarchine": false,
                "cardDiscount": "0.0",
                "moneyDiscount": "0.0",
                "block": null,
                "block_date": null,
                "created_at": "2017-11-20T00:06:59.000Z",
                "updated_at": "2017-12-29T18:16:25.000Z",
                "user_id": null,
                "service_id": 1,
                "vehicle_id": null,
                "User": null,
                "Service": {
                    "id": 1,
                    "name": "Motoboy",
                    "status": true,
                    "created_at": "2017-10-31T15:32:08.000Z",
                    "updated_at": "2017-10-31T15:32:08.000Z",
                    "city_id": null
                },
                "Scores": [],
                "Vehicle": null,
                "BlockDrivers": [],
                "ExtractDailies": [],
                "RunningDeliveries": [
                    {
                        "id": 9,
                        "value": "7.50",
                        "status": 9,
                        "freeDriver": false,
                        "created_at": "2017-11-20T21:34:19.000Z",
                        "updated_at": "2017-12-29T11:08:17.000Z",
                        "driver_id": 7,
                        "company_id": 1,
                        "service_id": 1,
                        "user_id": null
                    }
                ],
                "RunningTaxiDrivers": []
            }
        ]
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 404 Bad Request
        [
            {
                "title": "Ops",
                "message": "Não foi possivel requisitar a lista de prestadores."
            }
        ]
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 500 Internal Server Error
       */

/**
       *  @api {post} /api/v1/drivers/push/:id Tester Push Notification Running Delivery Driver
       *  @apiGroup Driver
       *  @apiParam {id} id RunningDelivery id
       *  @apiHeader {String} x-access-token Users unique access-key.
       *  @apiExample {curl} Example usage:
        curl -X POST http://localhost:3000/api/v1/drivers/push/1 \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
            -d token=4a5e65ad-cacb-45a6-88a8-0e79fe17c09c
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
       "{\"multicast_id\":8083297635863398624,\"success\":0,\"failure\":1,\"canonical_ids\":0,\"results\":[{\"error\":\"InvalidRegistration\"}]}"
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 404 Bad Request
        [
            {
                "title": "Token",
                "message": "Token é requerido!"
            }
        ]
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 500 Internal Server Error
       */

/**
       *  @api {put} /api/v1/drivers/status/:id Tester Push Notification Running Delivery Driver
       *  @apiGroup Driver
       *  @apiParam {id} id Driver id
       *  @apiHeader {String} x-access-token Users unique access-key.
       *  @apiExample {curl} Example usage:
            curl -X PUT http://localhost:3000/api/v1/drivers/status/1 \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
            -d token=4a5e65ad-cacb-45a6-88a8-0e79fe17c09c
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
       "{\"multicast_id\":8083297635863398624,\"success\":0,\"failure\":1,\"canonical_ids\":0,\"results\":[{\"error\":\"InvalidRegistration\"}]}"
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 404 Bad Request
        [
            {
                "title": "Token",
                "message": "Token é requerido!"
            }
        ]
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 500 Internal Server Error
       */

/**
       *  @api {put} /api/v1/drivers/:id/active Active Driver
       *  @apiGroup Driver
       *  @apiParam {id} id Driver id
       *  @apiHeader {String} x-access-token Users unique access-key.
       * @apiSuccess {Boolean} active Service active
       *  @apiExample {curl} Example usage:
            curl -X PUT http://localhost:3000/api/v1/drivers/1/active \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
            -d active=true
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
                title: 'Online',
                message: 'Online é requerido!'
            }
        ]
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 500 Internal Server Error
       */

/**
       *  @api {post} /api/v1/drivers/freedom Feedom Driver (Tester Tiberius)
       *  @apiGroup Driver
       *  @apiHeader {String} x-access-token Users unique access-key.
       * @apiSuccess {Integer} driver_id Driver driver_id
       *  @apiExample {curl} Example usage:
            curl -X POST http://localhost:3000/api/v1/drivers/freedom \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
            -d driver_id=1
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
                title: 'Motorista',
                message: 'Motorista é requerido!'
            }
        ]
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 500 Internal Server Error
       */

/**
       *  @api {post} /api/v1/drivers/:id/unlock/company/runningdelivery Unlock Driver Return Companie
       *  @apiGroup Driver
       *  @apiParam {id} id Driver id
       *  @apiHeader {String} x-access-token Users unique access-key.
       * @apiSuccess {Integer} description Driver description
       *  @apiExample {curl} Example usage:
            curl -X POST http://localhost:3000//api/v1/drivers/1/unlock/company/runningdelivery \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
            -d description='description'
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
                title: 'Descrição',
                message: 'Descrição é requerido!'
           }
        ]
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 500 Internal Server Error
       */