module.exports = app => {
    const url = `${app.config.url}/group`
    const Controller = require('../controllers/group')(app)

    app.route(`${url}/find`)
        .get(app.jwtShop, Controller.find)

    app.route(`${url}`)
        .post(app.jwtShop, Controller.create)
        .put(app.jwtShop, Controller.update)
        .get(app.jwtShop, Controller.findAll)

    app.route(`${url}/:id`)
        .delete(app.jwtShop, Controller.delete)
}
