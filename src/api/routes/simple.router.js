const router = require('express').Router();
const { resumeDbFromSession } = require('../middlewares/session');

const controllerCreateBD = require('../controllers/simple.create.controller');
const controllerManage = require('../controllers/simple.manage.controller');

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
