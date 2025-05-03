import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, CircularProgress, Chip } from '@mui/material';
import axios from 'axios';

const LiveMatch = () => {
  const [liveMatch, setLiveMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLiveMatch = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/matches/furia/live');
        setLiveMatch(response.data);
        setError(null);
      } catch (error) {
        console.error('Erro ao buscar jogo ao vivo:', error);
        setError('Erro ao buscar jogo ao vivo');
      } finally {
        setLoading(false);
      }
    };

    // Busca o jogo ao vivo inicialmente
    fetchLiveMatch();

    // Atualiza a cada 30 segundos
    const interval = setInterval(fetchLiveMatch, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!liveMatch) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Nenhum jogo ao vivo no momento</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Chip 
          label="AO VIVO" 
          color="error" 
          sx={{ mb: 1 }}
        />
        <Typography variant="h6" color="text.secondary">
          {liveMatch.event.name}
        </Typography>
      </Box>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={5}>
          <Box sx={{ textAlign: 'center' }}>
            <img 
              src={liveMatch.team1.logo} 
              alt={liveMatch.team1.name} 
              style={{ height: 50, marginBottom: 1 }}
            />
            <Typography variant="h6">{liveMatch.team1.name}</Typography>
          </Box>
        </Grid>

        <Grid item xs={2}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4">
              {liveMatch.team1.score} - {liveMatch.team2.score}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={5}>
          <Box sx={{ textAlign: 'center' }}>
            <img 
              src={liveMatch.team2.logo} 
              alt={liveMatch.team2.name} 
              style={{ height: 50, marginBottom: 1 }}
            />
            <Typography variant="h6">{liveMatch.team2.name}</Typography>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Mapas:
        </Typography>
        <Grid container spacing={1}>
          {liveMatch.maps.map((map, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper sx={{ p: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {map.name}
                </Typography>
                <Typography variant="body1">
                  {map.team1Score} - {map.team2Score}
                </Typography>
                <Chip 
                  label={map.status} 
                  size="small"
                  color={map.status === 'Finalizado' ? 'default' : 'primary'}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default LiveMatch; 