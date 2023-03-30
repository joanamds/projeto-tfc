import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import TeamsService from '../database/services/teams.service';
import TeamsController from '../database/controllers/teams.controller';
import { teamsMock, avai } from './mocks/teams.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Teste Teams', () => {
  let teamsController: TeamsController;
  let getAllTeamsStub: sinon.SinonStub;

  beforeEach(() => {
    getAllTeamsStub = sinon.stub(TeamsService.prototype, 'getAllTeams').resolves(teamsMock);
    teamsController = new TeamsController();
  });

  afterEach(() => {
    getAllTeamsStub.restore();
  });

  describe('getAll', () => {
    it('Testa se retorna todos os times', async () => {
      const response = await chai.request(app).get('/teams');
      expect(response).to.have.status(200);
      expect(response.body).to.deep.equal(teamsMock);
    });
  });

  describe('findById', () => {
    it('Testa se retorna o time de acordo com o id', async () => {
      const response = await chai.request(app).get('/teams/1');
      expect(response).to.have.status(200);
      expect(response.body).to.deep.equal(avai)
    })
  })
});

