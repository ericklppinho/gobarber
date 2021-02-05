import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  user_id: string;
}

type IResponse = Omit<User, 'password'>[];

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<IResponse> {
    const users = await this.usersRepository.findAll({
      except_user_id: user_id,
      without_password: true,
    });

    return users;
  }
}

export default ListProvidersService;
