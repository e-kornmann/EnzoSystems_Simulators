const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/device.controller');

// device specific routes
router.put('/status', controller.setStatus);

router.get('/active-session', controller.getSession);
router.put('/active-session', controller.updateSession);

module.exports = router;
