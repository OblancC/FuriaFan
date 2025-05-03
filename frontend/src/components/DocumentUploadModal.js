import React, { useState } from 'react';
import { Box, Button, Typography, Modal, CircularProgress, Alert } from '@mui/material';
import Tesseract from 'tesseract.js';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#111',
  border: '2px solid #FFFFFF',
  boxShadow: 24,
  p: 4,
  color: '#FFFFFF',
  borderRadius: 2,
};

const DocumentUploadModal = ({ open, onClose, cpfDigitado, nomeCadastrado }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setResultado(null);
    }
  };

  const handleOcr = () => {
    if (!image) return;
    setLoading(true);
    Tesseract.recognize(
      image,
      'por',
      { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
      // Regex para CPF
      const cpfMatch = text.match(/\d{3}\.?\d{3}\.?\d{3}-?\d{2}/);
      // Regex simples para nome (ajuste conforme necessário)
      const nomeMatch = text.match(/nome[:\s]*([A-ZÀ-Úa-zà-ú\s]+)/i);

      const cpfExtraido = cpfMatch ? cpfMatch[0].replace(/\D/g, '') : '';
      const cpfDigitadoLimpo = (cpfDigitado || '').replace(/\D/g, '');

      const nomeExtraido = nomeMatch ? nomeMatch[1].trim().toLowerCase() : '';
      const nomeCadastradoLimpo = (nomeCadastrado || '').trim().toLowerCase();

      let validacao = [];
      if (!cpfExtraido) validacao.push('CPF não encontrado na imagem.');
      else if (cpfExtraido !== cpfDigitadoLimpo) validacao.push('O CPF da imagem não corresponde ao digitado.');

      if (!nomeExtraido) validacao.push('Nome não encontrado na imagem.');
      else if (!nomeCadastradoLimpo.includes(nomeExtraido) && !nomeExtraido.includes(nomeCadastradoLimpo)) validacao.push('O nome da imagem não corresponde ao cadastrado.');

      setResultado({
        sucesso: validacao.length === 0,
        mensagens: validacao.length === 0 ? ['Documento validado com sucesso!'] : validacao,
        cpfExtraido,
        nomeExtraido
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>Validação de Documento</Typography>
        <input
          accept="image/*"
          type="file"
          onChange={handleImageChange}
          style={{ marginBottom: 16, color: '#FFFFFF' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleOcr}
          disabled={!image || loading}
          sx={{ mb: 2, background: '#FFFFFF', color: '#000', '&:hover': { background: '#FFC000' } }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: '#000' }} /> : 'Validar Documento'}
        </Button>
        {resultado && (
          <Box sx={{ mt: 2 }}>
            {resultado.sucesso ? (
              <Alert severity="success">{resultado.mensagens[0]}</Alert>
            ) : (
              resultado.mensagens.map((msg, idx) => (
                <Alert severity="error" key={idx}>{msg}</Alert>
              ))
            )}
          </Box>
        )}
        {image && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <img
              src={URL.createObjectURL(image)}
              alt="Documento"
              style={{ maxWidth: '100%', maxHeight: 150, borderRadius: 8, border: '1px solid #FFFFFF' }}
            />
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default DocumentUploadModal; 