import * as bcryptjs from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import UsersModel from '../models/UsersModel';

class UsersService {
  private usersModel: typeof UsersModel;

  constructor(usersModel: typeof UsersModel) {
    this.usersModel = usersModel;
  }

  public async login(email: string, pw: string) {
    const user = await this.usersModel.findOne({ where: { email } });
    if (user) {
      const { password } = user.dataValues;
      const isRightPassword = await bcryptjs.compare(pw, password);
      if (isRightPassword) {
        const token = jwt.sign(
          { id: user.dataValues.id, role: user.dataValues.role },
          process.env.JWT_SECRET || 'mysecretkey',
          { expiresIn: '7d' },
        );
        return { token };
      }
    }
    return null;
  }
}

export default UsersService;
