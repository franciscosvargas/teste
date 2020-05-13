module.exports = app => {
    const url = `${app.config.url}/category`
    const Controller = require('../controllers/category')(app)

    app.route(`${url}/find`)
        .get(Controller.find)

    app.route(`${url}`)
        .post(Controller.create)
        .put(Controller.update)
        .get(Controller.findAll)

    app.route(`${url}/:id`)
        .delete(Controller.delete)
}
