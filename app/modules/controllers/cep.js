module.exports = app => {
    const Cep = app.datasource.models.Cep
    const Persistence = require('../../helpers/persistence')(Cep)
    const Regex = require('../../helpers/regex').cep
    return {
        create: (res, body) => {
            const object = {}

            object.zipCode = Regex(body.cep)
            object.city = body.localidade || body.cidade
            object.state = body.uf || body.estado || body.uf_sigla
            object.district = body.bairro

            try {
                object.ibge = body.ibge || body.cidade_info.codigo_ibge
                object.address = body.logradouro.length > 3 ? body.logradouro : body.logradouro_completo || ''
            } catch (er) {
                object.ibge = ''
            }
            Persistence.create(object, res)
        }
    }
}
