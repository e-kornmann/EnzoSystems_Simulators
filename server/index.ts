import express, { Application, Request, Response } from 'express';
import payment_terminal from './routes/payment_terminal';
import other_device from './routes/other_device';
import cors from 'cors';

const app: Application = express();
const port = 8003;

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://lorem.ipsum.vite.app'],
}));

app.use('/payment_terminal', payment_terminal);
app.use('/other_device', other_device);

app.get('/', (_req: Request, res: Response) => res.send('API is running'));

app.listen(port, () => console.log(`Server is listening on ${port}`));