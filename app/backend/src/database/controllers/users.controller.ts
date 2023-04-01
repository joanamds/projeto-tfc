import { Request, Response } from 'express';
import UsersModel from '../models/UsersModel';
import UsersService from '../services/users.service';
import LoginValidation from '../validations/loginValidation';

export default class TeamsController {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService(UsersModel);
  }

  public async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const validate = new LoginValidation(email, password);

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    const getUser = await this.usersService.login(email, password);

    if (!getUser || !validate.validateEmail() || !validate.validatePassword()) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.status(200).json(getUser);
  }
}
