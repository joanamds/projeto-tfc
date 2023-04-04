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

  public async getItems() {
    const [points, totalGames, totalVictories, totalDraws, totalLosses, goalsFavor,
      goalsOwn, goalsBalance, efficiency] = await Promise.all([
      this.leaderboardService.calculatePoints(), this.leaderboardService.totalGames(),
      this.leaderboardService.totalVictories(), this.leaderboardService.totalDraws(),
      this.leaderboardService.totalLosses(), this.leaderboardService.goalsFavor(),
      this.leaderboardService.goalsOwn(), this.leaderboardService.goalsBalance(),
      this.leaderboardService.efficiency(),
    ]);
    return { points,
      totalGames,
      totalVictories,
      totalDraws,
      totalLosses,
      goalsFavor,
      goalsOwn,
      goalsBalance,
      efficiency,
    };
  }

  public async getLeaderboard() {
    const { points, totalGames, totalVictories, totalDraws,
      totalLosses, goalsFavor, goalsOwn, goalsBalance, efficiency } = await this.getItems();
    const leaderboard = points.map((point) => ({
      name: point.name,
      totalPoints: point.totalPoints,
      totalGames: totalGames.find((game) => game.name === point.name)?.totalGames,
      totalVictories: Number(totalVictories
        .find((victory) => victory.name === point.name)?.totalVictories),
      totalDraws: Number(totalDraws.find((draw) => draw.name === point.name)?.totalDraws),
      totalLosses: Number(totalLosses.find((loss) => loss.name === point.name)?.totalLosses),
      goalsFavor: Number(goalsFavor.find((gf) => gf.name === point.name)?.goalsFavor),
      goalsOwn: Number(goalsOwn.find((go) => go.name === point.name)?.goalsOwn),
      goalsBalance: Number(goalsBalance.find((gb) => gb.name === point.name)?.goalsBalance),
      efficiency: Number(efficiency.find((e) => e.name === point.name)?.efficiency),
    }));

    return leaderboard;
  }

  public async orderedLiderboard(_req: Request, res: Response) {
    const leaderboard = await this.getLeaderboard();
    const ordered = leaderboard.sort((a, b) => {
      if (a.totalPoints !== b.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      if (a.totalVictories !== b.totalVictories) {
        return b.totalVictories - a.totalVictories;
      }
      if (a.goalsBalance !== b.goalsBalance) {
        return b.goalsBalance - a.goalsBalance;
      }
      return b.goalsFavor - a.goalsFavor;
    });
    return res.status(200).json(ordered);
  }
}
