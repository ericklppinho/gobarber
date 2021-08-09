import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import UsersController from '@modules/users/infra/http/controllers/UsersController';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(20).required(),
      password_confirmation: Joi.valid(Joi.ref('password')).required(),
    },
  }),
  usersController.create,
);

export default usersRouter;
