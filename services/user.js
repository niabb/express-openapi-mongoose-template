const apiUserModel = require('../models/apiUser');

async function createUser(username, password, roles) {
  const existingUser = await apiUserModel.getUser(username);
  if (existingUser) {
    throw new Error('The user already exists!');
  }

  return apiUserModel.createUser(username, password, roles || []);
}

module.exports = { createUser };
