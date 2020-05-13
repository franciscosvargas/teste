/**
    * @api {post} /api/v1/authenticate Authenticate
    * @apiGroup Authenticate
    * @apiSuccess {Object[]} Authenticate
    * @apiSuccess {String} name User name
    * @apiSuccess {String} email User email 
    * @apiExample {curl} Example usage:
    curl -X POST \
    http://localhost:3000/api/v1/authenticate \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -d 'email=erick-548%40hotmail.com&password=123456'
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUxLCJuYW1lIjoiRVJJQ0sgIEJFWkVSUkEgREEgQ09TVEEiLCJpYXQiOjE1MTY5MDk2MzZ9.v81BTtjvp6X1I-_PGLfKDMDe16-zp-5e4Sx52lvZJy0",
        "object": {
            "id": 151,
            "name": "ERICK  BEZERRA DA COSTA",
            "number": 982618695,
            "ddd": 81,
            "ddi": "55",
            "email": "erick-548@hotmail.com",
            "avatar": "b507125deb747f4545692bb12d37fb13.jpg",
            "alias": null,
            "birthday": null,
            "cpf": "08514931490",
            "first": false,
            "stage": 7,
            "status": true,
            "types_user_id": null,
            "TypesUser": null,
            "Addresses": [
                {
                    "id": 107,
                    "zipCode": "52160190",
                    "location": {
                        "type": "Point",
                        "coordinates": [
                            -7.992096,
                            -34.916601
                        ]
                    },
                    "address": "Rua Jornalista Nelson Firmo",
                    "number": "256",
                    "district": "Dois Unidos",
                    "complement": "-",
                    "default": null,
                    "created_at": "2018-01-17T11:06:14.000Z",
                    "updated_at": "2018-01-17T11:06:14.000Z",
                    "user_id": 151,
                    "city_id": 1,
                    "state_id": 1,
                    "country_id": 1
                }
            ],
            "Documents": [],
            "Banks": [],
            "Cards": [
                {
                    "id": 11,
                    "object": "card",
                    "cardId": "card_cjbxyerpe01jb1v6d2fqxr04a",
                    "dateCreated": "2018-01-02T18:15:03.363Z",
                    "dateUpdated": "2018-01-02T18:15:03.625Z",
                    "brand": "visa",
                    "holderName": "erick b da costa",
                    "firstDigits": "404025",
                    "lastDigits": "0315",
                    "country": "UNITED STATES",
                    "fingerprint": "cjbxyerfc0eb30k000m5cy01n",
                    "customer": null,
                    "valid": "1",
                    "expirationDate": null,
                    "cardCvv": "897",
                    "payment": null,
                    "status": null,
                    "created_at": "2018-01-02T15:15:03.000Z",
                    "updated_at": "2018-01-02T15:15:03.000Z",
                    "user_id": 151,
                    "company_id": null
                },
                {
                    "id": 16,
                    "object": "card",
                    "cardId": "card_cjckfzebo00o85h6e4lt9poeg",
                    "dateCreated": "2018-01-18T11:57:55.140Z",
                    "dateUpdated": "2018-01-18T11:57:55.439Z",
                    "brand": "mastercard",
                    "holderName": "erick b da costa",
                    "firstDigits": "551505",
                    "lastDigits": "0266",
                    "country": "UNITED STATES OF AMERICA",
                    "fingerprint": "cjckfze7s04h30h59udbkzkru",
                    "customer": null,
                    "valid": "1",
                    "expirationDate": null,
                    "cardCvv": "358",
                    "payment": null,
                    "status": null,
                    "created_at": "2018-01-18T08:57:55.000Z",
                    "updated_at": "2018-01-18T08:57:55.000Z",
                    "user_id": 151,
                    "company_id": null
                },
                {
                    "id": 17,
                    "object": "card",
                    "cardId": "card_cjckhbojg00s1r86daycs05nr",
                    "dateCreated": "2018-01-18T12:35:27.869Z",
                    "dateUpdated": "2018-01-18T12:35:28.123Z",
                    "brand": "mastercard",
                    "holderName": "erick b da costa",
                    "firstDigits": "544901",
                    "lastDigits": "1087",
                    "country": "RUSSIA",
                    "fingerprint": "cjckhbnvc04ij0h59n6f6b2iu",
                    "customer": null,
                    "valid": "1",
                    "expirationDate": null,
                    "cardCvv": "682",
                    "payment": null,
                    "status": null,
                    "created_at": "2018-01-18T09:35:28.000Z",
                    "updated_at": "2018-01-18T09:35:28.000Z",
                    "user_id": 151,
                    "company_id": null
                }
            ],
            "Vehicles": [],
            "Drivers": [],
            "Companies": [],
            "BlockDrivers": []
        }
    }
     * @apiErrorExample {json} List error
    *    HTTP/1.1 400 Bad Request
    [
        {
            "title": "Email",
            "message": "Email é requerido!"
        },
        {
            "title": "Senha",
            "message": "Senha é requerido!"
        }
    ]
    *    HTTP/1.1 500 Intern	al Server Error
 * */