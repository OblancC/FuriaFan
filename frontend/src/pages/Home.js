import React from 'react';
import { Box, Typography } from '@mui/material';
import Quiz from '../components/Quiz';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <Box
      sx={{
        height: '90vh',
        width: '100%',
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: 0
      }}
    >
      {/* Container Principal */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '900px',
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: 'transparent',
          padding: '2rem',
          boxSizing: 'border-box'
        }}
      >
        {/* Texto vertical */}
        <Typography
          sx={{
            writingMode: 'vertical-rl',
            letterSpacing: 6,
            color: '#fff',
            fontWeight: 700,
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 18,
            opacity: 0.7,
            zIndex: 2
          }}
        >
          JOIN US . BE FURIA .
        </Typography>

        {/* Quiz Section - Mostra apenas quando logado */}
        {isAuthenticated ? (
          <Quiz />
        ) : (
          <Typography variant="h6" sx={{ color: '#FFf', textAlign: 'center', mb: 4 }}>
            Faça login para descobrir seu perfil de jogador
          </Typography>
        )}
      </Box>
    </Box>
  );
} 