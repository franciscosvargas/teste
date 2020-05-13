module.exports = app => {
    return {
        listone: (req) => {
            const query = {
                where: req.params,
                attributes: {exclude: ['created_at', 'updated_at']}
            }
            return query
        },
        listAll: () => {
            const query = {
                where: {},
                attributes: {exclude: ['created_at', 'updated_at']}
            }
            return query
        }
    }
}
