module.exports = (app, eventEmitter) => {
    const Canais = app.datasource.models.canais
    const Usuarios = app.datasource.models.usuarios
    const Protocolos = app.datasource.models.protocolos
    const Contatos = app.datasource.models.contatos
    const MensagensRecebidas = app.datasource.models.mensagens_recebidas
    const MensagensEnviadas = app.datasource.models.mensagens_enviadas
    const GoBOT = require('../modules/business/gobot')(app)
    const Generator = require('../helpers/generator')

    const fs = require('fs')
    const privateKey = fs.readFileSync('/etc/letsencrypt/live/www.gobot.digital/privkey.pem', 'utf8')
    const certificate = fs.readFileSync('/etc/letsencrypt/live/www.gobot.digital/fullchain.pem', 'utf8')

    const moment = require('moment')
    const express = require('express')()
    const https = require('https').createServer({key: privateKey, cert: certificate}, express)
    const io = require('socket.io')(https)
    const path = require('path')
    const sequelize = require('sequelize')

    const port = 4000
    const baseUrl = require('../config/urls').baseUrl

    let socketUsers = []

    const sendOpenProtocols = function (user) {
        Protocolos.findAll({
            // attributes: [sequelize.fn('max', sequelize.col('protocolos.id'))],
            // group: ['contato_id'],
            order: [
                ['id', 'DESC']
            ],
            where: {
                $or: [
                    // {
                    // created_at: {
                    //     $gte: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
                    // }
                    // },
                    {usuario_id: user.id},
                    {'status': 'Em Espera'}
                ]
            },
            include: [
                {model: Contatos},
                {model: MensagensRecebidas, order: [['created_at', 'DESC']], limit: 1},
                {model: MensagensEnviadas, order: [['created_at', 'DESC']], limit: 1}
            ]
        }).then(result => {
            eventEmitter.emit('send-open-protocols', {
                usuario_id: user.id,
                protocolos: result
            })
        })
    }

    //

    io.on('connection', function (socket) {
        socket.on('disconnect', function () {
        })

        socket.on('register', function (data) {
            try {
                const query = {where: {token: {$eq: data}}, include: {all: true}}
                Usuarios.findOne(query, {
                    include: [
                        {model: Canais}
                    ]
                })
                    .then((user) => {
                        if (user) {
                            socket.user = user.dataValues
                            socketUsers[user.dataValues.id] = socket

                            sendOpenProtocols(user)

                            Contatos.findAll({where: {canal_id: {$eq: socket.user.canal_id}}}).then(result => {
                                eventEmitter.emit('send-contacts', {
                                    usuario_id: user.id,
                                    contatos: result
                                })
                            })
                        } else {
                            console.log('Error fetching token User.', data)
                        }
                    })
                    .catch((err) => {
                        console.log('Error fetching token User.', data, err)
                    })
            } catch (err) {
                console.log('Error: Your token is invalid', data)
            }
        })

        socket.on('message', function (data) {
            // token, body, protocol_id
            GoBOT.protocolSendMessage(this.user, data, eventEmitter)
        })

        socket.on('image', function (data) {
            // token, body, protocol_id
            GoBOT.protocolSendImage(this.user, data, eventEmitter)
        })

        socket.on('file', function (data) {
            // token, body, protocol_id
            GoBOT.protocolSendFile(this.user, data, eventEmitter)
        })

        socket.on('audio', function (data) {
            // token, body, protocol_id
            GoBOT.protocolSendAudio(this.user, data, eventEmitter)
        })

        socket.on('location', function (data) {
            // token, body, protocol_id
            GoBOT.protocolSendLocation(this.user, data, eventEmitter)
        })

        socket.on('contact', function (data) {
            // token, body, protocol_id
            GoBOT.protocolSendContact(this.user, data, eventEmitter)
        })

        socket.on('set-user-status', async function (data) {
            // token, status
            const usuario = await Usuarios.findOne({where: {token: {$eq: data.token}}})
            if (!usuario) {
                return
            }

            Usuarios.update({online: data.status}, {where: {id: {$eq: usuario.id}}})
            if (data.status) {
                sendOpenProtocols(usuario)
            }
        })

        socket.on('set-user-picture', async function (data) {
            // token, picture
            const usuario = await Usuarios.findOne({where: {token: {$eq: data.token}}})
            if (!usuario) {
                return
            }

            const dir = path.join(path.dirname(require.main.filename), 'public/avatars/')
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir)
            }

            fs.writeFile((dir + usuario.id), data.picture.replace(/^data:image\/png;base64,/, ''), 'base64', function (err) {
                if (err) {
                    console.log('set-user-picture error', err)
                } else {
                    Usuarios.update({imagem_url: baseUrl + '/avatars/' + usuario.id}, {where: {id: {$eq: usuario.id}}})
                }
            })
        })

        socket.on('reply-message', async function (data) {
            // token, body, protocol_id, message_id
            const usuario = await Usuarios.findOne({where: {token: {$eq: data.token}}})
            if (!usuario) {
                return
            }

            GoBOT.replyMessage(this.user, data, eventEmitter)
        })

        socket.on('forward-message', async function (data) {
            // token, body, protocol_id, message_id, contact_id
            const usuario = await Usuarios.findOne({where: {token: {$eq: data.token}}})
            if (!usuario) {
                return
            }

            GoBOT.forwardMessage(this.user, data, eventEmitter)
        })

        socket.on('open-protocol', async function (data) {
            // token, protocol_id, start_new
            const usuario = await Usuarios.findOne({where: {token: {$eq: data.token}}})
            if (!usuario) {
                return
            }

            let protocolo = (await Protocolos.findOne({where: {id: {$eq: data.protocol_id}}}))
            if (!protocolo) {
                return
            }

            GoBOT.onOpenProtocol({protocol: protocolo})

            if (protocolo.status === 'Em Espera') {
                protocolo.status = 'Atendendo'
                await Protocolos.update({status: 'Atendendo', usuario_id: usuario.id}, {where: {id: {$eq: data.protocol_id}}})
            }

            socket.emit('open-protocol', (await Protocolos.findOne({
                where: {id: {$eq: data.protocol_id}},
                include: [
                    {model: Contatos},
                    {model: MensagensRecebidas, order: [['created_at', 'DESC']], limit: 8},
                    {model: MensagensEnviadas, order: [['created_at', 'DESC']], limit: 8, include: [{model: Usuarios}]}
                ]
            })))
        })

        socket.on('open-new-protocol', async function (data) {
            // token, contact_id
            const usuario = await Usuarios.findOne({where: {token: {$eq: data.token}}})
            if (!usuario) {
                return
            }

            let protocolo = (await Protocolos.create({
                'numero': Generator().protocolCode(),
                'status': 'Atendendo',
                'contato_id': data.contact_id,
                // 'api_chat_id': data.chat_id,
                'ultima_atualizacao': Date.now(),
                'usuario_id': socket.user.id
            }))
            protocolo = (await Protocolos.findOne({where: {id: protocolo.id}, include: {all: true}}))

            GoBOT.sendMessage({
                phone: protocolo.contato.whatsapp,
                chatId: null,
                body: 'Seja bem-vindo ao nosso canal!'
            }, socket.user.canal.instance_token, GoBOT.validateResponse)

            eventEmitter.emit('send-new-protocol', protocolo)

            GoBOT.onOpenProtocol({protocol: protocolo})

            if (protocolo.status === 'Em Espera') {
                protocolo.status = 'Atendendo'
                await Protocolos.update({status: 'Atendendo', usuario_id: usuario.id}, {where: {id: {$eq: data.protocol_id}}})
            }

            socket.emit('open-protocol', (await Protocolos.findOne({
                where: {id: {$eq: protocolo.id}},
                include: [
                    {model: Contatos},
                    {model: MensagensRecebidas, order: [['created_at', 'DESC']], limit: 8},
                    {model: MensagensEnviadas, order: [['created_at', 'DESC']], limit: 8, include: [{model: Usuarios}]}
                ]
            })))
        })

        socket.on('open-contact', async function (data) {
            // token, contact_id
            const usuario = await Usuarios.findOne({where: {token: {$eq: data.token}}})
            if (!usuario) {
                return
            }

            const protocolo = (await Protocolos.findOne({where: {contato_id: data.contact_id}, order: [['id', 'DESC']]}))
            if (!protocolo) {
                return
            }

            GoBOT.onOpenProtocol({protocol: protocolo})

            socket.emit('open-protocol', (await Protocolos.findOne({
                where: {id: {$eq: protocolo.id}},
                include: [
                    {model: Contatos},
                    {model: MensagensRecebidas, order: [['created_at', 'DESC']], limit: 8},
                    {model: MensagensEnviadas, order: [['created_at', 'DESC']], limit: 8, include: [{model: Usuarios}]}
                ]
            })))
        })

        socket.on('close-protocol', async function (data) {
            // token, protocol_id, message, send_message
            const usuario = await Usuarios.findOne({where: {token: {$eq: data.token}}})
            if (!usuario) {
                return
            }

            const protocolo = (await Protocolos.findOne({where: {id: {$eq: data.protocol_id}}, include: {all: true}}))
            if (!protocolo) {
                return
            }

            GoBOT.onCloseProtocol({protocol: protocolo, message: data.message, send_message: data.send_message}, this.user, eventEmitter)

            protocolo.status = 'Concluído'
            await Protocolos.update({status: 'Concluido', usuario_id: usuario.id}, {where: {id: {$eq: data.protocol_id}}})

            socket.emit('close-protocol', protocolo)
        })

        socket.on('get-protocol-messages', async function (data) {
            // page, protocol_id
            const usuario = await Usuarios.findOne({where: {token: {$eq: data.token}}})
            if (!usuario) {
                return
            }

            const protocolo = (await Protocolos.findOne({
                where: {id: {$eq: data.protocol_id}},
                include: [
                    {model: MensagensRecebidas, order: [['created_at', 'DESC']], limit: 8, offset: (data.page * 8)},
                    {model: MensagensEnviadas, order: [['created_at', 'DESC']], limit: 8, offset: (data.page * 8)}
                ]
            }))
            if (!protocolo) {
                return
            }

            socket.emit('protocol-messages', protocolo)
        })

        socket.on('get-contact-protocols', async function (data) {
            // contact_id
            const usuario = await Usuarios.findOne({where: {token: {$eq: data.token}}})
            if (!usuario) {
                return
            }

            const protocolos = (await Protocolos.findAll({
                where: {contato_id: {$eq: data.contact_id}}
            }))

            socket.emit('contact-protocols', protocolos)
        })

        socket.on('do-contact-advanced-search', async function (data) {
            // contact_id, protocol_id, message
            const usuario = await Usuarios.findOne({where: {token: {$eq: data.token}}})
            if (!usuario) {
                return
            }

            const protocolos = (await Protocolos.findAll({
                where: {contato_id: {$eq: data.contact_id}}
            }))

            socket.emit('contact-advanced-search', protocolos)
        })

        socket.on('active-communication', async function (data) {
            // data
            GoBOT.sendMessage(data.data.whatsapp, data.data.message, this.user, eventEmitter)
        })

        socket.on('save-contact-name', async function (data) {
            // token, contact_id, name
            const contato = await Contatos.findOne({where: {id: data.contact_id}})
            if (!contato) {
                return
            }

            Contatos.update({nome: data.name}, {where: {id: contato.id}})
        })

        socket.on('add-contact', async function (data) {
            // token, name, phone
            let contato = await Contatos.findOne({where: {whatsapp: data.phone}})
            if (contato) {
                return
            }

            contato = (await Contatos.create({
                nome: data.name,
                whatsapp: data.phone,
                celular: data.phone,
                telefone: data.phone,
                valido: true,
                inscrito: true,
                avatar_url: '', // $this->chat_api->getContactImage($usuario->instance_id, $usuario->token, $message->author),
                sexo: 'Masculino', // $this->genderize_api->getGender($message->senderName)
                canal_id: socket.user.canal.id
            }))

            socketUsers[socket.user.id].emit('new-contact', contato)
        })
    })

    https.listen(port, function () {
        console.log('listening on *:' + port)
    })

    eventEmitter.on('send-open-protocols', data => {
        // console.log('sending', data)
        socketUsers[data.usuario_id] ? socketUsers[data.usuario_id].emit('open-protocols', data.protocolos) : console.log('Couldn\'t find socket for user', data)
    })

    eventEmitter.on('send-contacts', data => {
        // console.log('sending', data)
        socketUsers[data.usuario_id] ? socketUsers[data.usuario_id].emit('contacts', data.contatos) : console.log('Couldn\'t find socket for user', data)
    })

    eventEmitter.on('send-new-protocol', async data => {
        // console.log('sending new-protocol', data)
        for (const userId in socketUsers) {
            const user = socketUsers[userId]
            if (user) {
                try {
                    const usuario = await Usuarios.findOne({where: {id: {$eq: userId}, online: true}})
                    if (!usuario) {
                        return
                    }
                    user.emit('new-protocol', data)
                } catch (e) {
                }
            }
        }
    })

    eventEmitter.on('send-protocol', data => {
        const socket = socketUsers[data.usuario_id]
        if (socket) {
            socket.emit('protocol', data)
        } else {
            console.log('Couldn\'t find socket for user', data)
        }
    })

    eventEmitter.on('send-protocol-message', data => {
        const socket = socketUsers[data.protocolo.usuario_id]
        if (socket) {
            socket.emit('protocol-message', data)
        } else {
            console.log('Couldn\'t find socket for user', data)
        }
    })

    eventEmitter.on('update-protocol-message', data => {
        const socket = socketUsers[data.protocolo.usuario_id]
        if (socket) {
            socket.emit('update-protocol-message', data)
        } else {
            console.log('Couldn\'t find socket for user', data)
        }
    })
}
