var request = require('request')

const Url = require('../config/key').cpf
const Regex = require('../helpers/regex')

const comparing = (Object, User) => (User.name.toUpperCase().trim() === Object.nomePessoaFisica.trim())

const error = (res) => res.status(400).json([{title: 'CPF ou Data', message: 'Data não Corresponde'}])

const searchCpf = (User, object, res) => {
    var options = {
        method: 'GET',
        url: `${Url}/${object.cpf}/${Regex.removeAll(object.birthdate)}`,
        headers: {
            'cache-control': 'no-cache'
        }
    }
    request(options, function (errors, response, body) {
        if (response.statusCode == 200) {
            const objectResponse = JSON.parse(body)
            // if (comparing(objectResponse, User)) {
            res.status(200).json(objectResponse)
            // } else if (response.statusCode === 404) {
            //  error(res)
            // }
        } else {
            error(res)
        }
    })
}

module.exports = {
    searchCpf: searchCpf
}
