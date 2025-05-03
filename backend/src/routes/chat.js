const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const { isAuthenticated } = require('../middleware/auth');

// Obter histórico de mensagens de uma sala
router.get('/:room/messages', isAuthenticated, async (req, res) => {
  try {
    const messages = await ChatMessage.find({ room: req.params.room })
      .populate('user', 'name socialMedia')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(messages.reverse());
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
});

// Enviar mensagem
router.post('/:room/messages', isAuthenticated, async (req, res) => {
  try {
    const { message, type, metadata } = req.body;
    
    const chatMessage = new ChatMessage({
      room: req.params.room,
      user: req.user._id,
      message,
      type: type || 'text',
      metadata
    });
    
    await chatMessage.save();
    
    // Emitir evento WebSocket
    req.app.get('io').to(req.params.room).emit('new-message', {
      ...chatMessage.toObject(),
      user: {
        _id: req.user._id,
        name: req.user.name,
        socialMedia: req.user.socialMedia
      }
    });
    
    res.status(201).json(chatMessage);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
});

// Reagir a uma mensagem
router.post('/messages/:messageId/reactions', isAuthenticated, async (req, res) => {
  try {
    const { type } = req.body;
    const message = await ChatMessage.findById(req.params.messageId);
    
    if (!message) {
      return res.status(404).json({ error: 'Mensagem não encontrada' });
    }
    
    // Remover reação existente do usuário
    message.reactions = message.reactions.filter(
      reaction => !reaction.user.equals(req.user._id)
    );
    
    // Adicionar nova reação
    message.reactions.push({
      user: req.user._id,
      type
    });
    
    await message.save();
    
    // Emitir evento WebSocket
    req.app.get('io').to(message.room).emit('message-reaction', {
      messageId: message._id,
      reactions: message.reactions
    });
    
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao reagir à mensagem' });
  }
});

module.exports = router; 