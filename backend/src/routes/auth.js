const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

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

// Rota de login com X
router.get('/twitter', passport.authenticate('twitter', {
  scope: ['read', 'users.read', 'tweet.read', 'list.read', 'follows.read', 'offline.access']
}));

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

// Rota de logout
router.post('/logout', (req, res, next) => {
  if (req.logout) {
    req.logout(function(err) {
      if (err) { return next(err); }
      if (req.session) {
        req.session.destroy(() => {
          res.clearCookie('connect.sid');
          res.json({ message: 'Logout realizado com sucesso' });
        });
      } else {
        res.json({ message: 'Logout realizado com sucesso' });
      }
    });
  } else {
    res.json({ message: 'Logout realizado com sucesso' });
  }
});

// Rota de registro local
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Preencha todos os campos' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: 'Erro ao logar' });
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email
      });
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
});

// Login local (email/senha)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Preencha todos os campos' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Usuário não encontrado' });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(400).json({ message: 'Senha incorreta' });
  }
  req.login(user, (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao logar' });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email
    });
  });
});

module.exports = router; 