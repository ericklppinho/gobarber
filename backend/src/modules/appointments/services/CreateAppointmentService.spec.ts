import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeCacheProvider: FakeCacheProvider;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointmentsService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();

    createAppointmentsService = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await createAppointmentsService.execute({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: new Date(2020, 4, 10, 13),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider-id');
  });

  it('should not be able to create two appointments in the same hour', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointmentDate = new Date(2020, 4, 10, 13);

    await createAppointmentsService.execute({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: appointmentDate,
    });

    await expect(
      createAppointmentsService.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentsService.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: appointmentDate,
      }),
    ).rejects.toHaveProperty('message', 'This appointment is already booked');
  });

  it('should not be able to create an appointment an a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentsService.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: new Date(2020, 4, 10, 11),
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentsService.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: new Date(2020, 4, 10, 11),
      }),
    ).rejects.toHaveProperty(
      'message',
      "You can't create an appointment on a past date.",
    );
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentsService.execute({
        provider_id: 'user-id',
        user_id: 'user-id',
        date: new Date(2020, 4, 10, 13),
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentsService.execute({
        provider_id: 'user-id',
        user_id: 'user-id',
        date: new Date(2020, 4, 10, 13),
      }),
    ).rejects.toHaveProperty(
      'message',
      "You can't create an appointment with yourself.",
    );
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 10, 5).getTime();
    });

    await expect(
      createAppointmentsService.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: new Date(2020, 4, 10, 7),
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentsService.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: new Date(2020, 4, 10, 7),
      }),
    ).rejects.toHaveProperty(
      'message',
      'You can only create appointments between 8am and 5pm.',
    );

    await expect(
      createAppointmentsService.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: new Date(2020, 4, 10, 18),
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentsService.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: new Date(2020, 4, 10, 18),
      }),
    ).rejects.toHaveProperty(
      'message',
      'You can only create appointments between 8am and 5pm.',
    );
  });
});
