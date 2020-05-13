module.exports = app => {
    const Documents = app.datasource.models.Documents
    const User = app.datasource.models.User
    const TypeDocuments = app.datasource.models.TypeDocuments
    const Help = require('../../helpers/upload')
    const Errors = require('../../errors/documents/pt-br')

    return {
        create: async (req, res, next) => {
            req.assert('type_document_id', Errors.typeDocument).notEmpty()
            req.assert('user_id', Errors.userId).notEmpty()
            const error = req.validationErrors()
            if (error) {
                res.status(400).json(error)
            } else {
                try {
                    const user = await User.findById(req.body.user_id)
                    if (user) {
                        const typeDocument = await TypeDocuments.findById(req.body.type_document_id)
                        if (typeDocument) {
                            !req.file ? res.status(400).json([Errors.url]) : next()
                        } else {
                            res.status(400).json([Errors.typeDocumentNotExist])
                            Help.uploadRemove(req.file.filename)
                        }
                    } else {
                        res.status(400).json([Errors.userNotExist])
                        Help.uploadRemove(req.file.filename)
                    }
                } catch (err) {
                    Help.uploadRemove(req.file.filename)
                    res.status(500).json(err)
                }
            }
        },
        isTwoDocument: async (req, res, next) => {
            const document = await Documents.count({ where: { user_id: req.body.user_id } })
            if (document <= 3) {
                next()
            } else {
                res.status(200).json()
            }
        },
        update: async (req, res, next) => {
            if (isNaN(req.params.id)) {
                res.status(400).json([Errors.idInvalid])
            } else {
                const document = await Documents.findById(req.params.id)
                if (document) {
                    if (req.file) Help.uploadRemove(document.dataValues.url)
                    next()
                } else {
                    res.status(400).json([Errors.notExist])
                }
            }
        },
        listOne: (req, res, next) => {
            isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
        },
        delete: (req, res, next) => {
            isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
        }
    }
}
