const vision = require('@google-cloud/vision');
const path = require('path');
const fs = require('fs').promises;

// Inicializa o cliente do Vision API
const client = new vision.ImageAnnotatorClient({
    keyFilename: path.join(__dirname, '../../furiafans-ocr-e820a2473786.json')
});

// Contador mensal de requisições (em memória - você pode implementar em banco de dados depois)
let monthlyRequests = 0;
const MONTHLY_LIMIT = 900; // Mantendo abaixo do limite gratuito para segurança

// Função para validar tamanho e tipo do arquivo
const validateFileBasics = (file) => {
    // Limite de 5MB
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        return { isValid: false, error: 'Arquivo muito grande. Máximo permitido: 5MB' };
    }

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
        return { isValid: false, error: 'Tipo de arquivo não permitido. Envie apenas JPG ou PNG' };
    }

    return { isValid: true };
};

// Função para validar CPF offline
const validateCPF = (cpf) => {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfRegex.test(cpf);
};

// Função para validar RG offline
const validateRG = (text) => {
    const rgRegex = /\d{2}\.\d{3}\.\d{3}-[0-9X]/i;
    return rgRegex.test(text);
};

// Função para remover arquivo
const removeFile = async (filePath) => {
    try {
        await fs.unlink(filePath);
        console.log('Arquivo removido com sucesso:', filePath);
    } catch (error) {
        console.error('Erro ao remover arquivo:', error);
    }
};

exports.validateDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado' });
        }

        // Validação básica do arquivo
        const basicValidation = validateFileBasics(req.file);
        if (!basicValidation.isValid) {
            await removeFile(req.file.path);
            return res.status(400).json({ 
                error: basicValidation.error,
                isValid: false 
            });
        }

        // Verificar limite mensal
        if (monthlyRequests >= MONTHLY_LIMIT) {
            await removeFile(req.file.path);
            return res.status(429).json({
                error: 'Limite mensal de processamento atingido',
                details: 'Por favor, tente novamente no próximo mês',
                isValid: false
            });
        }

        const filePath = req.file.path;

        try {
            // Incrementar contador de requisições
            monthlyRequests++;

            // Realizar OCR na imagem
            const [result] = await client.textDetection(filePath);
            const detections = result.textAnnotations;
            
            if (!detections || detections.length === 0) {
                await removeFile(filePath);
                return res.status(400).json({ 
                    error: 'Nenhum texto detectado na imagem',
                    isValid: false 
                });
            }

            const extractedText = detections[0].description;
            
            // Validar se é um documento válido
            const isCPF = validateCPF(extractedText);
            const isRG = validateRG(extractedText);
            
            // Detectar se é uma imagem de documento usando labels
            const [labelResult] = await client.labelDetection(filePath);
            const labels = labelResult.labelAnnotations;
            const isDocument = labels.some(label => 
                ['document', 'identity document', 'card'].includes(label.description.toLowerCase())
            );

            // Análise de segurança da imagem
            const [safeSearch] = await client.safeSearchDetection(filePath);
            const isSafe = safeSearch.adult !== 'LIKELY' && safeSearch.adult !== 'VERY_LIKELY';

            // Remover o arquivo após todas as verificações
            await removeFile(filePath);

            if (!isSafe) {
                return res.status(400).json({
                    error: 'Imagem considerada imprópria',
                    isValid: false
                });
            }

            if (!isDocument) {
                return res.status(400).json({
                    error: 'A imagem não parece ser um documento válido',
                    isValid: false
                });
            }

            // Adicionar informação sobre uso da API
            const remainingRequests = MONTHLY_LIMIT - monthlyRequests;
            
            res.json({
                isValid: true,
                documentType: isCPF ? 'CPF' : isRG ? 'RG' : 'Outro',
                extractedText,
                confidence: detections[0].confidence,
                labels: labels.map(label => ({
                    description: label.description,
                    confidence: label.score
                })),
                apiInfo: {
                    remainingRequests,
                    monthlyLimit: MONTHLY_LIMIT
                }
            });

        } catch (error) {
            // Garantir que o arquivo seja removido mesmo em caso de erro
            await removeFile(filePath);
            
            // Verificar se é um erro de API desabilitada
            if (error.code === 7 && error.details?.includes('API has not been used')) {
                return res.status(503).json({
                    error: 'Serviço temporariamente indisponível. A API do Google Vision precisa ser habilitada.',
                    details: 'Por favor, entre em contato com o administrador do sistema.',
                    isValid: false
                });
            }
            throw error;
        }

    } catch (error) {
        console.error('Erro ao validar documento:', error);
        res.status(500).json({ 
            error: 'Erro ao processar documento',
            details: error.message,
            isValid: false
        });
    }
}; 