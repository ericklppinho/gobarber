import { getRepository, Repository, Not } from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllUsersDTO from '@modules/users/dtos/IFindAllUsersDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IFindUserByIdDTO from '@modules/users/dtos/IFindUserByIdDTO';
import IFindUserByEmailDTO from '@modules/users/dtos/IFindUserByEmailDTO';

export default class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findAll({
    except_user_id,
    without_password,
  }: IFindAllUsersDTO): Promise<User[]> {
    let users: User[];

    if (except_user_id) {
      users = await this.ormRepository.find({
        where: {
          id: Not(except_user_id),
        },
        select: without_password
          ? ['id', 'name', 'email', 'avatar', 'created_at', 'updated_at']
          : [
              'id',
              'name',
              'email',
              'password',
              'avatar',
              'created_at',
              'updated_at',
            ],
      });
    } else {
      users = await this.ormRepository.find({
        select: without_password
          ? ['id', 'name', 'email', 'avatar', 'created_at', 'updated_at']
          : [
              'id',
              'name',
              'email',
              'password',
              'avatar',
              'created_at',
              'updated_at',
            ],
      });
    }

    return users;
  }

  public async findById({
    user_id,
    without_password,
  }: IFindUserByIdDTO): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne(user_id, {
      select: without_password
        ? ['id', 'name', 'email', 'avatar', 'created_at', 'updated_at']
        : [
            'id',
            'name',
            'email',
            'password',
            'avatar',
            'created_at',
            'updated_at',
          ],
    });

    return findUser;
  }

  public async findByEmail({
    user_email,
    without_password,
  }: IFindUserByEmailDTO): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne({
      where: { email: user_email },
      select: without_password
        ? ['id', 'name', 'email', 'avatar', 'created_at', 'updated_at']
        : [
            'id',
            'name',
            'email',
            'password',
            'avatar',
            'created_at',
            'updated_at',
          ],
    });

    return findUser;
  }

  public async create(data: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(data);

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    await this.ormRepository.save(user);

    return user;
  }
}
