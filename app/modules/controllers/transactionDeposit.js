module.exports = app => {
    const TransactionDeposit = app.datasource.models.TransactionDeposit
    const Persistence = require('../../helpers/persistence')(TransactionDeposit)
    const FinancialTransactionBusiness = require('../business/financialTransaction')(app);
    const Business = require('../business/transactionDeposit')(app)
    const Upload = require('../../helpers/aws-s3')
    return {
        create: async (req, res) => {
            const s3 = await Upload.uploadAws(req.file)
            req.body.receipt = s3.Location
            req.body.keyUpload = req.file.filename
            req.body.status = false
            Persistence.create(req.body, res)
        },

        update: (req, res) => {
            const query = req.params
            req.body.status = false
            Persistence.update(query, req.body, res)
        },

        listOne: (req, res) => {
            const query = req.params
            Persistence.listOneWithJoin(query, res)
        },

        listAll: (req, res) => {
            Persistence.listAllWithJoin(res)
        },

        validate: (req, res) => {
            const query = {
                $and: [
                    req.params,
                    {status: false}
                ]
            }
            Business.transaction(req.transactionDeposit)
                .then(transaction => {
                    FinancialTransactionBusiness.doLogTransactionCredit(transaction.authorizedAmount, transaction.company_id, `Inserido crédito via depósito bancário`)
                    Business.charge(req.transactionDeposit)
                        .then(objectTicket => Persistence.update(query, {status: true}, res))
                        .catch(err => res.status(500).json(err))
                })
                .catch(err => res.status(400).json(err))
        },

        listAllCompany: (req, res) => {
            const query = req.params
            Persistence.listOneAllWithJoin(query, res)
        },
        
        delete: (req, res) => {
            const query = req.params
            Persistence.delete(query, res)
        }
    }
}
