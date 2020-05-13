module.exports = app => {
    const Generator = require('../../helpers/generator')(app)
    // const SendEmail = require('../../helpers/sendEmail')(app)
    const SendEmailAws = require('../../helpers/sendEmailAws')(app)
    const Regex = require('../../helpers/regex')
    const SendSms = require('../../helpers/sendSms')
    const randtoken = require('rand-token')
    const Onesignal = require('../../helpers/oneSignal')
    const Firebase = require('../../helpers/firebase')

    const Driver = app.datasource.models.Driver
    const User = app.datasource.models.User
    const Vehicles = app.datasource.models.Vehicles

    return {
        create: req => new Promise(async (resolve, reject) => {
            try {
                const phone = Regex.phoneClean(req.body.phone)
                req.body.ddi = Regex.ddi(phone)
                req.body.ddd = Regex.ddd(phone)
                req.body.number = Regex.phone(phone)
                req.body.name = req.body.name.toUpperCase()
                req.body.active = Generator.active()
                req.body.type_user_id = 1
                req.body.stage = 1
                const user = await User.create(req.body)
                const mod = { user_id: user.id, status: true }
                await Driver.create(mod)
                const Template = require('../../templates/active-code.html')
                const description = 'Código para Ativação'
                SendEmailAws.send(user.dataValues, Template, description)
                SendSms.send(req.body)
                resolve(user)
            } catch (err) {
                reject(err)
            }
        }),
        client: req => {
            const phone = Regex.phoneClean(req.body.phone)
            req.body.ddi = Regex.ddi(phone)
            req.body.ddd = Regex.ddd(phone)
            req.body.number = Regex.phone(phone)
            req.body.name = req.body.name.toUpperCase()
            req.body.active = Generator.active()
            req.body.member_code = Generator.memberCode()
            req.body.promotional_code = Generator.promocode()
            req.body.type_user_id = 1
            req.body.status = 1
            // const Template = require('../../templates/active-code.html')
            // const description = 'Código para Ativação'
            // SendEmailAws.send(req.body, Template, description)
            // SendSms.send(req.body)
            return req.body
        },
        forgot: (object) => {
            const Template = require('../../templates/forgot-html')
            object.forgot = randtoken.generate(30)
            const description = 'Esqueci Minha Senha'
            SendEmailAws.send(object, Template, description)
            return object
        },
        updatePassword: (object) => {
            const Template = require('../../templates/update-password-html')
            const description = 'Alterar Senha'
            SendEmailAws.send(object, Template, description)
        },
        resend: (req) => {
            req.user.active = Generator.active()
            SendSms.send(req.user)
            const Template = require('../../templates/active-code.html')
            const description = 'Código para Ativação'
            SendEmailAws.send(req.user, Template, description)
            return req.user
        },
        completeRegister: (object) => {
            const Template = require('../../templates/sign-up-prestador.html')
            const description = 'Cadastro finalizado'
            SendEmailAws.send(object, Template, description)
        },
        active: (active) => new Promise(async (resolve, reject) => {
            const user = await User.findOne({ where: { active: { $eq: active } }, include: [{ model: Driver }] })
            if (user.dataValues.Drivers.length === 0) {
                try {
                    const Template = require('../../templates/sign-up-user.html')
                    const description = 'Cadastro Ativo'
                    SendEmailAws.send(user.dataValues, Template, description)
                    user.stage = 2
                    resolve(user)
                } catch (err) {
                    reject({
                        title: 'Error',
                        message: 'Erro na validação de envio de e-mail'
                    })
                }
            }
            user.stage = 2
            resolve(user)
        }),
        pushNotificationDrivers: body => async object => {
            try {
                const objectGcm = {
                    data: {
                        title: body.title,
                        messenger: {
                            description: body.messenger
                        }
                    },
                    token: object.tokenGcm
                }
                await Firebase.pushNotification(objectGcm, Firebase.validateResponse)
                Promise.resolve()
            } catch (err) { Promise.resolve() }
        },
        pushNotificationUser: body => async object => {
            try {
                const push = {
                    message: {
                        'en': `${body.title}`
                    },
                    messenger: {
                        title: `${body.title}`,
                        message: `${body.messenger}`
                    },
                    playerId: [object.tokenGcm]
                }
                await Onesignal.pushNotification(push)
                Promise.resolve()
            } catch (err) {
                Promise.resolve()
            }
        },
        createBike: object => Vehicles.create(object),

        sendEmailDocument: async query => {
            const user = await User.findOne({where: query, raw: true})
            const Template = require('../../templates/pendent-document.html')
            const description = 'Problema no Cadastro'
            SendEmailAws.send(user, Template, description)
            return user
        }
    }
}
