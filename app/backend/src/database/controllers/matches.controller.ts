import { Request, Response } from 'express';
import MatchesModel from '../models/MatchesModel';
import MatchesService from '../services/matches.service';

export default class MatchesController {
  private matchesService: MatchesService;

  constructor() {
    this.matchesService = new MatchesService(MatchesModel);
  }

  public async getMatches(req: Request, res: Response) {
    const { inProgress } = req.query;
    if (inProgress === 'true') {
      const inProgressTrue = await this.matchesService.getByProgress(true);
      return res.status(200).json(inProgressTrue);
    }
    if (inProgress === 'false') {
      const inProgressFalse = await this.matchesService.getByProgress(false);
      return res.status(200).json(inProgressFalse);
    }
    const allMatches = await this.matchesService.getAllMatches();
    return res.status(200).json(allMatches);
  }
}
