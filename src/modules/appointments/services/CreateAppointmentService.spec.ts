import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

import AppError from '@shared/errors/AppError';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository, fakeNotificationsRepository, fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2021, 4, 20, 9).getTime());

    const appointment = await createAppointment.run({
      date: new Date(2021, 4, 20, 11),
      provider_id: 'provider',
      user_id: 'user',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider');
  });

  it('should not be able to create 2 appointment on the same time from the same providers', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2021, 4, 20, 9).getTime());

    const appointmentDate = new Date(2021, 4, 20, 11);

    await createAppointment.run({
      date: appointmentDate,
      provider_id: 'provider',
      user_id: 'user',
    });

    await expect(
      createAppointment.run({
        date: appointmentDate,
        provider_id: 'provider',
        user_id: 'user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create 2 appointment on the same time from different providers', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2021, 4, 20, 9).getTime());

    const appointmentDate = new Date(2021, 4, 20, 11);

    const appointment1 = await createAppointment.run({
      date: appointmentDate,
      provider_id: 'provider1',
      user_id: 'user1',
    });

    const appointment2 = await createAppointment.run({
      date: appointmentDate,
      provider_id: 'provider2',
      user_id: 'user2',
    });

    expect(appointment1).toHaveProperty('id');
    expect(appointment1.provider_id).toBe('provider1');

    expect(appointment2).toHaveProperty('id');
    expect(appointment2.provider_id).toBe('provider2');
  });

  /*
  it('should not be able to create 2 appointment on the same time from the same user', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2021, 4, 20, 9).getTime());

    const appointmentDate = new Date(2021, 4, 20, 11);

    await createAppointment.run({
      date: appointmentDate,
      provider_id: 'provider1',
      user_id: 'user',
    });

    await expect(
      createAppointment.run({
        date: appointmentDate,
        provider_id: 'provider2',
        user_id: 'user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  }); */

  it('should not be able to create appointment in the past', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2021, 4, 20, 9).getTime());

    const appointmentDate = new Date(2021, 4, 20, 8);

    await expect(
      createAppointment.run({
        date: appointmentDate,
        provider_id: 'provider',
        user_id: 'user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointment with yourself', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2021, 4, 20, 9).getTime());

    const appointmentDate = new Date(2021, 4, 20, 11);

    await expect(
      createAppointment.run({
        date: appointmentDate,
        provider_id: 'provider',
        user_id: 'provider',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointment before 8am', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2021, 4, 20, 9).getTime());

    const appointmentDate = new Date(2021, 4, 21, 7);

    await expect(
      createAppointment.run({
        date: appointmentDate,
        provider_id: 'provider',
        user_id: 'user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointment after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2021, 4, 20, 9).getTime());

    const appointmentDate = new Date(2021, 4, 21, 18);

    await expect(
      createAppointment.run({
        date: appointmentDate,
        provider_id: 'provider',
        user_id: 'user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
