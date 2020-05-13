
module.exports = app => {
    const Card = app.datasource.models.Card
    const Persistence = require('../../helpers/persistence')(Card)
    const Help = require('../../helpers/tratmentPagarme')
    // const HelpCielo = require('../../helpers/tratmentCielo')
    const Business = require('../business/card')(app)

    return {
        create: async (req, res) => {
            try {
                const object = await Business.createCielo(req.body)
                Persistence.create(object, res)
            } catch (err) {
                console.log(err)
                res.status(400).json(err)
            }
        },
        update: (req, res) => {
            const query = req.params
            Persistence.update(query, req.body, res)
        },
        company: (req, res) => {
            const cardObject = { company_id: req.body.company_id, cardCvv: req.body.cardCvv }
            Business.create(req)
                .then(card => Persistence.create(Help.returnCardCompany(card, cardObject), res))
                .catch(err => res.status(500).json(err))
        },
        listAllCompanyInCard: (req, res) =>
            Persistence.listAllQuery({
                where: {
                    $and: [
                        {company_id: parseInt(req.params.id)},
                        {status: true}
                    ]
                }
            }, res),
        listOne: (req, res) => {
            const query = req.params
            Persistence.listOneWithJoin(query, res)
        },
        listAllCompany: (req, res) => {
            const query = {
                company_id: req.params.company_id,
                status: true
            }
            Persistence.listOneAllWithJoin(query, res)
        },
        listAllUser: (req, res) => {
            const query = {
                user_id: req.params.user_id,
                status: true
            }
            Persistence.listOneAllWithJoin(query, res)
        },
        listAll: (req, res) => {
            Persistence.listAllWithJoin(res)
        },
        delete: (req, res) => {
            const query = {
                id: req.params.id
            }
            const mod = {
                status: false
            }
            Persistence.update(query, mod, res)
        }

    }
}
