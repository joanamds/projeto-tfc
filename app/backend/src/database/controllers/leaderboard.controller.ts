import { Request, Response } from 'express';
import sequelize from '../models';
import LeaderboardService from '../services/leaderboard.service';
import TeamsModel from '../models/TeamsModel';
import MatchesModel from '../models/MatchesModel';

export default class LeaderboardController {
  private leaderboardService: LeaderboardService;

  constructor() {
    this.leaderboardService = new LeaderboardService(sequelize, TeamsModel, MatchesModel);
  }

  public async getLeaderboard(_req: Request, res: Response) {
    const getGames = await this.leaderboardService.totalGames();
    return res.status(200).json(getGames);
  }
}
