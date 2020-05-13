module.exports = app => {
    const url = `${app.config.url}/product_variation`
    const Controller = require('../controllers/product_variation')(app)

    app.route(`${url}/find`)
        .get(Controller.find)

    app.route(`${url}`)
        .post(Controller.create)
        .put(Controller.update)

    app.route(`${url}/:id`)
        .delete(Controller.delete)
}
