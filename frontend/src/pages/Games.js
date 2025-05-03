import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Grid, Chip, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import LiveMatch from '../components/LiveMatch';

const Games = () => {
  const [games, setGames] = useState({
    upcoming: [],
    live: [],
    history: []
  });
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const [upcomingRes, liveRes, historyRes] = await Promise.all([
          axios.get('http://localhost:3001/api/games/upcoming', { withCredentials: true }),
          axios.get('http://localhost:3001/api/games/live', { withCredentials: true }),
          axios.get('http://localhost:3001/api/games/history', { withCredentials: true })
        ]);

        setGames({
          upcoming: upcomingRes.data,
          live: liveRes.data,
          history: historyRes.data
        });
      } catch (error) {
        console.error('Erro ao buscar jogos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchGames();
    }
  }, [isAuthenticated]);

  const GameCard = ({ game }) => (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" align="center">
            {game.team1}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle1" color="text.secondary">
              {new Date(game.date).toLocaleDateString()}
            </Typography>
            <Typography variant="h6">
              {game.score1} - {game.score2}
            </Typography>
            <Chip
              label={game.status}
              color={
                game.status === 'Próximo' ? 'primary' :
                game.status === 'Ao Vivo' ? 'error' :
                'default'
              }
              sx={{ mt: 1 }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" align="center">
            {game.team2}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );

  if (!isAuthenticated) {
    return (
      <Container>
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          Por favor, faça login para ver os jogos
        </Typography>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Jogos da FURIA
        </Typography>

        {/* Componente de jogo ao vivo */}
        <LiveMatch />

        {games.live.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Ao Vivo
            </Typography>
            {games.live.map((game) => (
              <GameCard key={game._id} game={game} />
            ))}
          </Box>
        )}

        {games.upcoming.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Próximos Jogos
            </Typography>
            {games.upcoming.map((game) => (
              <GameCard key={game._id} game={game} />
            ))}
          </Box>
        )}

        {games.history.length > 0 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Histórico
            </Typography>
            {games.history.map((game) => (
              <GameCard key={game._id} game={game} />
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Games; 