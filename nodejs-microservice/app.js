const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const libMysql = require('./src/lib/mysql');
const libLogger = require('./src/lib/logger');
const routers = require('./src/api/routes');
const logger = require('./src/lib/logger');
const { getConnection } = require('./src/utils/mysql.utils');

const DB = require('./src/lib/DB');

const app = express();
const port = 3001;

(async () => {
  let rootConnection;
  try {
    global.mysqlPool = await libMysql.createPool();
    app.locals.connections = [];
    rootConnection = await getConnection(global.mysqlPool);
    const allDatabases = await DB.getAllDatabases(rootConnection);

    for (let i = 0; i < allDatabases.length; i += 1) {
      const {
        user, password, name: dbName, sessionId, exId: identifier,
      } = allDatabases[i];
      // eslint-disable-next-line no-await-in-loop
      const conn = await libMysql.createPool(undefined, user, password);
      const dbInfo = {
        dbName, session: sessionId, mysql: conn, user, password, identifier,
      };
      app.locals.connections.push(dbInfo);
      libLogger.log('info', 'Recovering', JSON.stringify({
        user, password, dbName, sessionId, identifier,
      }));
    }

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
  } finally {
    if (rootConnection) {
      rootConnection.release();
    }
  }
})();

process.stdin.resume(); // so the program will not close instantly

async function exitHandler(opts) {
  if (opts.del) {
    let rootConnection = null;
    try {
      const { connections } = app.locals;
      const operations = [];
      rootConnection = await getConnection(global.mysqlPool);
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
    libLogger.log('info', 'EXITING', opts);
    process.exit();
  } else {
    process.exit();
  }
}

// do something when app is closing
process.on('exit', exitHandler.bind({ del: false }));

// catches ctrl+c event
process.on('SIGINT', exitHandler.bind({ del: false }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind({ del: false }));
process.on('SIGUSR2', exitHandler.bind({ del: false }));

// docker exit
process.on('SIGTERM', exitHandler.bind({ del: false }));
process.on('beforeExit', exitHandler.bind({ del: false }));

// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind({ del: false }));
