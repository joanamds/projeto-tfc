import { Model, DataTypes } from 'sequelize';
import db from '.';

class TeamsModel extends Model {
  public id!: number;
  public teamName!: string;
}

TeamsModel.init({
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  },
  teamName: {
    type: DataTypes.STRING,
    field: 'team_name',
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  timestamps: false,
});

export default TeamsModel;
