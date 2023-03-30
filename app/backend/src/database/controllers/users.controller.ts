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
    console.log(`email: ${email} password: ${password}`);
    const getUser = await this.usersService.login(email, password);
    console.log(getUser);
    return res.status(200).json(getUser);
  }
}
