
module.exports = app => {
    const FinancialTransaction = app.datasource.models.FinancialTransaction
    const RunningDelivery = app.datasource.models.RunningDelivery
    const RequestDelivery = app.datasource.models.RequestDelivery
    const Driver = app.datasource.models.Driver
    const User = app.datasource.models.User
    const Bank = app.datasource.models.Bank
    const TypesBank = app.datasource.models.TypesBank
    const Persistence = require('../../helpers/persistence')(FinancialTransaction)
    const Template = require('../../templates/recibo/index-html')
    const Business = require('../business/calculateDaily')(app)
    const moment = require('moment')
    const sequelize = require('sequelize')

    return {
        listAll: (req, res) => Persistence.listAllPaginated({ 
            where: {
                company_id: parseInt(req.query.company_id)
            },
            order: [
                ['created_at', 'DESC']
            ]
        }, res)(parseInt(req.query.page) === 0 ? 1 : req.query.page),

        revenues: (req, res) => {
            let initDate = moment(req.body.init).utcOffset(0).set({hour: 0, minute: 0, second: 0, millisecond: 1}).toISOString()
            let finishDate = moment(req.body.finish).utcOffset(0).set({hour: 23, minute: 59, second: 59, millisecond: 59}).toISOString()
            console.log(req.body)
            const query = {
                where: {
                    running_delivery_id: {$ne: null},
                    typePayment: parseInt(req.body.typePayment) !== 0 ? parseInt(req.body.typePayment) : {$ne: null}
                },
                attributes: [
                    [sequelize.fn('sum', sequelize.col('baseValue')), 'amountValue'], 'typePayment'
                ],
                group: ['RunningDelivery.driver_id'],
                include: [
                    {
                        model: RunningDelivery,
                        attributes: ['id'],
                        required: true,
                        where: {
                            $and: [
                                {created_at: {$between: [initDate, finishDate]}},
                                {driver_id: {$ne: null}},
                                {service_id: parseInt(req.body.service_id) !== 0 ? parseInt(req.body.service_id) : {$ne: null}},
                                {status: {$in: [6, 10]}}
                            ]
                        },
                        include: [
                            {
                                model: Driver,
                                where: {
                                    user_id: {$ne: null}
                                },
                                required: true,
                                attributes: ['id', 'service_id'],
                                include: [
                                    {
                                        model: User,
                                        where: {name: {$like: `%${req.body.name || ''}%`}},
                                        attributes: ['name', 'email'],
                                        include: [
                                            {
                                                model: Bank,
                                                attributes: ['name', 'cpf', 'agency', 'agencyDv', 'account', 'accountDv', 'operation'],
                                                include: [
                                                    {
                                                        model: TypesBank,
                                                        attributes: ['name', 'code', 'description']
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }

            RequestDelivery.findAll(query)
                .then(Business.tratmentObject)
                .then(Business.calculateListExtract(req.body))
                .then(Business.tratmentRunningExtract)
                .then(resp => res.status(200).json(resp.running))
                .catch(err => res.status(500).json(err))
        },
        export: (req, res) => {
            FinancialTransaction.findOne(
                {
                    where: {
                        id: req.params.id
                    },
                    include: {
                        all: true
                    },
                    raw: true
                })
                .then(transaction => {
                    transaction.created_at = moment(transaction.created_at).format('DD/MM/YYYY')
                    transaction.fantasy = transaction['Company.fantasy']
                    transaction.cnpj = transaction['Company.cnpj']
                    transaction.cnpj = transaction.cnpj.replace(/^(\d{2})(\d)/,"$1.$2")
                    transaction.cnpj = transaction.cnpj.replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3")
                    transaction.cnpj = transaction.cnpj.replace(/\.(\d{3})(\d)/,".$1/$2")
                    transaction.cnpj = transaction.cnpj.replace(/(\d{4})(\d)/,"$1-$2")
                    res.pdfFromHTML({
                        filename: 'report.pdf',
                        htmlContent: Template(transaction)
                    })
                }, error => {
                    res.status(400).json(error)
                })
        }
    }
}
