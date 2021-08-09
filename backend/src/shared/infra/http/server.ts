import 'reflect-metadata'; // First
import 'dotenv/config';

import { errors } from 'celebrate';
import cors from 'cors';
import express from 'express';
import 'express-async-errors';

import storageConfig from '@config/storage';

import '@shared/container';
import '@shared/infra/typeorm';

import globalErrorHandlerMiddleware from '@shared/infra/http/middlewares/globalErrorHandlerMiddleware';
import rateLimiterMiddleware from '@shared/infra/http/middlewares/rateLimiterMiddleware';
import routes from '@shared/infra/http/routes';

const app = express();

if (storageConfig.driver !== 'disk') {
  app.use(rateLimiterMiddleware);
}
app.use(cors());
app.use(express.json());
if (storageConfig.driver === 'disk') {
  app.use('/files', express.static(storageConfig.config.disk.storageFolder));
  app.use(rateLimiterMiddleware); // para o rateLimiter não se aplicar a rota /files
}
app.use(routes);
app.use(errors());
app.use(globalErrorHandlerMiddleware);

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333!');
});
