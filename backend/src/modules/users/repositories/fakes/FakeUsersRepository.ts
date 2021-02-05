import { v4 as uuid } from 'uuid';

import User from '@modules/users/infra/typeorm/entities/User';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllUsersDTO from '@modules/users/dtos/IFindAllUsersDTO';
import IFindUserByEmailDTO from '@modules/users/dtos/IFindUserByEmailDTO';
import IFindUserByIdDTO from '@modules/users/dtos/IFindUserByIdDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

export default class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findAll({
    except_user_id,
    without_password,
  }: IFindAllUsersDTO): Promise<User[]> {
    let users: User[];

    if (except_user_id) {
      users = [...this.users.filter(user => user.id !== except_user_id)];
    } else {
      users = [...this.users];
    }

    if (without_password) {
      return users.map(user => {
        const { password: omited, ...userWithoutPassword } = user;

        return userWithoutPassword as User;
      });
    }

    return users;
  }

  public async findById({
    user_id,
    without_password,
  }: IFindUserByIdDTO): Promise<User | undefined> {
    let findUser = this.users.find(user => user.id === user_id);

    if (findUser) {
      if (without_password) {
        const { password: omited, ...userWithoutPassword } = findUser;

        return userWithoutPassword as User;
      }

      findUser = { ...findUser };
    }

    return findUser;
  }

  public async findByEmail({
    user_email,
    without_password,
  }: IFindUserByEmailDTO): Promise<User | undefined> {
    let findUser = this.users.find(user => user.email === user_email);

    if (findUser) {
      if (without_password) {
        const { password: omited, ...userWithoutPassword } = findUser;

        return userWithoutPassword as User;
      }

      findUser = { ...findUser };
    }

    return findUser;
  }

  public async create(data: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid() }, data);

    this.users.push(user);

    return { ...user };
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return { ...user };
  }
}
