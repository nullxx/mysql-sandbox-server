const libMysql = require('../../lib/mysql');
const { getRandomInt } = require('../utils/compute');

const createSecureConnection = async (mysqlConn, dbName, session) => {
    const user = 'user_' + getRandomInt(0, Math.pow(10, 10)); // TODO very temporal
    const password = 'pass_' + getRandomInt(0, Math.pow(10, 10)); // TODO very temporal

    await libMysql.runQuery(mysqlConn, `CREATE USER '${user}'@'localhost' IDENTIFIED BY '${password}';`);
    await libMysql.runQuery(mysqlConn, `GRANT ALL ON ${dbName}.* TO '${user}'@'localhost';`);

    const conn = await libMysql.createConnection(undefined, user, password);
    await libMysql.changeUser(conn, dbName);

    return { dbName, session, mysql: conn, user, password };
}


const createDb = async (req, res, next) => {
    const { dbName } = req.params;
    if (dbName) {
        try {
            await libMysql.runQuery(req.app.locals.mysqlConn, `CREATE DATABASE ${dbName}`);

            const secureSandboxInfo = await createSecureConnection(req.app.locals.mysqlConn, dbName, req.session.id);
            req.app.locals.connections.push(secureSandboxInfo);

            res.send({ code: 1, database: { name: dbName } })
        } catch (error) {
            next(error);
        }
    }
}

module.exports.createDb = createDb;