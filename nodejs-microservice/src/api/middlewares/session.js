const resumeDbFromSession = (req, _res, next) => {
  const { connections } = req.app.locals;
  for (let i = 0; i < connections.length; i += 1) {
    const conn = connections[i];
    if (conn.session === req.session.id) {
      req.mysql = conn.mysql;
      return next();
    }
  }
  return next(new Error('Please create a database'));
};
const resumeDbFromSessionSoft = (req, _res, next) => {
  const { connections } = req.app.locals;
  for (let i = 0; i < connections.length; i += 1) {
    const conn = connections[i];
    if (conn.session === req.session.id) {
      req.mysql = conn.mysql;
      req.dbName = conn.dbName;
      return next();
    }
  }
  return next();
};

module.exports.resumeDbFromSession = resumeDbFromSession;
module.exports.resumeDbFromSessionSoft = resumeDbFromSessionSoft;
