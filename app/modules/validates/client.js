module.exports = app => {
    const User = app.datasource.models.User
    const Client = app.datasource.models.Client
    const CPF = require('cpf_cnpj').CPF

    return {
        create: (req, res, next) => {
            req.assert('cpf', 'valid cpf required').len(8, 11)
            req.assert('ddi', 'valid ddi required').notEmpty()
            req.assert('dd', 'valid dd required').notEmpty()
            req.assert('phone', 'valid phone required').len(8, 9)
            req.assert('user_id', 'valid user_id required').isInt().notEmpty()
            const error = req.validationErrors()
            if (error) {
                res.status(400).json(error)
            } else {
                if (!CPF.isValid(req.body.cpf)) {
                    res.status(400).json({error: 'Cpf invalid!'})
                } else {
                    User.findById(req.body.user_id)
                        .then(user => user ? res.status(400).json({error: 'User Taken'}) : next())
                        .catch(err => res.status(500).json(err))
                }
            }
        },
        listOne: (req, res, next) => {
            isNaN(req.params.id) ? res.json({id: 'Invalid!'}) : next()
        },
        update: (req, res, next) => {
            isNaN(req.params.id) ? res.json({id: 'Invalid!'}) : next()
        },
        delete: (req, res, next) => {
            isNaN(req.params.id) ? res.json({id: 'Invalid!'}) : next()
        },
        unique: (req, res, next) => {
            const query = {
                where: {cpf: req.body.cpf}
            }
            Client.findOne(query)
                .then(client => client ? res.status(400).json({error: 'Client Taken'}) : next())
                .catch(err => res.status(500).json(err))
        }

    }
}
