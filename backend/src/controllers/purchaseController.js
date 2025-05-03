const UserPurchase = require('../models/UserPurchase');

const purchaseController = {
  // Criar nova compra
  createPurchase: async (req, res) => {
    try {
      const { itemName, purchaseDate, amount, category, description } = req.body;
      const userId = req.user._id;

      const newPurchase = new UserPurchase({
        userId,
        itemName,
        purchaseDate,
        amount,
        category,
        description
      });

      await newPurchase.save();
      res.status(201).json(newPurchase);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar compra', error: error.message });
    }
  },

  // Listar compras do usuário
  getUserPurchases: async (req, res) => {
    try {
      const userId = req.user._id;
      const purchases = await UserPurchase.find({ userId }).sort({ purchaseDate: -1 });
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar compras', error: error.message });
    }
  },

  // Deletar compra
  deletePurchase: async (req, res) => {
    try {
      const { purchaseId } = req.params;
      const userId = req.user._id;

      const purchase = await UserPurchase.findOneAndDelete({ _id: purchaseId, userId });
      if (!purchase) {
        return res.status(404).json({ message: 'Compra não encontrada' });
      }

      res.json({ message: 'Compra deletada com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar compra', error: error.message });
    }
  }
};

module.exports = purchaseController; 