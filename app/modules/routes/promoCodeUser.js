module.exports = app => {
    const url = `${app.config.url}/promocodeuser`
    const Controller = require('../controllers/promoCodeUser')(app)
    const Validate = require('../validates/promoCodeUser')(app)

    app.route(url)
        .get(app.jwt, Controller.listAll)
        .post(
            Validate.create,
            Validate.uniqueUser,
            Validate.promoCodeIsExist,
            Validate.uniquePromoCodeService,
            Validate.countPromoCodeDelivery,
            Validate.countPromoCodeTaxi,
            Controller.create)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .put(app.jwt, Validate.update, Controller.update)
        .delete(app.jwt, Validate.delete, Controller.delete)
}
