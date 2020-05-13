module.exports = app => {

    const Company = app.datasource.models.Company
    const FinancialTransaction = app.datasource.models.FinancialTransaction

    return {
        doLogTransactionDebit: (runing, companyId, observations) => {
            return new Promise((resolve, reject) => {
                let transaction = new FinancialTransaction()
                Company.findById(companyId, {
                    raw: true
                }).then(company => {
                    transaction.operation = 'DEBIT'
                    transaction.value = runing.value
                    transaction.balance = company.balance
                    // TODO Tornar disponível a Internacionalização
                    transaction.observations = observations || `Código da entrega: ${runing.id}`
                    transaction.company_id = company.id
                    transaction.reversal = false
                    transaction.save()
                    resolve()
                }, error => {
                    reject(error)
                })
            })
        },

        doLogTransactionUpdateCompany: (object, companyId, observations) => {
            return new Promise((resolve, reject) => {
                console.log(object)
                let transaction = new FinancialTransaction()
                transaction.operation = 'DEBIT'
                transaction.value = object.value
                transaction.balance = object.balance
                // TODO Tornar disponível a Internacionalização
                transaction.observations = observations || `Código da entrega: ${runing.id}`
                transaction.company_id = companyId
                transaction.reversal = false
                transaction.save()
                resolve()
            })
        },

        doLogTransactionDebitCopy: runing => {
            return new Promise((resolve, reject) => {
                let transaction = new FinancialTransaction()
                Company.findById(runing.dataValues.company_id, {
                    raw: true
                }).then(company => {
                    transaction.operation = 'DEBIT'
                    transaction.value = runing.dataValues.value
                    transaction.balance = company.balance
                    //TODO Tornar disponível a Internacionalização
                    transaction.observations = `Código da entrega: ${runing.dataValues.id}`
                    transaction.company_id = company.id
                    transaction.reversal = false
                    transaction.save()
                    resolve(runing)
                }, error => {
                    reject(error)
                })
            })
        },

        doLogTransactionCredit: (value, companyId, observations) => {
            return new Promise((resolve, reject) => {
                let transaction = new FinancialTransaction();
                Company.findById(companyId, {
                    raw: true
                }).then(company => {
                    transaction.operation = 'CREDIT';
                    transaction.value = value;
                    transaction.balance = company.balance;
                    //TODO Tornar disponível a Internacionalização
                    transaction.observations = observations;
                    transaction.company_id = company.id;
                    transaction.reversal = false;
                    transaction.save();
                    resolve()
                }, error => {
                    reject(error);
                });
            });
        },
        doLogTransactionReversal: (runing) => new Promise((resolve, reject) => {
            Company.findById(parseInt(runing.company_id), {
                raw: true
            })
                .then(company => {
                    let transactionCredit = new FinancialTransaction();
                    transactionCredit.operation = 'CREDIT';
                    transactionCredit.value = runing.value;
                    transactionCredit.balance = (parseFloat(company.balance) + parseFloat(runing.value));
                    transactionCredit.observations = `Estorno realizado devido ao cancelamento. (${runing.id})`;
                    transactionCredit.company_id = company.id;
                    transactionCredit.reversal = true;
                    transactionCredit.save();

                    if (parseInt(runing.status) === 4) {
                        let transactionDebit = new FinancialTransaction();
                        transactionDebit.operation = 'DEBIT';
                        transactionDebit.value = 2;
                        transactionDebit.balance = (parseFloat(company.balance) + parseFloat(runing.value) - 2);
                        transactionDebit.observations = `Taxa de cancelamento. (${runing.id})`;
                        transactionDebit.company_id = company.id;
                        transactionDebit.reversal = false;
                        transactionDebit.save();
                    }
                    resolve()
                }).catch(reject)
        })
    }
}
