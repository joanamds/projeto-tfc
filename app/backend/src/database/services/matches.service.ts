import Match from '../interfaces/Match';
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
    console.log(finished);
    return finished;
  }
}
