module.exports = app => {
    const moment = require('moment-timezone')
    moment.tz.setDefault('America/Recife')

    const Model = app.datasource.models.settings
    const SettingsHelper = require('../../helpers/settings')

    return {
        find: (req, res) => {
            const query = {
                where: {},
                limit: 10
            }

            try {
                const params = req.params;
                const filters = JSON.parse(req.query.filter)

                if(params.type) {
                    filters.type = params.type;
                }

                if (filters) {
                    query.where.$or = []
                    for (const key in filters) {
                        let tmp = {}
                        tmp[key] = {$like: `%${filters[key]}%`}
                        query.where.$or.push(tmp)
                    }
                }
            } catch (e) {
            }

            Model.findAll(query)
                .then(result => {
                    const settingsObj = SettingsHelper.toSettingsObject(result);
                    return res.status(200).json(settingsObj);
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json(err)
                })
        },
        update: async (req, res) => {
            try {
                delete req.body._isEditMode
                delete req.body._userId
                delete req.body.id

                if(req.params && req.params.type) {
                    const type = req.params.type;

                    await Promise.all(Object.entries(req.body)
                        .map(([name, value]) => {
                            return Model.upsert({type, name, value});
                        })
                    );

                    res.status(200).json({})
                } else {
                    res.status(400).json({})
                }
            } catch (err) {
                console.log(err)
                res.status(400).json(err)
            }
        },

        updateDeliverDiscount: async (req, res) => {
            try {
                const { value } = req.body

                const query = {
                    where: {
                        type: 'DELIVER_DISCOUNT',
                        name: 'PRIMARY_DELIVER_DISCOUNT'
                    }
                }
    
                const id = await Model.update({ value }, query)
                const data = await Model.find(query)
                res.json(data)
                
            } catch (err) {
                console.log(err)
                res.status(400).json(err)
            }
        }
    }
}
