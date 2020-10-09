module.exports = app => {
    const Usuarios = app.datasource.models.users
    const Shops = app.datasource.models.shops

    const User = app.datasource.models.User
    const Bank = app.datasource.models.Bank
    const Driver = app.datasource.models.Driver
    const Company = app.datasource.models.Company
    const Vehicles = app.datasource.models.Vehicles
    const Address = app.datasource.models.Address
    const Card = app.datasource.models.Card
    const Documents = app.datasource.models.Documents
    const Deliver = app.datasource.models.delivers

    const Regex = require('../../helpers/regex')
    const Business = require('../business/authenticate')(app)
    const crypto = require('../../helpers/crypto')

    return {
        authenticate: async (req, res) => {
            let password = crypto.md5(String(req.body.password));
            const user = await Usuarios.findOne({
                where: {login: req.body.login.toLowerCase(), password},
                include: {all: true}
            })
            if (user) {
                try {
                    Business.authenticate(res)(user.dataValues)
                } catch (err) {
                    console.log(err)
                    res.status(400).json([err])
                }
            } else {
                res.status(400).json([{title: 'Login', message: 'Login ou senha Inválido!'}])
            }
        },
        authenticateShop: async (req, res) => {
            let password = crypto.md5(String(req.body.password));
            const user = await Shops.findOne({
                where: {login: req.body.login.toLowerCase(), password},
                include: {all: true}
            })
            if (user) {
                try {
                    Business.authenticateShop(res)(user.dataValues)
                } catch (err) {
                    console.log(err)
                    res.status(400).json([err])
                }
            } else {
                res.status(400).json([{title: 'Login', message: 'Login ou senha Inválido!'}])
            }
        },

        authenticateDeliver: async (req, res) => {

            const { email, password } = req.body

            const passwordEncrypted = crypto.md5(String(password))

            const deliver = await Deliver.findOne({
                where: {
                    email: email.toLowerCase(),
                    password: passwordEncrypted
                },
            })

            if(deliver) 
                return Business.authenticateDeliver(res)(deliver.dataValues)
                
            res.status(400).json([{title: 'Login', message: 'Login ou senha Inválido!'}])
            
        },

        logout: async (req, res) => {
            await Business.userLogout(req.user)
            res.status(200).json([{title: 'Sair', message: 'Saindo do sistema!'}])
        },
        logoutShop: async (req, res) => {
            await Business.shopLogout(req.user)
            res.status(200).json([{title: 'Sair', message: 'Saindo do sistema!'}])
        },
        logoutDeliver: async (req, res) => {
            await Business.deliverLogout(req.user)
            res.status(200).json([{title: 'Sair', message: 'Saindo do sistema!'}])
        }
    }
}