import * as chai from 'chai';
import { app } from '../app';
// @ts-ignore
import chaiHttp = require('chai-http');
import { leaderboard, hleaderboard, aleaderboard } from './mocks/leaderboard.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('GET /leaderboard', () => {
  it('Testa se retorna o status 200 e a classificação geral', async () => {
    const response = await chai.request(app).get('/leaderboard');
    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal(leaderboard)
  })
})

describe('GET /leaderboard/away', () => {
  it('Testa se retorna o status 200 e a classificação geral dos times visitantes', async () => {
    const response = await chai.request(app).get('/leaderboard/away');
    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal(aleaderboard)
  })
})

describe('GET /leaderboard/home', () => {
  it('Testa se retorna o status 200 e a classificação geral dos times da casa', async () => {
    const response = await chai.request(app).get('/leaderboard/home');
    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal(hleaderboard)
  })
})