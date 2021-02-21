import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let authenticateUser: AuthenticateUserService;
let createUser: CreateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to authenticate', async () => {
    const user = await createUser.run({
      name: 'Julia Craide',
      email: 'jdc@ex.com',
      password: '123456',
    });

    const response = await authenticateUser.run({
      email: 'jdc@ex.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with none existing user', async () => {
    await expect(authenticateUser.run({
      email: 'jdc@ex.com',
      password: '123456',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await createUser.run({
      name: 'Julia Craide',
      email: 'jdc@ex.com',
      password: '123456',
    });

    await expect(authenticateUser.run({
      email: 'jdc@ex.com',
      password: 'wrongPassword',
    })).rejects.toBeInstanceOf(AppError);
  });
});
