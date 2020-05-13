module.exports = app => {
    const path = require('path')
    return {
        listAll: (req, res) => res.sendFile(path.join(__dirname, './../../../', 'logiuvo_club.json'))
    }
}
