import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllAppointmentsInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllAppointmentsInDayFromProviderDTO';
import IFindAllAppointmentsInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllAppointmentsInMonthFromProviderDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
  findAllInMonthFromProvider(
    data: IFindAllAppointmentsInMonthFromProviderDTO,
  ): Promise<Appointment[]>;
  findAllInDayFromProvider(
    data: IFindAllAppointmentsInDayFromProviderDTO,
  ): Promise<Appointment[]>;
}
