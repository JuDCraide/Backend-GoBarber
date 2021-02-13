import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import User from '@modules/users/infra/typeorm/entities/User';

export default class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticateUser.run({
      email,
      password,
    });

    const noPasswordUser: Omit<User, 'password'> = user;

    return res.json({ noPasswordUser, token });
  }
}
