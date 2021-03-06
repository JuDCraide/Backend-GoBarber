import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviders = new ListProvidersService(fakeUsersRepository, fakeCacheProvider);
  });

  it('should be able to list the provider', async () => {
    const u1 = await fakeUsersRepository.create({
      name: 'Júlia D. Craide1',
      email: 'judcraide1@ex.com',
      password: '123456',
    });

    const u2 = await fakeUsersRepository.create({
      name: 'Júlia D. Craide2',
      email: 'judcraide2@ex.com',
      password: '123456',
    });

    const u3 = await fakeUsersRepository.create({
      name: 'Júlia D. Craide3',
      email: 'judcraide3@ex.com',
      password: '123456',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'Logged User',
      email: 'loggedUser@ex.com',
      password: '123456',
    });

    const providers = await listProviders.run(loggedUser.id);

    expect(providers).toEqual([
      u1, u2, u3,
    ]);
  });
});
