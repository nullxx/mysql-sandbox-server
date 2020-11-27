const mysql = require('mysql');

const libLogger = require('./logger');

const createConnection = (host = process.env.MYSQL_HOST,
  user = process.env.MYSQL_ROOT_USER,
  password = process.env.MYSQL_ROOT_PASSWORD) => new Promise((res, rej) => {
  const conn = mysql.createConnection({
    host,
    user,
    password,
  });

  conn.connect((err) => {
    if (err) rej(err);
    libLogger.log('debug', 'MYSQL ROOT CONN SUCCESS');
    res(conn);
  });
});

const runQuery = (conn, query, bind = []) => new Promise((res, rej) => {
  conn.query(query, bind, (err, result) => {
    if (err) return rej(err);
    libLogger.log('debug', 'MYSQL QUERY', query);
    return res(result);
  });
});

const changeUser = (conn, dbName) => new Promise((res, rej) => {
  conn.changeUser({ database: dbName }, (err) => {
    if (err) rej(err);
    libLogger.log('debug', 'CHANGE USER', dbName);
    res();
  });
});
module.exports.createConnection = createConnection;
module.exports.runQuery = runQuery;
module.exports.changeUser = changeUser;
