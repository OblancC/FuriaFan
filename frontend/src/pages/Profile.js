import React, { useEffect, useState } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Box, Chip, Grid, Divider, Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { API_URLS } from '../config/api';
import DocumentUpload from '../components/DocumentUpload';

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
    // Implemente a lógica para vincular uma nova rede social
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

  if (!formData) return <Container><Typography>Carregando...</Typography></Container>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Perfil do Usuário</Typography>
        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nome"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
              margin="normal"
            />
            <TextField
              label="CPF"
              name="cpf"
              value={formData.cpf || ''}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
              margin="normal"
            />
            <Divider sx={{ my: 2 }}>Endereço</Divider>
            <TextField
              label="Rua"
              name="address.street"
              value={formData.address?.street || ''}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
              margin="normal"
            />
            <TextField
              label="Cidade"
              name="address.city"
              value={formData.address?.city || ''}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
              margin="normal"
            />
            <TextField
              label="Estado"
              name="address.state"
              value={formData.address?.state || ''}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
              margin="normal"
            />
            <TextField
              label="CEP"
              name="address.zipCode"
              value={formData.address?.zipCode || ''}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>Interesses</Typography>
            {formData.interests && formData.interests.map((interest, idx) => (
              <Chip key={idx} label={interest} sx={{ mr: 1, mb: 1 }} />
            ))}
            <Divider sx={{ my: 2 }}>Plataformas Sociais</Divider>
            <Box sx={{ '& > *': { mb: 2 } }}>
              <Typography>
                Google: {formData.socialMedia?.google?.id
                  ? <Chip label="Vinculado" color="success" />
                  : <Button variant="outlined" color="primary" onClick={() => handleSocialLink('google')}>Vincular</Button>}
              </Typography>
              <Typography>
                Twitter: {formData.socialMedia?.twitter?.id
                  ? <Chip label="Vinculado" color="success" />
                  : <Button variant="outlined" color="primary" onClick={() => handleSocialLink('twitter')}>Vincular</Button>}
              </Typography>
              <Typography>
                Discord: {formData.socialMedia?.discord?.id
                  ? <Chip label="Vinculado" color="success" />
                  : <Button variant="outlined" color="primary" onClick={() => handleSocialLink('discord')}>Vincular</Button>}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3 }}>
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