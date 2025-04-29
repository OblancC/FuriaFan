const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

// Rota para iniciar autenticação do Discord
router.get('/discord', passport.authenticate('discord'));

// Callback do Discord
router.get('/discord/callback',
    passport.authenticate('discord', {
        failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`
    }),
    (req, res) => {
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile`);
    }
);

// Rota para obter informações do usuário atual
router.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.status(401).json({ message: 'Não autenticado' });
    }
});

// Rota para logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`);
});

// Rota de login com Twitter
router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback',
  passport.authenticate('twitter', {
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`
  }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile`);
  }
);

// Rota de login com Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`
  }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile`);
  }
);

// Rota para verificar status da autenticação
router.get('/status', (req, res) => {
  res.json({ isAuthenticated: req.isAuthenticated(), user: req.user });
});

module.exports = router; 