const express = require('express');
const router = express.Router({ mergeParams: true });
const deviceController = require('../controllers/device.controller');

// host specific routes
router.get('/status', deviceController.getDeviceStatus);
router.put('/mode', deviceController.setDeviceMode);
router.get('/scan', deviceController.getScan);

// device specific routes
router.put('/status', deviceController.setDeviceStatus);
router.post('/scan', deviceController.newScan);

// shared routes
router.get('/mode', deviceController.getDeviceMode);

module.exports = router;
