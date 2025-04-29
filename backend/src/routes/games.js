const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');

// Obter próximos jogos
router.get('/upcoming', isAuthenticated, async (req, res) => {
  try {
    // Aqui você pode integrar com uma API de e-sports
    // Por enquanto, retornamos dados mockados
    const upcomingGames = [
      {
        id: '1',
        team1: 'FURIA',
        team2: 'MIBR',
        tournament: 'ESL Pro League',
        date: '2024-05-15T19:00:00Z',
        status: 'upcoming'
      },
      {
        id: '2',
        team1: 'FURIA',
        team2: 'Liquid',
        tournament: 'BLAST Premier',
        date: '2024-05-20T20:00:00Z',
        status: 'upcoming'
      }
    ];
    
    res.json(upcomingGames);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar próximos jogos' });
  }
});

// Obter jogos ao vivo
router.get('/live', isAuthenticated, async (req, res) => {
  try {
    // Aqui você pode integrar com uma API de e-sports
    // Por enquanto, retornamos dados mockados
    const liveGames = [
      {
        id: '3',
        team1: 'FURIA',
        team2: 'Natus Vincere',
        tournament: 'IEM Katowice',
        score: {
          team1: 12,
          team2: 10
        },
        map: 'Mirage',
        status: 'live'
      }
    ];
    
    res.json(liveGames);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar jogos ao vivo' });
  }
});

// Obter histórico de jogos
router.get('/history', isAuthenticated, async (req, res) => {
  try {
    // Aqui você pode integrar com uma API de e-sports
    // Por enquanto, retornamos dados mockados
    const history = [
      {
        id: '4',
        team1: 'FURIA',
        team2: 'G2',
        tournament: 'IEM Rio',
        score: {
          team1: 16,
          team2: 14
        },
        date: '2024-04-25T18:00:00Z',
        status: 'completed'
      },
      {
        id: '5',
        team1: 'FURIA',
        team2: 'Vitality',
        tournament: 'ESL Pro League',
        score: {
          team1: 14,
          team2: 16
        },
        date: '2024-04-20T19:00:00Z',
        status: 'completed'
      }
    ];
    
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar histórico de jogos' });
  }
});

module.exports = router; 