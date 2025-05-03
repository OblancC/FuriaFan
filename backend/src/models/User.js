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
  password: {
    type: String,
    required: false
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
    zipCode: String,
    country: String
  },
  socialMedia: {
    discord: {
      id: String,
      username: String,
      email: String,
      avatar: String,
      accessToken: String,
      refreshToken: String,
      guilds: [{
        id: String,
        name: String,
        icon: String,
        owner: Boolean,
        permissions: Number
      }]
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
    enum: [
      // Times
      'furia', 'mibr', 'liquid', 'faze', 'g2', 'vitality', 'kingsleague',
      // Jogos
      'csgo', 'valorant', 'lol', 'dota2', 'fifa',
      // Categorias
      'esports', 'campeonatos', 'transferencias', 'noticias'
    ]
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
  socialData: {
    twitter: {
      following: [mongoose.Schema.Types.Mixed],
      tweets: [mongoose.Schema.Types.Mixed],
      likes: [mongoose.Schema.Types.Mixed]
    },
    discord: {
      guilds: [mongoose.Schema.Types.Mixed]
    },
    google: {
      youtubeSubscriptions: [mongoose.Schema.Types.Mixed],
      youtubePlaylists: [mongoose.Schema.Types.Mixed]
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema); 