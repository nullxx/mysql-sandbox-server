const { getConnection } = require('../../utils/mysql.utils');
const libMysql = require('../../lib/mysql');

const resumeDbFromSession = async (req, _res, next) => {
  const { connections } = req.app.locals;
  const { identifier } = req.body;

  try {
    for (let i = 0; i < connections.length; i += 1) {
      const conn = connections[i];
      if (conn.session === req.session.id || (identifier && conn.identifier === identifier)) {
        // eslint-disable-next-line no-await-in-loop
        req.mysql = await getConnection(conn.mysql);
        // eslint-disable-next-line no-await-in-loop
        await libMysql.changeUser(req.mysql, conn.dbName);
        // disable eslint because it will only be executed once

        return next();
      }
    }
  } catch (error) {
    next(error);
  }
  return next(new Error('Database not found.'));
};
const resumeDbFromSessionSoft = (req, _res, next) => {
  const { connections } = req.app.locals;
  const { identifier } = req.body;

  for (let i = 0; i < connections.length; i += 1) {
    const conn = connections[i];
    if (conn.session === req.session.id || (identifier && conn.identifier === identifier)) {
      req.mysql = conn.mysql;
      req.dbName = conn.dbName;
      req.identifier = identifier;
      return next();
    }
  }
  return next();
};

const resumeDBData = (req, _res, next) => {
  const { connections } = req.app.locals;
  const { identifier } = req.body;

  for (let i = 0; i < connections.length; i += 1) {
    const conn = connections[i];
    if (conn.session === req.session.id || (identifier && conn.identifier === identifier)) {
      req.dbName = conn.dbName;
      req.user = conn.user;
      req.password = conn.password;
      return next();
    }
  }
  return next();
};
const closeResumedDbSessionError = (err, req, _res, next) => {
  if (req.mysql) {
    req.mysql.release();
  }
  next(err);
};
const closeResumedDbSession = (req, _res, next) => {
  // this will be executed only when error ocurred
  try {
    if (req.mysql) { // an error could be thrown before set req.mysql
      req.mysql.release();
    }
  } catch (error) {
    next(error);
  } finally {
    next();
  }
};

module.exports.resumeDbFromSession = resumeDbFromSession;
module.exports.resumeDbFromSessionSoft = resumeDbFromSessionSoft;
module.exports.resumeDBData = resumeDBData;
module.exports.closeResumedDbSession = closeResumedDbSession;
module.exports.closeResumedDbSessionError = closeResumedDbSessionError;
