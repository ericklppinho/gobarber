import { getRepository } from 'typeorm';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

class AppointmentsRepository implements IAppointmentsRepository {
  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const ormRepository = getRepository(Appointment);

    const findAppointment = await ormRepository.findOne({
      where: { date },
    });

    return findAppointment;
  }

  public async create({
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const ormRepository = getRepository(Appointment);

    const appointment = ormRepository.create({ provider_id, date });

    await ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
