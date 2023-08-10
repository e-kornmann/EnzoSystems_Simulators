const express = require('express');
const router = express.Router({ mergeParams: true });
const logonController = require('../controllers/logon.controller');

router.post('/', logonController.logon);

module.exports = router;
