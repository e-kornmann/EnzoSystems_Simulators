const express = require('express');
const router = express.Router({ mergeParams: true });
const hostController = require('../controllers/host.controller');

// host specific routes
router.get('/:deviceId/status', hostController.getDeviceStatus);

router.post('/session', hostController.newSession);
router.put('/session/:id', hostController.updateSession);
router.patch('/session/:id', hostController.updateSession);
router.get('/session/:id', hostController.getSession);

module.exports = router;
