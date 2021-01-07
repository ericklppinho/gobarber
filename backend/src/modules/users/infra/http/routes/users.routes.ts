import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import UserAvatarController from '@modules/users/infra/http/controller/UserAvatarController';
import UsersController from '@modules/users/infra/http/controller/UsersController';

const usersRouter = Router();
const userAvatarController = new UserAvatarController();
const usersController = new UsersController();
const upload = multer(uploadConfig);

usersRouter.post('/', usersController.create);

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
);

export default usersRouter;
