module.exports = app => {
    const url = `${app.config.url}/authenticate`
    const Controller = require('../controllers/authenticate')(app)
    const Validate = require('../validates/authenticate')(app)

    app.route(url)
        .post(Validate.authenticate, Controller.authenticate)

    app.route(`${url}Shop`)
        .post(Validate.authenticate, Controller.authenticateShop)

    app.route(`${app.config.url}/me`)
        .get(app.jwt, Validate.me)

    app.route(`${app.config.url}/logout`)
        .get(app.jwt, Validate.logout, Controller.logout)
}
