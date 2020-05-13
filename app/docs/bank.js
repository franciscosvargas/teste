/**
    * @api {post} /api/v1/bank Create Bank
    * @apiGroup Bank
    * @apiSuccess {Object[]} AccountType Post's lists
    * @apiSuccess {String} name Bank name
    * @apiSuccess {String} cpf Bank cpf
    * @apiSuccess {String} my Bank my
    * @apiSuccess {String} agency Bank agency
    * @apiSuccess {String} agencyDv Bank agencyDv
    * @apiSuccess {String} account Bank account
    * @apiSuccess {String} accountDv Bank accountDv
    * @apiSuccess {String} user_id Bank user_id
    * @apiSuccess {String} operation Bank operation
    * @apiSuccess {String} types_bank_id Bank types_bank_id
    * @apiExample {curl} Example usage:
    curl -X POST \
    http://localhost:3000/api/v1/bank \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -d 'name=MICA%20LAIS&cpf=58572201491&my=true&agency=3016&account=0118956554&accountDv=5&types_bank_id=1&user_id=174'
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 201 OK
    {
            "id": 1,
            "name": "MICA LAIS",
            "cpf": "58572201491",
            "pagarme": "17683369",
            "my": true,
            "agency": "3016",
            "agencyDv": null,
            "account": "0118956554",
            "accountDv": 5,
            "operation": "",
            "status": true,
            "created_at": "2017-11-20T00:09:55.000Z",
            "updated_at": "2018-01-15T15:02:32.000Z",
            "user_id": 174,
            "types_bank_id": 1
    },
     * @apiErrorExample {json} List error
    *    HTTP/1.1 400 Bad Request
   [
        {
            "title": "Nome",
            "message": "Nome é requerido!"
        },
        {
            "title": "Cpf",
            "message": "Cpf é requerido!"
        },
        {
            "title": "Conta Terceiros",
            "message": "Conta Terceiros é requerido!"
        },
        {
            "title": "Agencia",
            "message": "Agencia é requerido!"
        },
        {
            "title": "Conta",
            "message": "Conta é requerido!"
        },
        {
            "title": "Digito da Conta",
            "message": "Digito de conta é requerido!"
        },
        {
            "title": "Usuário",
            "message": "Usuário é requerido!"
        },
        {
            "title": "Tipo de Banco",
            "message": "Tipo de Banco é requerido!"
        }
    ]
    *    HTTP/1.1 500 Intern	al Server Error
 * */

/**
    * @api {get} /api/v1/bank/:id Find One Bank
    * @apiGroup Bank
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} Bank Post's lists
    * @apiParam {id} id Bank id
    * @apiExample {curl} Example usage:
    curl http://localhost:3000/api/v1/bank/1 \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'x-access-token: Aqui Seu token' 
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
    
    {
        "id": 1,
        "name": "MICA LAIS",
        "cpf": "58572201491",
        "pagarme": "17683369",
        "my": true,
        "agency": "3016",
        "agencyDv": null,
        "account": "0118956554",
        "accountDv": 5,
        "operation": "",
        "status": true,
        "created_at": "2017-11-20T00:09:55.000Z",
        "updated_at": "2018-01-15T15:02:32.000Z",
        "user_id": 174,
        "types_bank_id": 1,
        "User": {
            "id": 174,
            "name": "MICA LAIS",
            "token": "",
            "forgot": null,
            "active": "",
            "number": 986501787,
            "ddd": 81,
            "ddi": "55",
            "email": "micalais1@gmail.com",
            "master": false,
            "avatar": "3133fc66040ff18067201e45ca93087f",
            "alias": "Mica",
            "password": "e10adc3949ba59abbe56e057f20f883e",
            "birthday": null,
            "cpf": "42186484412",
            "first": false,
            "stage": 9,
            "status": true,
            "created_at": "2017-12-28T09:58:04.000Z",
            "updated_at": "2018-01-23T14:57:15.000Z",
            "types_user_id": null
        },
        "TypesBank": {
            "id": 1,
            "name": "Caixa Econômica Federal",
            "code": "104",
            "rate": "0.00",
            "description": "Caixa Economica",
            "created_at": "2017-11-19T15:42:13.000Z",
            "updated_at": "2017-11-19T15:42:13.000Z"
        }
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
    * @api {get} /api/v1/bank Lista All Bank
    * @apiGroup Bank
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} Bank Post's lists
    * @apiExample {curl} Example usage:
    curl http://localhost:3000/api/v1/bank \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'x-access-token: Aqui Seu token' 
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
    [
        {
            "id": 1,
            "name": "MICA LAIS",
            "cpf": "58572201491",
            "pagarme": "17683369",
            "my": true,
            "agency": "3016",
            "agencyDv": null,
            "account": "0118956554",
            "accountDv": 5,
            "operation": "",
            "status": true,
            "created_at": "2017-11-20T00:09:55.000Z",
            "updated_at": "2018-01-15T15:02:32.000Z",
            "user_id": 174,
            "types_bank_id": 1,
            "User": {
                "id": 174,
                "name": "MICA LAIS",
                "token": "",
                "forgot": null,
                "active": "",
                "number": 986501787,
                "ddd": 81,
                "ddi": "55",
                "email": "micalais1@gmail.com",
                "master": false,
                "avatar": "3133fc66040ff18067201e45ca93087f",
                "alias": "Mica",
                "password": "e10adc3949ba59abbe56e057f20f883e",
                "birthday": null,
                "cpf": "42186484412",
                "first": false,
                "stage": 9,
                "status": true,
                "created_at": "2017-12-28T09:58:04.000Z",
                "updated_at": "2018-01-23T14:57:15.000Z",
                "types_user_id": null
            },
            "TypesBank": {
                "id": 1,
                "name": "Caixa Econômica Federal",
                "code": "104",
                "rate": "0.00",
                "description": "Caixa Economica",
                "created_at": "2017-11-19T15:42:13.000Z",
                "updated_at": "2017-11-19T15:42:13.000Z"
            }
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
    * @api {delete} /api/v1/bank/:id Delete Bank
    * @apiGroup Bank
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} Bank Post's Delete
    * @apiParam {id} id Bank id
    * @apiExample {curl} Example usage:
        curl -X DELETE \
        http://localhost:3000/api/v1/bank/1 \
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
    * @api {get} /api/v1/bank/driver/:user_id Find One Driver in Bank
    * @apiGroup Bank
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} Bank Post's List
    * @apiParam {id} user_id User user_id
    * @apiExample {curl} Example usage:
        curl -X DELETE \
        http://localhost:3000/api/v1/bank/driver/6 \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -H 'x-access-token: Aqui Seu token' 
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 200 OK
    {
        "id": 50,
        "name": "tiago pedro gomes",
        "cpf": "08602765460",
        "pagarme": "2983118",
        "my": true,
        "agency": "3217",
        "agencyDv": null,
        "account": "78781",
        "accountDv": 8,
        "operation": null,
        "status": true,
        "created_at": "2017-12-19T14:22:43.000Z",
        "updated_at": "2018-01-25T16:15:02.000Z",
        "user_id": 6,
        "types_bank_id": 2,
        "User": {
            "id": 6,
            "name": "Pizzaria Comeu Morreu agora",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwibmFtZSI6IlBpenphcmlhIENvbWV1IE1vcnJldSIsImlhdCI6MTUxNjYyOTMzNX0.H7HdaJwSqgGMJ9ut4WppVK8NnZF9Ii5pi3cGtfOWq3k",
            "forgot": "cQakrvmur0EWqeo3frYjJ0OrdjYxgv",
            "active": "223627",
            "number": 1356,
            "ddd": 81,
            "ddi": "81",
            "email": "luciano.thomaz@gmail.com",
            "master": false,
            "avatar": null,
            "alias": null,
            "password": "e10adc3949ba59abbe56e057f20f883e",
            "birthday": "1978-09-24T03:00:00.000Z",
            "cpf": "02486723471",
            "first": false,
            "stage": 6,
            "status": false,
            "created_at": "2017-12-28T14:45:14.000Z",
            "updated_at": "2018-01-25T11:05:33.000Z",
            "types_user_id": null
        },
        "TypesBank": {
            "id": 2,
            "name": "Itaú Unibanco S.A",
            "code": "341",
            "rate": "0.00",
            "description": "Itaú",
            "created_at": "2017-11-19T15:41:57.000Z",
            "updated_at": "2017-11-19T15:41:57.000Z"
        }
    }
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
    * @api {put} /api/v1/bank/:id Update Bank
    * @apiGroup Bank
    * @apiSuccess {Object[]} AccountType Post's lists
    * @apiParam {id} id Bank id
    * @apiSuccess {String} name Bank name
    * @apiSuccess {String} cpf Bank cpf
    * @apiSuccess {String} my Bank my
    * @apiSuccess {String} agency Bank agency
    * @apiSuccess {String} agencyDv Bank agencyDv
    * @apiSuccess {String} account Bank account
    * @apiSuccess {String} accountDv Bank accountDv
    * @apiSuccess {Integer} user_id Bank user_id
    * @apiSuccess {String} operation Bank operation
    * @apiSuccess {Integer} types_bank_id Bank types_bank_id
    * @apiExample {curl} Example usage:
    curl -X PUT \
    http://localhost:3000/api/v1/bank/50 \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -d 'name=MICA%20LAIS&cpf=58572201491&my=true&agency=3016&account=0118956554&accountDv=5&types_bank_id=1&user_id=174'
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
            "title": "Nome",
            "message": "Nome é requerido!"
        },
        {
            "title": "Cpf",
            "message": "Cpf é requerido!"
        },
        {
            "title": "Conta Terceiros",
            "message": "Conta Terceiros é requerido!"
        },
        {
            "title": "Agencia",
            "message": "Agencia é requerido!"
        },
        {
            "title": "Conta",
            "message": "Conta é requerido!"
        },
        {
            "title": "Digito da Conta",
            "message": "Digito de conta é requerido!"
        },
        {
            "title": "Usuário",
            "message": "Usuário é requerido!"
        },
        {
            "title": "Tipo de Banco",
            "message": "Tipo de Banco é requerido!"
        }
    ]
    *    HTTP/1.1 500 Intern	al Server Error
 * */

 /**
    * @api {put} /api/v1/bank/driver/:user_id Update  Driver in Bank
    * @apiGroup Bank
    * @apiSuccess {Object[]} AccountType Post's lists
    * @apiParam {id} user_id User user_id
    * @apiSuccess {String} name Bank name
    * @apiSuccess {String} cpf Bank cpf
    * @apiSuccess {String} my Bank my
    * @apiSuccess {String} agency Bank agency
    * @apiSuccess {String} agencyDv Bank agencyDv
    * @apiSuccess {String} account Bank account
    * @apiSuccess {String} accountDv Bank accountDv
    * @apiSuccess {Integer} user_id Bank user_id
    * @apiSuccess {String} operation Bank operation
    * @apiSuccess {Integer} types_bank_id Bank types_bank_id
    * @apiExample {curl} Example usage:
    curl -X PUT \
    http://localhost:3000/api/v1/bank/50 \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -d 'name=MICA%20LAIS&cpf=58572201491&my=true&agency=3016&account=0118956554&accountDv=5&types_bank_id=1&user_id=174'
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
            "title": "Nome",
            "message": "Nome é requerido!"
        },
        {
            "title": "Cpf",
            "message": "Cpf é requerido!"
        },
        {
            "title": "Conta Terceiros",
            "message": "Conta Terceiros é requerido!"
        },
        {
            "title": "Agencia",
            "message": "Agencia é requerido!"
        },
        {
            "title": "Conta",
            "message": "Conta é requerido!"
        },
        {
            "title": "Digito da Conta",
            "message": "Digito de conta é requerido!"
        },
        {
            "title": "Usuário",
            "message": "Usuário é requerido!"
        },
        {
            "title": "Tipo de Banco",
            "message": "Tipo de Banco é requerido!"
        }
    ]
    *    HTTP/1.1 500 Intern	al Server Error
 * */
