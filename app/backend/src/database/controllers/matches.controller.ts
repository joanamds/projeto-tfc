import { Request, Response } from 'express';
import MatchesModel from '../models/MatchesModel';
import MatchesService from '../services/matches.service';
import MatchValidation from '../validations/matchValidation';

const notFound = { message: 'Token not found' };
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

  public async finishMatch(req: Request, res: Response) {
    const { id } = req.params;
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json(notFound);
    }
    const getId = Number(id);
    await this.matchesService.finishMatch(getId);
    return res.status(200).json({ message: 'Finished' });
  }

  public async updateMatch(req: Request, res: Response) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json(notFound);
    }
    const numberId = Number(id);
    await this.matchesService.updateMatch(numberId, homeTeamGoals, awayTeamGoals);
    return res.status(200).json({ message: 'Game score updated!' });
  }

  public async createMatch(req: Request, res: Response) {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json(notFound);
    }
    const validate = new MatchValidation(req.body);
    if (!validate.validateTeamsId()) {
      return res.status(422).json({
        message: 'It is not possible to create a match with two equal teams',
      });
    }
    const teamsExist = await validate.validateTeamsExist();
    if (!teamsExist) {
      return res.status(404).json({ message: 'There is no team with such id!' });
    }
    const create = await this.matchesService.insertNewMatch(req.body);
    const getNewMatch = await this.matchesService.getById(create);
    return res.status(201).json(getNewMatch);
  }
}
