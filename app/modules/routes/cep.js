module.exports = app => {
    const url = `${app.config.url}/cep`
    const Validate = require('../validates/cep')(app)

    app.route(`${url}/:cep`)
        .get(Validate.searchCep)
}
