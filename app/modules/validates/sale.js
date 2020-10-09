module.exports = app => {
   
    const Sale = app.datasource.models.sales
    const Driver = app.datasource.models.Driver
    const Vehicles = app.datasource.models.Vehicles
    const Help = require('../../helpers/upload')
    const Aws = require('../../helpers/aws-s3')
    const Search = require('../../helpers/searchCpf')
    const Errors = require('../../errors/sale/pt-br')
    const Regex = require('../../helpers/regex')
    const Cpf = require('cpf_cnpj').CPF

    return {
        updateByShop: async (req, res, next) => {

            const { id } = req.params
            const shop_id = req.user.object.id

            console.log(parseInt(id))

            const query = {
                where: {
                    id: parseInt(id),
                    shop_id
                }
            }

            Sale.findOne(query)
                .then(user => !user ? res.status(400).json([Errors.shopNotEqual]) : next())
                .catch(err => res.status(500).json(err))
        },

        findByStatus: async (req, res, next) => {

            if(!req.query.status)
                return res.status(400).json([Errors.missingStatus])
            
            next()
        },

        findByDate: async (req, res, next) => {
            if(!req.query.date)
                return res.status(400).json([Errors.missingDate])
            
            next()
        }
    }
}
