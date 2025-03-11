const echoCustom = (req, res) => {
  const { headers, content, contentBase64, contentJSON, type } = req.body || {};

  res._headers = {};

  if (type) {
    res.setHeader('Content-Type', type);
  }

  if (headers && typeof headers === 'object') {
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
  }

  if (contentBase64) {
    res.write(Buffer.from(contentBase64, 'base64'));
  } else if (contentJSON !== undefined) {
    res.write(JSON.stringify(contentJSON));
  } else if (content !== undefined) {
    res.write(content);
  }

  return res.end();
};

module.exports = echoCustom;
