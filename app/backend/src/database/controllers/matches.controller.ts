import { Request, Response } from 'express';
import MatchesModel from '../models/MatchesModel';
import MatchesService from '../services/matches.service';

export default class MatchesController {
  private matchesService: MatchesService;

  constructor() {
    this.matchesService = new MatchesService(MatchesModel);
  }

  public async getAll(_req: Request, res: Response) {
    const allMatches = await this.matchesService.getAllMatches();

    return res.status(200).json(allMatches);
  }
}
