import express from 'express';
import { logon } from '../controllers/logon.controller';

const router = express.Router({ mergeParams: true });

router.post('/', logon);

export default router;
