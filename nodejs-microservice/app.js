const express = require('express');
const session = require('express-session');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const libMysql = require('./src/lib/mysql');
const libLogger = require('./src/lib/logger');
const routers = require('./src/api/routes');
const logger = require('./src/lib/logger');

const app = express();
const port = 3001;

(async () => {
  try {
    app.locals.connections = [];
    app.locals.mysqlConn = await libMysql.createConnection();

    app.use(cors({
      credentials: true,
      origin: 'http://localhost:3000',
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
      genid: () => uuidv4().substring(0, 16),
    }));
    app.use('/', routers);

    app.use((err, _req, res, _next) => {
      res.send({ code: -1, error: err.message });
      _next();
    });

    app.listen(port, () => {
      logger.log('info', `APP started at port ${port}`);
    });
  } catch (error) {
    libLogger.log('error', 'INIT ERROR', error);
  }
})();

process.stdin.resume(); // so the program will not close instantly

async function exitHandler(options, exitCode) {
  try {
    const { connections } = app.locals;
    const operations = [];
    for (let i = 0; i < connections.length; i += 1) {
      const conn = connections[i];
      operations.push(libMysql.runQuery(app.locals.mysqlConn, 'DROP DATABASE ??;', [conn.dbName]));
      operations.push(libMysql.runQuery(app.locals.mysqlConn, 'DROP USER ?@\'%\';', [conn.user]));
    }
    await Promise.all(operations);
  } catch (error) {
    libLogger.log('error', 'ON EXIT', error);
  }
  if (options.cleanup) logger.log('info', 'CLEANUP');
  if (exitCode || exitCode === 0) logger.log('info', 'EXIT CODE', exitCode);
  if (options.exit) process.exit();
}

// do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
