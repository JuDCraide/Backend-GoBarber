import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from '@modules/users/services/ShowProfileService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show the profile', async () => {
    const { id } = await fakeUsersRepository.create({
      name: 'Júlia D. Craide',
      email: 'judcraide@ex.com',
      password: '123456',
    });

    const user = await showProfile.run(id);

    expect(user.name).toBe('Júlia D. Craide');
    expect(user.email).toBe('judcraide@ex.com');
  });

  it('should be not able to show non-existing profile', async () => {
    await expect(
      showProfile.run('invalidID'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
