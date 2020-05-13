
const equealsOrLargeBalance = (balance, valueTotal) => (balance >= valueTotal)

const toDebitCompany = (company, object) => (parseFloat(company.balance) - parseFloat(object.valueTotal))

const sumBalanceCompany = (company, object) => (parseFloat(company.balance) + parseFloat(object.request.valueTotal))

const verifyUpdate = (object, resolve, reject, body) => {
    if (!object[0]) {
        reject({ title: 'Error em alterar!', message: 'Não foi possivel efetuar atualização, tente novamente!' })
    } else {
        resolve(body)
    }
}

module.exports = app => {
    const Company = app.datasource.models.Company
    return {
        balanceVerify: (object) => {
            return new Promise((resolve, reject) => {
                Company.findById(object.company_id)
                    .then(company => {
                        if (company) {
                            if (equealsOrLargeBalance(parseFloat(company.dataValues.balance), parseFloat(object.valueTotal))) {
                                const balance = toDebitCompany(company, object)
                                const query = { where: { id: object.company_id } }
                                const mod = { balance: balance }
                                Company.update(mod, query)
                                    .then(update => verifyUpdate(update, resolve, reject, object))
                                    .catch(reject)
                            } else {
                                reject({ title: 'Saldo', message: 'Saldo Insuficiente!' })
                            }
                        } else {
                            reject({ title: 'Empresa', message: 'Empresa não existe!' })
                        }
                    })
                    .catch(reject)
            })
        },

        balanceReturn: (object) => {
            return new Promise((resolve, reject) => {
                Company.findById(object.request.company_id)
                    .then(company => {
                        if (company) {
                            const balance = sumBalanceCompany(company, object)
                            const query = {where: {$and: [{ id: object.request.company_id }]}}
                            const mod = {balance: balance}
                            Company.update(mod, query)
                                .then(update => verifyUpdate(update, resolve, reject, object))
                                .catch(reject)
                        } else {
                            reject({title: 'Empresa', message: 'Empresa não existe!'})
                        }
                    })
                    .catch(reject)
            })
        }

    }
}
