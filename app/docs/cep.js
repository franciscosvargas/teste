/**
       * @api {get} /api/v1/cep/:cep Find One Cep
       * @apiHeader {String} x-access-token Users unique access-key.
       * @apiGroup Cep
       * * @apiParam {cep} cep Cep cep
       * @apiExample {curl} Example usage:
         curl  http://localhost:3000/api/v1/cep/63050222 \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' 
       * @apiSuccessExample {json} Success
       *    HTTP/1.1 200 OK
       {
            "district": "Salesianos",
            "city": "Juazeiro do Norte",
            "address": "Rua Padre Josï¿½ Alves",
            "zipCode": "63050-222",
            "state": "CE",
            "ibge": "2307304",
            "created_at": "2017-11-21T21:03:54.000Z",
            "updated_at": "2017-11-21T21:03:54.000Z"
        }
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 404 Bad Request
       [
           {
               title: 'Cep', message: 'Cep requerido!'
            }
        ]
       * @apiErrorExample {json} Delete error
       *    HTTP/1.1 500 Internal Server Error
       */