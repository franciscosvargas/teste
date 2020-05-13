module.exports = app => {
    const Documents = app.datasource.models.Documents
    const Persistence = require('../../helpers/persistence')(Documents)
    const Business = require('../business/document')(app)
    const Upload = require('../../helpers/aws-s3')

    return {
        create: async (req, res) => {
            try {
                if (req.file) {
                    const s3 = await Upload.uploadAws(req.file)
                    req.body.url = s3.Location
                    req.body.keyUpload = req.file.filename
                }
                await Business.stageUser(req.body)
                Persistence.create(req.body, res)
            } catch (err) {
                console.log(err)
                res.status(500).json(err)
            }
        },
        createPainel: (req, res) => Persistence.create(req.body, res),
        painelUpdate: (req, res) => Persistence.update(req.params, req.body, res),
        update: (req, res) => {
            const query = req.params
            if (req.file) req.body.url = req.file.filename
            Persistence.update(query, req.body, res)
        },
        listOne: (req, res) => {
            const query = req.params
            Persistence.listOneWithJoin(query, res)
        },
        listAll: (req, res) => {
            Persistence.listAllWithJoin(res)
        },
        delete: (req, res) => {
            const query = req.params
            Persistence.delete(query, res)
        }
    }
}
