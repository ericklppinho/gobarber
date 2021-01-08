import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

describe('CreateUser', async () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createUsersService = new CreateUserService(fakeUsersRepository);

    const user = await createUsersService.execute({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with email from another', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createUsersService = new CreateUserService(fakeUsersRepository);

    await createUsersService.execute({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '123456',
    });

    expect(
      createUsersService.execute({
        name: 'John Doe',
        email: 'johndoe@exemple.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
