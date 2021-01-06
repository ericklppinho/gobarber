import 'reflect-metadata'; // First

import cors from 'cors';
import express from 'express';
import 'express-async-errors';

import uploadConfig from '@config/upload';

import routes from '@shared/infra/http/routes';
import globalErrorHandler from '@shared/infra/http/middlewares/globalErrorHandler';
import '@shared/infra/typeorm';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);
app.use(globalErrorHandler);

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333!');
});
