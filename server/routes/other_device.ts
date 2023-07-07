import Router, { Response, Request } from 'express';
const other_device = Router();

other_device.get('/', (_req: Request, res: Response) => res.send('this other device endpoint is ready to receive requests'));

export default other_device;


