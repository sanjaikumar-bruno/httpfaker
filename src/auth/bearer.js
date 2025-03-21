const express = require('express');
const router = express.Router();

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token || token !== `Bearer my_secret_token`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
};

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'password') {
    res.status(200).json({
      token: 'my_secret_token',
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

router.get('/resource', authenticateToken, (req, res) => {
  res.status(200).json({
    name: 'bruno',
    age: 5,
    email: 'support@usebruno.com',
    likes: ['kibbles', 'naps', 'string cheese'],
  });
});

module.exports = router;
