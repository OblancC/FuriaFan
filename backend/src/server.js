const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
require('dotenv').config();
require('./config/passport');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'furia-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    sameSite: 'lax'
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Configuração do diretório de uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/furia-fans', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/games', require('./routes/games'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/auth', require('./routes/auth'));
app.use('/api/news', require('./routes/news'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/purchases', require('./routes/purchaseRoutes'));
app.use('/api/bot', require('./routes/bot'));

// WebSocket
io.on('connection', (socket) => {
  socket.on('join-room', (room) => {
    socket.join(room);
  });

  socket.on('chat-message', (data) => {
    io.to(data.room).emit('new-message', {
      user: data.user,
      message: data.message,
      timestamp: new Date()
    });
});

  socket.on('disconnect', () => {
  });
});

// Permitir acesso ao objeto io nas rotas Express
app.set('io', io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
