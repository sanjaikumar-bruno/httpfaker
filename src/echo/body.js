const echoBody = (req, res) => {
  if (req.headers['content-type']) {
    res.setHeader('Content-Type', req.headers['content-type']);
  }

  res.send(req.rawBody);
};

module.exports = echoBody;
