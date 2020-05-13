module.exports = app => {
    const url = `${app.config.url}/contact`
    const Controller = require('../controllers/contact')(app)
    // const Validate = require('../validates/contact')(app)

    // const Help = require('../../helpers/upload')

    app.route(`${url}/find`)
        .get(Controller.find)

    app.route(`${url}`)
        .post(Controller.create)
        .put(Controller.update)

    app.route(`${url}/:id`)
        .delete(Controller.delete)
}
