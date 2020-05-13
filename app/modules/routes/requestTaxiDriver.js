module.exports = (app, eventEmitter) => {
    const url = `${app.config.url}/requesttaxidriver`
    const Controller = require('../controllers/requestTaxiDriver')(app)
    const Validate = require('../validates/requestTaxiDriver')(app)

    app.route(`${url}`)
        .get(app.jwt, Controller.listAll)
        .post(app.jwt, Validate.create, Validate.isPromocode, Validate.isPromocodeValidateUserTaxi, Controller.create(eventEmitter))

}
