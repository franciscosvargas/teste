const moment = require('moment-timezone')
moment.tz.setDefault('America/Recife')

module.exports = app => {
    const Company = app.datasource.models.Company
    const RunningDelivery = app.datasource.models.RunningDelivery
    const RequestDelivery = app.datasource.models.RequestDelivery
    const ExtractDaily = app.datasource.models.ExtractDaily
    const startOfMonth = `${moment().startOf('month').format('YYYY-MM-DD')} 00:00`
    const endOfMonth   = moment().endOf('month').format('YYYY-MM-DD hh:mm')
    const startOfWeek = `${moment().startOf('week').add('day', 1).format('YYYY-MM-DD')} 00:00`
    const endOfWeek   = moment().endOf('week').add('day', 1).format('YYYY-MM-DD hh:mm')
    
    const getCompany = company_id => Company.findOne({where: {id: company_id}});
    const countRunningDeliveriesCompleted = company_id => RunningDelivery.findAndCountAll({where: {company_id: company_id, status: [6, 10]}});
    const avgRunningDeliveries = company_id => RunningDelivery.findAll({attributes: [[RunningDelivery.sequelize.fn('AVG', RunningDelivery.sequelize.col('value')), 'value_avg']],where: {company_id: company_id}});
    const countRunningDeliveriesIsWaiting = company_id => RunningDelivery.findAndCountAll({where: {company_id: company_id, status: [2,3]}});
    const countRunningDeliveriesOnWay = company_id => RunningDelivery.findAndCountAll({where: {company_id: company_id, status: [4]}});
    const countRunningDeliveriesOnAir = company_id => RunningDelivery.findAndCountAll({where: {company_id: company_id, status: 5}});
    const countRunningDeliveriesCompletedOnCurrentMonth = company_id => RunningDelivery.findAndCountAll({where: {company_id: company_id, status: [6, 10], created_at: {$between: [startOfMonth, endOfMonth]}}});

    return {
        show: (company_id) => {
            return new Promise((resolve, reject) => {
                let overviewObject = {};
                getCompany(company_id).then(company => {
                    overviewObject.balance = parseFloat(company.balance);
                    countRunningDeliveriesCompleted(company_id).then(countRunnings => {
                        overviewObject.running_deliveries_completed = countRunnings.count;
                        avgRunningDeliveries(company_id).then(dataAvg => {
                            overviewObject.running_deliveries_avg = (dataAvg[0].dataValues.value_avg) ? parseFloat(dataAvg[0].dataValues.value_avg) : 0;
                            countRunningDeliveriesIsWaiting(company_id).then(countIsWaiting => {
                                overviewObject.running_deliveries_waiting = countIsWaiting.count;                                
                                countRunningDeliveriesOnAir(company_id).then(countOnAir => {
                                    overviewObject.running_deliveries_on_air = countOnAir.count;
                                    countRunningDeliveriesCompletedOnCurrentMonth(company_id).then(countCurrent => {
                                        overviewObject.running_deliveries_completed_on_currrent_month = countCurrent.count;
                                        countRunningDeliveriesOnWay(company_id).then(countCurrent => {
                                            overviewObject.running_deliveries_on_way = countCurrent.count;
                                            resolve(overviewObject)        
                                        }, error => {
                                            reject(error);  
                                        });
                                    }, error => {
                                        reject(error);  
                                    });
                                }, error => {
                                    reject(error);    
                                })
                            }, error => {
                                reject(error);    
                            })
                        }, error => {
                            reject(error);    
                        })
                    }, error => {
                        reject(error);    
                    })
                }, error => {
                    reject(error);
                });
            });
        }, 
        showDriver: (driver_id) => {
            return Promise.all([
                RequestDelivery.findAll({
                    where: {
                        running_delivery_id: {
                            $ne: null
                        },
                        typePayment: [1,2]
                    },
                    include: [
                        {
                            model: RunningDelivery,
                            where: {
                                driver_id: driver_id,
                                created_at: {$between: [startOfWeek, endOfWeek]}
                            }
                        }
                    ]
                }).then(requests => {
                    let value = 0;
                    requests.map( v => {
                        value += parseFloat(v.RunningDelivery.value);
                    })
                    return {weekly_balance_payed: value}
                }),
                RequestDelivery.findAll({
                    where: {
                        running_delivery_id: {
                            $ne: null
                        },
                        typePayment: [3],
                        // created_at: {$between: [startOfWeek, endOfWeek]}
                    },
                    include: [
                        {
                            model: RunningDelivery,
                            where: {
                                driver_id: driver_id,
                                created_at: {$between: [startOfWeek, endOfWeek]}
                            }
                        }
                    ]
                }).then(requests => {
                    let value = 0;
                    requests.map( v => {
                        value += parseFloat(v.RunningDelivery.value);
                    })
                    return {weekly_balance_pending:value}
                }),
                RunningDelivery.sum('value', {where: {driver_id: driver_id, status: [6, 10]}}).then(sum => {return {balance: sum || 0}}),
                RunningDelivery.findAndCountAll({where: {driver_id: driver_id, status: [6, 10]}}).then(count => {return {finished_runnings: count.count || 0}}),
                ExtractDaily.sum('value', {where: {driver_id: driver_id, created_at: {$between: [startOfWeek, endOfWeek]}}}).then(sum => {return {extract_dailies: sum || 0}})
            ]).then( makedArray => {
                let retObj = {}
                for (let i in makedArray) { Object.assign(retObj, makedArray[i])};
                return retObj;
            }, error => error);
        }
    }
}
