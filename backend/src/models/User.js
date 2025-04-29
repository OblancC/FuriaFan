const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  cpf: {
    type: String,
    unique: true,
    sparse: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  socialMedia: {
    discord: {
      id: String,
      username: String
    },
    twitter: {
      id: String,
      username: String
    },
    google: {
      id: String,
      email: String
    }
  },
  interests: [{
    type: String,
    enum: ['CS:GO', 'Valorant', 'League of Legends', 'Free Fire', 'Outros']
  }],
  eventsAttended: [{
    eventId: String,
    eventName: String,
    date: Date
  }],
  purchases: [{
    productId: String,
    productName: String,
    date: Date,
    amount: Number
  }],
  documents: [{
    type: {
      type: String,
      enum: ['RG', 'CPF', 'CNH']
    },
    url: String,
    verified: {
      type: Boolean,
      default: false
    },
    verificationDate: Date
  }],
  esportsProfiles: [{
    platform: String,
    username: String,
    url: String,
    verified: {
      type: Boolean,
      default: false
    }
  }],
  points: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  badges: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema); 