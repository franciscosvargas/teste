// require('newrelic')
const express = require('express')
const EventEmitter = require('events').EventEmitter
const bodyParser = require('body-parser')
const cors = require('cors')
// const http = require('http')
const path = require('path')

const morgan = require('morgan')
const compression = require('compression')
const validator = require('express-validator')
const validateFormat = require('./app/errors/validate')
const pdf = require('express-pdf')

const https = require('https')
const fs = require('fs')
const privateKey = fs.readFileSync('/etc/letsencrypt/live/pedeae.delivery/privkey.pem', 'utf8')
const certificate = fs.readFileSync('/etc/letsencrypt/live/pedeae.delivery/fullchain.pem', 'utf8')

// const log = require('./app/helpers/logApi').log

// mongoDB
// require('./app/databases/mongodb')
require('./app/databases/mysql')

var rawBodySaver = function (req, res, buf, encoding) {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8')

        const parsed = JSON.parse(req.rawBody)
        if (parsed) {
            req.parsed = parsed
        }
    }
}

const app = express()

// app.use(pdf)
// app.use(bodyParser.json({limit: '1000mb'}))
// app.use(bodyParser.urlencoded({limit: '1000mb', extended: true}))

app.use(bodyParser.json({ verify: rawBodySaver, limit: '1000mb' }))
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true, limit: '1000mb' }))
app.use(bodyParser.raw({
    limit: '1000mb',
    verify: rawBodySaver, type: function (req) {
        return true
    }
}))

app.use(express.static(path.join(__dirname, 'public')))
app.use(validator(validateFormat))
// app.use(log())
app.use(morgan('dev'))
app.use(compression())
app.use(cors())

const config = require('./app/config/urls')
const datasource = require('./app/databases/mysql')
app.config = config
app.datasource = datasource(app)

app.jwt = require('./app/helpers/jwt')(app).validate
app.jwtShop = require('./app/helpers/jwt')(app).validateShop

const port = process.env.PORT || 3000

const server = https.createServer({ key: privateKey, cert: certificate }, app)
// const server = http.createServer(app)

const eventEmitter = new EventEmitter()

require('./routes')(app, eventEmitter)

// require('./app/socket/server')(app, eventEmitter)
// require('./app/socket/send-socket')(eventEmitter)

app.route('/date').get((req, res) => res.json({ date: require('./app/helpers/dateFormat').utc(new Date()) }))

app.route('/medias/:sender_id/:file').get((req, res) => {
    var dir = '/root/WebWhatsapp-Wrapper'

    var mime = {
        html: 'text/html',
        txt: 'text/plain',
        css: 'text/css',
        gif: 'image/gif',
        jpe: 'image/jpeg',
        jpg: 'image/jpeg',
        png: 'image/png',
        svg: 'image/svg+xml',
        js: 'application/javascript'
    }

    var file = path.join(dir, req.path.replace(/\/$/, '/index.html'))
    if (file.indexOf(dir + path.sep) !== 0) {
        return res.status(403).end('Forbidden')
    }
    var type = mime[path.extname(file).slice(1)] || 'text/plain'
    var s = fs.createReadStream(file)
    s.on('open', function () {
        res.set('Content-Type', type)
        s.pipe(res)
    })
    s.on('error', function () {
        res.set('Content-Type', 'text/plain')
        res.status(404).end('Not found')
    })
})

app.route('/avatar/:sender_id').get((req, res) => {
    var mime = {
        html: 'text/html',
        txt: 'text/plain',
        css: 'text/css',
        gif: 'image/gif',
        jpe: 'image/jpeg',
        jpg: 'image/jpeg',
        png: 'image/png',
        svg: 'image/svg+xml',
        js: 'application/javascript'
    }

    var dir = '/root/WebWhatsapp-Wrapper/pictures'
    var file = path.join(dir, req.params.sender_id)
    if (file.indexOf(dir + path.sep) !== 0) {
        return res.status(403).end('Forbidden')
    }
    var type = mime[path.extname(file).slice(1)] || 'text/plain'
    var s = fs.createReadStream(file)
    s.on('open', function () {
        res.set('Content-Type', type)
        s.pipe(res)
    })
    s.on('error', function () {
        res.set('Content-Type', 'text/plain')
        res.status(404).end('Not found')
    })
})

app.use((req, res) => res.status(404).json({ error: 'Route not found' }))

server.listen(port)

module.exports = app
