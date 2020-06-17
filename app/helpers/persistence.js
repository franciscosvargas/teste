const callbackObject = require('./returnObject')

module.exports = Model => ({
    create: (data, res, options) => Model.create(data, options)
        .then(result => {
            delete result.dataValues.password;
            callbackObject.returnCreateSuccess(result, res)
        })
        .catch(error => callbackObject.returnError(error, res)),

    createUser: (data, res) => Model.create(data)
        .then(result => callbackObject.returnCreateSuccessUser(result, res))
        .catch(error => callbackObject.returnError(error, res)),

    listAll: (res) => Model.findAll({})
        .then(result => callbackObject.returnListSuccess(result, res))
        .catch(error => callbackObject.returnError(error, res)),

    listAllQueryWithJoin: (query, res) => Model.findAll({ query, include: { all: true } })
        .then(result => callbackObject.returnListSuccess(result, res))
        .catch(error => callbackObject.returnError(error, res)),

    listAllQuery: (query, res, options) => Model.findAll(Object.assign({}, query, options))
        .then(result => callbackObject.returnListSuccess(result, res))
        .catch(error => callbackObject.returnError(error, res)),

    listOne: (query, res, options) => Model.findOne(Object.assign({}, { where: query }, options))
        .then(result => callbackObject.returnListSuccess(result, res))
        .catch(error => callbackObject.returnError(error, res)),

    listOneNotWhere: (query, res) => Model.findOne(query)
        .then(result => callbackObject.returnListSuccess(result, res))
        .catch(error => callbackObject.returnError(error, res)),

    listOneWithJoin: (query, res) => Model.findOne({
        where: query,
        include: { all: true }
    })
        .then(result => callbackObject.returnListSuccess(result, res))
        .catch(error => callbackObject.returnError(error, res)),

    findAndCountAll: (query, res) => Model.findAndCountAll(query)
        .then(result => callbackObject.returnListSuccess(result, res))
        .catch(error => callbackObject.returnError(error, res)),

    listAllWithJoin: (res) => Model.findAll({ where: {}, include: { all: true } })
        .then(result => callbackObject.returnListSuccess(result, res))
        .catch(error => callbackObject.returnError(error, res)),

    listOneAllWithJoin: (query, res) => Model.findAll({
        where: query,
        include: { all: true }
    })
        .then(result => callbackObject.returnListSuccess(result, res))
        .catch(error => callbackObject.returnError(error, res)),

    delete: (query, res) => Model.destroy({ where: query })
        .then(result => callbackObject.returnDelete(result, res))
        .catch(error => callbackObject.returnError(error, res)),

    deleteWhere: (query, res) => Model.destroy(query)
        .then(result => callbackObject.returnDelete(result, res))
        .catch(error => callbackObject.returnError(error, res)),

    update: (query, mod, res) => Model.update(mod, { where: query })
        .then(result => callbackObject.returnUpdate(result, res))
        .catch(error => callbackObject.returnError(error, res)),

    activeCode: (query, mod, res) => Model.update(mod, { where: query })
        .then(result => callbackObject.returnUpdateActive(result, res))
        .catch(error => callbackObject.returnError(error, res)),

    listAllPaginated: (query, res) => pages => {
        const HelperPaginate = require('../helpers/paginate')(Model)
        HelperPaginate.countAll(pages, query)
            .then(HelperPaginate.listAll(query))
            .then(result => callbackObject.returnListSuccess(result, res))
            .catch(err => callbackObject.returnError(err, res))
    },

    upsert: async (obj) => {
        const [model, wasCreated] = await Model.findOrCreate({where: {id: obj.id}, defaults: obj});
        if(!wasCreated) {
            await model.update(obj);
        }
        return model;
    }
})
