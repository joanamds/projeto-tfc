import { Sequelize } from 'sequelize';
import TeamsModel from '../models/TeamsModel';
import MatchesModel from '../models/MatchesModel';

export default class LeaderboardService {
  private sequelize: Sequelize;
  private teamsModel: typeof TeamsModel;
  private matchesModel: typeof MatchesModel;

  constructor(
    sequelize: Sequelize,
    teamsModel: typeof TeamsModel,
    matchesModel: typeof MatchesModel,
  ) {
    this.sequelize = sequelize;
    this.teamsModel = teamsModel;
    this.matchesModel = matchesModel;
  }

  public async totalGames(): Promise<{ name: string, totalGames: number }[]> {
    const result = await this.sequelize.query(
      `
      SELECT
      teams.team_name AS name,
      COUNT(*) AS totalGames
      FROM teams
      JOIN matches
      ON teams.id = matches.home_team_id
      OR teams.id = matches.away_team_id AND matches.in_progress = false
      GROUP BY teams.id;
      `,
      { type: 'SELECT' },
    );
    return result as { name: string, totalGames: number }[];
  }
}
