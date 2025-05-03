const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const { isAuthenticated } = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(isAuthenticated);

// Criar nova compra
router.post('/', purchaseController.createPurchase);

// Listar compras do usuário
router.get('/', purchaseController.getUserPurchases);

// Deletar compra
router.delete('/:purchaseId', purchaseController.deletePurchase);

module.exports = router; 