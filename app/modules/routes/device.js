module.exports = app => {
    const url = `${app.config.url}/device`
    const Controller = require('../controllers/device')(app)
    const Validate = require('../validates/device')(app)

    app.route(url)
        .get(app.jwt, Controller.listAll)
        .post(app.jwt, Validate.create, Validate.unique, Controller.create)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .put(app.jwt, Validate.update, Validate.isToken, Controller.update)
        .delete(app.jwt, Validate.delete, Controller.delete)

    app.route(`${url}/driver/:driver_id`)
        .put(app.jwt, Validate.updateDriver, Validate.isToken, Controller.update)

    app.route(`${url}/user/:user_id`)
        .get(app.jwt, Validate.user, Controller.listOneUser)

    app.route(`${url}/user/push`)
        .post(app.jwt, Validate.userPush, Controller.pushClient)
}
