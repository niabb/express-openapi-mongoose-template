async function get(req, res) {
  return res.json({ roles: req.decodedToken.roles });
}

module.exports = { get };
