import { v4 as uuid } from 'uuid';
import {
  isEqual, getMonth, getYear, getDate,
} from 'date-fns';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentsDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO';
import IListAllInMonthFromProviderDTO from '@modules/appointments/dtos/IListAllInMonthFromProviderDTO';
import IListAllInDayFromProviderDTO from '@modules/appointments/dtos/IListAllInDayFromProviderDTO';
import IFindByDateAndProvider from '@modules/appointments/dtos/IFindByDateAndProvider';

class FakeAppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async listAllInDayFromProvider({
    provider_id, day, month, year,
  }: IListAllInDayFromProviderDTO): Promise<Appointment[]> {
    const findAppointment = this.appointments.filter(
      (appointment) => (
        appointment.provider_id === provider_id
        && getDate(appointment.date) === day
        && getMonth(appointment.date) + 1 === month
        && getYear(appointment.date) === year),
    );
    return findAppointment;
  }

  public async listAllInMonthFromProvider(
    { provider_id, month, year }: IListAllInMonthFromProviderDTO,
  ): Promise<Appointment[]> {
    const findAppointment = this.appointments.filter(
      (appointment) => (
        appointment.provider_id === provider_id
        && getMonth(appointment.date) + 1 === month
        && getYear(appointment.date) === year),
    );
    return findAppointment;
  }

  public async findByDateAndProvider({
    date, provider_id,
  }: IFindByDateAndProvider): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      (appointment) => isEqual(appointment.date, date) && appointment.provider_id === provider_id,
    );

    return findAppointment;
  }

  public async create({
    provider_id, user_id, date,
  }: ICreateAppointmentsDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, {
      id: uuid(), date, provider_id, user_id,
    });

    this.appointments.push(appointment);

    return appointment;
  }
}

export default FakeAppointmentsRepository;
