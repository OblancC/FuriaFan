import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Divider,
  Grid
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Google as GoogleIcon, Twitter as TwitterIcon } from '@mui/icons-material';
import DiscordIcon from '../components/DiscordIcon';
import { API_URLS, API_CONFIG } from '../config/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, loginWithSocial } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(API_URLS.login, {
        ...API_CONFIG,
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const userData = await response.json();
      login(userData);
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<GoogleIcon />}
                onClick={() => loginWithSocial('google')}
                sx={{
                  backgroundColor: '#DB4437',
                  '&:hover': { backgroundColor: '#C23321' }
                }}
              >
                Entrar com Google
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<TwitterIcon />}
                onClick={() => loginWithSocial('twitter')}
                sx={{
                  backgroundColor: '#1DA1F2',
                  '&:hover': { backgroundColor: '#0D95E8' }
                }}
              >
                Entrar com Twitter
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<DiscordIcon />}
                onClick={() => loginWithSocial('discord')}
                sx={{
                  backgroundColor: '#7289DA',
                  '&:hover': { backgroundColor: '#677BC4' }
                }}
              >
                Entrar com Discord
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }}>ou</Divider>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Senha"
            name="password"
            type="password"
            value={password}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Box sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Entrar
            </Button>
          </Box>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="text"
              onClick={() => navigate('/register')}
            >
              Não tem uma conta? Registre-se
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login; 