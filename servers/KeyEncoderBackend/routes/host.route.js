const express = require('express');
const router = express.Router({ mergeParams: true });
const hostController = require('../controllers/host.controller');

// host specific routes
router.get('/status', hostController.getStatus);

router.post('/session', hostController.postSession);
router.put('/session/:id', hostController.putSession);
router.get('/session/:id', hostController.getSession);
// router.delete('/session/:id', hostController.deleteSession);
// router.get('/key/:id', hostController.getKey);

module.exports = router;
