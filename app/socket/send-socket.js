module.exports = eventEmitter => {
    const { socket } = require('../config/key')

    const io = require('socket.io-client')
    const socketIo = io.connect(socket, { reconnect: true })

    eventEmitter.on('running_delivery', running => {
        socketIo.emit('new_running_particular', running)
    })

    eventEmitter.on('running_particular', running => {
        socketIo.emit('new_running_particular', running)
    })
}
