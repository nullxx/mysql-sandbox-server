const router = require('express').Router();

const { resumeDbFromSession, resumeDbFromSessionSoft } = require('../middlewares/session');

const controllerCreateBD = require('../controllers/simple.create.controller');
const controllerManage = require('../controllers/simple.manage.controller');

router
  .route('/getActiveDB')
  .get(
    resumeDbFromSessionSoft,
    controllerManage.getActiveDB,
  );

router
  .route('/query')
  .post(
    resumeDbFromSession,
    controllerManage.runQuery,
  );

router
  .route('/createDB/:dbName')
  .post(
    controllerCreateBD.createDb,
  );

module.exports = router;
