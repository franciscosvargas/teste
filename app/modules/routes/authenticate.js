module.exports = app => {
    const url = `${app.config.url}/authenticate`
    const Controller = require('../controllers/authenticate')(app)
    const Validate = require('../validates/authenticate')(app)


    app.route(`${url}/shop`)
        .post(Validate.authenticate, Controller.authenticateShop)

    app.route(`${url}/deliver`)
        .post(Validate.authenticateWithEmail, Controller.authenticateDeliver)

    app.route(`${app.config.url}/me`)
        .get(app.jwt, Validate.me)

    app.route(`${app.config.url}/logout`)
        .post(app.jwt, Validate.logout, Controller.logout)

    app.route(`${app.config.url}/logout/shop`)
        .post(app.jwtShop, Validate.logout, Controller.logoutShop)
    
    app.route(`${app.config.url}/logout/deliver`)
        .post(app.jwtDeliver, Validate.logout, Controller.logoutDeliver)
}
