module.exports = app => {
    const Controller = require('../modules/controllers/cep')(app)
    const request = require('request')

    function searchOne (req, res) {
        request(`https://viacep.com.br/ws/${req.params.cep}/json/`, function (error, response, body) {
            try {
                response.statusCode === 200 && !JSON.parse(body).erro
                    ? Controller.create(res, JSON.parse(body))
                    : searchTwo(req, res)
            } catch (err) {
                searchTwo(req, res)
            }
        })
    }
    function searchTwo (req, res) {
        request(`http://api.postmon.com.br/v1/cep/${req.params.cep}`, function (error, response, body) {
            try {
                response.statusCode == 200 && !JSON.parse(body).error
                    ? Controller.create(res, JSON.parse(body))
                    : searchFour(req, res)
            } catch (err) {
                searchFour(req, res)
            }
        })
    }
    function searchFour (req, res) {
        const cep = req.params.cep.replace(/[^\d]+/g, '')
        request(`http://correiosapi.apphb.com/cep/${cep}`, function (error, response, body) {
            try {
                response.statusCode == 200 && !JSON.parse(body).message
                    ? Controller.create(res, JSON.parse(body))
                    : searchFive(req, res)
            } catch (err) {
                searchFive(req, res)
            }
        })
    }

    function searchFive (req, res) {
        request(`http://cep.republicavirtual.com.br/web_cep.php?cep=${req.params.cep}&formato=json`, function (error, response, body) {
            try {
                response.statusCode == 200 && body.resultado
                    ? Controller.create(res, body)
                    : searchSix(req, res)
            } catch (err) {
                searchSix(req, res)
            }
        })
    }
    function searchSix(req, res) {
        request(`http://appservidor.com.br/webservice/cep?CEP=${req.params.cep}`, function (error, response, body) {
            try {
                response.statusCode == 200 && body.total
                    ? Controller.create(res, body)
                    : res.json({ cep: 'Não Encontrado!' })
            } catch (err) {
                res.json({ cep: 'Não Encontrado!' })
            }
        })
    }
    return searchOne
}
