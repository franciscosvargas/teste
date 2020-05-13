module.exports = app => {
    const url = `${app.config.url}/rate`
    const Controller = require('../controllers/rates')(app)
    // const Validate = require('../validates/rates')(app)

    // const Help = require('../../helpers/upload')

    app.route(`${url}/find`)
        .get(Controller.find)

    app.route(`${url}`)
        .post(Controller.create)
        .put(Controller.update)

    app.route(`${url}/:id`)
        .delete(Controller.delete)
}
