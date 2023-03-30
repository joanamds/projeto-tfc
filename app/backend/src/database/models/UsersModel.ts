import { Model, DataTypes } from 'sequelize';
import db from '.';

class UsersModel extends Model {
  public id!: number;
  public username!: string;
  public role!: string;
  public email!: string;
  declare password: string;
}

UsersModel.init({
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    field: 'username',
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    field: 'role',
  },
  email: {
    type: DataTypes.STRING,
    field: 'email',
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    field: 'password',
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'users',
  timestamps: false,
});

export default UsersModel;
