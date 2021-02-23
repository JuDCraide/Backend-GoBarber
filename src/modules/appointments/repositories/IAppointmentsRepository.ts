import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import ICreateAppointmentsDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO';
import IListAllInMonthFromProviderDTO from '@modules/appointments/dtos/IListAllInMonthFromProviderDTO';
import IListAllInDayFromProviderDTO from '@modules/appointments/dtos/IListAllInDayFromProviderDTO';
import IFindByDateAndProvider from '@modules/appointments/dtos/IFindByDateAndProvider';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentsDTO):Promise<Appointment>;
  findByDateAndProvider(data: IFindByDateAndProvider): Promise<Appointment | undefined>;
  listAllInMonthFromProvider(data: IListAllInMonthFromProviderDTO): Promise<Appointment[]>;
  listAllInDayFromProvider(data: IListAllInDayFromProviderDTO): Promise<Appointment[]>;
};
