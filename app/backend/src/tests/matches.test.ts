import * as chai from 'chai';
import { app } from '../app';
// @ts-ignore
import chaiHttp = require('chai-http');
import { allMatches, finishedMatches, inProgressMatches, errorTwoEqualTeams, errorInvalidId, matchCreated } from './mocks/matches.mock';
import { invalid, loginValid } from './mocks/login.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('GET /matches', () => {
  it('Testa se retorna status 200 e todas as partidas', async () => {
    const response = await chai.request(app).get('/matches');
    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal(allMatches);
  });
  
  describe('GET /matches?inProgress=true', () => {
    it('Testa se retorna status 200 e todas as partidas em progresso', async () => {
      const response = await chai.request(app).get('/matches?inProgress=true');
      expect(response).to.have.status(200);
      expect(response.body).to.deep.equal(inProgressMatches);
    })
  })

  describe('GET /matches?inProgress=false', () => {
    it('Testa se retorna status 200 e todas as partidas finalizas', async () => {
      const response = await chai.request(app).get('/matches?inProgress=false');
      expect(response).to.have.status(200);
      expect(response.body).to.deep.equal(finishedMatches);
    })
  })
})

describe('POST /matches', () => {
  it('Testa que não é possível inserir uma partida sem um token', async () => {
  const response = await chai.request(app).post('/matches').send({
    homeTeamId: 9,
    awayTeamId: 9,
    homeTeamGoals: 2,
    awayTeamGoals: 2
  })

    expect(response).to.have.status(401);
    expect(response.body).to.deep.equal({ message: 'Token not found'});
  })

  it('Testa que não é possível inserir uma partida sem um token válido', async () => {
    const response = await chai.request(app).post('/matches').send({
      homeTeamId: 9,
      awayTeamId: 9,
      homeTeamGoals: 2,
      awayTeamGoals: 2
    }).set('Authorization', 'Bearer ' + invalid)
  
    expect(response).to.have.status(401);
    expect(response.body).to.deep.equal({ message: 'Token must be a valid token'});
  })
  it('Testa se retorna o status 422 e a mensagem de erro', async () => {
    const login = await chai.request(app).post('/login').send(loginValid);
    const getToken = login.body.token;
    const response = await chai.request(app).post('/matches').send({
      homeTeamId: 9,
      awayTeamId: 9,
      homeTeamGoals: 2,
      awayTeamGoals: 2
    }).set('Authorization', getToken);
    expect(response).to.have.status(422);
    expect(response.body).to.deep.equal(errorTwoEqualTeams);
  });
  
  it('Testa se retorna status 404 e a mensagem de erro', async () => {
    const login = await chai.request(app).post('/login').send(loginValid);
    const getToken = login.body.token;
    const response = await chai.request(app).post('/matches').send({
      homeTeamId: 999,
      awayTeamId: 9,
      homeTeamGoals: 2,
      awayTeamGoals: 2
    }).set('Authorization', getToken);
    expect(response).to.have.status(404);
    expect(response.body).to.deep.equal(errorInvalidId);
  })

  it('Testa se retorna status 201 e a partida criada', async () => {
    const login = await chai.request(app).post('/login').send(loginValid);
    const getToken = login.body.token;
    const response = await chai.request(app).post('/matches').send({
      homeTeamId: 16,
      awayTeamId: 9,
      homeTeamGoals: 2,
      awayTeamGoals: 2
    }).set('Authorization', getToken);
    expect(response).to.have.status(201);
    expect(response.body).to.deep.equal(matchCreated);
  })
})