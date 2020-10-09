module.exports = app => {
    const Errors = require('../../errors/authenticate/pt-br')
    return {
        authenticate: (req, res, next) => {
            req.assert('login', Errors.login).optional()
            // req.assert('phone', Errors.phone).optional().notEmpty()
            req.assert('password', Errors.password).len(1, 2000)
            const error = req.validationErrors()
            error ? res.status(400).json(error)
                : req.body.login ? next() : res.status(400).json([Errors.login, Errors.password])
        },
        authenticateWithEmail: (req, res, next) => {
            req.assert('email', Errors.email).optional()
            // req.assert('phone', Errors.phone).optional().notEmpty()
            req.assert('password', Errors.password).len(1, 2000)
            const error = req.validationErrors()
            error ? res.status(400).json(error)
                : req.body.email ? next() : res.status(400).json([Errors.email, Errors.password])
        },
        me: (req, res, next) => {
            res.status(200).json(req.user)
        },
        logout: (req, res, next) => req.user ? next() : res.status(401).json([Errors.authenticate])
    }
}
