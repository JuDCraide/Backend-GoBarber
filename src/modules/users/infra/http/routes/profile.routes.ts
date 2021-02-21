import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProfileController from '@modules/users/infra/http/controller/ProfileController';
import UserAvatarController from '@modules/users/infra/http/controller/UserAvatarController';

const profileRouter = Router();
const upload = multer(uploadConfig);

const profileController = new ProfileController();
const userAvatarController = new UserAvatarController();

profileRouter.use(ensureAuthenticated);

profileRouter.put(
  '/',
  profileController.update,
);

profileRouter.get(
  '/',
  profileController.show,
);

profileRouter.patch(
  '/avatar',
  upload.single('avatar'),
  userAvatarController.update,
);

export default profileRouter;
