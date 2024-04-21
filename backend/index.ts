import express, { Application } from 'express';
import { BaseEnvironment } from './Environment';
import cors from 'cors';
import UserRoutes from './routes/User/User.routes';
import merchantRoutes from './routes/Merchant/Merchant.routes';
import indexRoutes from './routes/index.routes';
const env = new BaseEnvironment();

const app: Application = express();
const apiVersion = '/api/v1';

app.use(express.json());
app.use(cors());

app.use(`${apiVersion}/`, indexRoutes);
app.use(`${apiVersion}/user`, UserRoutes);
app.use(`${apiVersion}/merchant`, merchantRoutes);

app.get('/health-check', (req, res) => {
    res.send('I am alive!');
});

app.listen(env.PORT, () => {
    console.log(`Server is running on ${env.HOST}:${env.PORT}`);
});
