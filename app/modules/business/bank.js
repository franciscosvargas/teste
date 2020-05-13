module.exports = app => {
    const TypesBank = app.datasource.models.TypesBank
    const Bank = app.datasource.models.Bank
    const User = app.datasource.models.User
    const Driver = app.datasource.models.Driver
    const Pagarme = require('../../helpers/pagarme')
    const Help = require('../../helpers/tratmentPagarme')
    const SendEmail = require('../../helpers/sendEmail')(app)

    return {
        create: (req) => {
            const objectPagarme = Help.bank(req)
            return Pagarme.bank(objectPagarme).then(Help.returnPagarme)
        },
        listOneUser: object => new Promise((resolve, reject) => {
            User.findOne({ where: { id: object.body.user_id }, raw: true })
                .then(user => {
                    object.body.cpf = user.cpf
                    object.body.email = user.email
                    resolve(object)
                })
                .catch(reject)
        }),
        listOneUserDriver: object => 
            User.findOne({
                where: { id: parseInt(object.body.user_id) },
                include: [{ model: Driver, required: true }]
            }),
        listOne: (req) => {
            const query = {
                where: req.params,
                attributes: { exclude: ['created_at', 'updated_at'] },
                include: [{ model: TypesBank }]
            }
            return query
        },
        bankListOne: req => object => new Promise((resolve, reject) => {
            Bank.findOne({
                where: req.params
            })
                .then(banks => resolve(Object.assign({ bank: banks }, object)))
                .catch(reject)
        }),
        BankBond: req => object => new Promise((resolve, reject) => {
            if (parseInt(object.bank.pagarme) === object.id) {
                if (req.body.my) delete req.body.cpf
                const query = req.params
                resolve({
                    query: query,
                    body: req.body
                })
            } else {
                req.body.pagarme = object.id
                if (req.body.my) delete req.body.cpf
                const query = req.params
                resolve({
                    query: query,
                    body: req.body
                })
            }
        }),
        listAll: () => {
            const query = {
                where: {},
                attributes: { exclude: ['created_at', 'updated_at'] },
                include: [{ model: TypesBank }]
            }
            return query
        },
        sendEmail: user => {
            const Template = require('../../templates/sign-up-prestador.html.js')
            const description = 'Cadastro Pendente'
            SendEmail.send(user.dataValues, Template, description)
        },
        stageUser: req => new Promise((resolve, reject) =>
            User.update({ stage: 9 }, { where: { id: req.body.user_id } })
                .then(() => resolve(req))
                .catch(reject))
    }
}
