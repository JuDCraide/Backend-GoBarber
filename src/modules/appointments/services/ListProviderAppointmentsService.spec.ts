/* eslint-disable no-await-in-loop */
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointments from '@modules/appointments/services/ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointments;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderAppointments = new ListProviderAppointments(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the daily appointments from a provider', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2021, 4, 20, 10, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2021, 4, 20, 12, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider2',
      user_id: 'user',
      date: new Date(2021, 4, 20, 14, 0, 0),
    });

    const appointments = await listProviderAppointments.run({
      provider_id: 'provider',
      day: 20,
      month: 5,
      year: 2021,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
