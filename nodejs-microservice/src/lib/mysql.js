const mysql = require('mysql');

const libLogger = require('./logger');
const { parseError } = require('../utils/mysql.utils');

const createConnection = (host = process.env.MYSQL_HOST,
  user = process.env.MYSQL_ROOT_USER,
  password = process.env.MYSQL_ROOT_PASSWORD,
  port = process.env.MYSQL_PORT,
  database = undefined) => new Promise((res, rej) => {
  const conn = mysql.createPool({
    host,
    user,
    password,
    port: parseInt(port, 10),
    database,
  });

  conn.on('acquire', (c) => libLogger.log('debug', `Connection ${c.threadId} adquired`));
  conn.on('connection', (c) => libLogger.log('debug', `New connection ${c.threadId} created`));
  conn.on('enqueue', () => libLogger.log('debug', 'Waiting for available connection slot'));
  conn.on('release', (c) => libLogger.log('debug', `Connection ${c.threadId} released`));
  conn.on('error', (err) => rej(err));
  res(conn);
});

const runQuery = (conn, query, bind = []) => new Promise((res, rej) => {
  conn.query(query, bind, (err, result) => {
    if (err) return rej(parseError(err));
    libLogger.log('debug', 'MYSQL QUERY', query);
    return res(result);
  });
});

const changeUser = (conn, dbName) => new Promise((res, rej) => {
  conn.changeUser({ database: dbName }, (err) => {
    if (err) rej(parseError(err));
    libLogger.log('debug', 'CHANGE USER', dbName);
    res();
  });
});

module.exports.createConnection = createConnection;
module.exports.runQuery = runQuery;
module.exports.changeUser = changeUser;
