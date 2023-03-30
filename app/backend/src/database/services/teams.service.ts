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

  public async getById(id: number): Promise<Team> {
    const team = await this.teamsModel.findByPk(id);
    console.log(team);
    if (!team) {
      throw new Error(`A equipe com id ${id} não foi encontrada'`);
    }

    return team;
  }
}
