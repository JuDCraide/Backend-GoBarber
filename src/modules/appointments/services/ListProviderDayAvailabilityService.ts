import { inject, injectable } from 'tsyringe';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { getHours, isAfter } from 'date-fns';

interface Request {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type Response = Array<{
  hour: number;
  available: boolean;
}>

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) { }

  public async run({
    provider_id, day, month, year,
  }: Request): Promise<Response> {
    const hourStart = 8;
    const currentDate = new Date(Date.now());

    const eachHourInDay = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    );

    const appointments = await this.appointmentsRepository.listAllInDayFromProvider({
      provider_id,
      day,
      month,
      year,
    });

    const availability = eachHourInDay.map((hour) => {
      const hasAppointmentInHour = appointments.find(
        (appointment) => getHours(appointment.date) === hour,
      );

      const appointmentDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !hasAppointmentInHour && isAfter(appointmentDate, currentDate),
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
