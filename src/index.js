const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const openApiSpecification = require('./openapi');

const echo = require('./echo');
const echoRaw = require('./echo/raw');
const echoCustom = require('./echo/custom');

const app = express();
const PORT = 8080;

const saveRawBody = (req, res, buf) => {
  req.rawBuffer = Buffer.from(buf);
  req.rawBody = buf.toString();
};

app.use(bodyParser.json({ verify: saveRawBody }));
app.use(bodyParser.urlencoded({ extended: true, verify: saveRawBody }));
app.use(bodyParser.text({ verify: saveRawBody }));
app.use(express.raw({ type: '*/*', limit: '100mb', verify: saveRawBody }));

// Serve OpenAPI documentation
app.use('/', swaggerUi.serve, swaggerUi.setup(openApiSpecification));

app.post('/api/echo', echo);
app.post('/api/echo/raw', echoRaw);
app.post('/api/echo/custom', echoCustom);
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
