import express from 'express';
import { getDeviceStatus, getSession, newSession, updateSession } from '../controllers/host.controller';

const router = express.Router({ mergeParams: true });

// host specific routes
router.get('/:deviceId/status', getDeviceStatus);

router.post('/session', newSession);
router.put('/session/:id', updateSession);
router.get('/session/:id', getSession);
router.patch('/session/:id', updateSession);

export default router;