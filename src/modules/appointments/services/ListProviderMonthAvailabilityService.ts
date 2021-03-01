import { inject, injectable } from 'tsyringe';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

interface Request {
  provider_id: string;
  month: number;
  year: number;
}

type Response = Array<{
  day: number;
  available: boolean;
}>

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) { }

  public async run({ provider_id, month, year }: Request): Promise<Response> {
    const currentDate = new Date(Date.now());
    const numberOfDays = getDaysInMonth(new Date(year, month - 1));

    const eachDayInMonth = Array.from(
      { length: numberOfDays },
      (_, index) => index + 1,
    );

    const appointments = await this.appointmentsRepository.listAllInMonthFromProvider({
      provider_id,
      month,
      year,
    });

    const availability = eachDayInMonth.map((day) => {
      const compareDate = new Date(year, month - 1, day, 23, 59, 59);

      const appointmentsInDay = appointments.filter(
        (appointment) => getDate(appointment.date) === day,
      );

      return {
        day,
        available: isAfter(compareDate, currentDate) && appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
