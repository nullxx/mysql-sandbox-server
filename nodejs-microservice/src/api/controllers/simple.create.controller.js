const libMysql = require('../../lib/mysql');
const DB = require('../../lib/DB');

const { getConnection } = require('../../utils/mysql.utils');
const { createSecureConnection } = require('../../utils/create');

const createDb = async (req, res, next) => {
  const { dbName } = req.params;
  let mysqlConn = null;
  if (dbName) {
    try {
      mysqlConn = await getConnection(global.mysqlPool);
      await libMysql.runQuery(mysqlConn, 'CREATE DATABASE ??', [dbName]);

      const secureSandboxInfo = await createSecureConnection(
        mysqlConn,
        dbName,
        req.session.id,
      );

      await DB.createDatabase(mysqlConn, {
        name: secureSandboxInfo.dbName,
        exId: secureSandboxInfo.identifier,
        sessionId: secureSandboxInfo.session,
        user: secureSandboxInfo.user,
        password: secureSandboxInfo.password,
      });

      req.app.locals.connections.push(secureSandboxInfo);

      res.send({
        code: 1,
        data: {
          database: { name: dbName },
          identifier: secureSandboxInfo.identifier,
        },
      });
    } catch (error) {
      next(error);
    }
    if (mysqlConn) {
      mysqlConn.release();
    }
  }
};

module.exports.createDb = createDb;
