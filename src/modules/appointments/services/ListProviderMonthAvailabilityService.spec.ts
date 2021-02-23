/* eslint-disable no-await-in-loop */
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2021, 3, 20, 8, 0, 0),
    });

    for (let i = 8; i <= 17; i += 1) {
      await fakeAppointmentsRepository.create({
        provider_id: 'provider',
        user_id: 'user',
        date: new Date(2021, 4, 20, i, 0, 0),
      });
      await fakeAppointmentsRepository.create({
        provider_id: 'provider',
        user_id: 'user',
        date: new Date(2021, 4, 22, i, 0, 0),
      });
    }

    const availability = await listProviderMonthAvailability.run({
      provider_id: 'provider',
      year: 2021,
      month: 5,
    });

    expect(availability).toEqual(expect.arrayContaining([
      { day: 20, available: false },
      { day: 21, available: true },
      { day: 22, available: false },
    ]));
  });
});
