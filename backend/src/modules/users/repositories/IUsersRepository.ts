import User from '@modules/users/infra/typeorm/entities/User';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllUsersDTO from '@modules/users/dtos/IFindAllUsersDTO';
import IFindUserByEmailDTO from '@modules/users/dtos/IFindUserByEmailDTO';
import IFindUserByIdDTO from '@modules/users/dtos/IFindUserByIdDTO';

export default interface IUsersRepository {
  findAll(data: IFindAllUsersDTO): Promise<User[]>;
  findById(data: IFindUserByIdDTO): Promise<User | undefined>;
  findByEmail(data: IFindUserByEmailDTO): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
