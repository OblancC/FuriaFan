import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Chat from '../components/Chat';

export default function ChatPage() {
  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>
      <Typography variant="h4" sx={{ color: '#FFD700', mb: 3, fontWeight: 700 }}>
        Chat dos Fãs da FURIA
      </Typography>
      <Paper sx={{ width: '100%', maxWidth: 700, minHeight: 500, p: 2, bgcolor: '#181818', borderRadius: 3, boxShadow: 4 }}>
        <Chat />
      </Paper>
    </Box>
  );
} 