import TeamsModel from '../models/TeamsModel';
import Team from '../interfaces/Team';

export default class TeamsService {
  private teamsModel: typeof TeamsModel;

  constructor(teamsModel: typeof TeamsModel) {
    this.teamsModel = teamsModel;
  }

  public async getAllTeams(): Promise<Team[]> {
    const teams = await this.teamsModel.findAll();
    return teams;
  }
}
