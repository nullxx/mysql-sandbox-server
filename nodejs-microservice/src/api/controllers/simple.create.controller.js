const libMysql = require('../../lib/mysql');
const { getRandomInt } = require('../../utils/compute');

const createSecureConnection = async (mysqlConn, dbName, session) => {
  const user = `user_${getRandomInt(0, 512)}_${session}`;
  const password = `pass_${getRandomInt(0, 512)}_${session}`;

  await libMysql.runQuery(mysqlConn, 'CREATE USER ?@\'%\' IDENTIFIED BY ?;', [user, password]);
  await libMysql.runQuery(mysqlConn, 'GRANT ALL PRIVILEGES ON ??.* TO ?@\'%\';', [dbName, user]);
  await libMysql.runQuery(mysqlConn, 'FLUSH PRIVILEGES;');

  const conn = await libMysql.createPool(undefined, user, password);

  return {
    dbName, session, mysql: conn, user, password,
  };
};

const createDb = async (req, res, next) => {
  const { dbName } = req.params;
  if (dbName) {
    try {
      await libMysql.runQuery(req.app.locals.mysqlConn, 'CREATE DATABASE ??', [dbName]);

      const secureSandboxInfo = await createSecureConnection(
        req.app.locals.mysqlConn,
        dbName,
        req.session.id,
      );
      req.app.locals.connections.push(secureSandboxInfo);

      res.send({ code: 1, data: { database: { name: dbName } } });
    } catch (error) {
      next(error);
    }
  }
};

module.exports.createDb = createDb;
