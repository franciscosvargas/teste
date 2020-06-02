module.exports = app => {
    const url = `${app.config.url}/shop`
    const Controller = require('../controllers/shop')(app)

    app.route(`${url}/find`)
        .get(Controller.find)

    app.route(`${url}`)
        .post(Controller.create)
        .put(Controller.update)

    app.route(`${url}/:id`)
        .delete(Controller.delete)

    app.route(`${url}/:id/online`)
        .put(app.jwtShop, Controller.online)

    app.route(`${url}/:id/offline`)
        .put(app.jwtShop, Controller.offline)
}
