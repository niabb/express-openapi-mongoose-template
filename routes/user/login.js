const jwt = require('jsonwebtoken');

const ApiUser = require('../../models/apiUser');
const config = require('../../config');

async function post(req, res) {
  const foundUser = await ApiUser.findOne({ username: req.body.username });
  if (!foundUser) {
    res.status(401);
    return res.json({ error: 'The user does not exist.' });
  }
  if (await foundUser.checkPassword(req.body.password)) {
    const token = jwt.sign(
      { username: foundUser.username, roles: foundUser.roles },
      config.jwt.secret,
      { expiresIn: config.jwt.duration },
    );
    return res.json({ token });
  }
  res.status(401);
  return res.json({ error: 'Invalid password.' });
}


module.exports = { post };
