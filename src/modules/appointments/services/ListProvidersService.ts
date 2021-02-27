import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private UsersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) { }

  public async run(
    user_id: string,
  ): Promise<User[]> {
    let users = await this.cacheProvider.recover<User[]>(`providers-list:${user_id}`);

    if (!users) {
      users = await this.UsersRepository.listProviders(user_id);
      console.log('Query foi feita');

      await this.cacheProvider.save(
        `providers-list:${user_id}`,
        users,
      );
    }

    return users;
  }
}

export default ListProvidersService;
