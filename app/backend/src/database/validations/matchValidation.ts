import { NewMatch } from '../interfaces/Match';
import TeamsModel from '../models/TeamsModel';

export default class MatchValidation {
  private newMatch: NewMatch;

  constructor(newMatch: NewMatch) {
    this.newMatch = newMatch;
  }

  validateTeamsId() {
    const { homeTeamId, awayTeamId } = this.newMatch;
    if (homeTeamId === awayTeamId) {
      return false;
    }
    return true;
  }

  async validateTeamsExist(): Promise<boolean> {
    const { homeTeamId, awayTeamId } = this.newMatch;
    const homeExists = await TeamsModel.findOne({ where: { id: homeTeamId } });
    const awayExists = await TeamsModel.findOne({ where: { id: awayTeamId } });
    if (awayExists && homeExists) {
      return true;
    }
    return false;
  }
}
