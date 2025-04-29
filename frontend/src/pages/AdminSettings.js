import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, TextField, Button, Grid, Alert, CircularProgress, Tabs, Tab } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const AdminSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState({
    site: {
      title: '',
      description: '',
      logo: '',
      socialMedia: {
        twitter: '',
        instagram: '',
        facebook: ''
      }
    },
    content: {
      newsPerPage: 10,
      gamesPerPage: 10,
      enableComments: true
    },
    notifications: {
      email: '',
      discordWebhook: ''
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/admin/settings', {
          withCredentials: true
        });
        setSettings(response.data);
      } catch (error) {
        console.error('Erro ao buscar configurações:', error);
        setError('Erro ao carregar configurações');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchSettings();
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedChange = (e) => {
    const { name, value } = e.target;
    const [section, subSection, field] = name.split('.');
    
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subSection]: {
          ...prev[section][subSection],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await axios.put('http://localhost:3001/api/admin/settings', settings, {
        withCredentials: true
      });
      setSuccess('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setError('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">
            Acesso negado. Esta página é apenas para administradores.
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Configurações do Administrador
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Site" />
            <Tab label="Conteúdo" />
            <Tab label="Notificações" />
          </Tabs>

          <form onSubmit={handleSubmit}>
            {activeTab === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Título do Site"
                    name="site.title"
                    value={settings.site.title}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descrição"
                    name="site.description"
                    value={settings.site.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="URL do Logo"
                    name="site.logo"
                    value={settings.site.logo}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Redes Sociais
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Twitter"
                    name="site.socialMedia.twitter"
                    value={settings.site.socialMedia.twitter}
                    onChange={handleNestedChange}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Instagram"
                    name="site.socialMedia.instagram"
                    value={settings.site.socialMedia.instagram}
                    onChange={handleNestedChange}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Facebook"
                    name="site.socialMedia.facebook"
                    value={settings.site.socialMedia.facebook}
                    onChange={handleNestedChange}
                  />
                </Grid>
              </Grid>
            )}

            {activeTab === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Notícias por Página"
                    name="content.newsPerPage"
                    type="number"
                    value={settings.content.newsPerPage}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Jogos por Página"
                    name="content.gamesPerPage"
                    type="number"
                    value={settings.content.gamesPerPage}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      id="enableComments"
                      name="content.enableComments"
                      checked={settings.content.enableComments}
                      onChange={(e) => handleChange({
                        target: {
                          name: 'content.enableComments',
                          value: e.target.checked
                        }
                      })}
                    />
                    <label htmlFor="enableComments" style={{ marginLeft: 8 }}>
                      Habilitar Comentários
                    </label>
                  </Box>
                </Grid>
              </Grid>
            )}

            {activeTab === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email para Notificações"
                    name="notifications.email"
                    type="email"
                    value={settings.notifications.email}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Webhook do Discord"
                    name="notifications.discordWebhook"
                    value={settings.notifications.discordWebhook}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            )}

            <Box sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
              >
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminSettings; 