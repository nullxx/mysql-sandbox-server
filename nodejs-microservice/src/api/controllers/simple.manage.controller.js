const libMysql = require('../../lib/mysql');

const runQuery = async (req, res, next) => {
  try {
    const { query } = req.body;

    if (query) {
      res.send({ code: 1, data: await libMysql.runQuery(req.mysql, query) });
    }
  } catch (error) {
    next(error);
  }
};

const getActiveDB = async (req, res, next) => {
  try {
    const { dbName } = req;
    if (dbName) {
      res.send({ code: 1, data: { database: { name: dbName } } });
    } else {
      res.send({ code: 0, error: 'ERR_NO_DATABASE_CREATED' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports.runQuery = runQuery;
module.exports.getActiveDB = getActiveDB;
