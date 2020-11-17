
const { verify } = require('jsonwebtoken')

const key = require('../../config/key')

function ensureAdminAuthenticated(req, res, next){
    const authHeader = req.headers.authorization

    if (!authHeader)
      res.status(401).send('Informe um token de acesso.')

    const [, token] = authHeader.split(' ')

    try {
        const decoded = verify(token, key.tokenAdmin)

        const {id, name, master} = decoded;

        req.user = {
            id,
            name,
            master
        }

        return next()

    } catch (error) {
        res.status(401).send('O token informado é inválido')
    }
}

export default ensureAdminAuthenticated