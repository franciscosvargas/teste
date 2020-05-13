module.exports = ({
    runningDelivery: (res, object) => {
        res.io.emit('runningDelivery', {running: object})
    },
    runningTaxi: (res, object) => {
        res.io.emit('runningParticular', {running: object})
    }
})
