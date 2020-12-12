const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const csurf = require('csurf');

const libMysql = require('./src/lib/mysql');
const libLogger = require('./src/lib/logger');
const routers = require('./src/api/routes');
const logger = require('./src/lib/logger');
const { getConnection } = require('./src/utils/mysql.utils');

const app = express();
const port = 3001;

(async () => {
  try {
    app.locals.connections = [];
    app.locals.mysqlPool = await libMysql.createPool();

    app.use(morgan(process.env.EXPRESS_LOGGING_TYPE));
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
    app.use(csurf({ cookie: true }));

    app.use('/', routers);

    app.use((err, _req, res, _next) => {
      res.send({
        code: -1,
        error: {
          message: err.message, type: err.type ? err.type : undefined,
        },
      });
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
  let rootConnection = null;
  try {
    const { connections } = app.locals;
    const operations = [];
    rootConnection = await getConnection(app.locals.mysqlPool);
    for (let i = 0; i < connections.length; i += 1) {
      const conn = connections[i];

      operations.push(libMysql.runQuery(rootConnection, 'DROP DATABASE ??;', [conn.dbName]));
      operations.push(libMysql.runQuery(rootConnection, 'DROP USER ?@\'%\';', [conn.user]));
    }
    await Promise.all(operations);
  } catch (error) {
    libLogger.log('error', 'ON EXIT', error);
  } finally {
    if (rootConnection) {
      rootConnection.release();
    }
  }
  libLogger.log('info', 'EXITING', exitCode);
  if (options.exit) process.exit();
}

// do something when app is closing
process.on('exit', exitHandler.bind(null, { exit: true }));

// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

// docker exit
process.on('SIGTERM', exitHandler.bind(null, { exit: true }));
process.on('beforeExit', exitHandler.bind(null, { exit: true }));

// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
