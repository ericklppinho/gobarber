import 'reflect-metadata'; // First

import cors from 'cors';
import express from 'express';
import 'express-async-errors';

import uploadConfig from '@config/upload';

import '@shared/container';
import '@shared/infra/typeorm';

import routes from '@shared/infra/http/routes';
import globalErrorHandler from '@shared/infra/http/middlewares/globalErrorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);
app.use(globalErrorHandler);

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333!');
});
