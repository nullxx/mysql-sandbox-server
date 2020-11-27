const resumeDbFromSession = (req, _res, next) => {
  const { connections } = req.app.locals;
  for (let i = 0; i < connections.length; i += 1) {
    const conn = connections[i];
    if (conn.session === req.session.id) {
      req.mysql = conn.mysql;
      return next();
    }
  }
  return next('Please create a database');
};

module.exports.resumeDbFromSession = resumeDbFromSession;
