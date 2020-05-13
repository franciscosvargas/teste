module.exports = (app, eventEmitter) => {
    const GoBOT = require('../business/gobot')(app)
    const Canais = app.datasource.models.canais

    return {
        webhook: async (req, res) => {
            const instance_id = req.parsed.instanceId
            const ack = req.parsed.ack
            const messages = req.parsed.messages
            const canal = await Canais.findOne({where: {instance_id: {$eq: instance_id}}})

            if (messages) {
                for (const message of messages) {
                    if (!message.fromMe || message.fromMe === '') {
                        const contact = await GoBOT.generateContactFromMessage({message}, canal)
                        const protocol = await GoBOT.generateProtocol({chat_id: message.chatId, contato_id: contact.contato.id}, canal, eventEmitter)
                        GoBOT.onReceiveMessage({message, contact: contact.contato, protocol: protocol.protocolo}, canal, eventEmitter)

                        // const mensagensRespondidas = MensagensEnviadasBusiness.get
                        //
                        // $msgsRespondidas = $this->Mensagens_enviadas->get_many_by(['api_chat_id' => $message->chatId, 'respondida' => false]);
                        // foreach ($msgsRespondidas as $msgRespondida) {
                        //     $this->Mensagens_enviadas->update($msgRespondida->id, ['respondida' => true]);
                        // }
                        // } else {
                        // $this->Mensagens_enviadas->update_by(['destinatario' => $destinatario, 'api_chat_id' => 0], ['api_chat_id' => $message->chatId]);
                    } else {
                        GoBOT.onSendMessage({message}, canal, eventEmitter)
                    }
                }
            }

            if (ack) {
                for (const item of ack) {
                    const status = item.status === 'viewed' ? 'Lida' : 'Entregue'
                    GoBOT.updateSentMessage({id: item.id, status})
                }
            }

            res.status(200).json({success: true})
        }
    }
}
