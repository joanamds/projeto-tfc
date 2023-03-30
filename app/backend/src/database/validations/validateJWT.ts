import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import UsersModel from '../models/UsersModel';

const secret = process.env.JWT_SECRET || 'mysecretkey';
const jwtConfig = {
  expiresIn: '7d',
};

export class ValidateJWT {
  private usersModel: typeof UsersModel;

  constructor(usersModel: typeof UsersModel) {
    this.usersModel = usersModel;
  }

  public async validateToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Token not found' });
    try {
      const decoded = jwt.verify(token, secret) as { id: string, role: string };
      const user = await this.usersModel.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Token must be a valid token' });
      }
      res.locals.user = user;
      next();
    } catch (e) {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }
  }
}

export { secret, jwtConfig };
