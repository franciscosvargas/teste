
module.exports = (app) => {

    const jwt = require('jsonwebtoken')
    const key = require('../config/key')

    const User = app.datasource.models.users
    const Shop = app.datasource.models.shops
    const Deliver = app.datasource.models.delivers

    return {
        validate: (req, res, next) => {
            const token = req.headers['x-access-token']
            if (token) {
                try {
                    const query = {where: {token: {$eq: token}}, include: {all: true}}
                    User.findOne(query)
                        .then((user) => {
                            if (user) {
                                req.user = {
                                    token: user.dataValues.token,
                                    object: user.dataValues
                                }
                                next()
                            } else {
                                res.status(401).json({message: 'Error fetching token User.'})
                            }
                        })
                        .catch(() => res.status(401).json({message: 'Error fetching token User.'}))
                } catch (err) {
                    res.status(401).json({message: 'Error: Your token is invalid', error: err})
                }
            } else {
                res.status(401).json({message: 'Error: Authentication not found'})
            }
        },
        validateShop: (req, res, next) => {
            const token = req.headers['x-access-token']
            if (token) {
                try {
                    const query = {where: {token: {$eq: token}}, include: {all: true}}
                    Shop.findOne(query)
                        .then((user) => {
                            if (user) {
                                req.user = {
                                    token: user.dataValues.token,
                                    object: user.dataValues
                                }
                                next()
                            } else {
                                res.status(401).json({message: 'Error fetching token User.'})
                            }
                        })
                        .catch(() => res.status(401).json({message: 'Error fetching token User.'}))
                } catch (err) {
                    res.status(401).json({message: 'Error: Your token is invalid', error: err})
                }
            } else {
                res.status(401).json({message: 'Error: Authentication not found'})
            }
        },
        validateDelivery: (req, res, next) => {
            const token = req.headers['x-access-token']

            const decoded = jwt.verify(token, key.token)
            if (decoded.id) {
                try {
                    const query = {where: { id: decoded.id }, include: {all: true}}
                    Deliver.findOne(query)
                        .then((user) => {
                            if (user) {
                                req.user = {
                                    token: user.dataValues.token,
                                    object: user.dataValues
                                }
                                next()
                            } else {
                                res.status(401).json({message: 'Error fetching token User.'})
                            }
                        })
                        .catch(() => res.status(401).json({message: 'Error fetching token User.'}))
                } catch (err) {
                    res.status(401).json({message: 'Error: Your token is invalid', error: err})
                }
            } else {
                res.status(401).json({message: 'Error: Authentication not found'})
            }
        },
    }
}
