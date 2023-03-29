import { Request, Response } from 'express';
import TeamsModel from '../models/TeamsModel';
import TeamsService from '../services/teams.service';

export default class TeamsController {
  private teamsService: TeamsService;

  constructor() {
    this.teamsService = new TeamsService(TeamsModel);
  }

  public async getAll(_req: Request, res: Response) {
    const getTeams = await this.teamsService.getAllTeams();
    return res.status(200).json(getTeams);
  }

  public async getById(req: Request, res: Response) {
    const { id } = req.params;
    const numberId = Number(id);
    const findTeam = await this.teamsService.getById(numberId);
    if (!findTeam) {
      return res.status(404).json({ message: 'Team not found' });
    }

    return res.status(200).json(findTeam);
  }
}
