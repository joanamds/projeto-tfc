import { Request, Response } from 'express';
import UsersModel from '../models/UsersModel';
import UsersService from '../services/users.service';

export default class TeamsController {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService(UsersModel);
  }

  public async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }
    const getUser = await this.usersService.login(email, password);
    if (!getUser) {
      return res.status(400).json({ message: 'Incorrect email or password' });
    }
    return res.status(200).json(getUser);
  }
}
