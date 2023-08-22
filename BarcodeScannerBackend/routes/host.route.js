const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/host.controller');

// host specific routes
router.get('/status', controller.getStatus);

router.post('/session', controller.newSession);
router.get('/session/:id', controller.getSession);
router.put('/session/:id', controller.updateSession);

module.exports = router;
