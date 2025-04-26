const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String },
  socialAccounts: {
    google: { type: String },
    discord: { type: String },
    twitter: { type: String },
  },
  interactions: [
    {
      type: { type: String },
      detail: { type: String },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  fanLevel: { type: Number, default: 1 },
  quizScores: [
    {
      score: Number,
      date: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
