import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private UsersRepository: IUsersRepository,
  ) { }

  public async run(
    user_id: string,
  ): Promise<User[]> {
    const users = await this.UsersRepository.listProviders(user_id);

    return users;
  }
}

export default ListProvidersService;
