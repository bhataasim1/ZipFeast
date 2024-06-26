import express, { Application } from 'express';
import { BaseEnvironment } from './Environment';
import cors from 'cors';
import UserRoutes from './routes/User/User.routes';
import merchantRoutes from './routes/Merchant/Merchant.routes';
import indexRoutes from './routes/index.routes';
import productRoutes from './routes/Merchant/Product.routes';
import userOrderRoutes from './routes/order/order.routes';
import merchantOrderRoutes from './routes/order/MerchantOrder.routes';
import { sendApiResponseMiddleware } from './middleware';

const env = new BaseEnvironment();

const app: Application = express();
const apiVersion = '/api/v1';

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(sendApiResponseMiddleware);

app.use(`${apiVersion}/`, indexRoutes);
app.use(`${apiVersion}/user`, UserRoutes);
app.use(`${apiVersion}/user/order`, userOrderRoutes);
app.use(`${apiVersion}/merchant`, merchantRoutes);
app.use(`${apiVersion}/merchant/product`, productRoutes);
app.use(`${apiVersion}/merchant/order`, merchantOrderRoutes);

app.get('/health-check', (req, res) => {
    return res.send('I am alive!');
});

app.get('/', (req, res) => {
    return res.send('Welcome to Zipfeast API');
});

app.listen(env.PORT, () => {
    console.log(`Server is running on ${env.HOST}:${env.PORT}`);
});
