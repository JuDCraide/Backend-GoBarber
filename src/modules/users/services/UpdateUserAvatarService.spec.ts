import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository : FakeUsersRepository;
let fakeStorageProvider : FakeStorageProvider;
let UpdateUserAvatar : UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    UpdateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);
  });

  it('should be able update user avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Julia Craide',
      email: 'jdc@ex.com',
      password: '123456',
    });

    const updatedUser = await UpdateUserAvatar.run({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(updatedUser.avatar).toBe('avatar.jpg');
  });

  it('should be not able update avatar from non-existing user', async () => {
    await expect(UpdateUserAvatar.run({
      user_id: 'invalidUser',
      avatarFilename: 'avatar.jpg',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should be able delete old avatar while updating user avatar', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'Julia Craide',
      email: 'jdc@ex.com',
      password: '123456',
    });

    await UpdateUserAvatar.run({
      user_id: user.id,
      avatarFilename: 'avatar1.jpg',
    });

    const updatedUser = await UpdateUserAvatar.run({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg',
    });

    expect(deleteFile).toBeCalledWith('avatar1.jpg');
    expect(updatedUser.avatar).toBe('avatar2.jpg');
  });
});
