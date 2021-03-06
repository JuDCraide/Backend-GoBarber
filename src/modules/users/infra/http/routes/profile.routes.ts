import { Router } from 'express';
import multer from 'multer';
import { celebrate, Segments, Joi } from 'celebrate';
import uploadConfig from '@config/upload';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProfileController from '@modules/users/infra/http/controller/ProfileController';
import UserAvatarController from '@modules/users/infra/http/controller/UserAvatarController';

const profileRouter = Router();
const upload = multer(uploadConfig.multer);

const profileController = new ProfileController();
const userAvatarController = new UserAvatarController();

profileRouter.use(ensureAuthenticated);

profileRouter.put('/', celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    old_password: Joi.string(),
    password: Joi.string(),
    password_confirmation: Joi.string().valid(Joi.ref('password')),
  },
}), profileController.update);

profileRouter.get('/', profileController.show);

profileRouter.patch(
  '/avatar',
  upload.single('avatar'),
  userAvatarController.update,
);

export default profileRouter;
