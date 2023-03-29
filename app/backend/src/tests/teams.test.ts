import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';

chai.use(chaiHttp);

const { expect } = chai;

describe('/teams', () => {
  it('Deve retornar todos os times corretamente', async () => {
    const res = await chai.request(app).get('/teams');
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.lengthOf.at.least(1);
    expect(res.body[0]).to.have.property('id');
    expect(res.body[0]).to.have.property('teamName');
  });
});
