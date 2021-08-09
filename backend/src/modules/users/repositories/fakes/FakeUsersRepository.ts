import { v4 as uuid } from 'uuid';

import User from '@modules/users/infra/typeorm/entities/User';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllUsersDTO from '@modules/users/dtos/IFindAllUsersDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

export default class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findAll({ except_user_id }: IFindAllUsersDTO): Promise<User[]> {
    let users: User[];

    if (except_user_id) {
      users = [...this.users.filter(user => user.id !== except_user_id)];
    } else {
      users = [...this.users];
    }

    return users;
  }

  public async findById(user_id: string): Promise<User | undefined> {
    let findUser = this.users.find(user => user.id === user_id);

    if (findUser) {
      findUser = { ...findUser } as User;
    }

    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    let findUser = this.users.find(user => user.email === email);

    if (findUser) {
      findUser = { ...findUser } as User;
    }

    return findUser;
  }

  public async create(data: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid() }, data);

    this.users.push(user);

    return { ...user } as User;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return { ...user } as User;
  }
}
