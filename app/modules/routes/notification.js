module.exports = app => {
    const url = `${app.config.url}/notification`
    const Controller = require('../controllers/notification')(app)
    // const Validate = require('../validates/notification')(app)

    // const Help = require('../../helpers/upload')

    app.route(`${url}/find`)
        .get(Controller.find)

    app.route(`${url}`)
        .post(Controller.create)
        .put(Controller.update)

    app.route(`${url}/:id`)
        .delete(Controller.delete)
}
