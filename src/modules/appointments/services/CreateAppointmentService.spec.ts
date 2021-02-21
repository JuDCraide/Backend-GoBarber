import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

import AppError from '@shared/errors/AppError';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.run({
      date: new Date(),
      provider_id: '124324342',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('124324342');
  });

  it('should not be able to create 2 appointment on the same time', async () => {
    const appointmentDate = new Date();

    await createAppointment.run({
      date: appointmentDate,
      provider_id: '124324342',
    });

    await expect(
      createAppointment.run({
        date: appointmentDate,
        provider_id: '124324342',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
