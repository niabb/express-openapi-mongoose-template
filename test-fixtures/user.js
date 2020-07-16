const jwt = require('jsonwebtoken');

const ApiUser = require('../models/apiUser');
const config = require('../config');

const testUser = {
  username: 'testUser',
  password: 'testPassword',
};

async function createTestUser(roles) {
  const hashedPassword = await ApiUser.generatePassword(testUser.password);
  await ApiUser.create({
    username: testUser.username,
    password: hashedPassword,
    roles,
  });
}

async function deleteTestUser() {
  await ApiUser.deleteMany({ username: testUser.username });
}

function getToken(roles, duration) {
  return jwt.sign(
    { username: testUser.username, roles },
    config.jwt.secret,
    { expiresIn: duration },
  );
}

function getValidTokenWithRoles(roles) {
  return getToken(roles, config.jwt.duration);
}

function getExpiredTokenWithRoles(roles) {
  return getToken(roles, 0);
}

module.exports = {
  testUser,
  createTestUser,
  deleteTestUser,
  getValidTokenWithRoles,
  getExpiredTokenWithRoles,
};
