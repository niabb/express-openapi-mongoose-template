const ApiUser = require('../models/apiUser');

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

module.exports = {
  testUser,
  createTestUser,
  deleteTestUser,
};
