module.exports = app => {
    const Company = app.datasource.models.Company
    const Transactions = app.datasource.models.Transactions

    return {
        charge: (object) => {
            return new Promise((resolve, reject) => {
                Company.increment(['balance'], { by: parseFloat(object.value), where: { id: object.company_id } })
                    .then(company => resolve(company))
                    .catch(err => reject(err))
            })
        },

        transaction: (object) => {
            const mod = {
                balance: parseFloat(object.value),
                company_id: object.company_id,
                transaction_deposit_id: object.id,
                authorizedAmount: parseFloat(object.value)
            }
            return new Promise((resolve, reject) => {
                Transactions.create(mod)
                    .then(transaction => resolve(transaction))
                    .catch(err => reject(err))
            })
        }
    }
}
