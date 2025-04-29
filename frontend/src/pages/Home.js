import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

function Home() {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Bem-vindo ao FURIA Fans!
        </Typography>
        <Typography variant="body1" paragraph>
          Este é o seu portal oficial para acompanhar tudo sobre a FURIA Esports.
          Aqui você encontrará as últimas notícias, atualizações da equipe e muito mais.
        </Typography>
        <Typography variant="body1" paragraph>
          Navegue pelo menu superior para acessar:
        </Typography>
        <ul>
          <li><Typography variant="body1">Notícias: Fique por dentro das últimas novidades</Typography></li>
          <li><Typography variant="body1">Perfil: Gerencie suas configurações e preferências</Typography></li>
        </ul>
      </Paper>
    </Box>
  );
}

export default Home; 