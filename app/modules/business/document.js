    module.exports = app => {
    const User = app.datasource.models.User
    return {
        stageUser: body => new Promise((resolve, reject) =>
            User.update({stage: 8}, {where: {id: body.user_id}})
                .then(() => resolve(body))
                .catch(reject))
    }
}
