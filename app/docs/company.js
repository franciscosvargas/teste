/**
    * @api {post} /api/v1/company Create Company
    * @apiGroup Company
    * @apiSuccess {Object[]} Company Post's lists
    * @apiSuccess {String} fantasy Company fantasy
    * @apiSuccess {String} socialName Company socialName
    * @apiSuccess {Boolean} multiCompany Company multiCompany
    * @apiSuccess {String} phone Company phone
    * @apiSuccess {String} responsible Company responsible
    * @apiSuccess {String} cnpj Company cnpj
    * @apiSuccess {Integer} type_company_id TypeCompany type_company_id
    * @apiSuccess {String} zipCode Company zipCode
    * @apiSuccess {String} address Company address
    * @apiSuccess {String} number Company number
    * @apiSuccess {String} district Company district
    * @apiSuccess {String} complement Company complement
    * @apiSuccess {Integer} state_id State state_id
    * @apiSuccess {Integer} city_id City city_id
    * @apiSuccess {Integer} country_id Country country_id
    * @apiSuccess {Integer} user_id User user_id
    * @apiExample {curl} Example usage:
         curl -X POST \
        http://localhost:3000/api/v1/company \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -H 'x-access-token: Aqui Seu token' 
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 201 OK
  
     * @apiErrorExample {json} List error
    *    HTTP/1.1 400 Bad Request
    [
    {
        "title": "Nome fantasia",
        "message": "Nome fantasia requerido!"
    },
    {
        "title": "Razão Social",
        "message": "Razão Social requerido!"
    },
    {
        "title": "Filial",
        "message": "Filial requerido!"
    },
    {
        "title": "Telefone",
        "message": "Telefone é requerido!"
    },
    {
        "title": "Responsavel",
        "message": "Responsavel é requerido!"
    },
    {
        "title": "CNPJ",
        "message": "Cnpj é requerido!"
    },
    {
        "title": "Tipo de Empresa ",
        "message": "Tipo de Empresa é requerido!"
    },
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
        "title": "Usuário",
        "message": "Usuário é requerido!"
    }
]
    *    HTTP/1.1 500 Intern	al Server Error
 * */

 /**
    * @api {get} /api/v1/company/:id Find One Company
    * @apiGroup Company
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiParam {id} id Company id
    * @apiSuccess {Object[]} Company Post's lists
    * @apiExample {curl} Example usage:
        curl http://localhost:3000/api/v1/company/1 \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -H 'x-access-token: Aqui Seu token' 
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 201 OK
    {
        "id": 1,
        "fantasy": "MG IMOBILIAIRIA",
        "balance": "120.00",
        "socialName": "MG ADMINISTRACAO E ASSESSORIA IMOBILIARIA LTDA - EPP",
        "multiCompany": true,
        "cnpj": "24.272.981/0001-94",
        "phone": "81999919988",
        "responsible": "Luciano Thomaz",
        "zipCode": "52505020",
        "location": {
            "type": "Point",
            "coordinates": [
                -8.0395981,
                -34.8991461
            ]
        },
        "address": "AV CONSELHEIRO ROSA E SILVA",
        "number": "1356",
        "district": "AFLITOS",
        "complement": "Casa A",
        "created_at": "2017-11-19T17:42:50.000Z",
        "updated_at": "2018-01-26T17:12:02.000Z",
        "user_id": 6,
        "type_company_id": 1,
        "city_id": 1,
        "state_id": 1,
        "country_id": 1,
        "User": {
            "id": 6,
            "name": "Pizzaria Comeu Morreu agora",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwibmFtZSI6IlBpenphcmlhIENvbWV1IE1vcnJldSBhZ29yYSIsImlhdCI6MTUxNjk2OTg1OH0.vsPD7xtNruLoEkh4HTYo1lXZM-uBf7MRU9qeHltCssY",
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
            "stage": 3,
            "status": false,
            "created_at": "2017-12-28T14:45:14.000Z",
            "updated_at": "2018-01-26T18:18:25.000Z",
            "types_user_id": null
        },
        "TypeCompany": {
            "id": 1,
            "name": "Bares e Restaurantes",
            "status": true,
            "created_at": "2017-10-31T15:46:00.000Z",
            "updated_at": "2017-10-31T15:46:00.000Z"
        },
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
        },
        "Scores": [],
        "BlockDrivers": [
            {
                "id": 8,
                "description": "Descrição",
                "status": true,
                "created_at": "2018-01-25T18:20:46.000Z",
                "updated_at": "2018-01-25T18:20:46.000Z",
                "company_id": 1,
                "driver_id": 6,
                "user_id": null
            }
        ]
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
    * @api {get} /api/v1/company/search/:cnpj Validate Exist Company
    * @apiGroup Company
    * @apiParam {cnpj} cnpj Company cnpj
    * @apiSuccess {Object[]} Company Post's lists
    * @apiExample {curl} Example usage:
        curl http://localhost:3000/api/v1/company/search/27865757000102 \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 201 OK
        true
     * @apiErrorExample {json} List error
    * HTTP/1.1 404 Bad Request
        [
           {
               title: 'CNPJ',
                message: 'CNPJ é invalido!'
           }
        ]
    *    HTTP/1.1 500 Intern	al Server Error
 * */


 /**
    * @api {post} /api/v1/company/search/cnpj Search CNPJ Base Receita Federal
    * @apiGroup Company
    * @apiSuccess {String} cnpj Company cnpj
    * @apiSuccess {String} socialName Company socialName
    * @apiSuccess {Object[]} Company Post's lists
    * @apiExample {curl} Example usage:
        curl -X POST http://localhost:3000/api/v1/company/search/cnpj \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -d 'cnpj=27865757000102&socialName=GLOBO%20COMUNICACAO%20E%20PARTICIPACOES%20S%2FA'
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 201 OK
    {
        "atividade_principal": [
            {
                "text": "Atividades de televisão aberta",
                "code": "60.21-7-00"
            }
        ],
        "data_situacao": "03/11/2005",
        "nome": "GLOBO COMUNICACAO E PARTICIPACOES S/A",
        "uf": "RJ",
        "telefone": "(21) 2540-2623",
        "atividades_secundarias": [
            {
                "text": "Reprodução de vídeo em qualquer suporte",
                "code": "18.30-0-02"
            },
            {
                "text": "Portais, provedores de conteúdo e outros serviços de informação na internet",
                "code": "63.19-4-00"
            },
            {
                "text": "Agenciamento de espaços para publicidade, exceto em veículos de comunicação",
                "code": "73.12-2-00"
            },
            {
                "text": "Programadoras",
                "code": "60.22-5-01"
            }
        ],
        "qsa": [
            {
                "qual": "10-Diretor",
                "nome": "CARLOS HENRIQUE SCHRODER"
            },
            {
                "qual": "10-Diretor",
                "nome": "JORGE LUIZ DE BARROS NOBREGA"
            },
            {
                "qual": "10-Diretor",
                "nome": "ROSSANA FONTENELE BERTO"
            },
            {
                "qual": "10-Diretor",
                "nome": "ALI AHAMAD KAMEL ALI HARFOUCHE"
            },
            {
                "qual": "10-Diretor",
                "nome": "SERGIO LOURENCO MARQUES"
            },
            {
                "qual": "10-Diretor",
                "nome": "MARCELO LUIS MENDES SOARES DA SILVA"
            },
            {
                "qual": "10-Diretor",
                "nome": "ANTONIO CLAUDIO FERREIRA NETTO"
            },
            {
                "qual": "10-Diretor",
                "nome": "CRISTIANE DELECRODE LOPES SUT RIBEIRO"
            },
            {
                "qual": "10-Diretor",
                "nome": "MARCELO QUEIROZ DUARTE"
            },
            {
                "qual": "10-Diretor",
                "nome": "WANDERLEY BACCALA JUNIOR"
            }
        ],
        "situacao": "ATIVA",
        "bairro": "JARDIM BOTANICO",
        "logradouro": "R LOPES QUINTAS",
        "numero": "303",
        "cep": "22.460-901",
        "municipio": "RIO DE JANEIRO",
        "abertura": "31/01/1986",
        "natureza_juridica": "205-4 - Sociedade Anônima Fechada",
        "fantasia": "GCP,TV GLOBO, REDE GLOBO, GLOBO.COM, SOM LIVRE",
        "cnpj": "27.865.757/0001-02",
        "ultima_atualizacao": "2018-01-24T16:11:46.631Z",
        "status": "OK",
        "tipo": "MATRIZ",
        "complemento": "",
        "email": "",
        "efr": "",
        "motivo_situacao": "",
        "situacao_especial": "",
        "data_situacao_especial": "",
        "capital_social": "6408935530.37",
        "extra": {}
    }
     * @apiErrorExample {json} List error
    * HTTP/1.1 404 Bad Request
        [
            {
                "title": "CNPJ",
                "message": "Cnpj é requerido!"
            },
            {
                "title": "Razão Social",
                "message": "Razão Social requerido!"
            }
        ]
    *    HTTP/1.1 500 Intern	al Server Error
 * */
 

 /**
    * @api {get} /api/v1/company List All Company
    * @apiGroup Company
    * @apiHeader {String} x-access-token Users unique access-key.
    * @apiSuccess {Object[]} Company Post's lists
    * @apiExample {curl} Example usage:
        curl http://localhost:3000/api/v1/company \
        -H 'Cache-Control: no-cache' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -H 'x-access-token: Aqui Seu token' 
    * @apiSuccessExample {json} Success
    *    HTTP/1.1 201 OK
    [
            {
            "id": 1,
            "fantasy": "MG IMOBILIAIRIA",
            "balance": "120.00",
            "socialName": "MG ADMINISTRACAO E ASSESSORIA IMOBILIARIA LTDA - EPP",
            "multiCompany": true,
            "cnpj": "24.272.981/0001-94",
            "phone": "81999919988",
            "responsible": "Luciano Thomaz",
            "zipCode": "52505020",
            "location": {
                "type": "Point",
                "coordinates": [
                    -8.0395981,
                    -34.8991461
                ]
            },
            "address": "AV CONSELHEIRO ROSA E SILVA",
            "number": "1356",
            "district": "AFLITOS",
            "complement": "Casa A",
            "created_at": "2017-11-19T17:42:50.000Z",
            "updated_at": "2018-01-26T17:12:02.000Z",
            "user_id": 6,
            "type_company_id": 1,
            "city_id": 1,
            "state_id": 1,
            "country_id": 1,
            "User": {
                "id": 6,
                "name": "Pizzaria Comeu Morreu agora",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwibmFtZSI6IlBpenphcmlhIENvbWV1IE1vcnJldSBhZ29yYSIsImlhdCI6MTUxNjk2OTg1OH0.vsPD7xtNruLoEkh4HTYo1lXZM-uBf7MRU9qeHltCssY",
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
                "stage": 3,
                "status": false,
                "created_at": "2017-12-28T14:45:14.000Z",
                "updated_at": "2018-01-26T18:18:25.000Z",
                "types_user_id": null
            },
            "TypeCompany": {
                "id": 1,
                "name": "Bares e Restaurantes",
                "status": true,
                "created_at": "2017-10-31T15:46:00.000Z",
                "updated_at": "2017-10-31T15:46:00.000Z"
            },
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
            },
            "Scores": [],
            "BlockDrivers": [
                {
                    "id": 8,
                    "description": "Descrição",
                    "status": true,
                    "created_at": "2018-01-25T18:20:46.000Z",
                    "updated_at": "2018-01-25T18:20:46.000Z",
                    "company_id": 1,
                    "driver_id": 6,
                    "user_id": null
                }
            ]
        }
    ]
     * @apiErrorExample {json} List error
    *    HTTP/1.1 500 Intern	al Server Error
 * */

