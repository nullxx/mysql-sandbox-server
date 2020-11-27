const express = require('express')
const app = express()
const port = 3001;
const libMysql = require('./src/lib/mysql');
const libLogger = require('./src/lib/logger');
const routers = require('./src/api/routes');
const session = require('express-session');

 // TODO prevent sql injection!
 // SEPARATE STATEMENTS FROM STRINGS

(async () => {
    try {
        app.locals.connections = [];
        app.locals.mysqlConn = await libMysql.createConnection();

        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: { secure: false }
        }))
        app.use('/', routers);

        app.use((err, _req, res, _next) => {
            console.log(err)
            res.send({ code: -1, error: err });
        })

        app.listen(port, () => {
            console.log(`App listening at http://localhost:${port}`)
        })
    } catch (error) {
        libLogger.log('error', 'INIT ERROR', error);
    }
})();

process.stdin.resume(); //so the program will not close instantly

async function exitHandler(options, exitCode) {
    try {
        const connections = app.locals.connections;
        for (let i = 0; i < connections.length; i++) {
            const conn = connections[i];
            await libMysql.runQuery(app.locals.mysqlConn, `DROP DATABASE ${conn.dbName};`);
            console.log('Droped DB ' + conn.dbName);

            await libMysql.runQuery(app.locals.mysqlConn, `DROP USER '${conn.user}'@'localhost';`);
            console.log('Droped USER ' + conn.user);
        }
    } catch (error) {
        libLogger.log('error', 'ON EXIT', error);
    }
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));