module.exports = app => {
    const url = `${app.config.url}/sale`
    const Controller = require('../controllers/sale')(app)
    const Validate = require('../validates/sale')(app)

    // const Help = require('../../helpers/upload')

    app.route(`${url}/find`)
        .get(Controller.find)

    app.route(`${url}/findByDeliver`)
        .get(app.jwtDeliver, Controller.findByDeliver)

    app.route(`${url}/statusAndDeliver/:id`)
        .put(app.jwtShop, Validate.updateByShop, Controller.updateStatusAndDeliver)

    app.route(`${url}/coleta`)
        .get(Controller.GetBySalesInStateisAguardandoColeta);

    app.route(`${url}/quickSearch`)
        .get(Controller.quickSearch)

    app.route(`${url}`)
        .post(Controller.create)
        .put(Controller.update)

    app.route(`${url}/:id`)
        .delete(Controller.delete)
    
    
}
