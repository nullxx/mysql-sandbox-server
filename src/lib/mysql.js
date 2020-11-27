const mysql = require('mysql');
const libLogger = require('./logger');

const createConnection = (host = process.env.MYSQL_HOST, user = process.env.MYSQL_ROOT_USER, password = process.env.MYSQL_ROOT_PASSWORD) => {
    return new Promise((res, rej) => {
        var conn = mysql.createConnection({
            host,
            user,
            password
        });

        conn.connect((err) => {
            if (err) rej(err);
            libLogger.log('debug', 'MYSQL ROOT CONN SUCCESS');
            res(conn);
        });
    });
};

const runQuery = (conn, query) => {
    return new Promise((res, rej) => {
        conn.query(query, (err, result) => {
            if (err) return rej(err);
            libLogger.log('debug', 'MYSQL QUERY', query);
            res(result)
        });
    });
}

const changeUser = (conn, dbName) => {
    return new Promise((res, rej) => {
        conn.changeUser({ database: dbName }, function (err) {
            if (err) rej(err);
            libLogger.log('debug', 'CHANGE USER', dbName);
            res();
        });
    })

}
module.exports.createConnection = createConnection;
module.exports.runQuery = runQuery;
module.exports.changeUser = changeUser;
