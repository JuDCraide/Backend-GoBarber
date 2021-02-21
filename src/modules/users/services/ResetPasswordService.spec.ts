import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Julia Craide',
      email: 'jdc@ex.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const hash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.run({
      password: '654321',
      token,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(hash).toBeCalledWith('654321');
    expect(updatedUser?.password).toBe('654321');
  });

  it('should not be able to reset the password with non-existing token', async () => {
    await expect(resetPasswordService.run({
      password: '654321',
      token: 'non-existing',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password from non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate('non-existing');

    await expect(resetPasswordService.run({
      password: '654321',
      token,
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password more than two hours later', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Julia Craide',
      email: 'jdc@ex.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(resetPasswordService.run({
      password: '654321',
      token,
    })).rejects.toBeInstanceOf(AppError);
  });
});
