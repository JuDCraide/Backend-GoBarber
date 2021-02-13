import path from 'path';
import fs from 'fs';
import uploadConfig from '@config/upload';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface Request {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private UsersRepository: IUsersRepository,
  ) { }

  public async run({ user_id, avatarFilename }: Request): Promise<User> {
    const user = await this.UsersRepository.findById(user_id);
    if (!user) {
      throw new AppError('Only authenticated users can change avatar');
    }
    if (user.avatar) {
      // Deletar avatar anterior
      const UserAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(UserAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(UserAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;
    await this.UsersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
