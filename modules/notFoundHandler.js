function notFoundHandler(req, res) {
  res.status(500).send('not here! Go somewhere else 500');
}

module.exports = notFoundHandler;
