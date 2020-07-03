module.exports = app => {
    const url = `${app.config.url}/address`
    const Controller = require('../controllers/address')(app)
    app.route(`${url}/find`)
        .get(Controller.find)

    app.route(`${url}`)
        .post(Controller.create)

    app.route(`${url}/:id`)
        .put(Controller.update)
        .get(Controller.getIdById)
        .delete(Controller.delete)
}
