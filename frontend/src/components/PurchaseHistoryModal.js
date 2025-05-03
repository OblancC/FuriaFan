import React, { useState } from 'react';
import { Modal, Box, Typography, IconButton, ToggleButton, ToggleButtonGroup, Divider, Badge, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DeleteIcon from '@mui/icons-material/Delete';

const style = {
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)', width: 400,
  bgcolor: '#111', border: '2px solid #FFFFFFF', boxShadow: 24, p: 4, borderRadius: 2, color: '#FFFFFFF'
};

export default function PurchaseHistoryModal({ open, onClose, purchases, onDelete }) {
  const [viewMode, setViewMode] = useState('lastYear');
  
  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const filteredPurchases = viewMode === 'lastYear' 
    ? purchases.filter(p => new Date(p.purchaseDate) > new Date(Date.now() - 365*24*60*60*1000))
    : purchases;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Histórico de Compras</Typography>
          <IconButton onClick={onClose} sx={{ color: '#FFFFFFF' }}><CloseIcon /></IconButton>
        </Box>
        <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Badge badgeContent={filteredPurchases.length} color="primary" sx={{ mb: 1 }}>
            <HistoryIcon sx={{ color: '#FFFFFFF' }} />
          </Badge>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="modo de visualização"
            sx={{ 
              mb: 1,
              '& .MuiToggleButton-root': {
                color: '#FFFFFFF',
                borderColor: '#FFFFFFF',
                '&.Mui-selected': {
                  backgroundColor: '#FFFFFFF',
                  color: '#000'
                }
              }
            }}
          >
            <ToggleButton value="lastYear" sx={{ px: 2 }}>
              <CalendarMonthIcon sx={{ mr: 1 }} />Último Ano
            </ToggleButton>
            <ToggleButton value="all" sx={{ px: 2 }}>
              <HistoryIcon sx={{ mr: 1 }} />Histórico Completo
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Divider sx={{ mb: 2, bgcolor: '#FFFFFFF', height: 2 }} />
        {filteredPurchases.length === 0 ? (
          <Typography>Nenhuma compra registrada.</Typography>
        ) : (
          filteredPurchases.map((p, i) => (
            <Box key={i} sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', ':hover .delete-btn': { opacity: 1 } }}>
              <Box>
                <Typography variant="body2">{new Date(p.purchaseDate).toLocaleDateString()} - {p.itemName} (R$ {p.amount})</Typography>
                {p.description && <Typography variant="caption" color="text.secondary">{p.description}</Typography>}
              </Box>
              <Tooltip title="Excluir" arrow>
                <IconButton
                  className="delete-btn"
                  sx={{ color: '#FFFFFFF', opacity: 0.5, transition: 'opacity 0.2s', ml: 1, '&:hover': { color: '#f44336', opacity: 1 } }}
                  size="small"
                  onClick={() => onDelete(p._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          ))
        )}
      </Box>
    </Modal>
  );
} 