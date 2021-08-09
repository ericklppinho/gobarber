import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';
import multer from 'multer';

import storageConfig from '@config/storage';

import ProfileController from '@modules/users/infra/http/controllers/ProfileController';
import UserAvatarController from '@modules/users/infra/http/controllers/UserAvatarController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticatedMiddleware';

const profileRouter = Router();
const profileController = new ProfileController();
const userAvatarController = new UserAvatarController();

const upload = multer(storageConfig.multer);

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', profileController.show);
profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
      old_password: Joi.string().min(6).max(20),
      password: Joi.when('old_password', {
        is: Joi.exist(),
        then: Joi.string().min(6).max(20).required(),
      }),
      password_confirmation: Joi.when('password', {
        is: Joi.exist(),
        then: Joi.valid(Joi.ref('password')).required(),
      }),
    },
  }),
  profileController.update,
);

profileRouter.patch(
  '/avatar',
  upload.single('avatar'),
  userAvatarController.update,
);

export default profileRouter;
