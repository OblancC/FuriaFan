const express = require('express');
const router = express.Router();
const User = require('../models/Users');

// Criar novo usuário (mock/teste)
router.post('/register', async (req, res) => {
  const { name, email } = req.body;

  try {
    const newUser = new User({ name, email });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/interactions', async (req, res) => {
  const { type, detail } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    // Adiciona a nova interação
    const interaction = { type, detail, timestamp: new Date() };
    user.interactions.push(interaction);

    let points = 0;

    // Definindo a lógica de pontos
    if (type === 'quiz') {
      const match = detail.match(/(\d)\/5/);
      const score = match ? parseInt(match[1], 10) : 0;
      const quizPoints = [0, 1, 2, 4, 7, 10]; // índice = número de acertos
      points = quizPoints[score] || 0;

      // Também pode salvar esse score no array quizScores
      user.quizScores.push({ score });
    } else {
      // Pontuação padrão para outros tipos
      const interactionPoints = {
        like: 2,
        comment: 4,
        share: 6,
        stream: 8
      };

      points = interactionPoints[type] || 1;
    }

    // Aplica os pontos ao fanLevel
    user.fanLevel += points;

    await user.save();
    res.status(200).json({
      message: `Interação registrada com sucesso (+${points} pontos).`,
      updatedUser: user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




module.exports = router;
