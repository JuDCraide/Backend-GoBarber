import {
  format, getHours, isAfter, startOfHour,
} from 'date-fns';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequestDTO {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) { }

  public async run({ provider_id, user_id, date }: IRequestDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (provider_id === user_id) {
      throw new AppError('Cannot crate appointment with yourself');
    }

    if (isAfter(Date.now(), appointmentDate)) {
      throw new AppError('Cannot crate appointment on past date');
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError('Only able to crate appointments between 8am and 5pm');
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDateAndProvider({
      date: appointmentDate,
      provider_id,
    });

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy' às 'HH:mm");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento marcado para o dia ${dateFormatted}`,
    });

    const cacheKey = `provider-appointments:${provider_id}:${format(appointmentDate, 'yyyy-M-d')}`;
    await this.cacheProvider.invalidade(cacheKey);

    return appointment;
  }
}

export default CreateAppointmentService;
