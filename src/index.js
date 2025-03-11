const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/echo', (req, res) => {
  res.json(req.body);
});

// Simple GET endpoint for testing
app.get('/', (req, res) => {
  res.send('HTTP Faker is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
