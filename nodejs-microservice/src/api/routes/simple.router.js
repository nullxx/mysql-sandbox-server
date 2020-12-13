const router = require('express').Router();

const {
  resumeDbFromSession,
  resumeDbFromSessionSoft,
  resumeDBData,
  closeResumedDbSession,
  closeResumedDbSessionError,
} = require('../middlewares/session.middleware');

const controllerCreateBD = require('../controllers/simple.create.controller');
const controllerManage = require('../controllers/simple.manage.controller');
const exportController = require('../controllers/export.controller');

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
    closeResumedDbSessionError,
    closeResumedDbSession,
  );

router
  .route('/createDB/:dbName')
  .post(
    controllerCreateBD.createDb,
  );

router
  .route('/export/dump')
  .post(
    resumeDBData,
    exportController.mysqlDump,
  );

module.exports = router;
