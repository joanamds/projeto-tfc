import * as sinon from 'sinon';
import * as chai from 'chai';
import { app } from '../app';
// @ts-ignore
import chaiHttp = require('chai-http');
// import UsersService from '../database/services/users.service';
// import UsersController from '../database/controllers/users.controller';
import { invalidEntry, missingFields, loginValid, tokenNotFound, tokenInvalid, invalid, getRole } from './mocks/login.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('POST /login', () => {
  describe('Testa os erros caso falte campos preenchidos', () => {
    it('Testa se retorna status 400 e a mensagem de erro caso falte password na requisição', async () => {
      const response = await chai.request(app).post('/login').send({ email: 'email@email.com'});
      expect(response).to.have.status(400);
      expect(response.body).to.deep.equal(missingFields);
    })
    it('Testa se retorna status 400 a mensagem de erro caso falte email na requisição', async () => {
      const response = await chai.request(app).post('/login').send({ password: '123456'});
      expect(response).to.have.status(400);
      expect(response.body).to.deep.equal(missingFields);
    })
  })

  describe('Testa os erros caso email ou senha sejam inválidos', () => {
    it('Testa se retorna status 401 e mensagem de erro caso o email esteja errado', async () => {
      const response = await chai.request(app).post('/login').send({ email: 'email@email.com', password: '1234'});
      expect(response).to.have.status(401);
      expect(response.body).to.deep.equal(invalidEntry);
    })
    it('Testa se retorna status 401 e mensagem de erro caso o email esteja errado', async () => {
      const response = await chai.request(app).post('/login').send({ email: 'email_invalid', password: '123456'});
      expect(response).to.have.status(401);
      expect(response.body).to.deep.equal(invalidEntry);
    })
  })

  describe('Testa se faz a requisição corretamente', () => {
    it('Testa se retorna um token válido caso o email e a senha sejam corretos', async () => {
      const response = await chai.request(app).post('/login').send(loginValid);
      expect(response).to.have.status(200);
      expect(response.body).to.have.property('token');
      const token = response.body.token;
      expect(token).to.be.a('string');
      expect(token.split('.').length).to.equal(3);
    })
  })

  describe('Testa a rota /login/role', () => {
    it('Testa se retorna status 401 e mensagem de erro se o token não for encontrado', async () => {
      const response = await chai.request(app).get('/login/role');
      expect(response).to.have.status(401);
      expect(response.body).to.deep.equal(tokenNotFound)
    })
    it('Testa se retorna status 401 e mensagem de erro se o token não for encontrado', async () => {
      const response = await chai.request(app).get('/login/role').set('Authorization', 'Bearer ' + invalid);
      expect(response).to.have.status(401);
      expect(response.body).to.deep.equal(tokenInvalid);
    })
    it('Testa se retorna status 200 e um objeto contendo o "role" do usuário', async () => {
      const login = await chai.request(app).post('/login').send(loginValid);
      const getToken = login.body.token;
      const response = await chai.request(app).get('/login/role').set('Authorization', getToken);
      expect(response).to.have.status(200);
      expect(response.body).to.deep.equal(getRole);
    })
  })
})