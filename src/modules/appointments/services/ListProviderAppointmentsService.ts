import { inject, injectable } from 'tsyringe';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface Request {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) { }

  public async run({
    provider_id, day, month, year,
  }: Request): Promise<Appointment[]> {
    // const cData = await this.cacheProvider.recover('asd');
    // console.log(cData);

    const appointments = await this.appointmentsRepository.listAllInDayFromProvider({
      provider_id,
      day,
      month,
      year,
    });

    // await this.cacheProvider.save('asd', 'asd2');

    return appointments;
  }
}

export default ListProviderAppointmentsService;
