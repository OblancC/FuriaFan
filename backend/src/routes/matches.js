const express = require('express');
const router = express.Router();
const hltvService = require('../services/hltvService');

// Rota para buscar todos os jogos da FURIA
router.get('/furia', async (req, res) => {
  try {
    const matches = await hltvService.getFuriaMatches();
    res.json(matches);
  } catch (error) {
    console.error('Erro ao buscar jogos da FURIA:', error);
    res.status(500).json({ error: 'Erro ao buscar jogos da FURIA' });
  }
});

// Rota para buscar o jogo ao vivo da FURIA
router.get('/furia/live', async (req, res) => {
  try {
    const liveMatch = await hltvService.getLiveMatch();
    res.json(liveMatch);
  } catch (error) {
    console.error('Erro ao buscar jogo ao vivo da FURIA:', error);
    res.status(500).json({ error: 'Erro ao buscar jogo ao vivo da FURIA' });
  }
});

module.exports = router; 