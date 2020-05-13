/**
    * @api {post} /api/v1/calculategooglemaps  Calculate Running Delivery Company
    * @apiGroup CalculateGoogleMaps
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} CalculateGoogleMaps Post's prices
    * @apiSuccess {Integer} company_id CalculateGoogleMaps company_id
    * @apiSuccess {Integer} address_client_id CalculateGoogleMaps address_client_id
    * @apiSuccess {Integer} service_id CalculateGoogleMaps service_id
    * @apiSuccess {String} requestReturn CalculateGoogleMaps requestReturn Optionalp
    * @apiSuccess {Integer} estimateAwait BlockDriver estimateAwait Optional
    * @apiSuccess {Integer} time Company time Optional
    * @apiExample {curl} Example usage:
         curl -X POST \
        http://localhost:3000/api/v1/calculategooglemaps \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -H 'x-access-token: Aqui Seu token' \
        -d 'company_id=2&address_client_id=1&service_id=2&requestReturn=true&estimateAwait=true&time=1'
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
   {
        "pointFinish": [
            -8.0544993,
            -34.8832516
        ],
        "pointInit": [
            -8.0584833,
            -34.9432772
        ],
        "fixedValue": "0.00",
        "metersSurplus": 0,
        "baseValue": "2.00",
        "franchiseMeters": 0,
        "requestReturn": "true",
        "estimateAwait": "true",
        "estimateAwaitValue": "0.00",
        "requestReturnValue": "0",
        "time": "1",
        "address_client": "Avenida Visconde de Suassuna, 128, Santo Amaro, 50050540",
        "adress_company": "R ANTONIO PAULINO, 60, RECIFE, 50.730-160",
        "duration": "29 mins",
        "durationTime": 1719,
        "kilometers": "9.8 km",
        "meters": 9769,
        "valueTotal": "11.77",
        "originAddresses": [
            "R ANTONIO PAULINO, 60, RECIFE, 50.730-160"
        ],
        "destinationAddresses": [
            "Avenida Visconde de Suassuna, 128, Santo Amaro, 50050540"
        ]
    }
     * @apiErrorExample {json} List error
    *    HTTP/1.1 400 Bad Request
    [
        {
            "title": "Empresa",
            "message": "Empresa é requerido! "
        },
        {
            "title": "Endereço Cliente",
            "message": "Endereço Cliente é requerido!"
        },
        {
            "title": "Serviço",
            "message": "Serviço é requerido!"
        }
    ]
    *    HTTP/1.1 500 Intern	al Server Error
 * */

 /**
    * @api {post} /api/v1/calculategooglemaps/taxi  Calculate Running Taxi AppClient
    * @apiGroup CalculateGoogleMaps
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} CalculateGoogleMaps Post's prices
    * @apiSuccess {Integer} clientLat CalculateGoogleMaps clientLat
    * @apiSuccess {Integer} clientLng CalculateGoogleMaps clientLng
    * @apiSuccess {Integer} destinationLat CalculateGoogleMaps destinationLat
    * @apiSuccess {String} destinationLng CalculateGoogleMaps destinationLng 
    * @apiSuccess {Integer} service_id BlockDriver service_id
    * @apiExample {curl} Example usage:
         curl -X POST \
        http://localhost:3000/api/v1/calculategooglemaps/taxi \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -H 'x-access-token: Aqui Seu token' \
        -d 'clientLat=-8.0629718&clientLng=-34.8781547&destinationLat=-8.0588926&destinationLng=-34.8833475&service_id=1'
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
   {
        "clientLat": "-8.0629718",
        "clientLng": "-34.8781547",
        "destinationLat": "-8.0588926",
        "destinationLng": "-34.8833475",
        "service_id": "1",
        "addressClient": {
            "number": "315",
            "district": "Santo Antônio",
            "city": "Recife",
            "state": "PE",
            "addressComplet": "Edifício JK - Av. Dantas Barreto, 315 - Santo Antônio, Recife - PE, 50010-360, Brazil",
            "country": "BR",
            "zipCode": "50010-360"
        },
        "rates": {
            "id": 1,
            "baseValue1": "7.50",
            "baseValue2": "7.50",
            "franchiseMeters": 5000,
            "minBandeirada1": "0.00",
            "minBandeirada2": "0.00",
            "fixedValue": "0.00",
            "metersSurplus": 1,
            "typeCalculate": 1,
            "valueKm1": "0.00",
            "valueKm2": "0.00",
            "estimateAwaitValue": "0.40",
            "dailyValue": "2.00",
            "requestReturnValue": "0.50",
            "created_at": "2017-10-31T19:56:35.000Z",
            "updated_at": "2017-11-19T20:15:19.000Z",
            "city_id": 1,
            "country_id": 1,
            "state_id": 1,
            "service_id": 1,
            "City": {
                "id": 1,
                "name": "Recife",
                "lat": "-8.0475622",
                "lng": "-34.8769643",
                "status": true,
                "created_at": "2017-10-31T15:21:18.000Z",
                "updated_at": "2017-10-31T15:21:18.000Z",
                "country_id": 1,
                "state_id": 1
            },
            "State": {
                "id": 1,
                "name": "Pernambuco",
                "lat": "-8.8137173",
                "lng": "-36.95410700000002",
                "initials": "PE",
                "created_at": "2017-10-31T15:19:19.000Z",
                "updated_at": "2017-10-31T15:19:19.000Z",
                "country_id": 1
            },
            "Country": {
                "id": 1,
                "name": "Brasil",
                "lat": "-14.235004",
                "lng": "-51.92527999999999",
                "initials": "BR",
                "created_at": "2017-10-31T15:18:39.000Z",
                "updated_at": "2017-10-31T15:18:39.000Z"
            }
        },
        "bandeirada2": false,
        "bandeirada1": true,
        "duration": "5 mins",
        "durationTime": 276,
        "kilometers": "1.0 km",
        "meters": 1039,
        "originAddresses": [
            "Av. Dantas Barreto, 1994-2070 - São José, Recife - PE, Brazil"
        ],
        "destinationAddresses": [
            "R. do Hospício, 1205-1243 - Boa Vista, Recife - PE, 50050-050, Brazil"
        ],
        "valueTotal": "7.50"
    }
     * @apiErrorExample {json} List error
    *    HTTP/1.1 400 Bad Request
    [
        {
            "title": "Empresa",
            "message": "Empresa é requerido! "
        },
        {
            "title": "Endereço Cliente",
            "message": "Endereço Cliente é requerido!"
        },
        {
            "title": "Empresa",
            "message": "Empresa é requerido! "
        },
        {
            "title": "Endereço Cliente",
            "message": "Endereço Cliente é requerido!"
        },
        {
            "title": "Serviço",
            "message": "Serviço é requerido!"
        }
    ]
    *    HTTP/1.1 500 Intern	al Server Error
 * */

 /**
    * @api {post} /api/v1/calculategooglemaps/location  Calculate Running Taxi AppClient
    * @apiGroup CalculateGoogleMaps
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} CalculateGoogleMaps Post's prices
    * @apiSuccess {Integer} clientLat CalculateGoogleMaps clientLat
    * @apiSuccess {Integer} clientLng CalculateGoogleMaps clientLng
    * @apiSuccess {Integer} destinationLat CalculateGoogleMaps destinationLat
    * @apiSuccess {String} destinationLng CalculateGoogleMaps destinationLng 
    * @apiSuccess {Integer} service_id BlockDriver service_id
    * @apiSuccess {Boolean} requestReturn BlockDriver requestReturn Optional
    * @apiSuccess {estimateAwait} requestReturn BlockDriver estimateAwait Optional
    * @apiSuccess {Integer} time BlockDriver time Optional
    * @apiExample {curl} Example usage:
         curl -X POST \
        http://localhost:3000/api/v1/calculategooglemaps/taxi \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -H 'x-access-token: Aqui Seu token' \
        -d 'clientLat=-8.0629718&clientLng=-34.8781547&destinationLat=-8.0588926&destinationLng=-34.8833475&service_id=1&requestReturn=true&estimateAwait=true&time=10'
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
    {
        "pointFinish": [
            "-8.0588926",
            "-34.8833475"
        ],
        "pointInit": [
            -8.0629718,
            -34.8781547
        ],
        "fixedValue": "0.00",
        "metersSurplus": 1,
        "baseValue": "7.50",
        "franchiseMeters": 5000,
        "requestReturn": "true",
        "estimateAwait": "true",
        "estimateAwaitValue": "0.40",
        "requestReturnValue": "0.50",
        "rate_id": 1,
        "time": "10",
        "company_id": null,
        "user_id": null,
        "service_id": "1",
        "duration": "5 mins",
        "durationTime": 276,
        "kilometers": "1.0 km",
        "meters": 1039,
        "valueTotal": 15.25,
        "originAddresses": [
            "Av. Dantas Barreto, 1994-2070 - São José, Recife - PE, Brazil"
        ],
        "destinationAddresses": [
            "R. do Hospício, 1205-1243 - Boa Vista, Recife - PE, 50050-050, Brazil"
        ]
    }
     * @apiErrorExample {json} List error
    *    HTTP/1.1 400 Bad Request
    [
        {
            "title": "Cliente Latitude",
            "message": "Cliente latitude é requerido!"
        },
        {
            "title": "Cliente Longitude",
            "message": "Cliente Longitude é requerido!"
        },
        {
            "title": "Destino Latitude",
            "message": "Destino Latitude é requerido!"
        },
        {
            "title": "Destino Longitude",
            "message": "Destino Longitude é requerido!"
        },
        {
            "title": "Serviço",
            "message": "Serviço é requerido!"
        }
    ]
    *    HTTP/1.1 500 Intern	al Server Error
 * */