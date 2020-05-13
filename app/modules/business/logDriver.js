module.exports = app => {
    const LogDriver = app.datasource.models.LogDriver
    return {
        create: (object) => LogDriver.create(object)
    }
}

