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
    const Regex = require('../../helpers/regex')
    const Business = require('../business/authenticate')(app)
    const crypto = require('../../helpers/crypto')

    return {
        authenticate: async (req, res) => {
            const user = await Usuarios.findOne({
                where: {login: req.body.login.toLowerCase(), password: req.body.password},
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
            const user = await Shops.findOne({
                where: {login: req.body.login.toLowerCase(), password: req.body.password},
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
        logout: async (req, res) => {
            const driverLogout = await Business.driverLogout(req.user.object.Drivers[0].dataValues)
            const userLogout = await Business.userLogout(req.user.object)(driverLogout)
            await Business.mongodbStatus(req.user.object.Drivers[0].dataValues)(userLogout)
            res.status(200).json([{title: 'Sair', message: 'Saindo do sistema!'}])
        }
    }
}
