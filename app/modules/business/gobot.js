module.exports = app => {
    const GoBOT = require('../../helpers/gobot')
    const Generator = require('../../helpers/generator')
    const Sequelize = require('sequelize')
    const fs = require('fs')
    const moment = require('moment')

    const Protocolos = app.datasource.models.protocolos
    const MensagensEnviadas = app.datasource.models.mensagens_enviadas
    const MensagensRecebidas = app.datasource.models.mensagens_recebidas
    const Contatos = app.datasource.models.contatos

    return {
        protocolSendMessage: async (usuario, data, eventEmitter) => new Promise(async (resolve, reject) => {
            const protocolo = await Protocolos.findOne({where: {id: {$eq: data.protocol_id}}, include: {all: true}})
            const mensagemEnviada = (await MensagensEnviadas.create({
                conteudo: data.body,
                destinatario: protocolo.contato.whatsapp,
                contato_id: protocolo.contato.id,
                protocolo_id: protocolo.id,
                tipo: 'chat',
                usuario_id: usuario.id
            })).get({plain: true})

            mensagemEnviada.usuario = usuario

            // 'phone': object.phone, 'chatId': object.chat_id, 'body': object.body
            GoBOT.sendMessage({
                phone: protocolo.contato.whatsapp,
                chatId: null,
                body: data.body
            }, usuario.canal.instance_token, GoBOT.validateResponse).then(value => {
                // console.log('sendMessage result', value)
                value = JSON.parse(value)
                GoBOT.saveContactPicture(value.chat.contact)
                Contatos.update({
                    nome: value.chat.contact.formattedName,
                    avatar_url: 'https://www.gobot.digital:3000/avatar/' + value.chat.id.user // value.chat.contact.profilePicThumbObj.eurl
                }, {where: {whatsapp: protocolo.contato.whatsapp}})

                // if (value.ack && value.ack === 1) {
                MensagensEnviadas.update({enviado: true, api_id: value.id}, {where: {id: mensagemEnviada.id}})
                // }
            }).catch(error => {
                console.log('sendMessage error', error)
            })

            eventEmitter.emit('send-protocol-message', {protocolo: protocolo, mensagem: mensagemEnviada})
        }),

        protocolSendImage: async (usuario, data, eventEmitter) => new Promise(async (resolve, reject) => {
            const mediaRootPath = '/root/WebWhatsapp-Wrapper/'
            var mediaPath = 'medias/sent/'
            var extraData = {mime: '', size: '', caption: data.caption}

            if (!fs.existsSync(mediaRootPath + mediaPath)) {
                fs.mkdirSync(mediaRootPath + mediaPath)
            }

            mediaPath += Generator().generateUUID()

            const buffer = new Buffer(data.body.replace(/^data:image\/\w+;base64,/, ''), 'base64')
            fs.writeFileSync(mediaRootPath + mediaPath, buffer)

            const protocolo = await Protocolos.findOne({where: {id: {$eq: data.protocol_id}}, include: {all: true}})
            const mensagemEnviada = (await MensagensEnviadas.create({
                // conteudo: data.body,
                destinatario: protocolo.contato.whatsapp,
                contato_id: protocolo.contato.id,
                protocolo_id: protocolo.id,
                tipo: 'image',
                midia_url: mediaPath,
                dados_extras: JSON.stringify(extraData),
                usuario_id: usuario.id
            })).get({plain: true})

            mensagemEnviada.usuario = usuario

            // {'phone': object.phone, 'chatId': object.chat_id, 'body': object.body, 'filename': object.filename, 'caption': object.caption}
            GoBOT.sendFile({
                phone: protocolo.contato.whatsapp,
                chatId: null,
                body: data.body,
                filename: data.filename,
                caption: data.caption
            }, usuario.canal.instance_token, GoBOT.validateResponse).then(value => {
                console.log('sendFile result', value)
                value = JSON.parse(value)
                Contatos.update({
                    nome: value.chat.contact.formattedName,
                    avatar_url: 'https://www.gobot.digital:3000/avatar/' + value.chat.id.user
                }, {where: {whatsapp: protocolo.contato.whatsapp}})

                if (value.ack && value.ack === 1) {
                    MensagensEnviadas.update({enviado: true}, {where: {id: mensagemEnviada.id}})
                }

                eventEmitter.emit('send-protocol-message', {protocolo: protocolo, mensagem: mensagemEnviada})
            }).catch(error => {
                console.log('sendMessage error', error)
            })
        }),

        protocolSendFile: async (usuario, data, eventEmitter) => new Promise(async (resolve, reject) => {
            const mediaRootPath = '/root/WebWhatsapp-Wrapper/'
            var mediaPath = 'medias/sent/'
            var extraData = {mime: '', size: '', caption: data.caption}

            if (!fs.existsSync(mediaRootPath + mediaPath)) {
                fs.mkdirSync(mediaRootPath + mediaPath)
            }

            mediaPath += Generator().generateUUID()

            const buffer = new Buffer(data.body.replace(/^data:image\/\w+;base64,/, ''), 'base64')
            fs.writeFileSync(mediaRootPath + mediaPath, buffer)

            const protocolo = await Protocolos.findOne({where: {id: {$eq: data.protocol_id}}, include: {all: true}})
            const mensagemEnviada = (await MensagensEnviadas.create({
                // conteudo: data.body,
                destinatario: protocolo.contato.whatsapp,
                contato_id: protocolo.contato.id,
                protocolo_id: protocolo.id,
                tipo: 'document',
                midia_url: mediaPath,
                dados_extras: JSON.stringify(extraData),
                usuario_id: usuario.id
            })).get({plain: true})

            mensagemEnviada.usuario = usuario

            // {'phone': object.phone, 'chatId': object.chat_id, 'body': object.body, 'filename': object.filename, 'caption': object.caption}
            GoBOT.sendFile({
                phone: protocolo.contato.whatsapp,
                chatId: null,
                body: data.body,
                filename: data.filename,
                caption: data.caption
            }, usuario.canal.instance_token, GoBOT.validateResponse).then(value => {
                console.log('sendFile result', value)
                value = JSON.parse(value)
                Contatos.update({
                    nome: value.chat.contact.formattedName,
                    avatar_url: 'https://www.gobot.digital:3000/avatar/' + value.chat.id.user
                }, {where: {whatsapp: protocolo.contato.whatsapp}})

                if (value.ack && value.ack === 1) {
                    MensagensEnviadas.update({enviado: true}, {where: {id: mensagemEnviada.id}})
                }

                eventEmitter.emit('send-protocol-message', {protocolo: protocolo, mensagem: mensagemEnviada})
            }).catch(error => {
                console.log('sendMessage error', error)
            })
        }),

        protocolSendAudio: async (usuario, data, eventEmitter) => new Promise(async (resolve, reject) => {
            const protocolo = await Protocolos.findOne({where: {id: {$eq: data.protocol_id}}, include: {all: true}})
            const mensagemEnviada = (await MensagensEnviadas.create({
                conteudo: data.body,
                destinatario: protocolo.contato.whatsapp,
                contato_id: protocolo.contato.id,
                protocolo_id: protocolo.id,
                tipo: 'audio',
                usuario_id: usuario.id
            })).get({plain: true})

            mensagemEnviada.usuario = usuario

            GoBOT.sendPtt({
                phone: protocolo.contato.whatsapp,
                chatId: null,
                body: data.body,
                filename: data.filename
            }, usuario.canal.instance_token, GoBOT.validateResponse).then(value => {
                console.log('sendPtt result', value)
                value = JSON.parse(value)
                Contatos.update({
                    nome: value.chat.contact.formattedName,
                    avatar_url: 'https://www.gobot.digital:3000/avatar/' + value.chat.id.user
                }, {where: {whatsapp: protocolo.contato.whatsapp}})

                if (value.ack && value.ack === 1) {
                    MensagensEnviadas.update({enviado: true}, {where: {id: mensagemEnviada.id}})
                }

                eventEmitter.emit('send-protocol-message', {protocolo: protocolo, mensagem: mensagemEnviada})
            }).catch(error => {
                console.log('sendMessage error', error)
            })
        }),

        protocolSendLocation: async (usuario, data, eventEmitter) => new Promise(async (resolve, reject) => {
            const protocolo = await Protocolos.findOne({where: {id: {$eq: data.protocol_id}}, include: {all: true}})
            const mensagemEnviada = (await MensagensEnviadas.create({
                conteudo: null,
                destinatario: protocolo.contato.whatsapp,
                contato_id: protocolo.contato.id,
                protocolo_id: protocolo.id,
                tipo: 'location',
                dados_extras: JSON.stringify(data.body),
                usuario_id: usuario.id
            })).get({plain: true})

            mensagemEnviada.usuario = usuario

            const url = 'https://maps.google.com/?q=' + data.body.latitude + ',' + data.body.longitude

            GoBOT.sendLink({
                phone: protocolo.contato.whatsapp,
                chatId: null,
                body: url,
                preview_base_64: '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',
                title: data.body.address,
                description: data.body.address
            }, usuario.canal.instance_token, GoBOT.validateResponse).then(value => {
                console.log('sendLink result', value)
                value = JSON.parse(value)

                if (value.chat) {
                    Contatos.update({
                        nome: value.chat.contact.formattedName,
                        avatar_url: 'https://www.gobot.digital:3000/avatar/' + value.chat.id.user
                    }, {where: {whatsapp: protocolo.contato.whatsapp}})
                }

                if (value.ack && value.ack === 1) {
                    MensagensEnviadas.update({enviado: true}, {where: {id: mensagemEnviada.id}})
                }

                eventEmitter.emit('send-protocol-message', {protocolo: protocolo, mensagem: mensagemEnviada})
            }).catch(error => {
                console.log('sendMessage error', error)
            })
        }),

        protocolSendContact: async (usuario, data, eventEmitter) => new Promise(async (resolve, reject) => {
            const protocolo = await Protocolos.findOne({where: {id: {$eq: data.protocol_id}}, include: {all: true}})
            const mensagemEnviada = (await MensagensEnviadas.create({
                conteudo: data.body,
                destinatario: protocolo.contato.whatsapp,
                contato_id: protocolo.contato.id,
                protocolo_id: protocolo.id,
                tipo: 'contact',
                dados_extras: JSON.stringify(data.body),
                usuario_id: usuario.id
            })).get({plain: true})

            mensagemEnviada.usuario = usuario

            GoBOT.sendContact({
                phone: protocolo.contato.whatsapp,
                chatId: null,
                body: data.body
            }, usuario.canal.instance_token, GoBOT.validateResponse).then(value => {
                console.log('sendContact result', value)
                value = JSON.parse(value)
                // Contatos.update({
                //     nome: value.chat.contact.formattedName,
                //     avatar_url: 'https://www.gobot.digital:3000/avatar/' + value.chat.id.user
                // }, {where: {whatsapp: protocolo.contato.whatsapp}})

                if (value && value.ack && value.ack === 1) {
                    MensagensEnviadas.update({enviado: true}, {where: {id: mensagemEnviada.id}})
                }

                eventEmitter.emit('send-protocol-message', {protocolo: protocolo, mensagem: mensagemEnviada})
            }).catch(error => {
                console.log('sendMessage error', error)
            })
        }),

        replyMessage: async (usuario, data, eventEmitter) => new Promise(async (resolve, reject) => {
            const protocolo = await Protocolos.findOne({where: {id: {$eq: data.protocol_id}}, include: {all: true}})

            let mensagemEnviadaDados = {
                conteudo: data.body,
                destinatario: protocolo.contato.whatsapp,
                contato_id: protocolo.contato.id,
                protocolo_id: protocolo.id,
                tipo: 'chat',
                usuario_id: usuario.id
            }

            if (data.em_resposta_enviada_id) {
                mensagemEnviadaDados.em_resposta_enviada_id = data.em_resposta_enviada_id
            } else {
                mensagemEnviadaDados.em_resposta_recebida_id = data.em_resposta_recebida_id
            }

            const mensagemEnviada = (await MensagensEnviadas.create(mensagemEnviadaDados)).get({plain: true})

            mensagemEnviada.usuario = usuario

            GoBOT.replyMessage({message_id: data.message_id, message: data.body}, usuario.canal.instance_token, GoBOT.validateResponse).then(value => {
                value = JSON.parse(value)
                // console.log(value)
                GoBOT.saveContactPicture(value.sent.chat.contact)
                Contatos.update({
                    nome: value.sent.chat.contact.formattedName,
                    avatar_url: 'https://www.gobot.digital:3000/avatar/' + value.sent.chat.id.user
                }, {where: {whatsapp: protocolo.contato.whatsapp}})

                // if (value.sent.ack && value.sent.ack === 1) {
                MensagensEnviadas.update({enviado: true, api_id: value.sent.id}, {where: {id: mensagemEnviada.id}})
                // }
            }).catch(error => {
                console.log('sendMessage error', error)
            })

            eventEmitter.emit('send-protocol-message', {protocolo: protocolo, mensagem: mensagemEnviada})
        }),

        forwardMessage: async (usuario, data, eventEmitter) => new Promise(async (resolve, reject) => {
            const contato = await Contatos.findOne({where: {id: {$eq: data.contact_id}}, include: {all: true}})
            const protocolo = await Protocolos.findOne({where: {contato_id: {$eq: contato.id}, status: 'Atendendo'}, include: {all: true}})
            let mensagemEnviada = null
            if (protocolo) {
                let mensagemOriginal = await MensagensRecebidas.findOne({where: {api_id: {$eq: data.message_id}}})
                if (!mensagemOriginal) {
                    mensagemOriginal = await MensagensEnviadas.findOne({where: {api_id: {$eq: data.message_id}}})
                }

                if (mensagemOriginal) {
                    mensagemEnviada = (await MensagensEnviadas.create({
                        conteudo: mensagemOriginal.conteudo,
                        destinatario: protocolo.contato.whatsapp,
                        contato_id: protocolo.contato.id,
                        protocolo_id: protocolo.id,
                        tipo: mensagemOriginal.tipo,
                        midia_url: mensagemOriginal.midia_url,
                        dados_extras: mensagemOriginal.dados_extras,
                        usuario_id: usuario.id,
                        encaminhada: true
                    })).get({plain: true})

                    mensagemEnviada.usuario = usuario
                }
            }

            GoBOT.forwardMessage({
                message_id: data.message_id,
                contact_id: data.whatsapp_id
            }, usuario.canal.instance_token, GoBOT.validateResponse).then(value => {
                if (protocolo) {
                    value = JSON.parse(value)
                    // console.log(value)
                    // GoBOT.saveContactPicture(value.sent.chat.contact)
                    // Contatos.update({
                    //     nome: value.sent.chat.contact.formattedName,
                    //     avatar_url: 'https://www.gobot.digital:3000/avatar/' + value.sent.chat.id.user
                    // }, {where: {whatsapp: protocolo.contato.whatsapp}})

                    // if (value.ack && value.ack === 1) {
                    if (mensagemEnviada) {
                        MensagensEnviadas.update({enviado: true, api_id: value.sent.id}, {where: {id: mensagemEnviada.id}})
                        eventEmitter.emit('send-protocol-message', {protocolo: protocolo, mensagem: mensagemEnviada})
                    }
                }
            }).catch(error => {
                console.log('sendMessage error', error)
            })

            eventEmitter.emit('send-protocol-message', {protocolo: protocolo, mensagem: mensagemEnviada})
        }),

        updateSentMessage: (data) => new Promise((resolve, reject) => {
            // id, status
            MensagensEnviadas.update({status: data.status}, {where: {api_id: data.id}}).then(value => resolve(value)).catch(error => reject(error))
        }),

        generateContactFromMessage: (data, canal) => new Promise(async (resolve, reject) => {
            // message

            const whatsapp = data.message.author.match(/\d/g).join('')
            let contato = await Contatos.findOne({where: {'whatsapp': whatsapp, 'canal_id': canal.id}})
            if (contato) {
                resolve({'contato': contato, 'novo': false})
                return
            }

            // $this->load->library('Chat_Api');
            // $this->load->library('Genderize_Api');

            contato = await Contatos.create({
                nome: data.message.senderName,
                whatsapp,
                celular: whatsapp,
                telefone: whatsapp,
                valido: true,
                inscrito: true,
                avatar_url: '', // $this->chat_api->getContactImage($usuario->instance_id, $usuario->token, $message->author),
                sexo: 'Masculino', // $this->genderize_api->getGender($message->senderName)
                canal_id: canal.id
            })

            resolve({contato, novo: true})
        }),

        generateProtocol: (data, canal, eventEmitter) => new Promise(async (resolve, reject) => {
            // chat_id, contato_id

            let protocolo = await Protocolos.findOne({
                where: {
                    api_chat_id: data.chat_id,
                    contato_id: data.contato_id,
                    status: {$notIn: ['Concluido', 'Abandono']}
                }
            })
            if (protocolo) {
                resolve({protocolo, novo: false})
            } else {
                protocolo = (await Protocolos.create({
                    'numero': Generator().protocolCode(),
                    'status': 'Em Espera',
                    'contato_id': data.contato_id,
                    'api_chat_id': data.chat_id,
                    'ultima_atualizacao': Date.now()
                }))
                protocolo = (await Protocolos.findOne({where: {id: protocolo.id}, include: {all: true}}))

                GoBOT.sendMessage({
                    phone: protocolo.contato.whatsapp,
                    chatId: null,
                    body: 'Seja bem-vindo ao nosso canal! Digite para ser atendido.'
                }, canal.instance_token, GoBOT.validateResponse)

                eventEmitter.emit('send-new-protocol', protocolo)
                resolve({
                    protocolo,
                    novo: true
                })
            }
        }),

        onReceiveMessage: (data, canal, eventEmitter) => new Promise((resolve, reject) => {
            // console.log('onReceiveMessage', data)

            // message, contact, protocol
            MensagensRecebidas.create({
                conteudo: data.message.body,
                remetente: data.message.author,
                api_id: data.message.id,
                contact_id: data.contact.id,
                protocolo_id: data.protocol.id,
                tipo: data.message.type,
                midia_url: data.message.media_path,
                dados_extras: JSON.stringify(data.message.extra_data)
            }).then(value => {
                Contatos.update({last_activity: Date.now()}, {where: {id: data.contact.id}})
                resolve(value)
                eventEmitter.emit('send-protocol-message', {protocolo: data.protocol, mensagem: value})
            }).catch(error => reject(error))
        }),

        onSendMessage: (data, canal, eventEmitter) => new Promise((resolve, reject) => {
            // console.log('onSendMessage', data)

            // message, contact, protocol
            MensagensEnviadas.update({
                conteudo: data.message.body,
                remetente: data.message.author,
                api_id: data.message.id,
                // contact_id: data.contact.id,
                // protocolo_id: data.protocol.id,
                tipo: data.message.type,
                midia_url: data.message.media_path,
                dados_extras: JSON.stringify(data.message.extra_data)
            }, {where: {api_id: data.message.id}}).then(value => {
                resolve(value)
                eventEmitter.emit('update-protocol-message', {protocolo: data.protocol, mensagem: value})
            }).catch(error => reject(error))
        }),

        onOpenProtocol: (data, eventEmitter) => new Promise((resolve, reject) => {
            MensagensRecebidas.update({lida: true}, {where: {protocolo_id: {$eq: data.protocol.id}}})
        }),

        onCloseProtocol: (data, usuario, eventEmitter) => new Promise((resolve, reject) => {
            if (data.send_message) {
                const mensagem = data.message || 'O seu atendimento foi finalizado.'

                GoBOT.sendMessage({
                    phone: data.protocol.contato.whatsapp,
                    chatId: null,
                    body: mensagem
                }, usuario.canal.instance_token, GoBOT.validateResponse).then(value => {
                    eventEmitter.emit('send-protocol-message', {protocolo: data.protocol, mensagem: mensagem})
                }).catch(error => {
                    console.log('sendMessage error', error)
                })
            }

            Protocolos.update({finalizado_em: moment().format('YYYY-MM-DD HH:mm:ss')}, {where: {id: data.protocol.id}})
        }),

        sendMessage: async (phone, content, usuario, eventEmitter) => new Promise(async (resolve, reject) => {
            // const mensagemEnviada = await MensagensEnviadas.create({
            //     conteudo: data.body,
            //     destinatario: protocolo.contato.whatsapp,
            //     contato_id: protocolo.contato.id,
            //     protocolo_id: protocolo.id,
            //     tipo: 'chat'
            // })
            // 'phone': object.phone, 'chatId': object.chat_id, 'body': object.body
            GoBOT.sendMessage({phone: phone, chatId: null, body: content}, usuario.canal.instance_token, GoBOT.validateResponse).then(value => {
                // console.log('sendMessage result', value)
            }).catch(error => {
                console.log('sendMessage error', error)
            })
        })
    }
}
