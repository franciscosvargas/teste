module.exports = app => {
    const url = `${app.config.url}/address`
    const Controller = require('../controllers/address')(app)

    app.route(`${url}/find`)
        .get(Controller.find)

    app.route(`${url}`)
        .post(Controller.create)
        .put(Controller.update)

    app.route(`${url}/:id`)
        .delete(Controller.delete)
}
