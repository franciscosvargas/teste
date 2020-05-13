module.exports = app => {
    const Company = app.datasource.models.Company
    const Persistence = require('../../helpers/persistence')(Company)
    const Business = require('../business/address')(app)
    const BusinessCompany = require('../business/company')(app)
    const FinancialTransactionBusiness = require('../business/financialTransaction')(app)
    return {
        create: async (req, res) => {
            try {
                req.body.balance = 0
                const stageCompany = await BusinessCompany.stageCompany(req.body)
                const object = await Business.create(stageCompany)
                Persistence.create(object, res)
            } catch (err) {
                res.status(500).json(err)
            }
        },
        update: async (req, res) => {
            const query = req.params
            try {
                if (req.body.balance && req.user.object.types_user_id === 2 && req.body.balance) {
                    const company = await Company.find({where: {id: req.params.id}, raw: true})
                    if (parseFloat(company.balance) > parseFloat(req.body.balance)) {
                        const value = parseFloat(company.balance) - parseFloat(req.body.balance)
                        await FinancialTransactionBusiness.doLogTransactionUpdateCompany({value: parseFloat(value), balance: parseFloat(company.balance)}, req.params.id, 'Estorno realizado pelo o financeiro!')
                        Persistence.update(query, req.body, res)
                    } else {
                        const value = parseFloat(req.body.balance) - parseFloat(company.balance)
                        await FinancialTransactionBusiness.doLogTransactionCredit(parseFloat(value), req.params.id, 'Credito realizado pelo o financeiro!')
                        Persistence.update(query, req.body, res)
                    }
                }
            } catch (err) {
                console.log(err)
            }
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
