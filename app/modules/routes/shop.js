module.exports = app => {
    const url = `${app.config.url}/shop`
    const url2 = `${app.config.url}/`
    const Controller = require('../controllers/shop')(app)

    app.route(`${url}/find`)
        .get(Controller.find)



    app.route(`${url}`)
        .post(Controller.create)
        .put(Controller.update)

    app.route(`${url}/:id`)
        .get(Controller.listByCategoryId)
        .delete(Controller.delete)

    app.route(`${url}/:id/:city`)
        .get(Controller.listByCategoryIdWhereCityName)

    app.route(`${url}/detail/:id`)
        .get(Controller.GetByShopId)

        app.route(`${url2}:id/address`)
        .get(Controller.getIdByAddressId)

    app.route(`${url}/:id/online`)
        .put(app.jwtShop, Controller.online)

    app.route(`${url}/:id/offline`)
        .put(app.jwtShop, Controller.offline)
}
