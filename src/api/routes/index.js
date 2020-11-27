const router = require('express').Router();

const simpleRouter = require('./simple.router');

router.use('/', simpleRouter);

module.exports = router;
