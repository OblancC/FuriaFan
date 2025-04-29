const vision = require('@google-cloud/vision');
require('dotenv').config();

// Configura a autenticação
const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

// Função para extrair texto de imagem
async function extractTextFromImage(imagePath) {
  const [result] = await client.textDetection(imagePath);
  const detections = result.textAnnotations;
  if (detections.length > 0) {
    return detections[0].description; // O texto extraído
  }
  return '';
}

module.exports = { extractTextFromImage };
