const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
chai.should();

describe('User', () => {
  describe('login', () => {
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
  });
});
