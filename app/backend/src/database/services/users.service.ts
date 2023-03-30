import UsersModel from '../models/UsersModel';

class UsersService {
  private usersModel: typeof UsersModel;

  constructor(usersModel: typeof UsersModel) {
    this.usersModel = usersModel;
  }

  public async login(email: string, password: string) {
    const response = await this.usersModel.findAll({ where: { email, password } });
    return response;
  }
}

export default UsersService;
