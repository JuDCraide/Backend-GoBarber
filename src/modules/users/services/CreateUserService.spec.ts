import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.run({
      name: 'Julia Craide',
      email: 'jdc@ex.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with repeated email', async () => {
    await createUser.run({
      name: 'Julia Craide',
      email: 'jdc@ex.com',
      password: '123456',
    });

    await expect(createUser.run({
      name: 'Julia Craide',
      email: 'jdc@ex.com',
      password: '123456',
    })).rejects.toBeInstanceOf(AppError);
  });
});
