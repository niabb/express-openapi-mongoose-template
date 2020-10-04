require('dotenv').config('../../test.env');
const chai = require('chai');

require('../../lib/mongoose');
const ApiUser = require('../../models/apiUser');

chai.should();

const username = 'victim';
const password = 'password';

describe('ApiUser', () => {
  it('#insert', async () => {
    const hashed = await ApiUser.generatePassword(password);
    const createdUser = await ApiUser.create({
      username,
      password: hashed,
    });
    createdUser.should.be.a('object');
    createdUser.should.have.property('username', 'victim');
  });

  it('#find', async () => {
    const foundUser = await ApiUser.findOne({ username });
    foundUser.should.be.a('object');
    foundUser.should.have.property('username', 'victim');
  });

  it('#delete', async () => {
    await ApiUser.deleteMany({ username });
  });
});
