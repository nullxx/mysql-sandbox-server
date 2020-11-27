const libMysql = require('../../lib/mysql');

const runQuery = async (req, res, next) => {
    try {
        const { query } = req.body;

        if (query) {
            res.send({ code: 1, data: await libMysql.runQuery(req.mysql, query) })
        }
    } catch (error) {
        next(error);
    }
}


module.exports.runQuery = runQuery;
