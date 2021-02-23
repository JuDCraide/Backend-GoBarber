import { getRepository, Repository, Raw } from 'typeorm';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentsDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO';
import IListAllInMonthFromProviderDTO from '@modules/appointments/dtos/IListAllInMonthFromProviderDTO';
import IListAllInDayFromProviderDTO from '@modules/appointments/dtos/IListAllInDayFromProviderDTO';
import IFindByDateAndProvider from '@modules/appointments/dtos/IFindByDateAndProvider';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async listAllInDayFromProvider({
    provider_id, day, month, year,
  }: IListAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');
    const parsedDay = String(day).padStart(2, '0');

    const findAppointment = this.ormRepository.find({
      where: {
        provider_id,
        date: Raw((dateFieldName) => `
          to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'
        `),
      },
    });

    return findAppointment;
  }

  public async listAllInMonthFromProvider(
    { provider_id, month, year }: IListAllInMonthFromProviderDTO,
  ): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');

    const findAppointment = this.ormRepository.find({
      where: {
        provider_id,
        date: Raw((dateFieldName) => `
          to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'
        `),
      },
    });

    return findAppointment;
  }

  public async findByDateAndProvider({
    provider_id, date,
  }: IFindByDateAndProvider): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    });

    return findAppointment || undefined;
  }

  public async create({
    provider_id, user_id, date,
  }: ICreateAppointmentsDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({ provider_id, user_id, date });

    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
