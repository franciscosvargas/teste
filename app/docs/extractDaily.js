
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