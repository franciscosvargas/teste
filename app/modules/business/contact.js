module.exports = app => {
    const SendEmail = require('../../helpers/sendEmail')(app)
    return {
        sendEmail: (object) => new Promise((resolve, reject) => {
            try {
                const Template = require('../../templates/send-email.html')
                const description = 'Email para Contato'
                SendEmail.sendContact(object, Template, description)
                resolve(object)
            } catch (err) {
                //console.log(err)
                reject({title: 'Email', message: 'Não conseguimos entrar em contato!'})
            }
        })
    }
}
