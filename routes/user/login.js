const jwt = require('jsonwebtoken');

const ApiUser = require('../../models/apiUser');
const config = require('../../config');
const logger = require('../../lib/logger');

async function post(req, res) {
  try {
    const foundUser = await ApiUser.getUser(req.body.username);
    if (!foundUser) {
      logger.info(`Login attempt with unknown user ${req.body.username}`);
      res.status(401);
      return res.json({ error: 'The user does not exist.' });
    }
    if (await foundUser.checkPassword(req.body.password)) {
      const token = jwt.sign(
        { username: foundUser.username, roles: foundUser.roles },
        config.jwt.secret,
        { expiresIn: config.jwt.duration },
      );
      logger.info(`Successful login for user ${req.body.username}`);
      return res.json({ token });
    }
    logger.info(`Login attempt with wrong password for user ${req.body.username}`);
    res.status(401);
    return res.json({ error: 'Invalid password.' });
  } catch (error) {
    logger.error(`error in /login for ${req.body.username}: `, error);
    return res.status(500).json({ error });
  }
}

module.exports = { post };
