import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    CircularProgress,
    Alert,
    Paper,
    IconButton,
    LinearProgress
} from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';

const DocumentUpload = ({ onValidationComplete }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Função para validar CPF
    const validateCPF = (text) => {
        const cpfRegex = /\d{3}\.?\d{3}\.?\d{3}-?\d{2}/;
        const match = text.match(cpfRegex);
        return match ? match[0] : null;
    };

    // Função para validar RG
    const validateRG = (text) => {
        const rgRegex = /\d{2}\.?\d{3}\.?\d{3}-?[0-9X]/i;
        const match = text.match(rgRegex);
        return match ? match[0] : null;
    };

    const handleFileSelect = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            // Validar tamanho do arquivo (5MB)
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError('Arquivo muito grande. Máximo permitido: 5MB');
                return;
            }

            // Validar tipo do arquivo
            if (!['image/jpeg', 'image/png'].includes(selectedFile.type)) {
                setError('Tipo de arquivo não permitido. Envie apenas JPG ou PNG');
                return;
            }

            setFile(selectedFile);
            setError('');
            
            // Criar preview da imagem
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreview(null);
        setError('');
        setSuccess('');
        setProgress(0);
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Por favor, selecione um arquivo');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');
        setProgress(0);

        try {
            // Importação dinâmica do Tesseract.js
            const { createWorker } = await import('tesseract.js');
            const worker = await createWorker();
            
            // Configurar worker e mostrar progresso
            worker.logger = m => {
                if (m.status === 'recognizing text') {
                    setProgress(parseInt(m.progress * 100));
                }
            };

            // Inicializar worker
            await worker.load();
            await worker.loadLanguage('por');
            await worker.initialize('por');

            // Realizar OCR
            const { data: { text } } = await worker.recognize(file);
            
            // Procurar por CPF ou RG no texto
            const cpf = validateCPF(text);
            const rg = validateRG(text);

            await worker.terminate();

            if (cpf || rg) {
                const documentType = cpf ? 'CPF' : 'RG';
                const documentNumber = cpf || rg;

                setSuccess(`Documento ${documentType} detectado: ${documentNumber}`);
                
                if (onValidationComplete) {
                    onValidationComplete({
                        isValid: true,
                        documentType,
                        extractedText: documentNumber
                    });
                }
            } else {
                setError('Nenhum documento válido encontrado na imagem');
            }
        } catch (err) {
            console.error('Erro ao processar documento:', err);
            setError('Erro ao processar documento. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 3 }}>
            <Typography variant="h6" gutterBottom>
                Upload de Documento
            </Typography>
            
            <Box sx={{ mt: 2, mb: 2 }}>
                <input
                    accept="image/jpeg,image/png"
                    style={{ display: 'none' }}
                    id="document-upload"
                    type="file"
                    onChange={handleFileSelect}
                    disabled={loading}
                />
                <label htmlFor="document-upload">
                    <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUpload />}
                        disabled={loading}
                        fullWidth
                    >
                        Selecionar Documento
                    </Button>
                </label>
            </Box>

            {preview && (
                <Box sx={{ position: 'relative', mt: 2, mb: 2 }}>
                    <img
                        src={preview}
                        alt="Preview"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '300px',
                            objectFit: 'contain'
                        }}
                    />
                    <IconButton
                        sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bgcolor: 'background.paper'
                        }}
                        onClick={clearFile}
                    >
                        <Close />
                    </IconButton>
                </Box>
            )}

            {loading && (
                <Box sx={{ width: '100%', mt: 2 }}>
                    <LinearProgress variant="determinate" value={progress} />
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                        Processando... {progress}%
                    </Typography>
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    <Typography component="div" style={{ whiteSpace: 'pre-line' }}>
                        {error}
                    </Typography>
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    <Typography component="div">
                        {success}
                    </Typography>
                </Alert>
            )}

            <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={!file || loading}
                fullWidth
                sx={{ mt: 2 }}
            >
                {loading ? (
                    <CircularProgress size={24} color="inherit" />
                ) : (
                    'Validar Documento'
                )}
            </Button>

            <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    Aceitos: RG, CPF ou CNH em formato de imagem (JPG, PNG)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Tamanho máximo: 5MB
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Nota: O processamento é feito localmente no seu navegador.
                </Typography>
            </Box>
        </Paper>
    );
};

export default DocumentUpload; 