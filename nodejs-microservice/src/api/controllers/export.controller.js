const mysqldump = require('mysqldump');

const mysqlDump = async (req, res, next) => {
  try {
    const { user, password, dbName } = req;
    const result = await mysqldump({
      connection: {
        host: process.env.MYSQL_HOST,
        user,
        password,
        database: dbName,
        port: process.env.MYSQL_PORT,
      },
    });
    res.send({ code: 1, data: result });
  } catch (error) {
    next(error);
  } finally {
    next();
  }
};

module.exports.mysqlDump = mysqlDump;
