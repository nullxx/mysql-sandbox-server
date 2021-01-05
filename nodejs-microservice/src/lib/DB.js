const libMysql = require('./mysql');

const createDatabase = async (conn, {
  name,
  sessionId,
  user,
  password,
  exId,
}) => {
  try {
    const result = await libMysql.runQuery(conn, 'INSERT INTO ??.`databases` (name, sessionId, user, password, exId) VALUES (?, ?, ?, ?, ?);', [process.env.MYSQL_DATABASE, name, sessionId, user, password, exId]);
    if (result.serverStatus === 2) {
      return true;
    }
    throw new Error(result.message);
  } catch (error) {
    return Promise.reject(error);
  }
};

const getAllDatabases = async (conn) => {
  try {
    const result = await libMysql.runQuery(conn, 'SELECT * FROM ??.`databases`', [process.env.MYSQL_DATABASE]);
    return result;
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports.createDatabase = createDatabase;
module.exports.getAllDatabases = getAllDatabases;
