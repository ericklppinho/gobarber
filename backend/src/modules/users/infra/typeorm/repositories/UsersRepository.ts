import { getRepository } from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

export default class UsersRepository implements IUsersRepository {
  public async findById(id: string): Promise<User | undefined> {
    const ormRepository = getRepository(User);

    const findUser = await ormRepository.findOne(id);

    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const ormRepository = getRepository(User);

    const findUser = await ormRepository.findOne({
      where: { email },
    });

    return findUser;
  }

  public async create(data: ICreateUserDTO): Promise<User> {
    const ormRepository = getRepository(User);

    const user = ormRepository.create(data);

    await ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const ormRepository = getRepository(User);

    await ormRepository.save(user);

    return user;
  }
}
