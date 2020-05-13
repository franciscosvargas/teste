/**
       * @api {post} /api/v1/device Create Device
       * @apiHeader {String} x-access-token Users unique access-key.
       * @apiGroup Device
       *  @apiSuccess {String} name Device name
       * * @apiSuccess {String} tokenGcm Device tokenGcm
        * @apiSuccess {Integer} company_id Device company_id
        * @apiSuccess {String} serial Device serial
        * @apiSuccess {Integer} driver_id Driver driver_id optional
        * @apiSuccess {Integer} user_id User user_id optional
       * @apiExample {curl} Example usage:
        curl -X POST http://localhost:3000/api/v1/device \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
            -d 'driver_id=1&tokenGcm=fBeIkkoPkxE%3AAPA91bHyGgn3ghlyDMMG-dvAyi9zUiu58Wn9VxBowvdb-VGwtpJXCE7NOZ_FpgQDXK6e9ktaQb8sUleFspdLUuHlYbDEcAXCZ6sHijqu0N1vpVwVsJ6I5fzLqTZLbrmQI2P5M4PGaEmX&serial=32103210312031203301&name=Moto%20G'
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
        {
            "id": 64,
            "driver_id": "1",
            "tokenGcm": "fBeIkkoPkxE:APA91bHyGgn3ghlyDMMG-dvAyi9zUiu58Wn9VxBowvdb-VGwtpJXCE7NOZ_FpgQDXK6e9ktaQb8sUleFspdLUuHlYbDEcAXCZ6sHijqu0N1vpVwVsJ6I5fzLqTZLbrmQI2P5M4PGaEmX",
            "serial": "32103210312031203301",
            "name": "Moto G",
            "updated_at": "2018-01-29T15:01:04.357Z",
            "created_at": "2018-01-29T15:01:04.356Z"
        }
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 404 Bad Request
        [
            {
                "title": "Nome",
                "message": "Nome é requerido!"
            },
            {
                "title": "Token Gcm",
                "message": "Token Gcm é requerido!"
            },
            {
                "title": "Serial",
                "message": "Serial é requerido!"
            }
        ]
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 500 Internal Server Error
       */

/**
       * @api {get} /api/v1/device List All Device
       * @apiHeader {String} x-access-token Users unique access-key.
       * @apiGroup Device
       * @apiExample {curl} Example usage:
        curl http://localhost:3000/api/v1/device \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
        [
            {
                "id": 64,
                "tokenGcm": "fBeIkkoPkxE:APA91bHyGgn3ghlyDMMG-dvAyi9zUiu58Wn9VxBowvdb-VGwtpJXCE7NOZ_FpgQDXK6e9ktaQb8sUleFspdLUuHlYbDEcAXCZ6sHijqu0N1vpVwVsJ6I5fzLqTZLbrmQI2P5M4PGaEmX",
                "serial": "32103210312031203301",
                "name": "Moto G",
                "user_id": null,
                "driver_id": 1,
                "User": null
                "updated_at": "2018-01-29T15:01:04.357Z",
                "created_at": "2018-01-29T15:01:04.356Z"
            }
        ]
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 500 Internal Server Error
       */

/**
       * @api {get} /api/v1/device/:id Find One Device
       * @apiHeader {String} x-access-token Users unique access-key.
       * @apiGroup Device
       * @apiExample {curl} Example usage:
        curl http://localhost:3000/api/v1/device/64 \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
        {
            "id": 64,
            "name": "Moto G",
            "tokenGcm": "fBeIkkoPkxE:APA91bHyGgn3ghlyDMMG-dvAyi9zUiu58Wn9VxBowvdb-VGwtpJXCE7NOZ_FpgQDXK6e9ktaQb8sUleFspdLUuHlYbDEcAXCZ6sHijqu0N1vpVwVsJ6I5fzLqTZLbrmQI2P5M4PGaEmX",
            "serial": "32103210312031203301",
            "user_id": null,
            "driver_id": 1,
            "User": null
        }
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 400 Bad Request
        [
            {
                "title": "Id",
                "message": "Id invalido!"
            }
        ]
       *    HTTP/1.1 500 Internal Server Error
       */


/**
       * @api {get} /api/v1/device/user/:user_id Find One User in Device
       * @apiHeader {String} x-access-token Users unique access-key.
       * @apiGroup Device
       * @apiExample {curl} Example usage:
        curl http://localhost:3000/api/v1/device/user/10 \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
       {
            "id": 25,
            "name": "Moto G (5S) Plus",
            "tokenGcm": "-",
            "serial": "bfe65b2147dd99fe",
            "created_at": "2017-11-29T11:55:33.000Z",
            "updated_at": "2017-12-27T16:28:50.000Z",
            "user_id": 10,
            "driver_id": 6
        }
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 400 Bad Request
        [
            {
                "title": "Id",
                "message": "Id invalido!"
            }
        ]
       *    HTTP/1.1 500 Internal Server Error
       */

/**
       * @api {put} /api/v1/device/driver/:driver_id Update Device with Driver
       * @apiHeader {String} x-access-token Users unique access-key.
       * @apiGroup Device
       * @apiSuccess {String} tokenGcm Device tokenGcm
       * @apiSuccess {Integer} company_id Device company_id
       * @apiSuccess {String} serial Device serial
       * @apiSuccess {Integer} driver_id Driver driver_id optional
       * @apiSuccess {Integer} user_id User user_id optional
       * @apiExample {curl} Example usage:
        curl -X PUT http://localhost:3000/api/v1/device/driver/6 \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
            -d 'driver_id=1&tokenGcm=fBeIkkoPkxE%3AAPA91bHyGgn3ghlyDMMG-dvAyi9zUiu58Wn9VxBowvdb-VGwtpJXCE7NOZ_FpgQDXK6e9ktaQb8sUleFspdLUuHlYbDEcAXCZ6sHijqu0N1vpVwVsJ6I5fzLqTZLbrmQI2P5M4PGaEmX&serial=32103210312031203301&name=Moto%20G'
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
       [
            {
                "title": "Alterado com sucesso!",
                "message": "Conseguimos alterar o seu registro com sucesso!"
            }
        ]
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 400 Bad Request
        [
            {
                "title": "Id",
                "message": "Id invalido!"
            }
        ]
       *    HTTP/1.1 500 Internal Server Error
       */


/**
       * @api {put} /api/v1/device/:id Update Device 
       * @apiHeader {String} x-access-token Users unique access-key.
       * @apiGroup Device
       * @apiSuccess {String} tokenGcm Device tokenGcm
       * @apiSuccess {Integer} company_id Device company_id
       * @apiSuccess {String} serial Device serial
       * @apiSuccess {Integer} driver_id Driver driver_id optional
       * @apiSuccess {Integer} user_id User user_id optional
       * @apiExample {curl} Example usage:
        curl -X PUT http://localhost:3000/api/v1/device/25 \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
            -d 'driver_id=1&tokenGcm=fBeIkkoPkxE%3AAPA91bHyGgn3ghlyDMMG-dvAyi9zUiu58Wn9VxBowvdb-VGwtpJXCE7NOZ_FpgQDXK6e9ktaQb8sUleFspdLUuHlYbDEcAXCZ6sHijqu0N1vpVwVsJ6I5fzLqTZLbrmQI2P5M4PGaEmX&serial=32103210312031203301&name=Moto%20G'
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
       [
            {
                "title": "Alterado com sucesso!",
                "message": "Conseguimos alterar o seu registro com sucesso!"
            }
        ]
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 400 Bad Request
        [
            {
                "title": "Id",
                "message": "Id invalido!"
            }
        ]
       *    HTTP/1.1 500 Internal Server Error
       */


/**
       * @api {delete} /api/v1/device/:id Delete Device 
       * @apiHeader {String} x-access-token Users unique access-key.
       * @apiGroup Device
       * @apiSuccess {String} tokenGcm Device tokenGcm
       * @apiSuccess {Integer} company_id Device company_id
       * @apiSuccess {String} serial Device serial
       * @apiSuccess {Integer} driver_id Driver driver_id optional
       * @apiSuccess {Integer} user_id User user_id optional
       * @apiExample {curl} Example usage:
        curl -X DELETE http://localhost:3000/api/v1/device/25 \
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
       *    HTTP/1.1 400 Bad Request
        [
            {
                "title": "Id",
                "message": "Id invalido!"
            }
        ]
       *    HTTP/1.1 500 Internal Server Error
       */

/**
       * @api {post} /api/v1/device/user/push  Test Push Notification Device 
       * @apiHeader {String} x-access-token Users unique access-key.
       * @apiGroup Device
       * @apiSuccess {String} tokenGcm Device tokenGcm
       * @apiSuccess {Integer} running_delivery_id RunningDelivery running_delivery_id
       * @apiExample {curl} Example usage:
        curl -X POST http://localhost:3000/api/v1/device/user/push \
            -H 'Cache-Control: no-cache' \
            -H 'Content-Type: application/x-www-form-urlencoded' 
            -H 'x-access-token: Aqui Seu token' 
            -d 'running_delivery_id=2&tokenGcm=fBeIkkoPkxE%3AAPA91bHyGgn3ghlyDMMG-dvAyi9zUiu58Wn9VxBowvdb-VGwtpJXCE7NOZ_FpgQDXK6e9ktaQb8sUleFspdLUuHlYbDEcAXCZ6sHijqu0N1vpVwVsJ6I5fzLqTZLbrmQI2P5M4PGaEmX'
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
        {
            "id": "31388102-1de2-4dd4-943e-677ad52cb613",
            "recipients": 1
        }
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 400 Bad Request
        [
            {
                "title": "Token Gcm",
                "message": "Token Gcm é requerido!"
            },
            {
                "title": "Corrida",
                "message": "Corrida é requerido!"
            }
        ]
       *    HTTP/1.1 500 Internal Server Error
        {
            "errors": [
                "Incorrect player_id format in include_player_ids (not a valid UUID): f--iC0zuPLE:APA91bFXKEulKFCuShpzeVZrzo2oIs2OKyrocVw8Pfeygj4UlHlDuGlU0g6y42MdWervacoQf05pSSEW2VdWb_Rk1Priiq6QQlmrbXgkpNubJ4SkX58bD2IjFWLw0JNwg6GAG14gSD7K"
            ]
        }
       */