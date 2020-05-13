module.exports = app => {
    const Business = require('../business/overview')(app)
    return {
        show: (req, res) => {
            Business.show(req.query.company_id).then(overview => {
                res.json(overview)
            }, error => {
                res.status(500).json(error);
            });
        },
        showDriver: (req, res) => {
            Business.showDriver(req.params.driver_id).then(overview => {
                res.json(overview)
            }, error => {
                res.status(500).json(error);
            });
        }
    }
}
