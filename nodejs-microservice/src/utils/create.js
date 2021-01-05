const libMysql = require('../lib/mysql');

const { getRandomInt, generateShort } = require('./compute');

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

module.exports.createSecureConnection = createSecureConnection;
