const { getConnection } = require('../../utils/mysql.utils');
const libMysql = require('../../lib/mysql');

const resumeDbFromSession = async (req, _res, next) => {
  const { connections } = req.app.locals;
  for (let i = 0; i < connections.length; i += 1) {
    const conn = connections[i];
    if (conn.session === req.session.id) {
      // eslint-disable-next-line no-await-in-loop
      req.mysql = await getConnection(conn.mysql);
      // eslint-disable-next-line no-await-in-loop
      await libMysql.changeUser(req.mysql, conn.dbName);
      // disable eslint because it will only be executed once
      return next();
    }
  }
  return next(new Error('Please create a database'));
};
const resumeDbFromSessionSoft = (req, _res, next) => {
  const { connections } = req.app.locals;
  for (let i = 0; i < connections.length; i += 1) {
    const conn = connections[i];
    if (conn.session === req.session.id) {
      req.mysql = conn.mysql;
      req.dbName = conn.dbName;
      return next();
    }
  }
  return next();
};

const closeResumedDbSession = async (req, _res, next) => {
  try {
    req.mysql.release();
  } catch (error) {
    next(error);
  } finally {
    next();
  }
};

module.exports.resumeDbFromSession = resumeDbFromSession;
module.exports.resumeDbFromSessionSoft = resumeDbFromSessionSoft;
module.exports.closeResumedDbSession = closeResumedDbSession;
