const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const userController = require('../controllers/userController');
const User = require('../models/User');
const { extractTextFromImage } = require('./visionService');

const upload = multer({ dest: 'uploads/' });

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

router.put('/:id/profile', async (req, res) => {
  try {
    const { cpf, address, birthDate, interests, eventsAttended, purchases } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          cpf,
          address,
          birthDate,
          interests,
          eventsAttended,
          purchases
        }
      },
      { new: true }
    );

    res.status(200).json({ message: 'Perfil atualizado com sucesso', updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/upload-document', upload.single('document'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    const text = await extractTextFromImage(req.file.path);

    // Regex para encontrar CPF
    const cpfEncontrado = text.match(/\d{3}\.\d{3}\.\d{3}\-\d{2}/);

    if (cpfEncontrado) {
      // Atualiza o usuário
      user.documents.push(req.file.filename);
      user.cpf = cpfEncontrado[0];
      user.aiValidated = true;

      await user.save();

      fs.unlinkSync(req.file.path); // Remove o arquivo temporário

      res.status(200).json({ message: 'Documento validado com sucesso!', cpf: cpfEncontrado[0], user });
    } else {
      fs.unlinkSync(req.file.path); // Remove o arquivo mesmo em caso de erro
      res.status(400).json({ message: 'Não conseguimos validar o CPF no documento.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
