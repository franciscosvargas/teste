module.exports = app => {
    const url = `${app.config.url}/calculategooglemaps`
    const Controller = require('../controllers/calculateGoogleMaps')(app)
    const Validate = require('../validates/calculateGoogleMaps')(app)

    app.route(`${url}`)
        .post(app.jwt, Validate.companyCalculate, Controller.companyCalculate)

    app.route(`${url}/taxi`)
        .post(app.jwt, Validate.taxiCalculate, Controller.taxiCalculate)

    app.route(`${url}/location`)
        .post(app.jwt, Validate.locationCalculate, Controller.locationCalculate)
}
