import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';

import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository : FakeUsersRepository;
let fakeMailProvider : FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover password using email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'Julia Craide',
      email: 'jdc@ex.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.run({
      email: 'jdc@ex.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover the password of a non-existing user', async () => {
    await expect(sendForgotPasswordEmail.run({
      email: 'jdc@ex.com',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Julia Craide',
      email: 'jdc@ex.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.run({
      email: 'jdc@ex.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
