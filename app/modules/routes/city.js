module.exports = app => {
    const url = `${app.config.url}/`
    const Controller = require('../controllers/city')(app)

    app.route(`${url}city/find`)
        .get(Controller.find)

    app.route(`${url}:id/city`)
    .get(Controller.listAllOrderByState)
    
    app.route(`${url}city`)
        .post(Controller.create)
        .put(Controller.update)

    app.route(`${url}city/:id`)
        .delete(Controller.delete)
}
