const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');

const ApiUser = require('../models/apiUser');


chai.use(chaiHttp);
chai.should();

const username = 'testAdmin';
const password = '4dm1n';
const roles = ['admin', 'everything'];
let token = '';
const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZXMiOlsiYWRtaW4iXSwiaWF0IjoxNTU0MjM0MDgxLCJleHAiOjE1NTQyMzQwODJ9.w84x0YHc5UAFisNhtsEW9cenYk7Kj6sqqSTNgVHLSC8';

describe('/user', () => {
  before((done) => {
    ApiUser
      .generatePassword(password)
      .then((hashed) => {
        ApiUser.create({
          username,
          password: hashed,
          roles,
        }).then(() => {
          done();
        });
      });
  });
  describe('/login', () => {
    it('should get a 400 error sending only the username', (done) => {
      chai.request(app)
        .post('/user/login')
        .send({ username: 'dashboard' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error', 'Request validation error.');
          res.body.should.have.property('details');
          res.body.details.should.be.instanceof(Array);
          done();
        });
    });
    it('should get a 401 error trying to log in with an unknown user', (done) => {
      chai.request(app)
        .post('/user/login')
        .send({ username: 'kilian', password: 'jornet' })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('error', 'The user does not exist.');
          done();
        });
    });
    it('should get a 401 error trying to log in with an existing user but a wrong password', (done) => {
      chai.request(app)
        .post('/user/login')
        .send({ username, password: 'whatever' })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('error', 'Invalid password.');
          done();
        });
    });
    it('should get a JWT loging with an existing user', (done) => {
      chai.request(app)
        .post('/user/login')
        .send({ username, password })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token').which.is.a('string');
          ({ token } = res.body);
          done();
        });
    });
  });
  describe('/getRoles', () => {
    it('should get the user roles providing a correct token', (done) => {
      chai.request(app)
        .get('/user/getRoles')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('roles');
          res.body.roles.should.be.instanceof(Array).and.have.lengthOf(2).and.include('admin').and.include('everything');
          done();
        });
    });
    it('should get a 400 error providing an incorrect token', (done) => {
      chai.request(app)
        .get('/user/getRoles')
        .set('Authorization', 'Bearer something')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error', 'Request validation error.');
          res.body.should.have.property('details');
          res.body.details.should.be.instanceof(Array).and.have.lengthOf(1).and.include('jwt malformed');
          done();
        });
    });
    it('should get a 400 error providing an expired token', (done) => {
      chai.request(app)
        .get('/user/getRoles')
        .set('Authorization', `Bearer ${expiredToken}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error', 'Request validation error.');
          res.body.should.have.property('details');
          res.body.details.should.be.instanceof(Array).and.have.lengthOf(1).and.include('jwt expired');
          done();
        });
    });
  });

  after((done) => {
    ApiUser.deleteMany({ username }).then(() => {
      done();
    });
  });
});
