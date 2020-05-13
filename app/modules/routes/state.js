module.exports = app => {
    const url = `${app.config.url}/state`
    const Controller = require('../controllers/state')(app)
    // const Validate = require('../validates/state')(app)

    // const Help = require('../../helpers/upload')

    app.route(`${url}/find`)
        .get(Controller.find)

    app.route(`${url}`)
        .post(Controller.create)
        .put(Controller.update)

    app.route(`${url}/:id`)
        .delete(Controller.delete)
}
