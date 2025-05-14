const express = require('express');
const cookieParser = require('cookie-parser');

const router = express.Router();

// POST - sets cookies and redirects
router.post('/login', (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).send('Username is required');
  }
  const token = `session-${Math.random().toString(36).slice(2)}`;
  res.cookie('auth-token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 10 * 60 * 1000,
  });
  res.redirect(302, '/redirected');
});

// GET - just another redirect, but to a protected route
router.get('/redirected', (req, res) => {
  res.redirect(302, '/dashboard');
});

// GET - protected route
router.get('/dashboard', (req, res) => {
  const token = req.cookies['auth-token'];
  if (!token) {
    return res.status(401).send('❌ No auth-token provided');
  }
  if (!token.startsWith('session-')) {
    return res.status(403).send('❌ Invalid auth-token');
  }
  res.send(`🎉 Welcome to your dashboard! Authenticated with token: ${token}`);
});

module.exports = router;
