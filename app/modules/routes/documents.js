module.exports = app => {
    const url = `${app.config.url}/document`
    const Controller = require('../controllers/documents')(app)
    const Validate = require('../validates/documents')(app)

    const Help = require('../../helpers/upload')

    app.route(url)
        .get(app.jwt, Controller.listAll)
        .post(Help.uploadImage.single('url'), Validate.isTwoDocument, Controller.create)

    app.route(`${url}/painel`)
        .post(app.jwt, Controller.createPainel)

    app.route(`${url}/:id/painel`)
        .put(app.jwt, Controller.painelUpdate)

    app.route(`${url}/new`)
        .post(app.jwt, Validate.create, Controller.create)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .put(app.jwt, Help.uploadImage.single('url'), Validate.update, Controller   .update)
        .delete(app.jwt, Validate.delete, Controller.delete)
}


