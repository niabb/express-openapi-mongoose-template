const chai = require('chai');

require('../../mongo');
const ApiUser = require('../../models/apiUser');

chai.should();


const username = 'victim';
const password = 'password';


describe('ApiUser', () => {
  it('#insert', (done) => {
    ApiUser
      .generatePassword(password)
      .then((hashed) => {
        ApiUser.create({
          username,
          password: hashed,
        }).then((createdUser) => {
          createdUser.should.be.a('object');
          createdUser.should.have.property('username', 'victim');
          done();
        });
      });
  });

  it('#find', (done) => {
    ApiUser.findOne({ username })
      .then((foundUser) => {
        foundUser.should.be.a('object');
        foundUser.should.have.property('username', 'victim');
        done();
      });
  });

  it('#delete', (done) => {
    ApiUser.deleteMany({ username }).then(() => {
      done();
    });
  });
});
