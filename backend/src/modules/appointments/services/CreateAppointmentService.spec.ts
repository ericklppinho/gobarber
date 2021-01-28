import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentsService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointmentsService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointmentsService.execute({
      date: new Date(),
      provider_id: '123123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123');
  });

  it('should not be able to create two appointments in the same hour', async () => {
    const appointmentDate = new Date(2020, 4, 10, 11);

    await createAppointmentsService.execute({
      date: appointmentDate,
      provider_id: '123123',
    });

    await expect(
      createAppointmentsService.execute({
        date: appointmentDate,
        provider_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
