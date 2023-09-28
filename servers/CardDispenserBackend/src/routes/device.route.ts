import express from 'express';
import { getActiveSession, updateActiveSession, setStatus } from '../controllers/device.controller';

const router = express.Router({ mergeParams: true });

// device specific routes
router.put('/status', setStatus);

router.get('/active-session', getActiveSession);
router.put('/active-session', updateActiveSession);

export default router;
