module.exports = app => {
    const url = `${app.config.url}/user`
    const Controller = require('../controllers/user')(app)
    const Validate = require('../validates/user')(app)

    app.route(`${url}/dashboard/general`)
        .get(Controller.dashboard)

    app.route(`${url}/dashboard/locations`)
        .get(Controller.dashboard)

    app.route(`${url}/sendmenssage`)
        .post(app.jwt, Controller.sendMensagge)

    app.route(`${url}/:id/send/email`)
        .get(app.jwt, Validate.listOne, Controller.sendEmail)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        // .put(Help.uploadImage.single('avatar'), Validate.update, Controller.update)
        .put(app.jwt, Controller.update)
        .delete(app.jwt, Validate.delete, Controller.delete)

    app.route(url)
        .get(app.jwt, Controller.listAll)
        .post(Validate.create, Validate.uniqueStage, Controller.create)

    app.route(`${url}/client`)
        .post(Validate.createClient, Validate.unique, Controller.createClient)

    app.route(`${url}/provider`)
        .post(Validate.createProvider, Validate.uniqueProvider, Controller.createProvider)

    app.route(`${url}/:id/block`)
        .post(app.jwt, Validate.isAdmin, Controller.blockUser)

    app.route(`${url}/forgot`)
        .post(Validate.forgot, Controller.forgot)

    app.route(`${url}/forgot/send`)
        .post(Validate.resendPhone, Controller.resendPhone)

    app.route(`${url}/forgot/send/password`)
        .post(Validate.passwordSend, Controller.forgotSend)

    app.route(`${url}/forgot/password`)
        .post(Validate.password, Controller.password)

    app.route(`${url}/validate`)
        .post(Validate.forgotValidate)

    app.route(`${url}/sms/resend/:id`)
        .get(Validate.resend, Controller.resend)

    app.route(`${url}/:id/recover/sms`)
        .get(Validate.resend, Controller.resend)

    app.route(`${url}/:id/recover/validate/:active`)
        .get(Validate.activeCode, Controller.recoveAtiveCode)

    app.route(`${url}/sms/validate/:active`)
        .get(Validate.activeCode, Controller.activeCode)

    app.route(`${url}/alias/typesvehicles/:id`)
        .post(Validate.typesVehicles, Validate.generatePlateVehicle, Controller.typesVehicles)

    app.route(`${url}/complete/register`)
        .post(Validate.completeRegister, Controller.completeRegister)

    app.route(`${url}/search/cpf`)
        .post(Validate.searchCpf)

    app.route(`${url}/search`)
        .post(Validate.searchUser, Controller.searchUser)

    app.route(`${url}/validate/email/:email`)
        .get(Validate.email)

    app.route(`${url}/validate/phone/:phone`)
        .get(Validate.phone)

    app.route(`${url}/validate/cpf/:cpf`)
        .get(Validate.cpf)

    app.route(`${url}/search`)
        .get(Controller.searchQuery)

    app.route(`${url}/stage`)
        .post(Validate.statgeUser)

    app.route(`${url}/running/open`)
        .get(app.jwt, Controller.isOpenRunning)

    app.route(`${url}/create/reports`)
        .post(app.jwt, Validate.reportCreate, Controller.reportCreate)
}
