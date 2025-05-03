const mongoose = require('mongoose');

const userPurchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  purchaseDate: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['Merchandise', 'Tickets', 'Digital', 'Other'],
    required: true
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserPurchase', userPurchaseSchema); 