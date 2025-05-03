import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem } from '@mui/material';

const style = {
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)', width: 350,
  bgcolor: '#111', border: '2px solid #FFFFFF', boxShadow: 24, p: 4, borderRadius: 2, color: '#FFFFFF'
};

const purchaseCategories = [
  { value: 'Merchandise', label: 'Merchandise' },
  { value: 'Tickets', label: 'Tickets' },
  { value: 'Digital', label: 'Digital' },
  { value: 'Other', label: 'Outro' }
];

export default function PurchaseModal({ open, onClose, onSave }) {
  const [purchase, setPurchase] = useState({ 
    itemName: '', 
    purchaseDate: '', 
    amount: '', 
    category: '',
    description: '' 
  });

  const handleChange = e => setPurchase({ ...purchase, [e.target.name]: e.target.value });

  const handleSave = () => {
    if (purchase.itemName && purchase.purchaseDate && purchase.amount && purchase.category) {
      onSave(purchase);
      setPurchase({ itemName: '', purchaseDate: '', amount: '', category: '', description: '' });
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>Adicionar Compra</Typography>
        <TextField 
          label="Nome do Item" 
          name="itemName" 
          value={purchase.itemName} 
          onChange={handleChange} 
          fullWidth 
          sx={{ mb: 2 }} 
        />
        <TextField 
          label="Data" 
          name="purchaseDate" 
          type="date" 
          value={purchase.purchaseDate} 
          onChange={handleChange} 
          fullWidth 
          sx={{ mb: 2 }} 
          InputLabelProps={{ shrink: true }} 
        />
        <TextField 
          label="Valor (R$)" 
          name="amount" 
          type="number" 
          value={purchase.amount} 
          onChange={handleChange} 
          fullWidth 
          sx={{ mb: 2 }} 
        />
        <TextField
          select
          label="Categoria"
          name="category"
          value={purchase.category}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        >
          {purchaseCategories.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField 
          label="Descrição" 
          name="description" 
          value={purchase.description} 
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