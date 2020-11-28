const parseError = (errObj) => {
  const error = new Error(`${errObj.code}: ${errObj.sqlMessage}`);
  error.status = errObj.errno;
  return error;
};

module.exports.parseError = parseError;
