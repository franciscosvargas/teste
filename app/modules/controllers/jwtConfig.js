module.exports = (express, app) => {
    const jwt = require('jsonwebtoken')
    const apiRoutes = express.Router()

    apiRoutes.use((req, res, next) => {
        const token = req.headers['token']
        if (token) {
            try {
                const decoded = jwt.decode(token, app.get('superSecret'))

                if (decoded.exp <= Date.now() && req._doc && decoded) {
                    res.status(400).json({error: 'Access Expired, please sign in again'})
                }
                res.json(res.body)
            } catch (err) {
                res.status(401).json({message: 'Error: Your token is invalid'})
            }
        } else {
            res.status(401).json({message: 'Error: Authentication not found'})
        }
    })
    return apiRoutes
}
