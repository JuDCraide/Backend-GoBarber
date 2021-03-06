import { v4 as uuid } from 'uuid';
import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUsersDTO from '@modules/users/dtos/ICreateUserDTO';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async listProviders(except_user_id?: string): Promise<User[]> {
    let wantedUsers = this.users;

    if (except_user_id) {
      wantedUsers = wantedUsers.filter((u) => u.id !== except_user_id);
    }

    return wantedUsers;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find((u) => u.email === email);

    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.users.find((u) => u.id === id);

    return user;
  }

  public async create(userData: ICreateUsersDTO): Promise<User> {
    const user = new User();
    Object.assign(user, { id: uuid() }, userData);

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const userIndex = this.users.findIndex((findUser) => findUser.id === user.id);

    this.users[userIndex] = user;

    return user;
  }
}

export default FakeUsersRepository;
