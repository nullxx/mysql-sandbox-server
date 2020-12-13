const libMysql = require('../../lib/mysql');
const { getRandomInt, generateShort } = require('../../utils/compute');
const { getConnection } = require('../../utils/mysql.utils');

const createSecureConnection = async (mysqlConn, dbName, session) => {
  const user = `user_${getRandomInt(0, 512)}_${session}`;
  const password = `pass_${getRandomInt(0, 512)}_${session}`;
  const identifier = generateShort();

  await libMysql.runQuery(mysqlConn, 'CREATE USER ?@\'%\' IDENTIFIED BY ?;', [user, password]);
  await libMysql.runQuery(mysqlConn, 'GRANT ALL PRIVILEGES ON ??.* TO ?@\'%\';', [dbName, user]);
  await libMysql.runQuery(mysqlConn, 'FLUSH PRIVILEGES;');

  const conn = await libMysql.createPool(undefined, user, password);

  return {
    dbName, session, mysql: conn, user, password, identifier,
  };
};

const createDb = async (req, res, next) => {
  const { dbName } = req.params;
  let mysqlConn = null;
  if (dbName) {
    try {
      mysqlConn = await getConnection(req.app.locals.mysqlPool);
      await libMysql.runQuery(mysqlConn, 'CREATE DATABASE ??', [dbName]);

      const secureSandboxInfo = await createSecureConnection(
        mysqlConn,
        dbName,
        req.session.id,
      );

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
