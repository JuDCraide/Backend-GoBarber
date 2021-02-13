import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';
import User from '@modules/users/infra/typeorm/entities/User';

export default class UsersController {
  public async create(req: Request, res: Response): Promise < Response > {
    const { name, email, password } = req.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.run({
      name,
      email,
      password,
    });

    const noPasswordUser: Omit<User, 'password'> = user;

    return res.json(noPasswordUser);
  }
}
