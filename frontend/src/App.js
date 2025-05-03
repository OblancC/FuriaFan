import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './components/Chat';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#FFFFFF' },
    background: { default: '#000', paper: '#111' },
    text: { primary: '#fff', secondary: '#FFFFFF' }
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
    fontWeightBold: 700,
    h4: { fontWeight: 700 },
    h6: { fontWeight: 700 }
  }
});

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
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Button component={Link} to="/" sx={{ p: 0, minWidth: 0 }}>
            <img src="/assets/furia-logo.png" alt="FURIA Fans" style={{ height: 40 }} />
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          {isAuthenticated && (
            <Button color="inherit" component={Link} to="/news">
              Notícias
            </Button>
          )}
          {isAuthenticated && (
            <Button color="inherit" component={Link} to="/chat">
              Chat
            </Button>
          )}
          {isAuthenticated && (
            <Button color="inherit" component={Link} to="/profile">
              Perfil
            </Button>
          )}
          {isAuthenticated ? (
            <Button color="inherit" onClick={logout}>
              Sair
            </Button>
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
          <Route path="/" element={<Chat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/auth/callback" element={<SocialCallbackHandler />} />
        </Routes>
      </Container>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
