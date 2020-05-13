module.exports = app => {
    const url = `${app.config.url}/overview`
    const Controller = require('../controllers/overview')(app)
    const Validate = require('../validates/overview')(app)

    app.route(url)
        .get(app.jwt, Validate.show, Controller.show)  

    app.route(`${url}/:driver_id/driver`)
        .get(app.jwt, Validate.showDriver, Controller.showDriver)
}
