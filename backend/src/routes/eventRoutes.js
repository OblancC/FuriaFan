const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { isAuthenticated } = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(isAuthenticated);

// Criar novo evento
router.post('/', eventController.createEvent);

// Listar eventos do usuário
router.get('/', eventController.getUserEvents);

// Deletar evento
router.delete('/:eventId', eventController.deleteEvent);

module.exports = router; 