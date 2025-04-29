import React, { useEffect, useState } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Box, Chip, Grid, Divider, Alert,
  List, ListItem, ListItemText, ListItemAvatar, Avatar, ListItemSecondaryAction, IconButton
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { API_URLS } from '../config/api';
import DocumentUpload from '../components/DocumentUpload';
import { Launch as LaunchIcon, Google as GoogleIcon, Twitter as TwitterIcon } from '@mui/icons-material';
import DiscordIcon from '../components/DiscordIcon';
import Stack from '@mui/material/Stack';

function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Suporte para campos aninhados (ex: address.street)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(API_URLS.profile, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Erro ao atualizar perfil');
      setSuccess('Perfil atualizado com sucesso!');
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSocialLink = (provider) => {
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
  };

  const handleDocumentValidation = (validationData) => {
    // Atualizar o perfil com os dados do documento validado
    if (validationData.documentType === 'CPF') {
      setFormData(prev => ({
        ...prev,
        cpf: validationData.extractedText
      }));
    }
    // Você pode adicionar mais lógica aqui para outros tipos de documentos
  };

  const handleUnlink = async (provider) => {
    try {
      await fetch(`${API_URLS.base}/api/profile/unlink/${provider}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      // Atualiza o estado local removendo a rede desvinculada
      setFormData(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [provider]: undefined
        }
      }));
      setSuccess('Desvinculado com sucesso!');
    } catch (err) {
      setError('Erro ao desvincular.');
    }
  };

  const renderDiscordServers = () => {
    if (!formData?.socialMedia?.discord?.guilds?.length) return null;

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>Servidores Discord</Typography>
        <List>
          {formData.socialMedia.discord.guilds.map((guild) => (
            <ListItem key={guild.id}>
              <ListItemAvatar>
                <Avatar
                  src={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : undefined}
                >
                  {guild.name[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={guild.name}
                secondary={guild.owner ? 'Proprietário' : 'Membro'}
              />
              {guild.owner && (
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => window.open(`https://discord.com/channels/${guild.id}`, '_blank')}>
                    <LaunchIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  if (!formData) return <Container><Typography>Carregando...</Typography></Container>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Perfil do Usuário</Typography>
        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          {/* Bloco Perfil */}
          <Grid item xs={12} sm={5} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column',  p: 2, minWidth: 220, maxWidth: 320, width: '100%' }}>
              <TextField
                label="Nome"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                fullWidth
                disabled={!editMode}
                margin="dense"
                size="small"
              />
              <TextField
                label="Email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                fullWidth
                disabled={!editMode}
                margin="dense"
                size="small"
              />
              <TextField
                label="CPF"
                name="cpf"
                value={formData.cpf || ''}
                onChange={handleChange}
                fullWidth
                disabled={!editMode}
                margin="dense"
                size="small"
              />
            </Box>
          </Grid>
          {/* Bloco Endereço */}
          <Grid item xs={12} sm={5} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, minWidth: 220, maxWidth: 320, width: '100%' }}>
              <TextField
                label="Rua"
                name="address.street"
                value={formData.address?.street || ''}
                onChange={handleChange}
                fullWidth
                disabled={!editMode}
                margin="dense"
                size="small"
              />
              <TextField
                label="Cidade"
                name="address.city"
                value={formData.address?.city || ''}
                onChange={handleChange}
                fullWidth
                disabled={!editMode}
                margin="dense"
                size="small"
              />
              <TextField
                label="Estado"
                name="address.state"
                value={formData.address?.state || ''}
                onChange={handleChange}
                fullWidth
                disabled={!editMode}
                margin="dense"
                size="small"
              />
              <TextField
                label="CEP"
                name="address.zipCode"
                value={formData.address?.zipCode || ''}
                onChange={handleChange}
                fullWidth
                disabled={!editMode}
                margin="dense"
                size="small"
              />
            </Box>
          </Grid>
          {/* Redes Sociais */}
          <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Divider sx={{ my: 2, width: '100%' }}>Redes Sociais</Divider>
            {/* Status FURIA Discord */}
            {typeof formData.isInFuriaGuild !== 'undefined' && (
              formData.isInFuriaGuild ? (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Você está no servidor oficial da FURIA no Discord! (+10 pontos)
                </Alert>
              ) : (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Você ainda não está no servidor oficial da FURIA no Discord.<br />
                  <Button
                    variant="contained"
                    color="primary"
                    href="https://discord.gg/furia"
                    target="_blank"
                    sx={{ mt: 1 }}
                  >
                    Entrar no Discord da FURIA
                  </Button>
                </Alert>
              )
            )}
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
              <Stack direction="row" spacing={4} alignItems="flex-start">
                {/* Google */}
                <Box display="flex" flexDirection="column" alignItems="center" width="180px">
                  {formData.socialMedia?.google?.id ? (
                    <>
                      <Chip label="Google Vinculado" color="success" icon={<GoogleIcon />} />
                      <Button size="small" color="error" variant="outlined" sx={{ mt: 1 }} onClick={() => handleUnlink('google')}>Desvincular</Button>
                    </>
                  ) : (
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<GoogleIcon />}
                      onClick={() => handleSocialLink('google')}
                      fullWidth
                    >
                      Vincular Google
                    </Button>
                  )}
                </Box>
                {/* Twitter */}
                <Box display="flex" flexDirection="column" alignItems="center" width="180px">
                  {formData.socialMedia?.twitter?.id ? (
                    <>
                      <Chip label="Twitter Vinculado" color="success" icon={<TwitterIcon />} />
                      <Button size="small" color="error" variant="outlined" sx={{ mt: 1 }} onClick={() => handleUnlink('twitter')}>Desvincular</Button>
                    </>
                  ) : (
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<TwitterIcon />}
                      onClick={() => handleSocialLink('twitter')}
                      fullWidth
                    >
                      Vincular Twitter
                    </Button>
                  )}
                </Box>
                {/* Discord */}
                <Box display="flex" flexDirection="column" alignItems="center" width="180px">
                  {formData.socialMedia?.discord?.id ? (
                    <>
                      <Chip
                        label="Discord Vinculado"
                        color="success"
                        icon={<DiscordIcon />}
                      />
                      <Button size="small" color="error" variant="outlined" sx={{ mt: 1 }} onClick={() => handleUnlink('discord')}>Desvincular</Button>
                    </>
                  ) : (
                    <Button
                      variant="outlined"
                      sx={{ color: '#7289DA', borderColor: '#7289DA' }}
                      startIcon={<DiscordIcon />}
                      onClick={() => handleSocialLink('discord')}
                      fullWidth
                    >
                      Vincular Discord
                    </Button>
                  )}
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          {editMode ? (
            <Button variant="contained" color="primary" onClick={handleSave}>Salvar</Button>
          ) : (
            <Button variant="outlined" onClick={() => setEditMode(true)}>Editar</Button>
          )}
        </Box>
      </Paper>
      <DocumentUpload onValidationComplete={handleDocumentValidation} />
    </Container>
  );
}

export default Profile; 