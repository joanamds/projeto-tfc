import { Sequelize } from 'sequelize';
import TeamsModel from '../models/TeamsModel';
import MatchesModel from '../models/MatchesModel';

const m = 'matches.away_team_id';
export default class ALeaderboardService {
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
    const result = await this.matchesModel.findAll({
      attributes: [
        [this.sequelize.fn('COUNT', this.sequelize.col(m)), 'totalGames'],
      ],
      include: [{
        model: this.teamsModel,
        as: 'awayTeam',
        attributes: ['teamName'],
      }],
      where: { inProgress: false },
      group: [m],
    });
    return result.map((row) => ({
      name: row.awayTeam.teamName,
      totalGames: row.get('totalGames') as number,
    }));
  }

  public async totalVictories(): Promise<{ name: string, totalVictories: number }[]> {
    const result = await this.matchesModel.findAll({
      attributes: [[this.sequelize.fn('SUM', this.sequelize.literal(
        `CASE WHEN matches.away_team_id = awayTeam.id
        AND matches.away_team_goals > matches.home_team_goals THEN 1
        ELSE 0 END`,
      )), 'totalVictories']],
      include: [{
        model: this.teamsModel,
        as: 'awayTeam',
        attributes: ['teamName'],
      }],
      where: { inProgress: false },
      group: [m],
    });
    return result.map((row) => ({
      name: row.awayTeam.teamName,
      totalVictories: row.get('totalVictories') as number,
    }));
  }

  public async totalDraws(): Promise<{ name: string, totalDraws: number }[]> {
    const result = await this.matchesModel.findAll({
      attributes: [[this.sequelize.fn('SUM', this.sequelize.literal(
        `CASE WHEN matches.away_team_id = awayTeam.id
        AND matches.home_team_goals = matches.away_team_goals THEN 1
        ELSE 0 END`,
      )), 'totalDraws']],
      include: [{
        model: this.teamsModel,
        as: 'awayTeam',
        attributes: ['teamName'],
      }],
      where: { inProgress: false },
      group: [m],
    });
    return result.map((row) => ({
      name: row.awayTeam.teamName,
      totalDraws: row.get('totalDraws') as number,
    }));
  }

  public async totalLosses(): Promise<{ name: string, totalLosses: number }[]> {
    const result = await this.matchesModel.findAll({
      attributes: [[this.sequelize.fn('SUM', this.sequelize.literal(
        `CASE WHEN matches.away_team_id = awayTeam.id
        AND matches.away_team_goals < matches.home_team_goals THEN 1
        ELSE 0 END`,
      )), 'totalLosses']],
      include: [{
        model: this.teamsModel,
        as: 'awayTeam',
        attributes: ['teamName'],
      }],
      where: { inProgress: false },
      group: [m],
    });
    return result.map((row) => ({
      name: row.awayTeam.teamName,
      totalLosses: row.get('totalLosses') as number,
    }));
  }

  public async goalsFavor(): Promise<{ name: string, goalsFavor: number }[]> {
    const result = await this.matchesModel.findAll({
      attributes: [[this.sequelize.fn('SUM', this.sequelize.literal(
        `CASE WHEN matches.away_team_id = awayTeam.id
          THEN matches.away_team_goals
        END`,
      )), 'goalsFavor']],
      include: [{
        model: this.teamsModel,
        as: 'awayTeam',
        attributes: ['teamName'],
      }],
      where: { inProgress: false },
      group: [m],
    });
    return result.map((row) => ({
      name: row.awayTeam.teamName,
      goalsFavor: row.get('goalsFavor') as number,
    }));
  }

  public async goalsOwn(): Promise<{ name: string, goalsOwn: number }[]> {
    const result = await this.matchesModel.findAll({
      attributes: [[this.sequelize.fn('SUM', this.sequelize.literal(
        `CASE WHEN matches.away_team_id = awayTeam.id
          THEN matches.home_team_goals
        END`,
      )), 'goalsOwn']],
      include: [{
        model: this.teamsModel,
        as: 'awayTeam',
        attributes: ['teamName'],
      }],
      where: { inProgress: false },
      group: [m],
    });
    return result.map((row) => ({
      name: row.awayTeam.teamName,
      goalsOwn: row.get('goalsOwn') as number,
    }));
  }

  public async goalsBalance(): Promise<{ name: string, goalsBalance: number }[]> {
    const result = await this.matchesModel.findAll({
      attributes: [[this.sequelize.fn('SUM', this.sequelize.literal(
        `CASE WHEN matches.home_team_id = awayTeam.id THEN matches.home_team_goals
        ELSE matches.away_team_goals END) - SUM(CASE WHEN matches.home_team_id = awayTeam.id 
          THEN matches.away_team_goals ELSE matches.home_team_goals END`,
      )), 'goalsBalance']],
      include: [{
        model: this.teamsModel,
        as: 'awayTeam',
        attributes: ['teamName'],
      }],
      where: { inProgress: false },
      group: [m],
    });
    return result.map((row) => ({
      name: row.awayTeam.teamName,
      goalsBalance: row.get('goalsBalance') as number,
    }));
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
