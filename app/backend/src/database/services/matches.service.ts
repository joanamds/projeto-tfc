import { Match, NewMatch } from '../interfaces/Match';
import MatchesModel from '../models/MatchesModel';
import TeamsModel from '../models/TeamsModel';

export default class MatchesService {
  private matchesModel: typeof MatchesModel;

  constructor(matchesModel: typeof MatchesModel) {
    this.matchesModel = matchesModel;
  }

  public async getAllMatches(): Promise<Match[]> {
    const matches = await this.matchesModel.findAll({
      include: [
        {
          model: TeamsModel,
          as: 'homeTeam',
          attributes: ['teamName'],
        },
        {
          model: TeamsModel,
          as: 'awayTeam',
          attributes: ['teamName'],
        },
      ],
    });

    return matches;
  }

  public async getById(id: number) {
    const match = await this.matchesModel.findByPk(id);
    return match;
  }

  public async getByProgress(p: boolean): Promise<Match[]> {
    const inProgressMatches = await this.matchesModel.findAll({
      include: [
        {
          model: TeamsModel,
          as: 'homeTeam',
          attributes: ['teamName'],
        },
        {
          model: TeamsModel,
          as: 'awayTeam',
          attributes: ['teamName'],
        },
      ],
      where: { inProgress: p },
    });

    return inProgressMatches;
  }

  public async finishMatch(id: number) {
    const finished = await this.matchesModel.update(
      { inProgress: false },
      { where: { id } },
    );
    return finished;
  }

  public async updateMatch(
    id: number,
    homeGoals: number,
    awayGoals: number,
  ) {
    const updated = await this.matchesModel.update(
      { homeTeamGoals: homeGoals, awayTeamGoals: awayGoals },
      { where: { id } },
    );
    return updated;
  }

  public async insertNewMatch(newMatch: NewMatch) {
    const created = await this.matchesModel.create({
      newMatch,
    });
    return created.id;
  }
}
