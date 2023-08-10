const express = require('express');
const router = express.Router({ mergeParams: true });
const healthController = require('../controllers/health.controller');

router.get('/', healthController.health);

module.exports = router;
