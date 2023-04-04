import { Sequelize } from 'sequelize';
import TeamsModel from '../models/TeamsModel';
import MatchesModel from '../models/MatchesModel';

export default class HLeaderboardService {
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
      SELECT teams.team_name AS name,
      COUNT(*) AS totalGames
      FROM teams
      JOIN matches
      ON teams.id = matches.home_team_id AND matches.in_progress = false
      OR teams.id = matches.away_team_id AND matches.in_progress = false
      GROUP BY teams.id;
      `,
      { type: 'SELECT' },
    );
    return result as { name: string, totalGames: number }[];
  }

  public async totalVictories(): Promise<{ name: string, totalVictories: number }[]> {
    const result = await this.sequelize.query(
      `SELECT teams.team_name AS name,
      SUM(CASE
      WHEN matches.home_team_id = teams.id
      AND matches.home_team_goals > matches.away_team_goals THEN 1
      WHEN matches.away_team_id = teams.id
      AND matches.away_team_goals > matches.home_team_goals THEN 1
      ELSE 0
      END) AS totalVictories
      FROM teams
      JOIN matches
      ON teams.id = matches.home_team_id AND matches.in_progress = false
      OR teams.id = matches.away_team_id AND matches.in_progress = false
      GROUP BY teams.id;
      `,
      { type: 'SELECT' },
    );
    return result as { name: string, totalVictories: number }[];
  }

  public async totalDraws(): Promise<{ name: string, totalDraws: number }[]> {
    const result = await this.sequelize.query(
      `
      SELECT  teams.team_name AS name, SUM(CASE
      WHEN matches.home_team_goals = matches.away_team_goals THEN 1
      ELSE 0
      END) AS totalDraws
      FROM teams
      JOIN matches
      ON teams.id = matches.home_team_id AND matches.in_progress = false
      OR teams.id = matches.away_team_id AND matches.in_progress = false
      GROUP BY teams.id;
      `,
      { type: 'SELECT' },
    );

    return result as { name: string, totalDraws: number }[];
  }

  public async totalLosses(): Promise<{ name: string, totalLosses: number }[]> {
    const result = await this.sequelize.query(
      `
      SELECT  teams.team_name AS name, SUM(CASE
      WHEN matches.home_team_id = teams.id
      AND matches.home_team_goals < matches.away_team_goals THEN 1
      WHEN matches.away_team_id = teams.id
      AND matches.away_team_goals < matches.home_team_goals THEN 1
      ELSE 0
      END) AS totalLosses
      FROM teams
      JOIN matches
      ON teams.id = matches.home_team_id AND matches.in_progress = false
      OR teams.id = matches.away_team_id AND matches.in_progress = false
      GROUP BY teams.id;
      `,
      { type: 'SELECT' },
    );
    return result as { name: string, totalLosses: number }[];
  }

  public async goalsFavor(): Promise<{ name: string, goalsFavor: number }[]> {
    const result = await this.sequelize.query(
      `
      SELECT  teams.team_name AS name, SUM(CASE
      WHEN matches.home_team_id = teams.id THEN matches.home_team_goals
      ELSE matches.away_team_goals
      END) AS goalsFavor
      FROM teams
      JOIN matches
      ON teams.id = matches.home_team_id AND matches.in_progress = false
      OR teams.id = matches.away_team_id AND matches.in_progress = false
      GROUP BY teams.id;
      `,
      { type: 'SELECT' },
    );
    return result as { name: string, goalsFavor: number }[];
  }

  public async goalsOwn(): Promise<{ name: string, goalsOwn: number }[]> {
    const result = await this.sequelize.query(
      `
      SELECT  teams.team_name AS name, SUM(CASE
      WHEN matches.home_team_id = teams.id THEN matches.away_team_goals
      ELSE matches.home_team_goals
      END) AS goalsOwn
      FROM teams
      JOIN matches
      ON teams.id = matches.home_team_id AND matches.in_progress = false
      OR teams.id = matches.away_team_id AND matches.in_progress = false
      GROUP BY teams.id;
      `,
      { type: 'SELECT' },
    );
    return result as { name: string, goalsOwn: number }[];
  }

  public async goalsBalance(): Promise<{ name: string, goalsBalance: number }[]> {
    const result = await this.sequelize.query(
      `
      SELECT  teams.team_name AS name, SUM(CASE
      WHEN matches.home_team_id = teams.id THEN matches.home_team_goals
      ELSE matches.away_team_goals
      END) - SUM(CASE
      WHEN matches.home_team_id = teams.id THEN matches.away_team_goals
      ELSE matches.home_team_goals
      END) AS goalsBalance
      FROM teams
      JOIN matches
      ON teams.id = matches.home_team_id AND matches.in_progress = false
      OR teams.id = matches.away_team_id AND matches.in_progress = false
      GROUP BY teams.id;
      `,
      { type: 'SELECT' },
    );
    return result as { name: string, goalsBalance: number }[];
  }

  public async calculatePoints(): Promise<{ name: string, totalPoints: number }[]> {
    const [victories, draws] = await Promise.all([
      this.totalVictories(),
      this.totalDraws(),
    ]);
    const points = victories.map((v, i) => ({
      name: v.name,
      totalPoints: v.totalVictories * 3 + draws[i].totalDraws * 1,
    }));

    return points as { name: string, totalPoints: number }[];
  }

  public async efficiency(): Promise<{ name: string, efficiency: number }[]> {
    const [points, games] = await Promise.all([
      this.calculatePoints(),
      this.totalGames(),
    ]);
    const results = points.map((row) => {
      const { name, totalPoints } = row;
      const teamGames = games.find((game) => game.name === name)?.totalGames || 0;
      const efficiency = (totalPoints / (teamGames * 3)) * 100;
      return { name, efficiency: Number(efficiency.toFixed(2)) };
    });
    return results;
  }
}
