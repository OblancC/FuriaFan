const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/auth');
const { extractTextFromImage } = require('../services/visionServices');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const Tesseract = require('tesseract.js');
const path = require('path');
const TwitterService = require('../services/twitterService');

// ID do servidor oficial da FURIA via .env
const FURIA_GUILD_ID = process.env.FURIA_GUILD_ID;

// Obter perfil do usuário
router.get('/me', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-__v');
    // Verifica se está no servidor da FURIA
    const isInFuriaGuild = user.socialMedia?.discord?.guilds?.some(guild => guild.id === FURIA_GUILD_ID);
    res.json({
      ...user.toObject(),
      isInFuriaGuild: !!isInFuriaGuild
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
});

// Atualizar perfil
router.put('/me', isAuthenticated, async (req, res) => {
  try {
    const { name, email, cpf, address, interests } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        email,
        cpf,
        address,
        interests
      },
      { new: true }
    );
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
});

// Upload e validação de documento
router.post('/me/documents', isAuthenticated, upload.single('document'), async (req, res) => {
  try {
    const { type } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }
    
    // Extrair texto do documento usando Google Vision
    const text = await extractTextFromImage(req.file.path);
    
    // Aqui você pode adicionar lógica para validar o documento
    // com base no texto extraído
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          documents: {
            type,
            url: req.file.path,
            verified: true,
            verificationDate: new Date()
          }
        }
      },
      { new: true }
    );
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar documento' });
  }
});

// Adicionar perfil de e-sports
router.post('/me/esports-profiles', isAuthenticated, async (req, res) => {
  try {
    const { platform, username, url } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          esportsProfiles: {
            platform,
            username,
            url,
            verified: false
          }
        }
      },
      { new: true }
    );
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao adicionar perfil de e-sports' });
  }
});

// Adicionar rotas para desvincular redes sociais
router.post('/unlink/google', isAuthenticated, async (req, res) => {
  try {
    req.user.socialMedia.google = undefined;
    await req.user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao desvincular Google' });
  }
});

router.post('/unlink/twitter', isAuthenticated, async (req, res) => {
  try {
    req.user.socialMedia.twitter = undefined;
    await req.user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao desvincular Twitter' });
  }
});

router.post('/unlink/discord', isAuthenticated, async (req, res) => {
  try {
    req.user.socialMedia.discord = undefined;
    await req.user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao desvincular Discord' });
  }
});

// Rota para validar CPF via OCR
router.post('/validate-cpf', isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    const lastDoc = user.documents && user.documents.length > 0
      ? user.documents[user.documents.length - 1]
      : null;

    if (!lastDoc) return res.status(400).json({ error: 'Nenhum documento enviado.' });

    // Caminho do arquivo (ajuste se necessário)
    const filePath = path.join(__dirname, '../../', lastDoc.url);

    // Executa o OCR com Tesseract
    const { data: { text } } = await Tesseract.recognize(filePath, 'por');

    // Regex para encontrar CPF
    const cpfMatch = text.match(/\\b\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}\\b/);
    if (!cpfMatch) return res.status(400).json({ error: 'CPF não encontrado no documento.' });

    // Atualiza o perfil do usuário
    user.cpf = cpfMatch[0];
    await user.save();

    res.json({ cpf: cpfMatch[0] });
  } catch (err) {
    console.error('Erro ao validar CPF:', err);
    res.status(500).json({ error: 'Erro ao validar CPF.' });
  }
});

// Rota para sincronizar dados do Twitter
router.post('/sync/twitter', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.socialMedia?.twitter?.accessToken) {
      return res.status(400).json({ error: 'Conta do Twitter não vinculada' });
    }

    const twitterService = new TwitterService(
      user.socialMedia.twitter.accessToken,
      user.socialMedia.twitter.accessSecret
    );

    // Busca dados do Twitter
    const [profile, tweets, likes, following] = await Promise.all([
      twitterService.getUserProfile(),
      twitterService.getTweets(user.socialMedia.twitter.id),
      twitterService.getLikes(user.socialMedia.twitter.id),
      twitterService.getFollowing(user.socialMedia.twitter.id)
    ]);

    // Atualiza dados do usuário
    user.socialData = user.socialData || {};
    user.socialData.twitter = {
      following: following.map(f => ({
        id: f.id,
        username: f.username,
        name: f.name,
        profileImageUrl: f.profile_image_url
      })),
      tweets: tweets.map(t => ({
        id: t.id,
        text: t.text,
        createdAt: new Date(t.created_at),
        metrics: t.public_metrics
      })),
      likes: likes.map(l => ({
        id: l.id,
        text: l.text,
        createdAt: new Date(l.created_at),
        authorId: l.author_id,
        authorUsername: l.author_username
      }))
    };

    user.socialMedia.twitter.lastSync = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Dados do Twitter sincronizados com sucesso',
      data: {
        following: user.socialData.twitter.following.length,
        tweets: user.socialData.twitter.tweets.length,
        likes: user.socialData.twitter.likes.length
      }
    });
  } catch (error) {
    console.error('Erro ao sincronizar dados do Twitter:', error);
    res.status(500).json({ error: 'Erro ao sincronizar dados do Twitter' });
  }
});

module.exports = router; 