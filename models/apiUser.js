const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const apiUserSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String },
  roles: [String],
});

/**
 * Helper to create a hashed password from a plain text password, to be stored in the database
 * @param  {String} password the plain text password
 * @returns {Promise} It should return the hashed password
 */
async function generatePassword(password) {
  return bcrypt.hash(password, 10);
}
apiUserSchema.statics.generatePassword = generatePassword;

async function getUser(username) {
  return this.findOne({ username });
}
apiUserSchema.statics.getUser = getUser;

/**
 * This function is used to check if the provided password matches the stored hashed password
 * of an existing user.
 * @param  {String} providedPassword
 * @returns {Promise} It should return the result of the check through a promise
 */
apiUserSchema.methods.checkPassword = function async(providedPassword) {
  return bcrypt.compare(providedPassword, this.password);
};

/**
 * Insert a user with a hashed password in the database
 * @param {String} username
 * @param {String} clearPassword
 * @param {Array} roles the list of roles
 */
async function createUser(username, clearPassword, roles) {
  const hashedPassword = await generatePassword(clearPassword);
  return this.create({ username, password: hashedPassword, roles });
}
apiUserSchema.statics.createUser = createUser;

module.exports = mongoose.model('ApiUser', apiUserSchema);
