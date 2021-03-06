import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
  public async show(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;

    const showProfile = container.resolve(ShowProfileService);

    const user = await showProfile.run(user_id);

    return res.json(classToClass(user));
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;
    const {
      name, email, password, old_password,
    } = req.body;

    const updateProfile = container.resolve(UpdateProfileService);

    const user = await updateProfile.run({
      user_id,
      name,
      email,
      password,
      old_password,
    });

    return res.json(classToClass(user));
  }
}
