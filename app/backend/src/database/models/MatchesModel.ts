import { Model, DataTypes } from 'sequelize';
import db from '.';

import TeamsModel from './TeamsModel';

class MatchesModel extends Model {
  public id!: number;
  public homeTeamId!: number;
  public awayTeamId!: number;
  public homeTeamGoals!: number;
  public awayTeamGoals!: number;
  public inProgress!: boolean;

  public homeTeam!: TeamsModel;
  public awayTeam!: TeamsModel;
}

MatchesModel.init({
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  },
  homeTeamId: {
    type: DataTypes.INTEGER,
    field: 'home_team_id',
  },
  awayTeamId: {
    type: DataTypes.INTEGER,
    field: 'away_team_id',
  },
  homeTeamGoals: {
    type: DataTypes.INTEGER,
    field: 'home_team_goals',
  },
  awayTeamGoals: {
    type: DataTypes.INTEGER,
    field: 'away_team_goals',
  },
  inProgress: {
    type: DataTypes.BOOLEAN,
    field: 'in_progress',
  },
}, {
  underscored: true,
  sequelize: db,
  timestamps: false,
});

MatchesModel.belongsTo(TeamsModel, { foreignKey: 'homeTeamId', as: 'homeTeam' });
MatchesModel.belongsTo(TeamsModel, { foreignKey: 'awayTeamId', as: 'awayTeam' });

TeamsModel.hasMany(MatchesModel, { foreignKey: 'homeTeamId' });
TeamsModel.hasMany(MatchesModel, { foreignKey: 'awayTeamId' });

export default MatchesModel;
