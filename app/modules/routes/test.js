module.exports = app => {
    const url = `${app.config.url}`
    const Helper = require('../../helpers/sendEmail')
    //const Validate = require('../validates/cep')(app)

    app.route(`${url}/test/running-receipt/`)
        .get(()=> Helper().sendRunningReceipt({
            userName: 'Rodrigox@@',
            driverName: 'Jaimex@@',
            driverPhoto: 'https://img.kpopmap.com/2016/01/sm-rookies-kun-profile.jpg',
            driverVehicle: 'Moto@@',
            value: '9,99@@',
            originTime: '08:00@@',
            originLocal: 'Abdias de Carvalho, 772@@',
            destinationTime: '08:00@@',
            destinationLocal: 'Rua da Guia, 25@@',
            travelDistanceKm: '25,12@@',
            travelMap: 'lkbk@rd`oF@IZ_AZ_An@w@FMJOJONSPSLIz@o@h@a@HEfAm@t@c@HExEoClC{AZSpBgAVOXQtAy@hAk@TMZQ`@Wf@Uh@Sl@Qb@Kf@Gp@GjBAbBCpAAnABh@?h@?z@A|@?vB@jAA~CGrF?tB?tBApB?pB@tFFxB?xB?bC?rABdCAB?`@?`@@l@AtBCvBCpBArB?vB?xB?lFA~A?|B@L?F@tA?rCAj@AvA?hB?tB?rBArFDhF?vBAtB?xB@N?v@?|@@V?V?|@?P?p@AfD?XAJ@rABdEBlDE\\@dBAdQBh@AP?lHAlB?dA?dA?jBAD?lGBz@?pVBdCC~CBTAX?N?R?L?P?R?Z@V?R?T?V@R?T?V@X?V@TAPAPARADALAJAB?FADAHCHAHALARELCLAJCJCLCJCLCNEnAe@RIdAw@\\WDCtB_A~As@jLwEdF{Bj@Yn@WnAg@xF_CxAm@`IgDRI|JgEbGeCzHeDZMr@Ux@YXKd@Qr@Wp@W^Ob@Q@Ad@Qx@[l@Ul@UZO\\Mr@[\\O^OXKj@W',
            travelTime: '00:12:36@@',
            travelDate: '26 de Março de 2018@@',
            travelService: 'Delivery@@'

        }, "Recibo de viagem - IUVO Club"))

    app.route(`${url}/test/driver/codigoAtivacao`)
        .get(()=> Helper().sendDriverActivationCode({
            name: 'Rodrigo',
            active: 'AA547D'

        }, "Ativação de prestador - IUVO Club"))


    app.route(`${url}/test/driver/ativado`)
        .get(()=> Helper().sendDriverActivated({
            name: 'Rodrigo'

        }, "Prestador ativado - IUVO Club"))


    app.route(`${url}/test/driver/cadastro`)
        .get(()=> Helper().sendDriverSignUp({
            name: 'Rodrigo@@'
        }, "Prestador cadastrado - IUVO Club"))











    app.route(`${url}/test/user/codigoAtivacao`)
        .get(()=> Helper().sendUserActivationCode({
            name: 'User Rodrigo',
            active: 'AA547D'

        }, "Ativação de usuário - IUVO Club"))


    app.route(`${url}/test/user/cadastro`)
        .get(()=> Helper().sendUserSignUp({
            name: 'Rodrigo@@'
        }, "Usuário cadastrado - IUVO Club"))







    app.route(`${url}/test/pj/cadastro`)
        .get(()=> Helper().sendPjSignUp({
            name: 'PJ'
        }, "PJ cadastrado - IUVO Club"))
}
