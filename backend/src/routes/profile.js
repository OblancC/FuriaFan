const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/auth');
const { extractTextFromImage } = require('../services/visionServices');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

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

module.exports = router; 