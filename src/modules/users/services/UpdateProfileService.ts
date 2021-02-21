import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/model/IHashProvider';

interface Request {
  user_id: string,
  name: string,
  email: string,
  old_password?: string,
  password?: string,
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private UsersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) { }

  public async run({
    user_id, name, email, password, old_password,
  }: Request): Promise<User> {
    const user = await this.UsersRepository.findById(user_id);
    if (!user) {
      throw new AppError('Only authenticated users can change avatar');
    }

    const userWithUpdatedEmail = await this.UsersRepository.findByEmail(email);
    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError('Email already in use');
    }

    user.name = name;
    user.email = email;

    if (password) {
      if (!old_password) {
        throw new AppError('Old password needed to update password');
      }

      const checkOldPassword = await this.hashProvider.compareHash(old_password, user.password);
      if (!checkOldPassword) {
        throw new AppError('Old password does not match');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    await this.UsersRepository.save(user);

    return user;
  }
}

export default UpdateProfileService;
