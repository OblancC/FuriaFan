import React, { useEffect, useState } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Box, Chip, Grid, Divider, Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { API_URLS } from '../config/api';
import { Google as GoogleIcon, Twitter as TwitterIcon } from '@mui/icons-material';
import DiscordIcon from '../components/DiscordIcon';
import Stack from '@mui/material/Stack';
import DocumentUploadModal from '../components/DocumentUploadModal';
import EventModal from '../components/EventModal';
import PurchaseModal from '../components/PurchaseModal';
import EventHistoryModal from '../components/EventHistoryModal';
import PurchaseHistoryModal from '../components/PurchaseHistoryModal';
import axios from 'axios';

function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [eventHistoryOpen, setEventHistoryOpen] = useState(false);
  const [purchaseHistoryOpen, setPurchaseHistoryOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(user);
      fetchEvents();
      fetchPurchases();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(API_URLS.events, { withCredentials: true });
      setEvents(response.data);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };

  const fetchPurchases = async () => {
    try {
      const response = await axios.get(API_URLS.purchases, { withCredentials: true });
      setPurchases(response.data);
    } catch (error) {
      console.error('Erro ao buscar compras:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
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
    if (provider === 'twitter') {
      window.location.href = `http://localhost:5000/api/auth/twitter?scope=read,users.read,tweet.read,list.read,follows.read,offline.access`;
    } else {
      window.location.href = `http://localhost:5000/api/auth/${provider}`;
    }
  };

  const handleUnlink = async (provider) => {
    try {
      await fetch(`${API_URLS.base}/api/profile/unlink/${provider}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
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

  const handleAddEvent = async (event) => {
    try {
      const response = await axios.post(API_URLS.events, event, { withCredentials: true });
      setEvents(prev => [...prev, response.data]);
      setSuccess('Evento adicionado com sucesso!');
    } catch (error) {
      setError('Erro ao adicionar evento.');
    }
  };

  const handleAddPurchase = async (purchase) => {
    try {
      const response = await axios.post(API_URLS.purchases, purchase, { withCredentials: true });
      setPurchases(prev => [...prev, response.data]);
      setSuccess('Compra adicionada com sucesso!');
    } catch (error) {
      setError('Erro ao adicionar compra.');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`${API_URLS.events}/${eventId}`, { withCredentials: true });
      setEvents(prev => prev.filter(event => event._id !== eventId));
      setSuccess('Evento removido com sucesso!');
    } catch (error) {
      setError('Erro ao remover evento.');
    }
  };

  const handleDeletePurchase = async (purchaseId) => {
    try {
      await axios.delete(`${API_URLS.purchases}/${purchaseId}`, { withCredentials: true });
      setPurchases(prev => prev.filter(purchase => purchase._id !== purchaseId));
      setSuccess('Compra removida com sucesso!');
    } catch (error) {
      setError('Erro ao remover compra.');
    }
  };

  if (!formData) return <Container><Typography>Carregando...</Typography></Container>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">Perfil do Usuário</Typography>
          {editMode ? (
            <Button variant="contained" color="primary" onClick={handleSave}>Salvar</Button>
          ) : (
            <Button variant="outlined" onClick={() => setEditMode(true)}>Editar</Button>
          )}
        </Box>
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
              <Button
                variant="outlined"
                sx={{ mt: 1, color: '#FFFFFF', borderColor: '#FFFFFF' }}
                onClick={() => setModalOpen(true)}
              >
                Validar documento
              </Button>
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
              <TextField
                label="País"
                name="address.country"
                value={formData.address?.country || ''}
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
        {/* Botões de ações organizados em duas colunas verticais */}
        <Grid container spacing={2} sx={{ mt: 4, mb: 2 }} justifyContent="center">
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Box display="flex" flexDirection="column" gap={2}>
              <Button fullWidth variant="outlined" sx={{ color: '#FFF', borderColor: '#FFF' }} onClick={() => setEventModalOpen(true)}>
            Adicionar Evento
          </Button>
              <Button fullWidth variant="outlined" sx={{ color: '#FFF', borderColor: '#FFF' }} onClick={() => setEventHistoryOpen(true)}>
                Ver histórico de eventos
          </Button>
        </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Box display="flex" flexDirection="column" gap={2}>
              <Button fullWidth variant="outlined" sx={{ color: '#FFF', borderColor: '#FFF' }} onClick={() => setPurchaseModalOpen(true)}>
                Adicionar Compra
          </Button>
              <Button fullWidth variant="outlined" sx={{ color: '#FFF', borderColor: '#FFF' }} onClick={() => setPurchaseHistoryOpen(true)}>
            Ver histórico de compras
          </Button>
        </Box>
          </Grid>
        </Grid>
      </Paper>
      <DocumentUploadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        cpfDigitado={formData.cpf || ''}
        nomeCadastrado={formData.name || ''}
      />
      <EventModal open={eventModalOpen} onClose={() => setEventModalOpen(false)} onSave={handleAddEvent} />
      <PurchaseModal open={purchaseModalOpen} onClose={() => setPurchaseModalOpen(false)} onSave={handleAddPurchase} />
      <EventHistoryModal 
        open={eventHistoryOpen} 
        onClose={() => setEventHistoryOpen(false)} 
        events={events}
        onDelete={handleDeleteEvent}
      />
      <PurchaseHistoryModal 
        open={purchaseHistoryOpen} 
        onClose={() => setPurchaseHistoryOpen(false)} 
        purchases={purchases}
        onDelete={handleDeletePurchase}
      />
    </Container>
  );
}

export default Profile; 