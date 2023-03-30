import UsersModel from '../models/UsersModel';

class UsersService {
  private usersModel: typeof UsersModel;

  constructor(usersModel: typeof UsersModel) {
    this.usersModel = usersModel;
  }
  // public async login(email, password): Promise<> {

  // }
}

export default UsersService;
