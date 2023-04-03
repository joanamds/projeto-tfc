import { Request, Response } from 'express';
import sequelize from '../models';
import LeaderboardService from '../services/leaderboard.service';
import TeamsModel from '../models/TeamsModel';
import MatchesModel from '../models/MatchesModel';
// import Leaderboard from '../interfaces/Leaderboard';

export default class LeaderboardController {
  private leaderboardService: LeaderboardService;

  constructor() {
    this.leaderboardService = new LeaderboardService(sequelize, TeamsModel, MatchesModel);
  }

  public async getLeaderboard(_req: Request, res: Response) {
    const points = await this.leaderboardService.calculatePoints();
    const getGames = await this.leaderboardService.totalGames();
    const getVictories = await this.leaderboardService.totalVictories();
    // const getDraws = await this.leaderboardService.totalDraws();
    // const getLosses = await this.leaderboardService.totalLosses();
    // const getGoalsFavor = await this.leaderboardService.goalsFavor();
    // const getGoalsOwn = await this.leaderboardService.goalsOwn();
    // const getEfficiency = await this.leaderboardService.efficiency();
    const leaderboard = points.map((point) => {
      const object = {
        name: point.name,
        totalPoints: point.totalPoints,
        totalGames: getGames.find((game) => game.name === point.name)?.totalGames,
        totalVictories: Number(getVictories
          .find((victory) => victory.name === point.name)?.totalVictories),
      };
      return object;
    });

    return res.status(200).json(leaderboard);
  }
}
