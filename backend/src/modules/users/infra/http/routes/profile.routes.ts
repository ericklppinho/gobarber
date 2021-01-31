import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';

import ProfileController from '@modules/users/infra/http/controller/ProfileController';
import UserAvatarController from '@modules/users/infra/http/controller/UserAvatarController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const profileRouter = Router();
const profileController = new ProfileController();
const userAvatarController = new UserAvatarController();

const upload = multer(uploadConfig);

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', profileController.show);
profileRouter.put('/', profileController.update);

profileRouter.patch(
  '/avatar',
  upload.single('avatar'),
  userAvatarController.update,
);

export default profileRouter;
