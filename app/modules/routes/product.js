module.exports = app => {
    const url = `${app.config.url}/product`
    const Controller = require('../controllers/product')(app)

    app.route(`${url}/find`)
        .get(app.jwtShop, Controller.find)

    app.route(`${url}`)
        .post(app.jwtShop, Controller.create)
        .put(app.jwtShop, Controller.update)

    app.route(`${url}/shop/:id/:id_group`)
        .get(Controller.listByShopId)

    app.route(`${url}/:id`)
        .delete(app.jwtShop, Controller.delete)
}
