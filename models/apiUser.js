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
apiUserSchema.statics.generatePassword = async (password) => bcrypt.hash(password, 10);

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

module.exports = mongoose.model('ApiUser', apiUserSchema);
