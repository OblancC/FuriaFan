const express = require('express');
const router = express.Router();
const passport = require('passport');

// Rota de login com Discord
router.get('/discord', passport.authenticate('discord'));

router.get('/discord/callback',
  passport.authenticate('discord', {
    failureRedirect: '/login'
  }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000');
  }
);

// Rota de login com Twitter
router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback',
  passport.authenticate('twitter', {
    failureRedirect: '/login'
  }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000');
  }
);

// Rota de login com Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000');
  }
);

// Rota de logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000');
});

// Rota para verificar status da autenticação
router.get('/status', (req, res) => {
  res.json({ isAuthenticated: req.isAuthenticated(), user: req.user });
});

module.exports = router; 