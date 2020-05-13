module.exports = app => {
    const url = `${app.config.url}/administrator`
    const Controller = require('../controllers/administrator')(app)

    app.route(`${url}/find`)
        .get(Controller.find)

    app.route(`${url}`)
        .post(Controller.create)
        .put(Controller.update)

    app.route(`${url}/:id`)
        .delete(Controller.delete)
}
