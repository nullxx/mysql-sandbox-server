const parseError = (errObj) => {
  const error = new Error(`${errObj.code}: ${errObj.sqlMessage}`);
  error.status = errObj.errno;
  return error;
};

const getConnection = (pool) => new Promise((res, rej) => {
  pool.getConnection((err, conn) => {
    if (err) return rej(err);
    return res(conn);
  });
});

module.exports.parseError = parseError;
module.exports.getConnection = getConnection;
