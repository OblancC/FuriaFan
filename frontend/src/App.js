import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Profile from './pages/Profile';
import News from './pages/News';
import Login from './pages/Login';
import Register from './pages/Register';

function SocialCallbackHandler() {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleSocialCallback } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const provider = params.get('provider');
      const code = params.get('code');

      if (provider && code) {
        try {
          const result = await handleSocialCallback(provider, code);
          
          if (result.requiresRegistration) {
            navigate('/register', { 
              state: { 
                socialData: {
                  ...result.userData,
                  provider
                }
              }
            });
          } else {
            navigate('/profile');
          }
        } catch (error) {
          console.error('Erro no callback social:', error);
          navigate('/login', { state: { error: 'Erro na autenticação social' } });
        }
      }
    };

    handleCallback();
  }, [location, navigate, handleSocialCallback]);

  return null;
}

function AppContent() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            FURIA Fans
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/news">
            Notícias
          </Button>
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/profile">
                Perfil
              </Button>
              <Button color="inherit" onClick={logout}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Entrar
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Registrar
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/profile" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/profile" /> : <Register />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/auth/callback" element={<SocialCallbackHandler />} />
        </Routes>
      </Container>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
