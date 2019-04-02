const chai = require('chai');

require('../../mongo');
const ApiUser = require('../../models/apiUser');

chai.should();


const username = 'victim';
const password = 'password';


describe('ApiUser', () => {
  // before((done) => {
  //   mongoose
  //     .connect(mongoUri, { useNewUrlParser: true })
  //     .then(() => done(), () => assert.fail());
  // });

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

  // it('#find', (done) => {
  //   ApiUser.find({ username })
  //     .then(() => done(),
  //       () => assert.fail());
  // });

  // it('#delete', (done) => {
  //   ApiUser.deleteMany({ username })
  //     .then(() => {
  //       mongoose.disconnect();
  //       done();
  //     }, () => assert.fail());
  // });
});
