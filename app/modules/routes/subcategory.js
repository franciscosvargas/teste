module.exports = app => {
    const url = `${app.config.url}/subcategory`
    const Controller = require('../controllers/subcategory')(app)

    app.route(`${url}/find`)
        .get(Controller.find)

    app.route(`${url}`)
        .post(Controller.create)
        .put(Controller.update)
        .get(Controller.findAll)

    app.route(`${url}/:id`)
        .delete(Controller.delete)
}
