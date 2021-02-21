import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to update user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Julia Craide',
      email: 'jdc@ex.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.run({
      user_id: user.id,
      name: 'Júlia D. Craide',
      email: 'judcraide@ex.com',
    });

    expect(updatedUser.name).toBe('Júlia D. Craide');
    expect(updatedUser.email).toBe('judcraide@ex.com');
  });

  it('should be not able to update non-existing user', async () => {
    await expect(
      updateProfile.run({
        user_id: 'invalidUser',
        name: 'invalidUser',
        email: 'invalid@user.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be no able to change email to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'Julia Craide1',
      email: 'jdc1@ex.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Julia Craide2',
      email: 'jdc2@ex.com',
      password: '123456',
    });

    await expect(
      updateProfile.run({
        user_id: user.id,
        name: 'Julia Craide2',
        email: 'jdc1@ex.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Julia Craide',
      email: 'jdc@ex.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.run({
      user_id: user.id,
      name: 'Júlia D. Craide',
      email: 'judcraide@ex.com',
      password: '654321',
      old_password: '123456',
    });

    expect(updatedUser.password).toBe('654321');
  });

  it('should be no able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Julia Craide',
      email: 'jdc@ex.com',
      password: '123456',
    });

    await expect(
      updateProfile.run({
        user_id: user.id,
        name: 'Júlia D. Craide',
        email: 'judcraide@ex.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be no able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Julia Craide',
      email: 'jdc@ex.com',
      password: '123456',
    });

    await expect(
      updateProfile.run({
        user_id: user.id,
        name: 'Júlia D. Craide',
        email: 'judcraide@ex.com',
        password: '654321',
        old_password: 'wrongPassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
