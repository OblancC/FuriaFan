import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem } from '@mui/material';

const style = {
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)', width: 350,
  bgcolor: '#111', border: '2px solid #FFFFFF', boxShadow: 24, p: 4, borderRadius: 2, color: '#FFFFFF'
};

const eventTypes = [
  { value: 'LAN', label: 'LAN' },
  { value: 'Online', label: 'Online' },
  { value: 'Meetup', label: 'Meetup' }
];

export default function EventModal({ open, onClose, onSave }) {
  const [event, setEvent] = useState({ 
    eventName: '', 
    eventDate: '', 
    eventType: '', 
    description: '' 
  });

  const handleChange = e => setEvent({ ...event, [e.target.name]: e.target.value });

  const handleSave = () => {
    if (event.eventName && event.eventDate && event.eventType) {
      onSave(event);
      setEvent({ eventName: '', eventDate: '', eventType: '', description: '' });
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>Adicionar Evento</Typography>
        <TextField 
          label="Nome do Evento" 
          name="eventName" 
          value={event.eventName} 
          onChange={handleChange} 
          fullWidth 
          sx={{ mb: 2 }} 
        />
        <TextField 
          label="Data" 
          name="eventDate" 
          type="date" 
          value={event.eventDate} 
          onChange={handleChange} 
          fullWidth 
          sx={{ mb: 2 }} 
          InputLabelProps={{ shrink: true }} 
        />
        <TextField
          select
          label="Tipo de Evento"
          name="eventType"
          value={event.eventType}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        >
          {eventTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField 
          label="Descrição" 
          name="description" 
          value={event.description} 
          onChange={handleChange} 
          fullWidth 
          sx={{ mb: 2 }} 
          multiline
          rows={2}
        />
        <Button variant="contained" sx={{ background: '#FFFFFFF', color: '#000' }} onClick={handleSave}>Salvar</Button>
      </Box>
    </Modal>
  );
} 