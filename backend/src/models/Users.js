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
  cpf: { type: String }, 
  address: { type: String }, 
  birthDate: { type: Date }, 
  interests: [{ type: String }], 
  eventsAttended: [
    {
      event: { type: String },
      date: { type: Date }
    }
  ], 
  purchases: [
    {
      item: { type: String },
      date: { type: Date },
      value: { type: Number }
    }
  ],
  documents: [{ type: String }], 
  aiValidated: { type: Boolean, default: false }, 
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
