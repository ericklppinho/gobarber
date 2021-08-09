import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import SessionsController from '@modules/users/infra/http/controllers/SessionsController';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(20).required(),
    },
  }),
  sessionsController.create,
);

export default sessionsRouter;
