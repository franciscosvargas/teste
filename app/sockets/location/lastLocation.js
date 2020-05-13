module.exports = app => socket => io => {
    const Help = require('../helps/lastLocation')(app)

    const errorDestination = err => socket.emit('errors', err)
    const errorDestinationRoom = err => io.sockets.in(socket.roomDriverLoc).emit('errors', err)

    // const returnObject = object => socket.emit('update', object)
    const returnObjectRoom = object => new Promise((resolve, reject) => {
        io.sockets.in(object.driver_id).emit('update', object)
        resolve(object)
    })

    const emitGetLastLocationDriver = object => io.sockets.in(object.driver_id).emit('getLastLocationDriver', object)

    const setLastLocationDriver = async object => {
        if (object) {
            try {
                await Help.validateDriver(object)
                const isOfflineDriver = await Help.isOfflineDriver(object)
                if (isOfflineDriver) await Help.createLogDriver(object)
                await Help.updateLocation(object)
                const returnObjectR = await returnObjectRoom(object)
                await emitGetLastLocationDriver(returnObjectR)
            } catch (err) {
                console.log(err)
                
                errorDestinationRoom(err)
            }
        }
    }

    const lastLocationDriver = async object => {
        try {
            const validateDriver = await Help.validateDriver(object)
            const isOfflineDriver = await Help.isOfflineDriver(validateDriver)
            if (isOfflineDriver) await Help.createLogDriver(object)
            Help.updateLocation(object)
            const returnObjectR = await returnObjectRoom(object)
            await emitGetLastLocationDriver(returnObjectR)
        } catch (err) {
            console.log(err)
            errorDestination(err)
        }
    }

    const initDriverLoc = object => {
        if (object) {
            socket.roomDriverLoc = object.driver_id
            socket.join(socket.roomDriverLoc)
        }
    }

    const closeChat = object => {
        console.log('close-driver-loc')
        console.log(object)
        socket.leave(object.driver_id)
    }

    socket.on('init-driver-loc', initDriverLoc)
    socket.on('close-driver-loc', closeChat)
    socket.on('setLastLocationDriver', setLastLocationDriver)
    socket.on('lastLocationDriver', lastLocationDriver)
}