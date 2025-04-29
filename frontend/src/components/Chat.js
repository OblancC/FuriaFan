import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Paper, Typography, Avatar, IconButton } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import io from 'socket.io-client';
import axios from 'axios';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import MoodBadIcon from '@mui/icons-material/MoodBad';

const socket = io('http://localhost:3001');

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/chat/general/messages', {
          withCredentials: true
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
      }
    };

    fetchMessages();
    socket.emit('join-room', 'general');

    socket.on('new-message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('message-reaction', ({ messageId, reactions }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, reactions } : msg
        )
      );
    });

    return () => {
      socket.off('new-message');
      socket.off('message-reaction');
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post(
        'http://localhost:3001/api/chat/general/messages',
        { message: newMessage },
        { withCredentials: true }
      );
      setNewMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const handleReaction = async (messageId, reactionType) => {
    try {
      await axios.post(
        `http://localhost:3001/api/chat/messages/${messageId}/reactions`,
        { type: reactionType },
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Erro ao reagir à mensagem:', error);
    }
  };

  return (
    <Box sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ flex: 1, overflow: 'auto', p: 2, mb: 2 }}>
        {messages.map((message) => (
          <Box
            key={message._id}
            sx={{
              display: 'flex',
              mb: 2,
              alignItems: 'flex-start',
              flexDirection: message.user._id === user?._id ? 'row-reverse' : 'row'
            }}
          >
            <Avatar
              sx={{
                bgcolor: message.user._id === user?._id ? 'primary.main' : 'secondary.main',
                mr: message.user._id === user?._id ? 0 : 1,
                ml: message.user._id === user?._id ? 1 : 0
              }}
            >
              {message.user.name[0]}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {message.user.name}
              </Typography>
              <Paper
                elevation={1}
                sx={{
                  p: 1,
                  bgcolor: message.user._id === user?._id ? 'primary.light' : 'background.paper'
                }}
              >
                <Typography>{message.message}</Typography>
              </Paper>
              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                {message.reactions?.map((reaction, index) => (
                  <Typography key={index} variant="caption">
                    {reaction.type === 'like' && '👍'}
                    {reaction.type === 'love' && '❤️'}
                    {reaction.type === 'haha' && '😂'}
                    {reaction.type === 'wow' && '😮'}
                    {reaction.type === 'sad' && '😢'}
                    {reaction.type === 'angry' && '😠'}
                  </Typography>
                ))}
                <IconButton size="small" onClick={() => handleReaction(message._id, 'like')}>
                  <ThumbUpIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleReaction(message._id, 'love')}>
                  <FavoriteIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleReaction(message._id, 'haha')}>
                  <EmojiEmotionsIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleReaction(message._id, 'sad')}>
                  <SentimentVeryDissatisfiedIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleReaction(message._id, 'angry')}>
                  <MoodBadIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Paper>
      <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Digite sua mensagem..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button variant="contained" type="submit">
          Enviar
        </Button>
      </Box>
    </Box>
  );
};

export default Chat; 