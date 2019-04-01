async function get(req, res) {
  return res.json({ ping: 'pong' });
}

module.exports = { get };
