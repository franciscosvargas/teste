module.exports = (app) => {
    const nodemailer = require('nodemailer')
    const getTransport = () => nodemailer.createTransport({
        host: 'ses-smtp-user.iuvo_club',
        port: 465,
        secure: true,
        auth: {
            user: 'AKIAJMMVYLZMVQK44VOQ',
            pass: 'Ap8DqPmfkjsCynQVrI3ht2VGik5+vT3FR/5WEWb0DwF8'
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    const getConfig = (Description) => ({
        remetente: ' <no-reply@iuvoclub.com.co>',
        assunto: Description
    })

    const destinatario = 'rodrigo@wr7solutions.com.br'

    const sendEmail = (dest, config, html) => {
        getTransport().sendMail(
            {
                from: config.remetente,
                to: dest,
                subject: config.assunto,
                html: html
            }, (err) => {
                if (err) throw new TypeError(err)
            }
        )
    }
    return {
        send: (User, Template, Description) => {
            const template = Template
            const config = getConfig(Description)
            const html = template(User)

            getTransport().sendMail({
                from: config.remetente,
                to: User.email,
                subject: config.assunto,
                html: html
            }, (err) => {
                console.log(err)
                if (err) throw new TypeError(err)
            })
        },

        sendContactDocument: (User, Template, Description) => {
            const config = {
                remetente: ' <contato@iuvoclub.com.co>',
                assunto: Description
            }
            const html = Template(User)

            getTransport().sendMail({
                from: config.remetente,
                to: User.email,
                subject: config.assunto,
                html: html
            }, (err) => {
                console.log(err)
                if (err) throw new TypeError(err)
            })
        },

        sendContact: (User, Template, Description) => {
            const nodemailer = require('nodemailer')
            const template = Template

            const config = {
                remetente: ' <no-reply@iuvoclub.com.co>',
                assunto: Description
            }

            const html = template(User)

            const transporte = nodemailer.createTransport({
                host: 'smtpout.secureserver.net',
                port: 465,
                secure: true,
                auth: {
                    user: 'noreply@iuvoclub.com.co',
                    pass: '1B0ltt123456@'
                },
                tls: {
                    rejectUnauthorized: false
                }
            })
            transporte.sendMail({
                from: config.remetente,
                to: 'contato@iuvoclub.com.co',
                subject: config.assunto,
                html: html
            }, (err) => {
                if (err) throw new TypeError(err)
            })
        },

        sendRunningReceipt: (User) => {
            const template = require('../templates/running-receipt.html')
            const config = getConfig("Recibo da corrida - IUVO Club")
            const html = template(User)
            sendEmail(destinatario, config, html)
        },

        //
        // DRIVER
        //

        sendDriverActivated: (User) => {
            const template = require('../templates/active-prestador.html')
            const config = getConfig("Prestador ativado - IUVO Club")
            const html = template(User)
            sendEmail(User.email, config, html)
        },

        sendDriverSignUp: (User) => {
            const template = require('../templates/sign-up-prestador.html')
            const config = getConfig("Prestador cadastrado - IUVO Club")
            const html = template(User)
            sendEmail(User.email, config, html)
        },

        //
        // USER
        //
        /*
        sendUserActivationCode: (User, Description) => {
            const template = require('../templates/active-code.html')
            const config = getConfig(Description)
            const html = template(User)
            sendEmail(destinatario, config, html)
        },

        sendUserSignUp: (User, Description) => {
            const template = require('../templates/sign-up-user.html')
            const config = getConfig(Description)
            const html = template(User)
            sendEmail(destinatario, config, html)
        },
        */



        //
        // PJ
        //

        /*
        sendPjSignUp: (User, Description) => {
            const template = require('../templates/sign-up-pj.html')
            const config = getConfig(Description)
            const html = template(User)
            writeTemplate('sign-up-pj', html)
            sendEmail(destinatario, config, html)
        },
        */
    }
}
