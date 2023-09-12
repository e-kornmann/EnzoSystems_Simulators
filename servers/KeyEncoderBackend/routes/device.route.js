const express = require('express');
const router = express.Router({ mergeParams: true });
const deviceController = require('../controllers/device.controller');

// device specific routes
router.put('/status', deviceController.setStatus);

router.get('/active-session', deviceController.getActiveSession);
router.put('/active-session', deviceController.putActiveSession);

module.exports = router;
