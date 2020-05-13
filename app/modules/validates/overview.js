module.exports = app => {
    const Company = app.datasource.models.Company;
    const Driver = app.datasource.models.Driver;
    return {
        show: (req, res, next) => {
            req.assert('company_id', 'o Id da Empresa é necessário').notEmpty();

            if (req.validationErrors()) {
                res.status(400).json(error);
            } else {
                Company.findOne({
                    where: {
                        id: req.query.company_id
                    }
                }).then(company => {
                    if (!company) {
                        res.status(400).json({
                            "message":"A Empresa informada não existe"
                        })
                    } else {
                        next();
                    }
                })
            }
        },
        showDriver: (req, res, next) => {
            req.assert('driver_id', 'o Id do Motorista é necessário.').notEmpty();

            if (req.validationErrors()) {
                res.status(400).json(error);
            } else {
                Driver.findOne({
                    where: {
                        id: req.params.driver_id
                    }
                }).then(driver => {
                    if (!driver) {
                        res.status(400).json({
                            "message":"O Motorista informado não existe"
                        })
                    } else {
                        next();
                    }
                });
            }
        }
    }
}
