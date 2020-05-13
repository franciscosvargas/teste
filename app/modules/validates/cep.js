module.exports = app => {
    const Cep = app.datasource.models.Cep
    const SearchCep = require('../../helpers/searchCep')(app)
    const Regex = require('../../helpers/regex').cep
    return {
        searchCep: (req, res, next) => {
            if (req.params.cep.length > 9) {
                res.status(400).json([{title: 'Cep', message: 'Cep requerido!'}])
            } else {
                const query = {where: {zipCode: Regex(req.params.cep)}}
                Cep.findOne(query)
                    .then(cep => cep ? res.status(200).json(cep) : SearchCep(req, res))
                    .catch(err => res.status(500).json(err))
            }
        }
    }
}
