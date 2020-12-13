const libMysql = require('../../lib/mysql');

const runQuery = async (req, res, next) => {
  try {
    const { query } = req.body;

    if (query) {
      res.send({ code: 1, data: await libMysql.runQuery(req.mysql, query) });
    }
  } catch (error) {
    next(error);
  } finally {
    next();
  }
};

const getActiveDB = async (req, res, next) => {
  try {
    const { dbName, identifier } = req;
    if (dbName) {
      res.send({ code: 1, data: { database: { name: dbName }, identifier } });
    } else {
      res.send({ code: 0, error: 'ERR_NO_DATABASE_CREATED' });
    }
  } catch (error) {
    next(error);
  } finally {
    next();
  }
};

module.exports.runQuery = runQuery;
module.exports.getActiveDB = getActiveDB;
