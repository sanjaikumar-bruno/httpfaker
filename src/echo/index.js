const echo = (req, res) => {
  const response = {
    url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    method: req.method,
    headers: req.headers,
    body: req.rawBody
  };

  res.setHeader('Content-Type', 'application/json');

  res.json(response);
};

module.exports = echo;
