import express, { Application } from 'express';
import { BaseEnvironment } from './Environment';

const env = new BaseEnvironment();

const app: Application = express();

app.get('/health-check', (req, res) => {
    res.send('I am alive!');
});

app.listen(env.PORT, () => {
    console.log(`Server is running on ${env.HOST}:${env.PORT}`);
});
