const resumeDbFromSession = (req, _res, next) => {
    const connections = req.app.locals.connections;
    for (let i = 0; i < connections.length; i++) {
        const conn = connections[i];
        if (conn.session == req.session.id) {
            req.mysql = conn.mysql;
            return next();
        }
    }
    next('Please create a database');
}

module.exports.resumeDbFromSession = resumeDbFromSession;
