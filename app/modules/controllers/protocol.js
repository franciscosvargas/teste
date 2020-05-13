module.exports = app => {
    return {
        listAll: (req, res) => {
            res.status(400).json({'todo': true})
        },
        listOne: (req, res) => {
            res.status(400).json({'todo': true})
        },
        sendMessage: (req, res) => {
            res.status(400).json({'todo': true})
        }
    }
}
